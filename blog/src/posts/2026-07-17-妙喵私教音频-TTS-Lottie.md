---
title: 妙喵私教：音频/TTS/Lottie 资产链路接通
date: 2026-07-17
tags: [抖音创变AI大赛, 妙喵私教, TTS, edge-tts, Lottie, React, FastAPI]
---

## 今日完成

- [x] 后端接入 edge-tts（>=6.1.0），默认中文女声 `zh-CN-XiaoxiaoNeural`，带本地缓存
- [x] 新增 `POST /api/tts` 接口，支持 voice/rate/volume/pitch 参数
- [x] 前端接入语音输入（`use-pet-asr.ts`）与 TTS 播放（`use-pet-tts.ts`）
- [x] `pet-assistant.tsx` 接入麦克风输入与宠物回复朗读按钮
- [x] 10 个 Lottie 猫动画与 14 个音效就位，含 oneko 彩蛋
- [x] `npm run build` 通过、`POST /api/tts` 返回 `audio/mpeg` 通过、`pytest 26 passed`
- [x] 推送到分支 `feature/miaomiao-audio-tts`

## 今日思考

这次不是从零写代码，而是把 edge-tts、Lottie、ASR 这些现成能力串成一条资产链路。后端封装、前端 Hook、测试用例，三件套对齐后，功能才算真正可用。

一个观察：动画和音效占用的工程时间比代码多。资产准备必须提前，否则功能通了但产品还是空壳。

## 状态

- 分支已推，PR 待创建
- 抖音创变 AI 大赛仍在推进，其他赛道素材需补齐
