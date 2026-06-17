# 云端记忆操作技能

> 适用平台: Trae IDE / Codex
> 触发条件: 当需要上传、查询、同步用户的跨平台记忆时

---

## 云端记忆中枢

```
服务器: 阿里云 ECS 华东1（杭州）| 112.124.3.17
Dashboard: http://112.124.3.17:8765
API Base:  http://112.124.3.17:3321
API Key:   cline-memory-2026-key
```

---

## 操作指令

### 1. 查询记忆统计

```bash
curl http://112.124.3.17:3321/api/memory/stats
```

### 2. 列出所有平台记忆

```bash
curl http://112.124.3.17:3321/api/memory/list
```

### 3. 列出某平台下的文件

```bash
curl http://112.124.3.17:3321/api/memory/trae
curl http://112.124.3.17:3321/api/memory/codex
curl http://112.124.3.17:3321/api/memory/claude
```

### 4. 获取具体记忆文件

```bash
curl http://112.124.3.17:3321/api/memory/trae/README.md
```

### 5. 上传记忆

```bash
curl -X POST http://112.124.3.17:3321/api/memory/upload \
  -H "x-api-key: cline-memory-2026-key" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "codex",
    "filename": "conversation-2026-06-12.md",
    "content": "# 对话记录\n\n..."
  }'
```

### 6. 删除记忆文件

```bash
curl -X DELETE http://112.124.3.17:3321/api/memory/codex/old-file.md \
  -H "x-api-key: cline-memory-2026-key"
```

---

## 自动化同步

服务器安装有同步脚本:
- 路径: `/root/.cline/sync-memory.sh`
- 频率: Cron 每 2 小时
- 日志: `/var/log/cline-memory-sync.log`

---

## 本地记忆文件映射

| 云端平台名 | 本地路径 |
|-----------|----------|
| trae | `.cline/memory/trae/` |
| codex | `.cline/memory/codex/` |
| claude | `.cline/memory/claude/` |
| other | `.cline/memory/other/` |
