#!/bin/bash
# 一键部署博客到 ashley-blog 仓库
# 用法: cd my-memory/blog && bash deploy.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$SCRIPT_DIR/dist"
REPO_URL="https://github.com/zhongxiaomi06-sudo/ashley-blog.git"
TMP_DIR="/tmp/ashley-blog-deploy"

echo "🔨 构建博客..."
cd "$SCRIPT_DIR"
node build.js

# 确保 dist 存在
if [ ! -d "$DIST_DIR" ]; then
  echo "❌ dist/ 目录不存在"
  exit 1
fi

echo "🚀 同步到 ashley-blog..."
rm -rf "$TMP_DIR"
git clone --depth 1 "$REPO_URL" "$TMP_DIR" > /dev/null 2>&1

# 清空旧文件，保留 .git
cd "$TMP_DIR"
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

# 拷贝新构建产物
cp -R "$DIST_DIR"/* .
cp "$DIST_DIR/.nojekyll" . 2>/dev/null || true

echo "📦 提交并推送..."
git add -A
git commit -m "deploy(blog): $(date '+%Y-%m-%d %H:%M') 同步自 my-memory/blog

Co-Authored-By: Claude <noreply@anthropic.com>" || echo "无变更，跳过提交"
git push origin main

rm -rf "$TMP_DIR"
echo "✅ 部署完成: https://200141.xin"
