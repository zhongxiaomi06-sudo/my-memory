# Trae 对话记忆

> 参见主技能文件: [`.cline/SKILL.md`](../../SKILL.md)
> 云端记忆操作: [`.cline/skills/cloud-memory.md`](../../skills/cloud-memory.md)

该 Skill 从 Trae IDE 的对话数据库中提取了完整的对话历史，并在 Codex 中继续完成了跨平台记忆中枢的部署。

## 记忆文件位置

### 本地
- `.cline/memory/trae/raw.json` (373KB 原始数据)
- `.cline/memory/trae/README.md` (详细记忆内容)

### 云端记忆中枢
- **Dashboard**: http://112.124.3.17:8765
- **Memory API**: http://112.124.3.17:3321
  - `GET /api/memory/list` - 列出所有平台记忆文件
  - `GET /api/memory/stats` - 查看统计信息
  - `GET /api/memory/:platform` - 查看某平台的文件列表
  - `GET /api/memory/:platform/:file` - 获取具体文件内容
  - `POST /api/memory/upload` - 上传新记忆（需 x-api-key 头）
  - `DELETE /api/memory/:platform/:file` - 删除文件
- **API Key**: `cline-memory-2026-key`

## 各平台记忆同步状态（截至 2026-06-11）

| 平台 | 文件数 | 大小 | 状态 |
|------|--------|------|------|
| trae | 10 | 430KB | ✅ 全部同步 |
| claude | 47 | 1.75MB | ✅ 全部同步 |
| codex | 8 | 16KB | ✅ 已同步 |
| other | 3 | 11KB | ✅ 简历+用户画像 |
| cline | 0 | - | 等待同步 |
| cursor | 0 | - | 等待同步 |
| copilot | 0 | - | 等待同步 |
| chatgpt | 0 | - | 等待同步 |
| windsurf | 0 | - | 等待同步 |

## 自动同步
- 服务器已安装 `/root/.cline/sync-memory.sh` 同步脚本
- Cron 每 2 小时自动运行一次
- 日志: `/var/log/cline-memory-sync.log`

## 使用方式
当需要回顾用户的对话历史、上下文偏好或之前讨论过的技术方案时：
1. 先读取本地记忆文件
2. 如需要更多上下文，可通过 API 查询云端记忆库
