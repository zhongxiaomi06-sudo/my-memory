# 🧠 数字记忆中枢 · 系统手册

> 跨平台 AI Agent 记忆共享系统
> 最后更新: 2026-06-11

## 架构概览

```
┌─────────────────────────────────────────────────────┐
│                   本地 (Mac)                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │
│  │ Trae   │ │ Claude  │ │ Codex  │ │ Cline/其他   │  │
│  │ IDE    │ │Desktop  │ │Desktop │ │ Agent        │  │
│  └────┬───┘ └────┬───┘ └────┬───┘ └──────┬───────┘  │
│       └──────────┼──────────┼─────────────┘          │
│                  ▼          ▼                        │
│           ╔══════════════════════╗                   │
│           ║  本地记忆快照目录     ║                   │
│           ║  .cline/memory/trae/ ║                   │
│           ║  .codex/memory/      ║                   │
│           ╚══════════════════════╝                   │
└──────────────────┬──────────────────────────────────┘
                   │ SSH / API
                   ▼
┌─────────────────────────────────────────────────────┐
│              阿里云 ECS (112.124.3.17)               │
│                                                      │
│  ┌─────────────────┐  ┌────────────────────────┐    │
│  │ Cline Dashboard  │  │  Cline Memory Hub API  │    │
│  │ (端口 8765)      │  │  (端口 3321)           │    │
│  │ Web UI 界面      │  │  RESTful API 接口      │    │
│  └────────┬────────┘  └───────────┬────────────┘    │
│           │                       │                  │
│           ▼                       ▼                  │
│  ┌─────────────────────────────────────────────┐    │
│  │        记忆存储 (SQLite / FS)                │    │
│  │  trae/ claude/ codex/ cline/ cursor/ ...    │    │
│  │  copilot/ chatgpt/ windsurf/ other/         │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ⏰ 自动同步: 每 2 小时 (cron)                        │
└──────────────────────────────────────────────────────┘
```

## 核心组件

### 1. 云端服务器
- **IP**: 112.124.3.17
- **区域**: 阿里云 ECS, 华东1（杭州）
- **规格**: ecs.e-c1m1.large (2 vCPU, 2 GiB)
- **系统**: Ubuntu 20.04 64位
- **SSH**: `ssh -i ~/.ssh/id_ed25519 root@112.124.3.17`

### 2. Cline Dashboard (端口 8765)
Web 管理界面，用于监控记忆中枢运行状态。

### 3. Memory Hub API (端口 3321)
跨平台记忆读写接口。

## API 使用说明

```bash
# 查看统计
curl -H "x-api-key: cline-memory-2026-key" http://112.124.3.17:3321/api/memory/stats

# 列出所有记忆
curl -H "x-api-key: cline-memory-2026-key" http://112.124.3.17:3321/api/memory/list

# 查看某个平台的记忆文件
curl -H "x-api-key: cline-memory-2026-key" http://112.124.3.17:3321/api/memory/codex

# 上传新记忆
curl -X POST -H "x-api-key: cline-memory-2026-key" \
  -H "Content-Type: application/json" \
  -d '{"platform":"codex","content":"...","source":"api","tags":[]}' \
  http://112.124.3.17:3321/api/memory/upload
```

## 当前记忆统计
- 总计: 68 个文件, 2.21 MB
- Claude: 47 个文件 (1.75 MB) ✅
- Trae: 10 个文件 (430 KB) ✅
- Codex: 8 个文件 (16 KB) ✅
- Other: 3 个文件 (11 KB) ✅

## 项目结构
```
/Users/ashley/我的数字记忆/
├── 钟笑咪_AI简历_2026.html      # AI 简历 (HTML)
├── 数字记忆_README.md            # 本文件 - 系统手册
├── .cline/
│   └── memory/
│       └── trae/
│           ├── raw.json          # Trae IDE 原始导出数据 (373KB)
│           ├── README.md         # Trae 记忆内容详情
│           ├── SKILL.md          # 记忆使用说明
│           └── ...
```

## 扩展其他平台

如需添加新的平台记忆，参考以下步骤：
1. 提取该平台的对话数据
2. 通过 API POST 到 `/api/memory/upload`
3. 数据会自动被 cron 同步脚本索引
