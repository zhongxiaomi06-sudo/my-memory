#!/usr/bin/env python3
"""上传对话总结到云端记忆中枢"""
import json, urllib.request, sys, os
from datetime import datetime

API = "http://112.124.3.17:3321"
KEY = "cline-memory-2026-key"
PLATFORM = sys.argv[1] if len(sys.argv) > 1 else "codex"

# 从 stdin 读内容
content = sys.stdin.read().strip()
if not content:
    print("用法: echo '总结内容' | python3 upload-memory.py [platform]")
    sys.exit(1)

filename = f"conversation-{datetime.now().strftime('%Y-%m-%d')}.md"

# 追加模式
try:
    existing = urllib.request.urlopen(f"{API}/api/memory/{PLATFORM}/{filename}").read().decode()
    # 提取 content 字段
    import json as j
    existing_data = j.loads(existing)
    if isinstance(existing_data, dict) and 'content' in existing_data:
        content = existing_data['content'] + "\n\n---\n\n" + content
except:
    content = f"# {PLATFORM.upper()} 对话 {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n" + content

data = json.dumps({"platform": PLATFORM, "filename": filename, "content": content}).encode()
req = urllib.request.Request(f"{API}/api/memory/upload", data=data,
    headers={"x-api-key": KEY, "Content-Type": "application/json"}, method="POST")
resp = urllib.request.urlopen(req)
print(resp.read().decode())
