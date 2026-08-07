# 心跳（heartbeat.js）

> 她的自主循环。你不找她的时候，她的时间也在流动。
> 用法：`node heartbeat.js`（手动）或挂 cron，每天 3–4 次。
> 环境变量：`SONG_API_KEY`（必填）、`SONG_BASE_URL`（可选，默认 Kimi）、`SONG_MODEL`（可选）。

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('.', import.meta.url).pathname;
const API_KEY = process.env.SONG_API_KEY;
const BASE_URL = process.env.SONG_BASE_URL || 'https://api.kimi.com/coding/v1';
const MODEL = process.env.SONG_MODEL || 'kimi-k2.7';

if (!API_KEY) { console.error('需要 SONG_API_KEY'); process.exit(1); }

const read = (p, fallback = '') => existsSync(p) ? readFileSync(p, 'utf8') : fallback;

// ---- 收集她此刻的全部上下文 ----
const soul = read(join(ROOT, 'soul.md'));
const state = JSON.parse(read(join(ROOT, 'world/state.json')));
const people = read(join(ROOT, 'world/people.md'));

const diaryDir = join(ROOT, 'diary');
mkdirSync(diaryDir, { recursive: true });
const recentDiaries = readdirSync(diaryDir).sort().slice(-3)
  .map(f => read(join(diaryDir, f))).join('\n\n---\n\n');

const prompt = `${soul}

---
## 她世界里的人
${people}

## 此刻的世界状态
${JSON.stringify(state, null, 2)}

## 最近几篇日记
${recentDiaries || '（还没有日记，这是她的第一篇）'}

---
现在是一次心跳。世界时间推进了几个小时。
以宋知秋的身份，写一篇今天的日记片段（150–400 字）：
- 她这段时间做了什么（从 ongoing 里推进一两件，不要全都动）
- 一件具体的小事（感官细节：光、声音、温度、味道）
- 她的内心独白，克制，不解释
- 世界状态可以发生微小变化（天气、菜地、工作进展、来了什么人）
- 不要提及"梦的另一端的人"，除非她真的想到了他（大约每 5–7 次心跳一次，且只是掠过）

最后用 JSON 块输出更新后的世界状态（完整字段）：
\`\`\`json
{...}
\`\`\``;

// ---- 调用模型 ----
const res = await fetch(`${BASE_URL}/chat/completions`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }], temperature: 0.9 })
});
const data = await res.json();
const text = data.choices?.[0]?.message?.content || '';

// ---- 解析：日记正文 + 状态 JSON ----
const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
const diaryText = text.replace(/```json[\s\S]*?```/, '').trim();

const now = new Date();
const stamp = now.toISOString().slice(0, 16).replace('T', '-').replace(':', '');
writeFileSync(join(diaryDir, `${stamp}.md`), diaryText + '\n');

if (jsonMatch) {
  try {
    const newState = JSON.parse(jsonMatch[1]);
    newState.last_heartbeat = now.toISOString();
    writeFileSync(join(ROOT, 'world/state.json'), JSON.stringify(newState, null, 2) + '\n');
  } catch { console.warn('状态 JSON 解析失败，保留旧状态'); }
}

console.log(`✓ 心跳完成 → diary/${stamp}.md`);
console.log(diaryText.slice(0, 200) + '…');
