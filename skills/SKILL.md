---
name: codex-router
description: CC Switch 路由诊断与修复。用于排查 Codex 连接 DeepSeek/Ollama 失败、502/429/402 错误、端口冲突等问题。
metadata:
  short-description: CC Switch 路由诊断修复
---

# CC Switch 路由诊断修复

用于排查和修复 Codex 连接 Provider 的路由问题。

## 架构

```
Codex → CC Switch (127.0.0.1:15721) → DeepSeek (api.deepseek.com)
                                     → Ollama  (127.0.0.1:11434)
```

## 诊断流程

### 1. 查健康状态
```bash
curl -s http://127.0.0.1:15721/health
```

### 2. 查端口占用
```bash
lsof -iTCP:15721 -sTCP:LISTEN -n -P
```
预期: 只有 `cc-switch` 一个进程。

### 3. 直连 DeepSeek 测试
```bash
curl -s -X POST http://127.0.0.1:15721/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}]}' | head -1
```

### 4. 直连 Ollama 测试
```bash
curl -s http://127.0.0.1:11434/api/tags | head -1
```

## 常见问题修复

### 502 Bad Gateway (路由切换失败)
原因: CC Switch 数据库中 `base_url` 指向自己

修复:
```bash
python3 -c "
import sqlite3, json
db = sqlite3.connect('/Users/ashley/.cc-switch/cc-switch.db')
c = db.cursor()
c.execute(\"SELECT id, settings_config FROM providers WHERE id='6d324a62-4aee-4e1d-9fdc-f8784efe76eb'\")
row = c.fetchone()
cfg = json.loads(row[1])
cfg['config'] = cfg['config'].replace('base_url = \"http://127.0.0.1:15721/v1\"', 'base_url = \"https://api.deepseek.com/v1\"')
c.execute(\"UPDATE providers SET settings_config=? WHERE id=?\", (json.dumps(cfg, ensure_ascii=False), row[0]))
db.commit(); print('Fixed')
"
killall cc-switch; sleep 1; open -a 'CC Switch'
```

### 端口冲突 (Address already in use)
```bash
for pid in $(lsof -ti:15721); do kill -9 $pid; done
open -a "CC Switch"
```

### 429 Too Many Requests
DeepSeek 限流，等待后重试，建议加 `sleep 3` 间隔。

### 402 Payment Required
DeepSeek 余额不足，需充值。

## 配置位置

| 文件 | 用途 |
|------|------|
| `~/.cc-switch/cc-switch.db` | Provider 配置、路由规则 |
| `~/Library/Application Support/com.ccswitch.desktop/app_paths.json` | GUI 层配置 |

## 已验证 Provider

**DeepSeek:** baseURL=`https://api.deepseek.com/v1`, model=`deepseek-chat`
**Ollama:** baseURL=`http://127.0.0.1:11434/v1`, model=`qwen2.5:7b`
