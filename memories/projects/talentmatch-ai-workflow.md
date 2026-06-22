---
name: talentmatch-ai-workflow
description: TalentMatch 项目及通用 AI 开发工作流：Claude Code + OpenCode + oh-my-openagent + Kimi Code Plan 组合与 24x7 不间断运作方案
metadata:
  type: project
  updatedAt: "2026-06-22"
---

# TalentMatch · AI 开发组合工作流

## 工具栈与角色（精确定义）

| 工具 | 角色 | 主模型 | 用途 |
|------|------|--------|------|
| **OpenCode** | 写代码的 Agent 工具 | Kimi K2.6 / GPT-5.5 | 复杂设计、跨文件重构、代码生成、多学科 review |
| **oh-my-openagent** | AI 自动化 harness | 同上 | 让 AI 在不需要人工确认的情况下连续工作数小时；内置 11 个 agent + 14 个 skill |
| **Claude Code** | 日常驾驶舱 + 执行器 | Kimi K2.7 (via Kimi Code Plan) | 改代码、跑测试、部署、验证、协调 |
| **Kimi Code Plan** | 模型能力层 / token 套餐 | Kimi K2.7 / K2.6 / K2.5 | 国产最便宜、最好用的 coding agent token；为 Claude Code 和 oh-my-openagent 提供长上下文、强编码模型 |
| **Codex** | 桌面自动化 + 文档 + 飞书集成 | DeepSeek V4 Pro (via CC Switch) | 文档处理、Lark/Feishu 集成、桌面自动化 |

> 关键区别：OpenCode 是**工具**，oh-my-openagent 是**让它自动化干活的 harness**，Kimi Code Plan 是**便宜的 token 层**。

## 典型任务分工

```
日常小迭代          → Claude Code 单独完成
复杂架构/设计       → Claude Code Plan Mode + OpenCode 并行深探
代码审计            → OpenCode /audit  →  Claude Code 按结果修复
批量修复            → Claude Code /fix 或手动循环
上线发布            → Claude Code /ship 或手动 6 步流程
保存/推送           → Claude Code /save 或手动 git commit + push
线上白屏监控        → OpenCode /whitescreen → Claude Code 诊断修复
```

## 关键配置位置

- 全局 Claude Code：`~/.claude/settings.json`
- 项目 Claude Code：`/Users/ashley/Documents/简历的工作信息/.claude/settings.json`
- MCP 服务器：`~/.mcp.json`
- OpenCode：`~/.config/opencode/opencode.json` + `~/.config/opencode/oh-my-openagent.json`
- 通用 AI 工作流配置：`~/.ai-workflow/config.json`（新增）
- TalentMatch 入口：`/Users/ashley/Documents/简历/work信息/talentmatch/`
- TalentMatch 服务器：`47.110.93.137` / `yorkteam.cn`，部署路径 `/opt/recruit-bot-v5/`

## 通用 AI 工作流系统（新增）

为了不再把脚本硬编码到 TalentMatch，已封装成通用系统：

```
手机飞书 Bot 命令
  ↓
~/bin/ai-workflow-feishu-bot.py（本地监听器）
  ↓
~/bin/ai-workflow --project <name> --task <type> --duration <hours>
  ↓
~/bin/ai-workflow-dispatch.sh
  ↓
tmux 会话群：claude / opencode / codex / monitor / timer
```

任务类型映射：

| 任务 | OpenCode Agent | Category |
|------|----------------|----------|
| develop | sisyphus | deep |
| audit | prometheus | ultrabrain |
| refactor | hephaestus | deep |
| release | sisyphus-junior | quick |
| monitor | librarian | quick |
| research | oracle | ultrabrain |

触发方式：
- CLI：`ai-workflow --project mediguide --task develop --duration 4h`
- 飞书：`/ai start mediguide develop 4h`
- MediGuide Web：AI 工作流面板
- 定时 cron

## 24x7 不间断运作架构

- 服务端：`recruit-bot` systemd 服务，端口 `8878`
- 本地持久化：Claude Code / OpenCode / Codex 在 tmux 中常驻
- 自动化调度：Claude Code `/loop` 或 `CronCreate`
- 监控告警：健康检查 + 白屏检查 + 安全审计 → 飞书

## 协作防冲突原则

1. 同一文件不要双开同时改
2. Claude Code 是执行 owner
3. 改前 pull，改后 push
4. 统一分支 `stable-v7`
5. 不要重复开 Plan

## 停止条件

- 测试：271 passed, 0 failed
- 验证：verify.sh 输出 `6 passed, 0 failed`
- 同一种修复连续失败 3 次 → 换方案并报告用户

## 已落地的脚本与配置

- `~/bin/ai-workflow` — 通用主入口
- `~/bin/ai-workflow-dispatch.sh` — 通用调度器
- `~/bin/ai-workflow-feishu-bot.py` — 飞书 Bot 监听器
- `~/bin/ai-workflow-start.sh` — TalentMatch 专用启动器
- `~/bin/ai-workflow-stop.sh` / `ai-workflow-monitor.sh` / `ai-workflow-notify.sh` / `ai-workflow-status.sh`
- `~/.ai-workflow/config.json` — 通用工作流配置
- `~/.mcp.json` — MCP 服务器配置
- `~/.claude/settings.json` — 全局 Claude Code 配置

**Why:** 单独一个 AI 工具无法同时覆盖"快速执行"和"深度分析"，三工具体组合+定时循环才能实现不间断开发与运维。
**How to apply:** 复杂任务先在 Claude Code Plan Mode 定方案，再让 OpenCode 做深探，最后 Claude Code 落地并验证。通用工作流系统落地后，优先用 `ai-workflow --project <name> --task <type>` 启动。
