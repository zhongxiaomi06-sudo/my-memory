# Codex 记忆索引

> 从 Trae IDE + Claude Code 迁移的完整记忆仓库
> 本文件是 Codex 的入口点

---

## 快速导航

| 内容 | 路径 |
|------|------|
| **项目总索引** | [projects/PROJECTS_INDEX.md](./projects/PROJECTS_INDEX.md) |
| **Trae 原始数据** | [trae/](./trae/) |
| **Claude 对话记录** | [claude/](./claude/) |

---

## Trae 平台文件（9个）

| 文件 | 大小 | 内容 |
|------|------|------|
| [README.md](./trae/README.md) | 31KB | Trae IDE 完整导出：LevelDB、会话、agent配置、AB实验 |
| [SKILL.md](./trae/SKILL.md) | 0.8KB | 记忆 skill 用法说明 |
| [claude-preferences.md](./trae/claude-preferences.md) | 1.5KB | 项目偏好、配置、密钥索引 |
| [claude-settings.json](./trae/claude-settings.json) | 1KB | Claude Code 设置（MiniMax proxy） |
| [project-CLAUDE.md](./trae/project-CLAUDE.md) | 2KB | 自媒体数字化项目 CLAUDE.md |
| [raw.json](./trae/raw.json) | 364KB | Trae 原始数据 dump（模型列表、会话、配置） |
| [test-upload.md](./trae/test-upload.md) | 0.6KB | 测试上传文件 |
| [第一版快照](./trae/trae-2026-06-07T08-49-00-255Z.json) | 0.6KB | AI眼镜项目计划 |
| [最新快照](./trae/trae-2026-06-10T12-30-21-719Z.json) | 0.8KB | 最新 Trae 会话状态 |

## Claude 平台文件（28个）

核心文件：
- [claude-2026-06-10T12-33-25-409Z.md](./claude/claude-2026-06-10T12-33-25-409Z.md) — **57KB** 主要对话：献书游戏部署、Qwen代理、排行榜、人物立绘
- 其余27个文件为短会话记录（模型切换、API配置、模型不存在错误）

---

## 启动指令

当你在 Codex 中开始新会话时，请先执行：

> **规则**: 每次启动先读取本索引文件 + 对应项目的记忆文件，了解我的偏好和历史上下文后再开始工作。

---

## 工作方式

我习惯的工作方式：
1. **完全自动化工作流** — 不需要频繁手动操作
2. **云端记忆同步** — 所有对话上传到 `http://112.124.3.17:3321` 记忆仓库
3. **四天交付** — 快速迭代，短平快
4. **电影级品质** — 对游戏/内容品质有高要求
5. **所有特权开放** — 可以自由操作文件系统和服务器
