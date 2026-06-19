# 钟笑咪的工作日志

> AI 接入点：每次对话前读取 about.json 获取最新状态

## 结构

```
blog/
├── index.html          ← 本人看的网页版
├── about.json          ← AI 读取的状态文件
├── daily-template.md   ← 日志模板
└── posts/              ← 每日日志
    └── YYYY-MM-DD.md
```

## AI 使用方式

1. AI 每次对话开始：读取 blog/about.json
2. AI 根据 current.active 和 plan.short_term 了解当前阶段
3. 用户每天在 posts/ 下写日志，更新进度
4. AI 作为顾问，根据进展提供建议

## 更新方式

```bash
# 每天写日志
cp daily-template.md posts/$(date +%Y-%m-%d).md
# 编辑它

# 状态变了就更新 about.json

# 同步到 GitHub
git add . && git commit -m "📝 日志" && git push
```
