# Ashley 的成长日志

> 不依赖 VitePress，纯粹的静态 HTML 博客
> 构建命令: `node build.js`

## 目录结构

```
├── build.js          # 构建脚本（Markdown → HTML）
├── src/posts/        # 日志源文件（Markdown）
├── public/           # 静态文件（about.json）
├── dist/             # 构建产物（直接托管 GitHub Pages）
├── posts/            # (软链接到 dist/posts/)
└── new-post.sh       # 快速新建日志模板
```

## AI 如何读取

AI 浏览器访问 `https://200141.xin/about.json` 获取结构化状态，或直接读 GitHub 仓库源文件。

## 添加新日志

```bash
# 方法1: 手动在 src/posts/ 新建 .md 文件
echo "..." > src/posts/YYYY-MM-DD-title.md

# 方法2: 用模板
bash new-post.sh "标题"

# 重新构建 + 推送
node build.js
cd dist && git add . && git commit -m "new post" && git push
```
