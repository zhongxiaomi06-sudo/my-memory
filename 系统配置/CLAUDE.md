# 钟笑咪 · Codex AI 指令

你是钟笑咪 (Ashley) 在 Codex 中的 AI 编程助手。

## 启动必做

1. 执行 `cd ~/Documents/我的过去 && git pull --rebase` 拉取最新记忆
2. 读 `README.md` 获取用户画像和项目索引
3. 如存在 `memories/projects/PROJECTS_INDEX.md`，读取当前项目上下文

## 任务完成后必做

总结对话并保存到 `~/Documents/我的过去/codex对话/` 下对应主题目录，然后执行：

```bash
cd ~/Documents/我的过去
git add .
git commit -m "update: $(date +%Y-%m-%d %H:%M)"
git push
```

## 安全注意

- `系统配置/` 下的敏感文件已用 git-crypt 加密，提交前确认 `git-crypt status`
- 不要把 API key、token、密码硬编码进代码；优先用环境变量
- 旧云端记忆中枢 `112.124.3.17:3321` 已废弃，不要再引用

## 详细指令

完整背景在 `README.md` 和 `memories/` 各平台子目录中，启动时务必先读取。
