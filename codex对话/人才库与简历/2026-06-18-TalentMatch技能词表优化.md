# TalentMatch 技能词表优化 & 中文搜索修复

> 2026-06-18 · 审计改进

---

## 改动内容

### 1. 词表扩展（56 → 240 条）

将 `COMMON_TECH_SKILLS` 从原来 56 条纯技术词扩展到 240 条，覆盖互联网/AI 全岗位：

- **AI/大模型/算法**: LLM、RAG、Agent、Prompt Engineering、SFT、RLHF、LoRA、Transformer、推荐系统 等
- **后端/基础架构**: Spring全家桶、微服务、高并发、K8s Service Mesh、gRPC 等
- **前端/客户端**: React、Vue、Flutter、React Native、小程序、SSR、微前端 等
- **数据/分析/工程**: Spark、Flink、ClickHouse、数据仓库、增长分析 等
- **DevOps/运维/云**: CI/CD、云原生、Serverless、阿里云/腾讯云 等
- **互联网业务/产品/运营**: 产品策略、用户运营、内容运营、私域运营 等
- **岗位职能/职级**: 算法工程、后端/前端/全栈、P6-P9 等

文件：`/opt/recruit-bot-v5/app/api/match.py`

### 2. 中文搜索修复

`_extract_skills` 原逻辑只提取英文字母关键词（`re.findall(r'[A-Za-z...]')`），完全忽略中文字词。导致：
- `产品经理`、`商业化`、`需求分析` 等中文关键词永远匹配不到
- 产品经理类 JD 匹配结果为 0

修复：增加中文关键词（2-8字）提取和包含关系匹配。

`_search_candidates` 增加 **中文 LIKE 回退**：
- FTS5 不支持中文分词，中文关键词搜不到
- 回退用 SQL `LIKE` 模糊搜索 current_role / current_company / skills / summary

### 3. 数据可见性修复

`EXCLUDE_SOURCES` 中去掉 `"rds_sync"`：
- 原来过滤了 3000 条真实简历数据
- 改前 `/api/candidates` 只返回 9 条
- 改后返回 3010 条（50/page）

### 匹配效果对比

| JD 类型 | 改前 | 改后 |
|---------|------|------|
| AI算法（大模型/PyTorch） | 3 | 18 |
| Java后端（微服务） | 6 | 30 |
| 产品经理（B端/商业化） | **0** | **19** |
| 前端React工程师 | 3 | 34 |
| 数据产品经理（增长/SQL） | **0** | **33** |

---

## 历史背景

此前审计发现系统存在 5 个 P0 问题：
1. EXCLUDE_SOURCES 过滤 3000 条数据 ✅ 已修复
2. 前端 fast-match 请求格式不匹配（Form → JSON）— 待前端改写
3. 词表只覆盖技术岗 ✅ 已修复
4. 认证已实现但不生效 — 待前端加登录页
5. SQLite 写并发瓶颈 — 有 RDS 但未切换

与 York 的沟通确认聚焦互联网/AI 岗位，不扩商科金融词表。
