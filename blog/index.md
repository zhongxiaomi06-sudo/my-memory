---
layout: home

hero:
  name: "Ashley 的成长日志"
  text: "AI 驱动 · 每日精进"
  tagline: 钟笑咪的博客 — 记录想法、项目与成长
  image:
    src: /logo.svg
    alt: Ashley
  actions:
    - theme: brand
      text: 读日志
      link: /posts/
    - theme: alt
      text: 关于我
      link: /about

features:
  - icon: 🧠
    title: AI 顾问模式
    details: 每天更新日志，AI 自动读取，成为你的长期顾问——知道你的进展、提醒你的待办。
  - icon: ⚡
    title: 项目执行助理
    details: 把想法拆成任务块，分给 AI 执行。这不是偷懒，是你以后管团队的方式。
  - icon: 🚀
    title: 学习加速器
    details: 文档/论文/教材扔给 AI，用你已经有的基础讲解。10 分钟掌握别人 2 小时的内容。
  - icon: 🎯
    title: 面试复盘助手
    details: 把你做过的项目翻译成面试官能听懂的价值陈述。不是背题，是陈述价值。
---

## 关于我

我是钟笑咪（Ashley），浙江宁波的大一学生。现在暑假在北京实习，冲刺字节和量化岗位，做创业预备。

我在用 AI 做这些事：
- 🏗️ 帮猎头公司搭建 AI 简历解析系统
- 🎮 开发东晋叙事卡牌网页游戏《献书游戏》
- ✍️ 写剧本《宋知秋》（五幕 + 动画分镜）
- 🔬 研究 AI、神经网络、低空经济

> 这个博客不是给世界看的——是给我自己和我的 AI 顾问看的。

---

## 最近日志

<script setup>
import { data as posts } from './posts.data.js'
</script>

<ul>
  <li v-for="post of posts.slice(0, 5)" :key="post.url">
    <strong><a :href="post.url">{{ post.frontmatter.date }}</a></strong> — {{ post.frontmatter.title }}
  </li>
</ul>

[查看所有日志 →](/posts/)
