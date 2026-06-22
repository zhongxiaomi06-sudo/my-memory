# AI 工作流操作手册（新手版）

> 目标：让第一次用的人也能独立启动、监控、停止 AI 工作流，并把运行记录保存到记忆仓库。

---

## 一、这套系统是什么

你的 AI 工作流 = **1 个调度器 + 3 个 AI 工具 + 1 个监控器**。

```text
ai-workflow（调度器）
    ├─ Claude Code   ← 主驾驶，执行代码、跑测试、部署
    ├─ OpenCode      ← 副驾驶，做深度分析、代码审计、设计
    ├─ Codex         ← 文档/飞书/自动化辅助
    └─ Monitor       ← 监控服务器健康、检查安全规则、自动重启
```

一次工作流会启动 4～5 个 `tmux` 后台会话，你可以随时切进去看每个 AI 在干什么。

---

## 二、为什么要这样设计

| 问题 | 传统做法 | 这套工作流 |
|------|---------|-----------|
| AI 上下文会断 | 一个窗口聊到底 | 启动多个 AI 并行，互相补充 |
| 线上服务挂了不知道 | 手动刷新页面 | Monitor 自动检测并告警/重启 |
| 代码里又写出硬编码 key | 靠人眼 review | 自动审计规则每小时扫描 |
| 每次对话结束忘记保存 | 手动复制粘贴 | 自动同步到 `~/Documents/我的过去/` |

---

## 三、操作前准备

### 1. 必须安装的工具

在终端运行：

```bash
which claude opencode codex tmux jq gh lark-cli
```

如果某一行没有输出，说明没装，需要补装：

```bash
brew install claude opencode codex tmux jq gh lark-cli
```

### 2. 必须配置的环境变量

把下面内容加进 `~/.zshrc`（不要写死 key，用的时候再 export）：

```bash
# 记忆仓库
export MY_MEMORY_REPO="$HOME/Documents/我的过去"

# AI 工具路径
export PATH="$HOME/bin:$HOME/.local/bin:$PATH"

# 飞书 Bot 用（去飞书开放平台获取）
# export FEISHU_APP_ID=cli_xxx
# export FEISHU_APP_SECRET=xxx
# export FEISHU_VERIFICATION_TOKEN=xxx
# export FEISHU_ENCRYPT_KEY=xxx

# DeepSeek（CC Switch 代理用）
# export DEEPSEEK_API_KEY=sk-xxx
```

改完后生效：

```bash
source ~/.zshrc
```

### 3. 确认记忆仓库存在

```bash
ls ~/Documents/我的过去/README.md
```

如果不存在：

```bash
git clone https://github.com/zhongxiaomi06-sudo/my-memory.git ~/Documents/我的过去
```

---

## 四、核心操作

### 4.1 启动一个工作流

**场景**：你想让 AI 帮 TalentMatch 开发新功能。

**命令**：

```bash
ai-workflow --project talentmatch --task develop --duration 4h
```

**参数解释**：

| 参数 | 含义 | 可选值 |
|------|------|--------|
| `--project` | 项目名 | `talentmatch`、`mediguide` |
| `--task` | 任务类型 | `develop`（开发）、`audit`（审计）、`refactor`（重构）、`release`（发布）、`monitor`（监控）、`research`（调研） |
| `--duration` | 运行时长 | `1h`、`2h`、`4h`、`8h`，最大 `24h` |

**为什么**：`develop` 会自动选择 OpenCode 的 `sisyphus` agent 做深度分析，Claude Code 负责执行；`audit` 会选择 `prometheus` 做安全审计。

**成功标志**：

```text
🚀 启动 AI 工作流: TalentMatch (develop, 4h)
📁 Workflow ID: talentmatch-20260622-185000-develop
✅ 工作流已启动: talentmatch-20260622-185000-develop
```

---

### 4.2 进入 AI 会话

**命令**：

```bash
# 进入 Claude Code（主执行）
tmux attach -t ai-workflow-talentmatch-20260622-185000-develop-claude

# 进入 OpenCode（深度分析）
tmux attach -t ai-workflow-talentmatch-20260622-185000-develop-opencode

# 进入 Codex（文档/飞书辅助）
tmux attach -t ai-workflow-talentmatch-20260622-185000-develop-codex

# 进入 Monitor（监控日志）
tmux attach -t ai-workflow-talentmatch-20260622-185000-develop-monitor
```

**tmux 基本操作**（必须会）：

| 按键 | 作用 |
|------|------|
| `Ctrl+b` 然后 `d` | 退出会话（后台继续运行） |
| `Ctrl+b` 然后 `[` | 进入滚动模式，用方向键翻页，按 `q` 退出 |
| `Ctrl+d` | 关闭当前 shell（**慎用**，会终止该 AI） |

**为什么**：退出（detach）不会让 AI 停止，你可以随时回来；关闭 shell 才会真正杀掉那个 AI。

---

### 4.3 查看运行状态

**命令**：

```bash
ai-workflow --status
```

**输出示例**：

```text
运行中的 AI 工作流：
────────────────────────────────────────────────────────────
  talentmatch-20260622-185000-develop | TalentMatch/develop | Claude:🟢 OpenCode:🟢 Codex:🟢 Monitor:🟢
    接入: tmux attach -t ai-workflow-talentmatch-20260622-185000-develop-claude
```

