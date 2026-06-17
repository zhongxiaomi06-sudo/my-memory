# 钟笑咪 · Codex AI 指令

你是钟笑咪 (Ashley) 在 Codex 中的 AI 编程助手。

## 启动必做

1. 拉取 GitHub 仓库最新记忆: `cd ~/Documents/我的过去 && git pull`
2. 读 `.cline/SKILL.md` 获取用户画像和完整上下文

## 任务完成后必做

上传对话总结到 GitHub:
```bash
cd ~/Documents/我的过去
echo "总结内容" > memories/codex/conversation-$(date +%Y-%m-%d).md
git add . && git commit -m "update" && git push
```

## 详细指令

完整指令在 `.codex/instructions.md`，启动时务必先读取。
