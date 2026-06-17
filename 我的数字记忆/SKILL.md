# 钟笑咪 · 数字记忆中枢

> 跨平台通用 Skill 文件 — 同时适用于 Trae IDE 和 Codex
> 最后更新: 2026-06-12

---

## 你是谁

我是钟笑咪 (Ashley) 的 AI 助手。我驻留在 IDE 中，帮助完成软件开发、系统运维和日常技术工作。我会主动查阅本地记忆文件和云端记忆中枢，获取上下文。

---

## 用户偏好

- 语言：中文（写代码注释也用中文）
- 代码风格：简洁、不过度工程化
- 操作系统：macOS (Apple Silicon)
- 工作区：`/Users/ashley/我的数字记忆/`
- 常用工具：Trae IDE、Codex、Ollama、DeepSeek、CC Switch

---

## 云端记忆中枢

| 组件 | 地址 |
|------|------|
| Dashboard | http://112.124.3.17:8765 |
| Memory API | http://112.124.3.17:3321 |
| API Key | `cline-memory-2026-key` |
| 服务器 | 阿里云 ECS (华东1 杭州, 112.124.3.17) |

### API 端点

```
GET  /api/memory/list              - 列出所有平台记忆文件
GET  /api/memory/stats             - 查看统计信息
GET  /api/memory/:platform         - 查看某平台的文件列表
GET  /api/memory/:platform/:file   - 获取具体文件内容
POST /api/memory/upload            - 上传新记忆 (需要 x-api-key 头)
DELETE /api/memory/:platform/:file - 删除文件
```

### 上传记忆文件

```bash
curl -X POST http://112.124.3.17:3321/api/memory/upload \
  -H "x-api-key: cline-memory-2026-key" \
  -H "Content-Type: application/json" \
  -d '{"platform":"trae","filename":"conversation-2026-06-12.md","content":"..."}'
```

### API 查询示例

```bash
# 查看统计
curl http://112.124.3.17:3321/api/memory/stats

# 列出 codex 平台文件
curl http://112.124.3.17:3321/api/memory/codex

# 获取具体文件
curl http://112.124.3.17:3321/api/memory/trae/README.md
```

---

## 各平台记忆同步状态 (2026-06-11)

| 平台 | 文件数 | 大小 | 状态 |
|------|--------|------|------|
| trae | 10 | 430KB | ✅ 全部同步 |
| claude | 47 | 1.75MB | ✅ 全部同步 |
| codex | 8 | 16KB | ✅ 已同步 |
| other | 3 | 11KB | ✅ 简历+用户画像 |
| cline | 0 | - | 等待同步 |
| cursor | 0 | - | 等待同步 |
| copilot | 0 | - | 等待同步 |
| chatgpt | 0 | - | 等待同步 |
| windsurf | 0 | - | 等待同步 |

---

## 本地记忆文件

```
.cline/
├── SKILL.md              ← 你在这里 (主技能文件)
├── skills/
│   ├── cloud-memory.md   ← 云端记忆操作详解
│   └── codex-router.md   ← Codex CC Switch 路由配置
└── memory/
    └── trae/
        ├── SKILL.md       ← Trae 对话记忆
        ├── README.md      ← Trae 提取的详细记忆
        └── raw.json       ← Trae 原始对话数据 (373KB)
```

---

## AI 基础设施

### Ollama (本地)
- 地址：`http://127.0.0.1:11434`
- 模型：`qwen2.5:7b`

### DeepSeek (云端)
- 地址：`https://api.deepseek.com`
- 模型：`deepseek-chat`
- API Key 已配置 (不在此文件明文存储)

### CC Switch
- 代理端口：`127.0.0.1:15721`
- 用途：在 Codex / Trae 中切换 AI provider 路由
- 当前路由：DeepSeek

---

## 使用方式

当需要回顾用户的对话历史、上下文偏好或之前讨论过的技术方案时：
1. 先读取本地 `.cline/memory/` 下的记忆文件
2. 如需更多上下文，通过 API 查询云端记忆库 `http://112.124.3.17:3321`
3. 每次完成任务后，更新本文件中的状态信息
