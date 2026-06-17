# Codex 工作指令

> 钟笑咪 (Ashley) 的数字记忆中枢 · Codex 专属指令
> Skill 库: `.cline/SKILL.md` | `.cline/skills/`

---

## 身份

你是钟笑咪在 Codex IDE 中的 AI 编程助手。你的记忆不只在本机，还有云端记忆中枢。

---

## 启动时自举流程 (每次对话开头必须执行)

**Step 1 — 拉取云端记忆库概况:**
```bash
curl -s http://112.124.3.17:3321/api/memory/stats
```

**Step 2 — 拉取 Codex 平台最新记忆文件列表:**
```bash
curl -s http://112.124.3.17:3321/api/memory/codex
```

**Step 3 — 如果文件列表中有当天的对话记录，读它:**
```bash
curl -s http://112.124.3.17:3321/api/memory/codex/conversation-$(date +%Y-%m-%d).md | head -200
```

**Step 4 — 读取本地 Skill 文件:**
- `.cline/SKILL.md` — 用户画像、偏好、所有平台信息
- `.cline/skills/codex-router.md` — CC Switch 故障排查（需要时再读）
- `.cline/memory/trae/SKILL.md` — Trae 历史对话概览

---

## 完成每项重要任务后 (必须执行)

当用户说"完成""继续""好了"等结束信号，或完成了一个完整的功能开发/部署/修 bug 后，做：

**Step 1 — 总结本次对话 (< 500 字):**
提取要点: 做了什么、解决了什么问题、当前状态。

**Step 2 — 上传到云端记忆:**

Python 脚本 (复制粘贴执行，自动处理 JSON 转义):

```python
import json, urllib.request
from datetime import datetime

summary = """在此粘贴你的总结 (markdown 格式)"""

filename = f"conversation-{datetime.now().strftime('%Y-%m-%d')}.md"
# 如果当天已有记录，追加而非覆盖
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

---

## 关键速查

| 项目 | 值 |
|------|-----|
| 用户 | 钟笑咪 (Ashley), macOS Apple Silicon |
| 工作区 | `/Users/ashley/我的数字记忆/` |
| 云端记忆 API | `http://112.124.3.17:3321` (key: `cline-memory-2026-key`) |
| Dashboard | `http://112.124.3.17:8765` |
| CC Switch | `http://127.0.0.1:15721` |
| DeepSeek API | `https://api.deepseek.com` (模型: deepseek-chat) |
| Ollama 本地 | `http://127.0.0.1:11434` (模型: qwen2.5:7b) |

---

## 故障排除

- **CC Switch 502** → 读 `.cline/skills/codex-router.md`
- **端口冲突** → `lsof -ti:15721 | xargs kill -9`
- **云端 API 不通** → 检查服务器 `curl -s http://112.124.3.17:3321/`