🟢 表示该会话活着，⭕ 表示已退出或不存在。

---

### 4.4 查看日志

**命令**：

```bash
ai-workflow --logs --workflow talentmatch-20260622-185000-develop
```

默认看 Claude 的日志。想看 Monitor：

```bash
ai-workflow-logs.sh talentmatch-20260622-185000-develop monitor
```

**为什么**：AI 在后台运行时，你不需要一直盯着；出了问题再翻日志。

---

### 4.5 停止工作流

**场景 1**：工作提前完成，手动结束。

```bash
ai-workflow --stop --workflow talentmatch-20260622-185000-develop
```

**场景 2**：你想停止某个项目的所有工作流。

```bash
ai-workflow --stop --workflow talentmatch
```

**场景 3**：工作流到时间会自动停止（Timer 会话负责）。

**为什么**：不停止会占用 tmux 会话和资源；到点自动停止是防止 AI 无限跑下去烧 token。

---

### 4.6 同步运行记录到记忆仓库

**命令**：

```bash
ai-workflow-memorize
```

**它会做什么**：

1. 找到最近一次工作流
2. 把 `meta.json` 和最近 500 行日志复制到 `~/Documents/我的过去/ai-workflow/`
3. 生成 `ai-workflow/index.md` 索引
4. 自动 `git commit` 并尝试 `git push`

**首次迁移所有历史**：

```bash
ai-workflow-memorize --all
```

**为什么**：这样下次任何 AI 启动时，只要读 `README.md` 就能看到「之前做过什么工作流、结果如何」。

---

## 五、飞书 Bot 操作

### 5.1 启动 Bot

```bash
ai-workflow-bot-start.sh
```

### 5.2 停止 Bot

```bash
ai-workflow-bot-stop.sh
```

### 5.3 在飞书里发命令

 Bot 监听命令前缀 `/ai`：

```text
/ai start talentmatch develop 4h
/ai stop talentmatch-20260622-185000-develop
/ai status
/ai help
```

**为什么**：不用开电脑也能在手机上启停工作流、查状态。

**注意**：飞书 Bot 依赖 App 审核通过。如果审核还没过，只能先用终端命令。

---

## 六、完整示例：从 0 到保存记录

```bash
# 1. 确保环境变量已加载
source ~/.zshrc

# 2. 启动工作流
ai-workflow --project talentmatch --task develop --duration 4h

# 3. 进入 Claude Code 会话指导工作
#    按 Ctrl+b d 退出，让它后台继续

# 4. 偶尔查看状态
ai-workflow --status

# 5. 工作完成后停止（或等 4 小时自动停止）
ai-workflow --stop --workflow talentmatch-20260622-185000-develop

# 6. 把记录存进记忆仓库
ai-workflow-memorize

# 7. 确认已保存
cd ~/Documents/我的过去
ls ai-workflow/talentmatch/
```

---

## 七、常见问题

### Q1: 启动时报 "当前运行工作流已达上限"

**原因**：`config.json` 里 `max_concurrent_workflows` 是 2。

**解决**：先停止一个旧工作流，或修改配置。

```bash
ai-workflow --status
ai-workflow --stop --workflow <旧的 workflow_id>
```

### Q2: Claude 会话显示 🟢 但 attach 进去黑屏

**原因**：Claude Code 可能在等待输入，或者已经空闲。

**解决**：按回车；如果还是黑屏，看日志：

```bash
ai-workflow-logs.sh <workflow_id> claude
```

### Q3: Monitor 报健康检查失败

**原因**：线上服务挂了，或网络不通。

**解决**：先看 Monitor 日志；如果配置了 `auto_restart`，Monitor 会尝试自动重启服务。

### Q4: `ai-workflow-memorize` push 失败

**原因**：网络或权限。

**解决**：手动 push：

```bash
cd ~/Documents/我的过去
git push
```

### Q5: 我想修改任务类型对应哪个 OpenCode agent

编辑 `~/.ai-workflow/config.json` 里的 `agent_mapping`。

---

## 八、安全提醒

1. **不要把 key 写进代码或配置文件明文**。`audit-rules.json` 会扫描硬编码 secret。
2. **离开电脑前停止不需要的工作流**，避免意外消耗 token。
3. **定期运行 `ai-workflow-memorize`**，确保运行记录进记忆仓库。
4. **git-crypt 密钥** `~/my-memory-gitcrypt-key` 必须单独保管，丢了就无法解密敏感文件。

---

## 九、速查表

| 我想做 | 命令 |
|--------|------|
| 启动开发工作流 | `ai-workflow --project talentmatch --task develop --duration 4h` |
| 启动审计工作流 | `ai-workflow --project talentmatch --task audit --duration 2h` |
| 查看状态 | `ai-workflow --status` |
| 进入 Claude | `tmux attach -t ai-workflow-<id>-claude` |
| 查看日志 | `ai-workflow --logs --workflow <id>` |
| 停止工作流 | `ai-workflow --stop --workflow <id>` |
| 同步记忆 | `ai-workflow-memorize` |
| 启动飞书 Bot | `ai-workflow-bot-start.sh` |
| 飞书命令 | `/ai start talentmatch develop 4h` |

---

最后更新：2026-06-22
