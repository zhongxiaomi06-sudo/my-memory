# Codex CC Switch 路由配置技能

> 适用平台: Codex / Trae
> 触发条件: 当 CC Switch 故障、需要切换 AI provider、或路由出错时

---

## 架构概览

```
Codex/Trae → CC Switch (127.0.0.1:15721) → Provider API
                                          ├── DeepSeek (api.deepseek.com)
                                          └── Ollama  (127.0.0.1:11434)
```

---

## 服务检查

### 检查 CC Switch 状态
```bash
curl http://127.0.0.1:15721/health
# 预期: {"status":"healthy"}
```

### 检查端口占用
```bash
lsof -iTCP:15721 -sTCP:LISTEN -n -P
# 预期: 只有 cc-switch 进程
```

### 测试 DeepSeek 连通性
```bash
curl -X POST http://127.0.0.1:15721/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}]}'
```

### 测试 Ollama 连通性
```bash
curl http://127.0.0.1:11434/api/tags
```

---

## 故障修复

### 问题 1: 502 Bad Gateway (路由切换失败)
**症状**: `切换路由状态失败: {{detail}}` 或 `error sending request for url (http://127.0.0.1:15721/v1/chat/completions)`

**原因**: CC Switch 数据库中的 `base_url` 指向自己（127.0.0.1:15721），导致循环转发

**修复**:
```bash
# 1. 查 DB 中的 base_url
sqlite3 ~/.cc-switch/cc-switch.db \
  "SELECT json_extract(settings_config, '$.config') FROM providers WHERE id='6d324a62-4aee-4e1d-9fdc-f8784efe76eb';" \
  | grep base_url

# 2. 修正 (改为 DeepSeek)
python3 -c "
import sqlite3, json
db = sqlite3.connect('/Users/ashley/.cc-switch/cc-switch.db')
cursor = db.cursor()
cursor.execute(\"SELECT settings_config FROM providers WHERE id='6d324a62-4aee-4e1d-9fdc-f8784efe76eb'\")
config = json.loads(cursor.fetchone()[0])
config['config'] = config['config'].replace('base_url = \"http://127.0.0.1:15721/v1\"', 'base_url = \"https://api.deepseek.com/v1\"')
cursor.execute(\"UPDATE providers SET settings_config=? WHERE id='6d324a62-4aee-4e1d-9fdc-f8784efe76eb'\", (json.dumps(config, ensure_ascii=False),))
db.commit()
print('Fixed')
"

# 3. 重启
killall cc-switch; open -a "CC Switch"
```

### 问题 2: 端口被占用 (Address already in use)
```bash
# 清理端口
for pid in $(lsof -ti:15721 2>/dev/null); do kill -9 $pid; done
# 重启
open -a "CC Switch"
```

### 问题 3: 多个进程抢占端口
```bash
# 确保只有 CC Switch 在 15721
pkill -f 'nc.*15721'
pkill -f 'simple-proxy'
launchctl unload ~/Library/LaunchAgents/local.*.plist 2>/dev/null
```

---

## 配置位置

| 文件 | 用途 |
|------|------|
| `~/.cc-switch/cc-switch.db` | CC Switch 主数据库(provider 配置、路由规则) |
| `~/.cc-switch/settings.json` | 应用设置 |
| `~/Library/Application Support/com.ccswitch.desktop/app_paths.json` | GUI 层配置 (备选) |

---

## 已验证可用的 Provider 配置

### DeepSeek
```json
{
  "name": "DeepSeek",
  "baseURL": "https://api.deepseek.com/v1",
  "model": "deepseek-chat"
}
```

### Ollama (本地)
```json
{
  "name": "Ollama",
  "baseURL": "http://127.0.0.1:11434/v1",
  "model": "qwen2.5:7b"
}
```
