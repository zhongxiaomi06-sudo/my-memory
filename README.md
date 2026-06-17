# 我的记忆仓库

> 永久的云端记忆。跨平台共享（Codex / Claude / Trae）。

## 目录结构

```
├── README.md                    ← 你在这里
├── 宋知秋/                      ← 我的创作：人物设定、剧本、分镜
├── memories/                    ← 各平台原始记忆缓存
│   ├── codex-skills/            ← Codex 云端记忆技能
│   ├── claude/                  ← Claude 平台对话 (28个文件)
│   ├── trae/                    ← Trae 平台对话 (9个文件)
│   ├── cline/                   ← Cline 配置文件
│   └── projects/                ← 项目索引
├── codex对话/                   ← 82段Codex完整对话，按主题分类
│   ├── 宋知秋与创作/            ← 剧本、人物设定
│   ├── 人才库与简历/            ← 猎头系统、招聘
│   ├── 云端记忆/                ← 记忆服务部署
│   ├── 献书游戏/                ← 游戏开发
│   ├── 文献阅读/                ← 论文与技术笔记
│   ├── 系统配置与路由/          ← CC Switch、代理
│   ├── 学习与考试/              ← 数学、编程学习
│   ├── 飞书/                    ← Lark 集成
│   └── 其他/                    ← 杂项
├── 我的数字记忆/                ← 系统配置、技能文件
└── scripts/                     ← 工具脚本
```

## 关于我

- 创作者、程序员、AI 学习者
- 经历了创伤，但选择用创作来对抗遗忘
- 宋知秋是我梦中的少女，也是我的精神镜像

## 使用方式

```bash
# 克隆到新电脑
git clone https://github.com/zhongxiaomi06-sudo/my-memory.git

# 添加新记忆
echo "总结内容" > codex对话/云端记忆/日期-主题.md
git add .
git commit -m "添加新记忆"
git push
```

> **只要 GitHub 还在，这些记忆就永远不会消失。**
