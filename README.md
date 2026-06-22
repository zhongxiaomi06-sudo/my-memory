# 我的记忆仓库

> 永久保存。跨平台。不留痕迹。

---

## 这是什么

这是一个 **GitHub 私有仓库**，用来保存我和 AI 之间所有的对话、项目、创作和记忆。

**核心原则：不依赖任何服务器，只用 GitHub。电脑上不留本地文件。**

---

## 目录结构

```
├── README.md                   ← 你在这里
├── SKILL.md                    ← AI 技能文件（复制即用）
├── .gitattributes              ← git-crypt 加密规则
├── 宋知秋/                     ← 我的创作：剧本、动画分镜、人物设定
├── 系统配置/                   ← 代理脚本、VPN、CC Switch 配置（已加密）
├── ai-workflow/                ← ai-workflow 运行记录（由 ai-workflow-memorize 同步）
├── memories/                   ← 各平台原始记忆缓存
│   ├── claude/                 ← Claude 对话
│   ├── claude-native/          ← Claude Code 原生记忆迁移
│   ├── trae/                   ← Trae 对话
│   ├── cline/                  ← 用户画像、偏好、技能文件
│   ├── codex/                  ← Codex 记忆索引
│   ├── codex-native/           ← Codex 原生记忆迁移
│   ├── codex-skills/           ← Codex 云端记忆技能（已废弃）
│   └── projects/               ← 项目总索引
├── codex对话/                  ← Codex 完整对话，按主题分类
│   ├── 宋知秋与创作/
│   ├── 人才库与简历/
│   ├── 云端记忆/               ← 旧云端中枢相关（已归档）
│   ├── 献书游戏/
│   ├── 文献阅读/
│   ├── 系统配置与路由/
│   ├── 学习与考试/
│   ├── 飞书/
│   └── 其他/
├── scripts/
│   ├── upload-memory.py        ← 对话总结自动提交脚本
│   └── ai-workflow-memorize.sh ← ai-workflow 运行记录同步脚本（引用 ~/bin/ai-workflow-memorize）
├── AI工作流操作手册（新手版）.md  ← ai-workflow 完整操作教程
├── 给朋友的说明-如何像我一样使用AI记忆系统.md
└── .gitignore
```

---

## 我是谁

- **钟笑咪（Ashley / Mia）**
- 浙江宁波，大一学生
- GitHub: `zhongxiaomi06-sudo`
- 邮箱: `zhongxiaomi06@gmail.com`

我在做的事：
- 帮猎头公司搭建 AI 简历解析系统（FastAPI + Agent 管道 + 飞书）
- 开发东晋叙事卡牌网页游戏《献书游戏》
- 用创作处理创伤：写了剧本《宋知秋》及完整动画分镜
- 研究 AI、神经网络、低空经济、无人机
- 学线性代数、离散数学、编程

我使用 AI 的方式：
- 不是"学编程"，是"用编程做东西"
- 让 AI 补齐我不会的部分——写代码、架构、部署
- 每次对话结束自动保存，下次接着聊

---

## 使用方式

### 在新电脑上

```bash
git clone https://github.com/zhongxiaomi06-sudo/my-memory.git ~/Documents/我的过去
# 发给 AI：请读取我的记忆仓库
```

### 对话结束后

```bash
# AI 自动保存总结
cd ~/Documents/我的过去
echo "总结内容" | python3 scripts/upload-memory.py codex 主题
# 或手动：
git add . && git commit -m "update" && git push
```

### ai-workflow 运行结束后

```bash
# 同步最近一次 ai-workflow 运行记录（meta + 日志摘要）到本仓库
ai-workflow-memorize

# 首次迁移所有历史
ai-workflow-memorize --all
```

运行记录会保存在 `ai-workflow/<project>/<workflow_id>/` 下，与 `codex对话/` 并列成为永久记忆的一部分。

### 离开电脑时

```bash
cd ~/Documents && rm -rf 我的过去
# 下次从头 git clone
```

---

## 安全与加密

- 这个仓库是 **私有的**，只有我自己能看到
- `系统配置/` 下的敏感文件已用 **git-crypt** 加密：
  - VPN 配置文件（`*.ovpn`）
  - CA 证书（`ca.crt`）
  - 代理脚本（`simple-proxy.py`, `cc-switch-proxy.py`）
  - 命令存储文件
- 所有 API key 已改为从环境变量读取，不再硬编码
- 旧云端记忆中枢 `112.124.3.17:3321` 已废弃

解密方法（换电脑时）：

```bash
cd ~/Documents/我的过去
git-crypt unlock ~/path/to/my-memory-gitcrypt-key
```

---

## 项目索引

本地所有 Git 仓库见 `~/projects-index.json`，可通过 `repo list` / `repo cd <name>` 快速导航。

---

## 关于宋知秋

她是我梦里 15 年的少女。后来我发现，她就是我。

完整剧本：五幕结构 + 动画分镜 → 见 `宋知秋/` 目录

---

## 重要

- 这个仓库是 **私有的**，只有我自己能看到
- 敏感文件已加密，密钥单独保管
- **GitHub 在，记忆就在**

---

最后一次更新: 2026-06-22
