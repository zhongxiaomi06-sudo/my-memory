# Codex Cloud Memory 上下文摘要（从云端拉取 2026-06-22）

## TalentMatch v7 — 完整演进记录

### 6/14: v6→v7 升级日（完整 handoff）
- 上午: Codex 交付 v6（服务器版本、Phase 仪表盘、fastapi-backend）
- 下午: 新人 (Claude Code) 接手，Phase 1-3 全部完成
- Phase 1: API 修复 + Docker（/search, /stats, /resume/{id}）
- Phase 2: React 前端（App.jsx + WebSearchApp）
- Phase 3: 部署 47.110.93.137:8878 → 浏览器验证通过
- Bill 需求: 招 AI 工程师/Tech Lead
- 测试: 258 passed, 0 failed

### 6/15: UI/UX 大改
- 深色玻璃拟态主题（dark glassmorphism）
- ATS Resume Scoring 前端
- SSE 流式搜索
- Bill 简历（bill.pan resume）岗位匹配测试

### 6/16: 面试邀请信 + 手册
- invitation.html V3→V10，9轮迭代
- V10 最终版: 中文竖排，火漆封泥设计，东晋书法风 SVG
- 招行信用卡 logo → 替换为竖排书法字
- 微积分复习手册 (calculus-handbook/)
- LaTeX 编译规则（字体缺失→PDFLaTeX→文章类）

### Josh 问题（关键未解决）
- Josh = 真实用户，上传简历（"蔡"姓）
- resume_parser 未正确提取 Josh 的姓名
- 3 个 GitHub LLM 方案已研究，等待实施

## 献书游戏
- 原路径: ~/黑客松/献书游戏/ → 已移到 ~/Downloads/献书游戏/
- story-player.html: 716 行单页播放器
- 6 维度数值 + 11 结局 + 50 段视频提示词
- server.js → localhost:3000

## 系统配置演进
1. Kimi OpenClaw (5/17) → 控制 Codex 桌面端
2. LazyCodex + CC Switch + DeepSeek (6/19) → Codex 独立
3. Kimi OpenClaw 取消控制 Codex (6/22) → 当前状态

## 服务器清单
- 47.110.93.137 (yorkteam.cn): TalentMatch, recruit-bot:8878
- API 密钥: 见 ~/.claude/settings.json, ~/.codex/config.toml
