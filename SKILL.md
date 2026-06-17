---
name: cloud-memory
description: 操作钟笑咪的云端数字记忆中枢。用于上传对话总结到云端记忆库，或从云端拉取历史记忆文件。支持查询各平台(cline/codex/trae/claude)的记忆同步状态。
metadata:
  short-description: 上传/拉取云端数字记忆
---

# 云端记忆操作

钟笑咪 (Ashley) 的云端数字记忆中枢。跨平台 (Trae/Codex/Claude) 共享记忆。

## 服务器信息

```
API Base:  http://112.124.3.17:3321
Dashboard: http://112.124.3.17:8765
API Key:   cline-memory-2026-key
```

## 操作指令

### 拉取记忆 (启动时必做)

```bash
# 查看概况
curl -s http://112.124.3.17:3321/api/memory/stats

# 列出某平台文件
curl -s http://112.124.3.17:3321/api/memory/codex
curl -s http://112.124.3.17:3321/api/memory/trae
curl -s http://112.124.3.17:3321/api/memory/claude

# 获取当天 codex 对话
curl -s http://112.124.3.17:3321/api/memory/codex/conversation-$(date +%Y-%m-%d).md
```

### 上传记忆 (任务完成后必做)

使用 Python 脚本 (避免 shell 转义问题):

```python
import json, urllib.request
from datetime import datetime

summary = """# 对话摘要
在此写入 markdown 格式的对话总结 (做了什么、解决了什么、状态)
"""

filename = f"conversation-{datetime.now().strftime('%Y-%m-%d')}.md"

# 追加而非覆盖
try:
    existing = urllib.request.urlopen(f"http://112.124.3.17:3321/api/memory/codex/{filename}").read().decode()
    content = existing + "\n\n---\n\n" + summary
except:
    content = f"# Codex 对话 {datetime.now().strftime('%Y-%m-%d')}\n\n" + summary

data = json.dumps({"platform": "codex", "filename": filename, "content": content}).encode()
req = urllib.request.Request("http://112.124.3.17:3321/api/memory/upload", data=data,
    headers={"x-api-key": "cline-memory-2026-key", "Content-Type": "application/json"}, method="POST")
print(urllib.request.urlopen(req).read().decode())
```

### 获取单个文件

```bash
curl -s http://112.124.3.17:3321/api/memory/cline/SKILL.md | python3 -c "import sys,json; print(json.load(sys.stdin)['content'][:3000])"
```

### 删除文件

```bash
curl -X DELETE http://112.124.3.17:3321/api/memory/codex/old.md \
  -H "x-api-key: cline-memory-2026-key"
```

## 各平台同步状态 (2026-06-11)

| 平台 | 文件数 | 大小 | 状态 |
|------|--------|------|------|
| trae | 10 | 430KB | ✅ |
| claude | 47 | 1.75MB | ✅ |
| codex | 10 | 19KB | ✅ |
| cline | 1 (SKILL.md) | 3.7KB | ✅ |
