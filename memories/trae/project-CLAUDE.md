{
  "uploadedAt": "2026-06-08T04:29:06.780Z",
  "platform": "trae",
  "source": "api",
  "tags": [],
  "content": "# Claude 工作指令\n\n<!-- CLOUDE_STARTUP -->\n## 启动时必须执行\n\n1. **拉取云端记忆**: 运行 `./memory-sync.sh pull` 读取你的云端记忆仓库，了解用户偏好和历史上下文。\n2. 阅读 `.memory-sync/` 目录下的文件，了解用户之前的项目和偏好。\n\n## 项目背景\n\n当前项目: `/Users/ashley/自媒体数字化/`\n\n### 用户长期目标\n- 四天一个产品交付的连续创业者\n- 做工业化自媒体博主（自动化选题→制作→发布→分析）\n- 个人AI眼镜开发\n- 献书游戏开发（东晋叙事卡牌网页游戏）\n- 灵巧手+Manus手套映射\n\n### 用户偏好\n- 所有对话上传云端记忆，培养专属 agent\n- 完全自动化工作流，不需频繁手动操作\n- 电影级游戏品质追求\n- 短平快的交付节奏\n\n## 记忆仓库\n- API: `http://112.124.3.17:3321`\n- API Key: `cline-memory-2026-key`\n- Platform: `trae`\n- 同步脚本: `./memory-sync.sh`\n\n## 每次对话结束时\n运行 `./memory-sync.sh push` 将本次对话的关键决策和进度上传到云端记忆仓库。\n<!-- /CLOUDE_STARTUP -->\n\n## 当前项目技术栈\n- Python 3.14 + FastAPI\n- Node.js 26 (Claude Code)\n- 本地代理: `gc_proxy.py` (Anthropic→OpenAI 协议转换, localhost:3000)\n- 模型: MiniMax M2.7 via GeneralCompute\n\n## 目录结构\n```\n自媒体数字化/\n├── main.py              # 自媒体工作流主程序\n├── src/                 # 源代码\n│   ├── topics/          # 选题抓取\n│   ├── content/         # 视频策划\n│   ├── analytics/       # 数据分析\n│   ├── scheduler/       # 定时任务\n│   └── api/             # 路由\n├── gc_proxy.py          # GeneralCompute 代理\n├── memory-sync.sh       # 记忆同步脚本\n├── config.yaml          # 配置文件\n└── CLAUDE.md            # 本文件\n```\n",
  "metadata": {}
}