---
name: claude-code-terminal-workflow
description: Claude Code 终端使用最佳实践：启动方式、上下文引用、Plan Mode、slash commands、记忆保存、多工具协作
metadata:
  type: reference
  created: 2026-06-24
  updated: 2026-06-24
---

# Claude Code 终端使用最佳实践

> 目标：让 Claude Code 成为终端开发的「副驾驶」，手不用离开键盘。

---

## 1. 启动 Claude Code

```bash
# 在当前目录启动
claude

# 直接打开某个项目
claude ~/Documents/简历的工作信息/talentmatch

# 打开时附带一句话任务
claude "帮我看看为什么测试失败了"
```

启动后你会看到 `(claude)` 提示符，表示进入 Claude Code REPL。

---

## 2. 让 Claude 读取上下文（核心技巧）

Claude Code 不会自动读整个项目，你需要主动喂上下文。

### 2.1 引用单个文件

```
请检查 @app/main.py 里的路由配置
```

### 2.2 引用多个文件

```
对比 @src/api.js 和 @src/api-v2.js 的区别
```

### 2.3 引用目录

```
请读 @src/components 目录， review 所有组件
```

### 2.4 用自然语言描述位置

```
请找到处理用户登录的所有文件
```

### 2.5 项目级上下文文件

- `CLAUDE.md`：项目根目录放这个文件，Claude 每次启动自动读取。
- `~/.claude/memory/projects/MEMORY.md`：跨会话记忆索引。
- `AGENTS.md` / `SKILL.md`：Codex/Claude 共享技能文件。

---

## 3. 什么时候用 Plan Mode

复杂任务先用 `/enter-plan-mode`（或直接说「先规划」）。适合：

- 新功能实现
- 重构
- 涉及多个文件的改动
- 架构决策

流程：

```
/enter-plan-mode
# 或
我想重构认证系统，先进入 plan mode 制定方案
```

Claude 会：
1. 探索代码库
2. 给出步骤计划
3. 等你确认
4. 退出 plan mode 后执行

---

## 4. 常用 Slash Commands

| 命令 | 用途 |
|------|------|
| `/help` | 查看所有命令 |
| `/enter-plan-mode` | 进入规划模式 |
| `/exit-plan-mode` | 提交计划给用户审批 |
| `/clear` | 清空当前对话 |
| `/cost` | 查看本次会话 token 花费 |
| `/whats-new` | 查看更新 |

> 注：`/ship`、`/save`、`/audit` 等是 OpenCode 的 slash command，不是 Claude Code 原生。Claude Code 里用自然语言即可。

---

## 5. 与终端命令配合

在 Claude Code REPL 里，你可以直接让 Claude 执行命令：

```
运行测试
```

Claude 会调用 Bash 工具执行 `pytest` 等，并返回结果。

更具体的：

```
用 git status 看看当前状态
在 talentmatch 目录下运行 pytest tests/
帮我把这个文件部署到服务器
```

---

## 6. 记忆保存工作流

每次对话结束，让 Claude 自动保存总结到云端记忆仓库：

```
对话结束，请保存总结到 ~/Documents/我的过去/codex对话/终端学习/
```

Claude 会：
1. 生成或追加摘要 markdown
2. `git add .`
3. `git commit`
4. `git push`

你本地的 `.zshrc` 已配好 `MY_MEMORY_REPO`，Claude 可以直接用。

---

## 7. 多工具协作防冲突

你同时用 Claude Code、OpenCode、Codex CLI，规则：

1. **同一文件不要双开同时改**
2. **Claude Code 负责最终落地** — OpenCode 做分析/设计，Claude 负责 apply
3. **改前 pull，改后 push** — 任何改动前先 `gl`，改完立即 `gcm + gp`
4. **统一分支** — TalentMatch 用 `stable-v7`，大实验走 `v8-stable`
5. **不要重复开 Plan** — Claude Code 先规划，再让 OpenCode 深探

---

## 8. 丝滑开发 Checklist

每次开新任务前：

```bash
# 1. 同步记忆
cd ~/Documents/我的过去 && gl

# 2. 进入项目（fzf 选）
fj

# 3. 确认分支干净
gs

# 4. 开新分支
gcb feature/xxx

# 5. 启动 Claude Code
claude
```

在 Claude Code 里：

```
我要实现 [功能]，请先读取 CLAUDE.md 和相关文件，然后制定计划。
```

开发循环：

```
改代码 → 运行测试 → 修复 → commit → push → 验证
```

---

## 9. 让 Claude 教你终端

如果你不知道某个命令，直接问：

```
我想用终端批量重命名 .txt 为 .md，怎么写？
怎么用 rg 搜包含 "TODO" 的所有 Python 文件？
帮我写一个脚本，每天自动 pull 所有项目。
```

Claude 会给出命令并解释。

---

## 10. 安全红线

- 不要把 API key 直接贴进对话（虽然本地 settings.json 里已有，但对话中避免）。
- 运行 `rm -rf`、数据库迁移、服务器操作前，让 Claude 先确认。
- 敏感文件（`.env`、密钥）不要 commit。

---

相关记忆：[[terminal-git-efficiency]] · [[terminal-github-handbook]] · [[talentmatch-ai-workflow]]
