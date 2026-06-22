# Ashley 项目总索引

> 从 Trae + Claude 记忆仓库迁移而来
> 迁移时间: 2026-06-10

---

## 项目清单

### 1. 献书游戏（web-game）
- **路径**: `/Users/ashley/Downloads/献书游戏/web-game/`
- **类型**: 东晋叙事卡牌网页游戏（9轮、12选牌、3×3结局矩阵）
- **技术栈**: HTML5 + CSS3 + 原生JS, Node.js + Express + SQLite
- **当前状态**: 已部署到 47.101.204.120
- **待推进**: AI视频生成、B站互动视频集成、网页版互动视频播放器、美术资源、音效配乐
- **记忆文件**: [claude/大对话会话.md](/Users/ashley/.codex/memory/claude/claude-2026-06-10T12-33-25-409Z.md)

### 2. 自媒体数字化工作流
- **路径**: `/Users/ashley/自媒体数字化/`
- **目标**: 四天一个产品交付，工业化自媒体博主
- **技术栈**: Python 3.14 + FastAPI + APScheduler
- **需求**: 自动抓取流量选题、分析视频留存度、完全自动化工作流
- **记忆文件**: [trae/README.md](/Users/ashley/.codex/memory/trae/README.md)

### 3. AI眼镜开发
- **计划**: Ray-Ban Meta 半集成眼镜
- **方向**: AR翻译、AI视觉助手、记忆增强
- **记忆文件**: [trae/第一版快照](/Users/ashley/.codex/memory/trae/trae-2026-06-07T08-49-00-255Z.json)

### 4. 灵巧手 + Manus手套映射
- **设备**: Manus手套 + AroHand灵巧手
- **问题**: 映射抽搐需要解决
- **记忆文件**: [trae/claude-preferences.md](/Users/ashley/.codex/memory/trae/claude-preferences.md)

### 5. ai_tutorial_demo
- **路径**: `/Users/ashley/ai_tutorial_demo/backend/`
- **技术栈**: FastAPI + DeepSeek
- **服务器**: 47.101.204.120
- **记忆文件**: [claude/大对话会话.md](/Users/ashley/.codex/memory/claude/claude-2026-06-10T12-33-25-409Z.md)

### 6. TalentMatch（猎头智能匹配系统）
- **路径**: `/Users/ashley/Documents/简历/work信息/talentmatch/`（本地）/ `/opt/recruit-bot-v5/`（服务器）
- **类型**: AI 简历解析 + 候选人匹配系统
- **技术栈**: FastAPI + React + XGBoost + SQLite/RDS
- **服务器**: 47.110.93.137 / `yorkteam.cn`
- **当前状态**: 生产就绪（yorkteam.cn），v7.0 审计 1250/1250 PASS
- **AI 工作流**: Claude Code + OpenCode + oh-my-openagent + Kimi Code Plan 组合
- **待推进**: 打标前端 UI、PDF 全文解析、飞书 Bot 上线、HTTPS 证书
- **记忆文件**: [memories/projects/talentmatch-ai-workflow.md](/Users/ashley/Documents/我的过去/memories/projects/talentmatch-ai-workflow.md)

---

## 服务器清单

| 服务器 | IP | 用途 |
|--------|-----|------|
| 记忆仓库 | 112.124.3.17:3321 | Cline Memory Hub（39文件, 0.52MB） |
| 看板 | 112.124.3.17:8765 | Memory dashboard |
| 云服务器 | 47.101.204.120 | 献书游戏部署（Alibaba Cloud 杭州） |
| 本地代理 | localhost:3000 | MiniMax/Qwen 协议转换（gc_proxy.py） |
| 本地游戏 | localhost:3001 | 献书游戏开发服务器 |

---

## API 密钥索引

> ⚠️ 以下密钥来自记忆数据，使用时请注意安全

| 服务 | Key | 备注 |
|------|-----|------|
| DeepSeek | sk-bbfaeb7ccca4461e8841139575ede437 | 主力+ai_tutorial_demo |
| Uni-API | 9378cea3fc553d83c6f47260f6c70fcec1718f6b8850940f4520a8d1da2b2a27 | 中转站 |
| USTC | sk-x34NcMYTJflY-0ryg1Xj5A | 科大API |
| 阿里云(Qwen) | sk-ce38730718e94a04a6ee133f608d1f5c | DashScope |
| SiliconFlow | sk-vhtgwjvmnxothccocshkoquxpbpphlbrpdtovgnajwsotfwg | 千问 |
| BigModel(GLM) | (base64 encoded in raw.json) | 智谱 |

---

## 常用模型

**Trae 内置模型:**
- GPT-5.4 / GPT-5.2（主力推理）
- Gemini-3.1-Pro-Preview / Gemini-3-Flash-Preview
- MiniMax-M2.7
- Kimi-K2.5 / Kimi-K2-0905

**自定义模型:**
- DeepSeek-V4-Pro (deepseek.com)
- Qwen3.7-Max (dashscope.aliyuncs.com) — Qwen API Key
- GLM-4.6v-Flashx (bigmodel.cn)
- Astron-Code-Latest (xf-yun.com)

---

## 数据统计

| 平台 | 文件数 | 大小 |
|------|--------|------|
| trae | 9 | 430KB |
| claude | 28 | 90KB |
| other | 1 | 2.3KB |
| **总计** | **38** | **0.52MB** |
