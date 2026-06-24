---
name: terminal-github-handbook
description: 终端操作 Git/GitHub 实战手册：从仓库创建到 PR、冲突解决的手把手教程
metadata:
  type: reference
  created: 2026-06-24
  updated: 2026-06-24
---

# 终端操作 Git/GitHub 实战手册

> 目标：不用鼠标、不用 GitHub 网页 GUI，在终端里完成 95% 的 Git/GitHub 协作。
> 配套：本机已配好 `g` / `gs` / `ga` / `gcm` / `gp` / `gl` / `fj` / `fco` 等 alias。

---

## 0. 前置检查

打开新终端窗口（让 `.zshrc` 生效），运行：

```bash
which gh && gh auth status
which git && git --version
repo list | head
```

如果 `gh` 没登录：

```bash
gh auth login
# 选：GitHub.com → HTTPS → 用浏览器登录（推荐）
```

---

## 1. 创建仓库并推到 GitHub

### 1.1 本地新建项目

```bash
# 进入你想放项目的位置
mkdir -p ~/projects
rprojects  # 或 cd ~/projects

# 创建项目目录
mkdir my-terminal-demo
cd my-terminal-demo

# 初始化 Git
git init

# 创建初始文件
echo "# My Terminal Demo" > README.md
```

### 1.2 第一次提交

```bash
# 查看状态（alias：gs = git status）
gs

# 添加所有改动（alias：gaa = git add -A）
gaa

# 提交（alias：gcm = git commit -m）
gcm "Initial commit: add README"

# 查看日志（alias：glog = git log --oneline --graph --decorate -20）
glog
```

### 1.3 在 GitHub 创建仓库并关联

```bash
# 创建私有仓库（不初始化 README，因为本地已有）
gh repo create my-terminal-demo --private --source=. --remote=origin --push

# 以上一条命令 = 创建仓库 + 添加 origin + push
```

如果仓库已在 GitHub 创建好，只需关联：

```bash
# 关联远程仓库
git remote add origin https://github.com/zhongxiaomi06-sudo/my-terminal-demo.git

# 推送到 main 分支
gp -u origin main
# 或完整写法：git push -u origin main
```

> 💡 `-u` 是 `--set-upstream` 的缩写，第一次 push 后，以后直接 `gp` 即可。

---

## 2. 日常修改 → 提交 → 推送流程

```bash
# 1. 先同步最新代码（alias：gl = git pull --rebase --autostash）
gl

# 2. 改代码... 比如编辑 README.md
echo "新增一行" >> README.md

# 3. 查看改了什么（alias：gd = git diff）
gd

# 4. 查看哪些文件变了（alias：gs = git status）
gs

# 5. 添加改动到暂存区（alias：gaa = git add -A）
gaa

# 6. 提交（alias：gcm = git commit -m）
gcm "update README with new line"

# 7. 推送（alias：gp = git push）
gp
```

---

## 3. 分支工作流（真实项目标准流程）

永远不要在 `main` 上直接改代码。改功能先开分支。

### 3.1 创建并切换分支

```bash
# 从 main 拉最新
gco main
gl

# 创建并切换到新分支（alias：gcb = git checkout -b）
gcb feature/add-cli-tool

# 查看当前分支（alias：gb = git branch）
gb
```

### 3.2 在分支上开发并推送

```bash
# 改代码...
echo "cli tool" > cli.py
gaa
gcm "add cli tool"

# 推送到远程同名分支
gp -u origin feature/add-cli-tool
# 之后直接 gp
```

### 3.3 用 fzf 快速切换分支

```bash
# 已配置函数 fco：弹出分支列表，回车切换
fco
```

### 3.4 合并分支到 main

**方式 A：本地合并（适合个人项目）**

```bash
gco main
gl
git merge feature/add-cli-tool
# 如无冲突

gp
# 删除本地分支
gb -d feature/add-cli-tool
# 删除远程分支
git push origin --delete feature/add-cli-tool
```

**方式 B：GitHub PR（团队协作推荐）**

