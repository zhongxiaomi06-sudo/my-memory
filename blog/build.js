const fs = require('fs');
const path = require('path');

// 读取 about.json
const about = JSON.parse(fs.readFileSync('public/about.json', 'utf-8'));

// 读取所有日志
const postsDir = path.join(__dirname, 'src/posts');
fs.mkdirSync(postsDir, { recursive: true });

// 移动第一篇日志到 src
fs.copyFileSync(path.join(__dirname, 'posts/2026-06-19-start.md'), path.join(postsDir, '2026-06-19-start.md'));

const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).sort().reverse();

// 简单的 Markdown 解析（处理 # ## - [x] 等）
function parseMD(text) {
  const lines = text.split('\n');
  let html = '';
  let frontmatter = {};
  let inFM = false;
  let fmDone = false;

  for (const line of lines) {
    if (!fmDone && line.startsWith('---')) {
      if (!inFM) {
        inFM = true;
        continue;
      } else {
        fmDone = true;
        inFM = false;
        continue;
      }
    }
    if (inFM) {
      const m = line.match(/^(\w+):\s*(.+)/);
      if (m) frontmatter[m[1]] = m[2].trim();
      continue;
    }
    
    // 标题
    if (line.startsWith('### ')) {
      html += `<h3>${line.slice(4)}</h3>\n`;
    } else if (line.startsWith('## ')) {
      html += `<h2>${line.slice(3)}</h2>\n`;
    } else if (line.startsWith('# ')) {
      html += `<h1>${line.slice(2)}</h1>\n`;
    } else if (line.startsWith('- [x] ')) {
      html += `<li class="done">${line.slice(6)}</li>\n`;
    } else if (line.startsWith('- [ ] ')) {
      html += `<li class="todo">${line.slice(6)}</li>\n`;
    } else if (line.startsWith('- ')) {
      html += `<li>${line.slice(2)}</li>\n`;
    } else if (line.startsWith('> ')) {
      html += `<blockquote>${line.slice(2)}</blockquote>\n`;
    } else if (line.startsWith('---')) {
      html += '<hr/>\n';
    } else if (line.trim() === '') {
      html += '<br/>\n';
    } else if (line.startsWith('```')) {
      // 跳过代码块
    } else if (line.match(/^\d+\.\s/)) {
      html += `<li>${line.replace(/^\d+\.\s/, '')}</li>\n`;
    } else if (line.startsWith('|')) {
      // 跳过表格
      continue;
    } else if (line.match(/^\[(.+)\]\((.+)\)$/)) {
      const m = line.match(/^\[(.+)\]\((.+)\)$/);
      html += `<a href="${m[2]}">${m[1]}</a><br/>\n`;
    } else if (line.match(/\[(.+)\]\((.+)\)/)) {
      html += line.replace(/\[(.+)\]\((.+)\)/g, '<a href="$2">$1</a>') + '<br/>\n';
    } else {
      html += `<p>${line}</p>\n`;
    }
  }
  return { html, frontmatter };
}

// 生成首页
let postsHTML = '';
for (const file of postFiles) {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  const parsed = parseMD(content);
  postsHTML += `
    <article class="post-item">
      <div class="post-date">${parsed.frontmatter.date || file.replace('.md','').slice(0,10)}</div>
      <h3><a href="/posts/${file.replace('.md','')}.html">${parsed.frontmatter.title || '无标题'}</a></h3>
      ${parsed.frontmatter.tags ? `<div class="tags">${parsed.frontmatter.tags.split(',').map(t => `<code>${t.trim()}</code>`).join(' ')}</div>` : ''}
    </article>`;
}

