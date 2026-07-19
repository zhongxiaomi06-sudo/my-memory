# Ashley 的成长日志

> 不依赖 VitePress，纯粹的静态 HTML 博客
> 主题：暖色调、设计师风格、内容优先、响应式

## 部署架构

- **源码与内容**：`my-memory/blog/`（本目录）
- **部署仓库**：`zhongxiaomi06-sudo/ashley-blog`
- **线上域名**：`https://200141.xin`
- **构建产物**：`dist/` 不再提交到 `my-memory`，仅作为本地构建临时目录

## 页面结构

- **首页**：个人简介、数据、项目、创作、最近日志、技能、视频占位、社交平台入口
- **日志列表**：所有 Build in Public 日志
- **关于**：更完整的个人状态、技能、项目、创作与联系方式
- **about.json**：AI 可读的结构化状态

## 目录结构

```
├── build.js          # 构建脚本（Markdown → HTML）
├── deploy.sh         # 一键部署到 ashley-blog
├── src/posts/        # 日志源文件（Markdown）
├── public/           # 静态文件（about.json、style.css）
├── legacy/           # 旧 VitePress / 独立页面（不再构建）
├── dist/             # 构建产物（本地临时，不提交）
└── new-post.sh       # 快速新建日志模板
```

## 本地构建

```bash
cd my-memory/blog
node build.js
```

构建结果在 `dist/`，可直接用浏览器打开查看。

## 部署到线上

```bash
cd my-memory/blog
bash deploy.sh
```

脚本会：
1. 运行 `node build.js`
2. 拉取 `ashley-blog` 仓库到临时目录
3. 用 `dist/` 覆盖旧文件
4. 提交并推送到 `ashley-blog/main`
5. GitHub Pages 自动重新部署 `200141.xin`

## 添加新日志

```bash
# 方法1: 手动在 src/posts/ 新建 .md 文件
echo "..." > src/posts/YYYY-MM-DD-title.md

# 方法2: 用模板
bash new-post.sh "标题"

# 构建 + 部署
bash deploy.sh
```

## AI 如何读取

AI 浏览器访问 `https://200141.xin/about.json` 获取结构化状态，或直接读 `my-memory/blog/public/about.json`。

## 主题定制

样式在 `public/style.css`，基于 CSS 自定义属性。修改后重新构建部署即可。