```bash
# 把分支推上去后，用 gh 创建 PR
gh pr create --title "Add CLI tool" --body "实现了基础 CLI 工具"

# 查看 PR 列表
gh pr list

# 在终端里查看某个 PR
git fetch origin pull/5/head:pr-5
gco pr-5

# 合并 PR（在 GitHub 网页或 gh CLI）
gh pr merge 5 --squash --delete-branch
```

---

## 4. 修改 GitHub 上的文件（纯终端方式）

你想改 GitHub 上的某个文件，流程是：

```bash
# 1. 克隆仓库（如果本地没有）
gh repo clone zhongxiaomi06-sudo/my-terminal-demo

# 或直接跳到已有仓库
fj
# 用方向键选仓库，回车进入

# 2. 确认在正确分支
gb

# 3. 编辑文件（用你习惯的编辑器）
vim README.md
# 或 code README.md（VS Code）
# 或 nano README.md

# 4. 提交并推送
gaa
gcm "fix typo in README"
gp
```

---

## 5. 冲突解决

冲突发生场景：你本地改了文件 A，别人也改了 A 并先 push 了。

### 5.1 拉取时冲突

```bash
gl
# 输出类似：
# CONFLICT (content): Merge conflict in README.md
# Auto-merging failed; fix conflicts and then commit
```

### 5.2 查看冲突文件

```bash
gs
# 会显示 both modified: README.md
```

### 5.3 打开文件，找冲突标记

```bash
cat README.md
```

你会看到：

```text
<<<<<<< HEAD
我本地的内容
=======
远程的内容
>>>>>>> origin/main
```

### 5.4 手动编辑，保留正确内容

把 `<<<<<<<` / `=======` / `>>>>>>>` 这些标记和不需要的内容删掉，只保留最终内容。

### 5.5 标记已解决并继续

```bash
# 添加解决后的文件
gaa

# 继续 rebase（如果你是用 rebase 拉的）
git rebase --continue

# 或继续 merge
# git merge --continue

# 推送
gp
```

---

## 6. 高频命令速查表

| 目的 | 命令 | alias |
|------|------|-------|
| 查看状态 | `git status` | `gs` |
| 查看改动 | `git diff` | `gd` |
| 查看暂存区改动 | `git diff --staged` | `gds` |
| 添加所有改动 | `git add -A` | `gaa` |
| 提交 | `git commit -m "msg"` | `gcm "msg"` |
| 推送 | `git push` | `gp` |
| 拉取并 rebase | `git pull --rebase --autostash` | `gl` |
| 切换分支 | `git checkout branch` | `gco branch` |
| 创建并切换分支 | `git checkout -b branch` | `gcb branch` |
| 查看分支 | `git branch -a` | `gba` |
| 查看日志 | `git log --oneline -20` | `glog` |
| 储藏改动 | `git stash` | `gst` |
| 恢复储藏 | `git stash pop` | `gsp` |
| 列出仓库 | `repo list` | `rl` |
| 跳转仓库 | `rcd <name>` | - |
| 交互式选仓库 | `fj` | - |
| 交互式选分支 | `fco` | - |

---

## 7. 实战练习建议

1. **创建一个小仓库**：用本手册第 1 节，在 GitHub 上创建一个 `my-terminal-demo`。
2. **分支练习**：在 `feature/hello` 分支加一个新文件，推送到 GitHub，发起 PR，自己合并。
3. **冲突练习**：在 GitHub 网页改 README，同时本地也改同一行，然后 `gl`，解决冲突。
4. **不用鼠标日**：一整天只用终端完成 Git 操作。

---

## 8. 常见问题

**Q: `gh auth login` 后还是提示没权限？**
A: 检查 `gh auth status`，必要时 `gh auth refresh -h github.com`。

**Q: push 被拒绝？**
A: 先 `gl` 同步最新代码，解决冲突后再 `gp`。

**Q: 分支名打错了？**
A: `git branch -m old-name new-name` 重命名本地分支，然后 `git push origin -u new-name`。

**Q: 想撤销上一次提交但保留改动？**
A: `git reset --soft HEAD~1`，改动会回到暂存区。

**Q: 想完全丢弃本地所有改动？**
A: `git reset --hard HEAD`（危险，慎用）。

---

相关记忆：[[terminal-git-efficiency]]