// HTML 模板
const layout = (title, content) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — 钟笑咪</title>
<style>
:root { 
  --bg: #0d1117; --fg: #e6edf3; --accent: #58a6ff; 
  --card-bg: #161b22; --border: #30363d; --muted: #8b949e;
  --done: #3fb950; --todo: #d29922;
}
* { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--bg); color:var(--fg); font-family:-apple-system,sans-serif; line-height:1.6; }
.container { max-width:720px; margin:0 auto; padding:2rem 1rem; }
header { 
  border-bottom:1px solid var(--border); padding-bottom:1rem; margin-bottom:2rem;
  display:flex; justify-content:space-between; align-items:center;
}
header h1 { font-size:1.5rem; }
header h1 a { color:var(--fg); text-decoration:none; }
nav a { color:var(--accent); margin-left:1rem; text-decoration:none; }
nav a:hover { text-decoration:underline; }
.hero { text-align:center; padding:3rem 0; }
.hero h1 { font-size:2.5rem; margin-bottom:0.5rem; }
.hero .tagline { color:var(--muted); font-size:1.1rem; margin-bottom:2rem; }
.features { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:2rem 0; }
.feature { background:var(--card-bg); border:1px solid var(--border); border-radius:8px; padding:1.5rem; }
.feature h3 { margin-bottom:0.5rem; }
.feature p { color:var(--muted); font-size:0.95rem; }
.post-item { background:var(--card-bg); border:1px solid var(--border); border-radius:8px; padding:1.5rem; margin-bottom:1rem; }
.post-date { color:var(--muted); font-size:0.85rem; margin-bottom:0.5rem; }
.post-item h3 { font-size:1.1rem; }
.post-item a { color:var(--accent); text-decoration:none; }
.post-item a:hover { text-decoration:underline; }
.tags { margin-top:0.5rem; }
.tags code { background:var(--bg); padding:2px 8px; border-radius:12px; font-size:0.8rem; color:var(--muted); margin-right:4px; }
article { background:var(--card-bg); border:1px solid var(--border); border-radius:8px; padding:2rem; }
article h1, article h2, article h3 { margin:1rem 0 0.5rem; }
article h1 { font-size:1.8rem; }
article h2 { font-size:1.3rem; padding-bottom:0.3rem; border-bottom:1px solid var(--border); }
article p { margin:0.5rem 0; }
article li { margin-left:1.5rem; margin-bottom:0.3rem; }
article li.done { text-decoration:line-through; color:var(--done); }
article li.todo { color:var(--todo); }
article blockquote { border-left:3px solid var(--accent); padding-left:1rem; color:var(--muted); margin:1rem 0; }
article hr { border:none; border-top:1px solid var(--border); margin:1rem 0; }
article a { color:var(--accent); }
article code { background:var(--bg); padding:2px 6px; border-radius:4px; font-size:0.9em; }
footer {text-align:center;padding:2rem 0;color:var(--muted);font-size:0.85rem;border-top:1px solid var(--border);margin-top:3rem;}
.status-card { background:var(--card-bg); border:1px solid var(--accent); border-radius:8px; padding:1.5rem; margin:1.5rem 0; }
table { width:100%; border-collapse:collapse; margin:1rem 0; }
th, td { border:1px solid var(--border); padding:0.5rem; text-align:left; }
th { background:var(--card-bg); }
@media(max-width:600px) { .features{grid-template-columns:1fr;} header{flex-direction:column;} nav{margin-top:0.5rem;} }
</style>
</head>
<body>
<div class="container">
<header>
  <h1><a href="/">钟笑咪</a></h1>
  <nav>
    <a href="/">首页</a>
    <a href="/posts.html">日志</a>
    <a href="/about.html">关于</a>
  </nav>
</header>
${content}
<footer>
  <p>钟笑咪 · 2026</p>
  <p>this.sh is my AI advisor — knows what i'm doing</p>
</footer>
</div>
</body>
</html>`;

// 生成首页
const indexContent = `
<div class="hero">
  <h1>钟笑咪</h1>
</div>

<div class="status-card">
  <h3>当前状态</h3>
  <p>${about.location}  |  ${about.current_focus.join(' / ')}</p>
</div>

<div class="features">
  <div class="feature">
    <h3>AI 顾问模式</h3>
    <p>每天更新日志，AI 自动读取。它知道你的进展、提醒你的待办。</p>
  </div>
  <div class="feature">
    <h3>项目执行助理</h3>
    <p>想法拆成任务块，分给 AI 执行。这是你以后管团队的方式。</p>
  </div>
  <div class="feature">
    <h3>学习加速器</h3>
    <p>文档扔给 AI，10 分钟掌握别人 2 小时的内容。</p>
  </div>
  <div class="feature">
    <h3>面试复盘助手</h3>
    <p>把你做过的项目翻译成面试官能听懂的价值陈述。</p>
  </div>
</div>

<h2>最近日志</h2>
${postsHTML}
<p style="margin-top:1rem"><a href="/posts.html">查看所有日志 →</a></p>
`;

fs.writeFileSync('dist/index.html', layout('首页', indexContent));

// 生成日志列表页
const postsListHTML = postFiles.map(f => {
  const content = fs.readFileSync(path.join(postsDir, f), 'utf-8');
  const parsed = parseMD(content);
  return `
    <article class="post-item">
      <div class="post-date">${parsed.frontmatter.date || f.replace('.md','').slice(0,10)}</div>
      <h3><a href="/posts/${f.replace('.md','')}.html">${parsed.frontmatter.title || '无标题'}</a></h3>
      ${parsed.frontmatter.tags ? `<div class="tags">${parsed.frontmatter.tags.split(',').map(t => `<code>${t.trim()}</code>`).join(' ')}</div>` : ''}
    </article>`;
}).join('');

const postsListContent = `
<h1>所有日志</h1>
${postsListHTML || '<p>暂无日志</p>'}
`;
fs.writeFileSync('dist/posts.html', layout('所有日志', postsListContent));

// 生成每篇日志的独立页面
const postsDistDir = path.join(__dirname, 'dist/posts');
fs.mkdirSync(postsDistDir, { recursive: true });

for (const file of postFiles) {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  const parsed = parseMD(content);
  const postContent = `
<article>
  <p class="post-date" style="color:var(--muted)">${parsed.frontmatter.date || ''}</p>
  ${parsed.frontmatter.tags ? `<div class="tags">${parsed.frontmatter.tags.split(',').map(t => `<code>${t.trim()}</code>`).join(' ')}</div>` : ''}
  <h1>${parsed.frontmatter.title || '无标题'}</h1>
  ${parsed.html}
</article>
<p style="margin-top:2rem"><a href="/posts.html">← 返回日志列表</a></p>
`;
  fs.writeFileSync(path.join(postsDistDir, `${file.replace('.md','')}.html`), layout(parsed.frontmatter.title || '日志', postContent));
}

// 生成关于页面
const aboutContent = `
<article>
<h1>关于我</h1>

<h2>${about.name}（${about.english_name}）</h2>
<ul>
  <li><strong>身份</strong>：${about.role}</li>
  <li><strong>位置</strong>：${about.location}</li>
  <li><strong>邮箱</strong>：${about.email}</li>
  <li><strong>GitHub</strong>：<a href="https://github.com/${about.github}">@${about.github}</a></li>
</ul>

<h2>当前专注</h2>
<ul>
${about.current_focus.map(f => `<li>${f}</li>`).join('\n')}
</ul>

<h2>技能</h2>
${Object.entries(about.skills).map(([k,v]) => `<p><strong>${k}</strong>: ${v.join(', ')}</p>`).join('\n')}

<h2>项目</h2>
<table>
<tr><th>项目</th><th>角色</th><th>状态</th><th>技术栈</th></tr>
${about.projects.map(p => `
<tr>
  <td>${p.name}</td>
  <td>${p.role}</td>
  <td>${p.status}</td>
  <td>${p.tech}</td>
</tr>`).join('')}
</table>

<h2>AI 如何读取我的状态</h2>
<p>AI 浏览器的地址：<code>https://200141.xin/about.json</code></p>
<p>或者直接读 <a href="/about.json">about.json</a></p>
</article>
`;
fs.writeFileSync('dist/about.html', layout('关于我', aboutContent));

// 把 public 文件拷过去
fs.cpSync('public/about.json', 'dist/about.json');

console.log('✅ 博客构建完成！dist/ 目录已生成');
console.log('   - dist/index.html (首页)');
console.log('   - dist/posts.html (日志列表)');
console.log('   - dist/about.html (关于我)');
console.log('   - dist/about.json (AI 可读数据)');
console.log(`   - dist/posts/ (${postFiles.length} 篇日志)`);
