const fs = require('fs');
const path = require('path');

// 读取 about.json
const about = JSON.parse(fs.readFileSync('public/about.json', 'utf-8'));

// 读取所有日志
const postsDir = path.join(__dirname, 'src/posts');
fs.mkdirSync(postsDir, { recursive: true });

const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).sort().reverse();

// 安全取值
const safe = (v, fallback = '') => v !== undefined && v !== null ? v : fallback;
const safeArr = (v) => Array.isArray(v) ? v : [];
const pad = (n) => String(n).padStart(2, '0');

// 简单的 Markdown 解析
function parseMD(text) {
  const lines = text.split('\n');
  let html = '';
  let frontmatter = {};
  let inFM = false;
  let fmDone = false;
  let inList = false;
  let listType = null;
  let inCode = false;

  function closeList() {
    if (inList) {
      html += `</${listType}>\n`;
      inList = false;
      listType = null;
    }
  }

  function openList(type) {
    if (inList && listType !== type) closeList();
    if (!inList) {
      html += `<${type}>\n`;
      inList = true;
      listType = type;
    }
  }

  for (const line of lines) {
    if (!fmDone && line.startsWith('---')) {
      if (!inFM) { inFM = true; continue; }
      fmDone = true; inFM = false; continue;
    }
    if (inFM) {
      const m = line.match(/^(\w+):\s*(.+)/);
      if (m) {
        let val = m[2].trim();
        if (val.startsWith('[') && val.endsWith(']')) {
          val = val.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
        }
        frontmatter[m[1]] = val;
      }
      continue;
    }

    if (line.startsWith('```')) {
      closeList();
      if (!inCode) { html += '<pre><code>'; inCode = true; }
      else { html += '</code></pre>\n'; inCode = false; }
      continue;
    }
    if (inCode) { html += line + '\n'; continue; }

    if (line.startsWith('### ')) { closeList(); html += `<h3>${line.slice(4)}</h3>\n`; }
    else if (line.startsWith('## ')) { closeList(); html += `<h2>${line.slice(3)}</h2>\n`; }
    else if (line.startsWith('# ')) { closeList(); html += `<h1>${line.slice(2)}</h1>\n`; }
    else if (line.startsWith('- [x] ')) { openList('ul'); html += `<li class="done">${line.slice(6)}</li>\n`; }
    else if (line.startsWith('- [ ] ')) { openList('ul'); html += `<li class="todo">${line.slice(6)}</li>\n`; }
    else if (line.startsWith('- ')) { openList('ul'); html += `<li>${line.slice(2)}</li>\n`; }
    else if (line.startsWith('> ')) { closeList(); html += `<blockquote>${line.slice(2)}</blockquote>\n`; }
    else if (line.trim() === '') { closeList(); html += '<br/>\n'; }
    else if (line.match(/^\d+\.\s/)) { openList('ol'); html += `<li>${line.replace(/^\d+\.\s/, '')}</li>\n`; }
    else if (line.startsWith('|')) { continue; }
    else if (line.match(/\[(.+?)\]\((.+?)\)/)) {
      closeList();
      html += line.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>') + '<br/>\n';
    } else { closeList(); html += `<p>${line}</p>\n`; }
  }
  closeList();
  return { html, frontmatter };
}

// 规范化标签数组
function normalizeTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return raw.split(',').map(t => t.trim()).filter(Boolean);
}

// 页脚社交平台链接
const footerSocial = safeArr(about.social)
  .filter(s => s.status === 'active')
  .map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`)
  .join(' · ');

// 通用模板
const assetVer = Date.now();
const layout = (title, content, activeNav = '') => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — ${about.name}</title>
<meta name="description" content="${safe(about.tagline, about.goal)}">
<link rel="stylesheet" href="/style.css?v=${assetVer}">
</head>
<body>
<nav>
  <a class="brand" href="/">${about.name}<span> / ${about.english_name}</span></a>
  <button class="menu-toggle" aria-label="菜单">
    <span></span><span></span>
  </button>
</nav>
<div class="menu-overlay">
  <a class="menu-link" style="--i:0" data-index="01" href="/"><span class="ml-roll"><span>首页</span><span>首页</span></span></a>
  <a class="menu-link" style="--i:1" data-index="02" href="/posts.html"><span class="ml-roll"><span>日志</span><span>日志</span></span></a>
  <a class="menu-link" style="--i:2" data-index="03" href="/about.html"><span class="ml-roll"><span>关于</span><span>关于</span></span></a>
  <a class="menu-link" style="--i:3" data-index="04" href="mailto:${about.email}"><span class="ml-roll"><span>联系</span><span>联系</span></span></a>
  <div class="menu-footer">
    <a href="https://github.com/${about.github}" target="_blank" rel="noopener">GitHub</a> · <a href="mailto:${about.email}">${about.email}</a>
  </div>
</div>
${content}
<footer>
  <div class="footer-inner">
    <span>${about.name} · ${about.role}</span>
    <span>${footerSocial ? footerSocial + ' · ' : ''}<a href="mailto:${about.email}">${about.email}</a></span>
    <span>更新于 ${about.last_updated}</span>
  </div>
</footer>
<script src="/main.js?v=${assetVer}"></script>
</body>
</html>`;

// 解析所有日志
const parsedPosts = postFiles.map(file => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  return { file, ...parseMD(content) };
});

// ---------- 索引行（编辑级列表，Dogstudio 式悬停扫入） ----------
const postRow = (p, i) => {
  const date = p.frontmatter.date || p.file.replace('.md', '').slice(0, 10);
  const tags = normalizeTags(p.frontmatter.tags);
  return `
  <a class="row" href="/posts/${p.file.replace('.md', '')}.html">
    <span class="row-no">${pad(i + 1)}</span>
    <span class="row-body">
      <span class="row-title">${p.frontmatter.title || '无标题'}</span>
      ${tags.length ? `<span class="row-sub">${tags.join(' · ')}</span>` : ''}
    </span>
    <span class="row-meta">${date}</span>
    <span class="row-arrow">→</span>
  </a>`;
};

const projectRow = (p, i) => `
  <div class="row">
    <span class="row-no">${pad(i + 1)}</span>
    <span class="row-body">
      <span class="row-title">${p.name}</span>
      <span class="row-sub">${safe(p.tech || p.type || p.description)}</span>
    </span>
    <span class="row-meta">${p.status}</span>
    <span class="row-arrow">${p.role}</span>
  </div>`;

const creativeRow = (c, i) => `
  <div class="row">
    <span class="row-no">${pad(i + 1)}</span>
    <span class="row-body">
      <span class="row-title">${c.name}</span>
      <span class="row-sub">${safe(c.description)}</span>
    </span>
    <span class="row-meta">${c.status}</span>
    <span class="row-arrow">${c.role}</span>
  </div>`;

// 区块头：发丝线 + 小编号 + 标题
const secHead = (no, title, moreHref) => `
  <header class="sec-head">
    <div class="sec-head-left">
      <span class="sec-no">${no}</span>
      <h2>${title}</h2>
    </div>
    ${moreHref ? `<a class="sec-more" href="${moreHref}">查看全部<span>→</span></a>` : ''}
  </header>`;

// 数据：大数字行
const statsHTML = safeArr(about.stats).map(s => `
    <div class="stat">
      <span class="stat-num">${s.number}</span>
      <span class="stat-label">${s.label}</span>
      <span class="stat-desc">${safe(s.description)}</span>
    </div>`).join('');

// 技能：一行排版，薄荷绿间隔
const allSkills = Object.values(about.skills || {}).flat();
const skillsLine = allSkills.map(s => `<span>${s}</span>`).join('<i>·</i>');

// 社交行
const socialRows = safeArr(about.social).map((s, i) => {
  const inner = `
    <span class="row-no">${pad(i + 1)}</span>
    <span class="row-body"><span class="row-title">${s.name}</span></span>
    <span class="row-meta">${s.label}</span>
    <span class="row-arrow">${s.status === 'active' ? '→' : '待开通'}</span>`;
  return s.status === 'active'
    ? `<a class="row" href="${s.url}" target="_blank" rel="noopener">${inner}</a>`
    : `<div class="row is-dim">${inner}</div>`;
}).join('');

const now = about.now || {};

// ---------- 首页：第一屏纯雕塑，无文字 ----------
const indexContent = `
<header class="stage" aria-label="开场">
  <div class="sculpt">
    <div class="sculpt-circle" data-depth="-16"></div>
    <div class="sculpt-square" data-depth="10" data-rot="1"></div>
    <div class="sculpt-ring" data-depth="6" data-rot="1"></div>
    <div class="sculpt-line-h"></div>
    <div class="sculpt-line-v"></div>
    <div class="sculpt-dot"></div>
  </div>
  <div class="stage-cue" aria-hidden="true"><span></span></div>
</header>

<section>
  ${secHead('01', '数据')}
  <div class="stats">${statsHTML}</div>
</section>

<section>
  ${secHead('02', '项目', '/about.html#projects')}
  <div class="rows">${safeArr(about.projects).map(projectRow).join('')}</div>
</section>

<section>
  ${secHead('03', '创作')}
  <div class="rows">${safeArr(about.creative_works).map(creativeRow).join('')}</div>
</section>

<section>
  ${secHead('04', '最近日志', '/posts.html')}
  <div class="rows">${parsedPosts.slice(0, 3).map(postRow).join('')}</div>
</section>

<section>
  ${secHead('05', '技能')}
  <p class="skills-line">${skillsLine}</p>
</section>

<section>
  ${secHead('06', '联系')}
  <p class="contact-line">
    <a class="arrow-link" href="mailto:${about.email}">${about.email}<span>→</span></a>
  </p>
  <p class="contact-sub">${safe(now.status)} · ${safe(now.location)} · ${safe(now.focus)}</p>
</section>
`;

fs.writeFileSync('dist/index.html', layout('首页', indexContent, 'home'));

// ---------- 日志列表页 ----------
const postsListContent = `
<header class="page-head">
  <p class="page-eyebrow">Build in Public</p>
  <h1 data-split>所有日志</h1>
  <p class="page-sub">项目迭代、技术踩坑、创作过程与成长思考。</p>
</header>
<section>
  <div class="rows">${parsedPosts.map(postRow).join('') || '<p>暂无日志</p>'}</div>
</section>
`;
fs.writeFileSync('dist/posts.html', layout('所有日志', postsListContent, 'posts'));

// ---------- 每篇日志的独立页面 ----------
const postsDistDir = path.join(__dirname, 'dist/posts');
fs.mkdirSync(postsDistDir, { recursive: true });

for (const f of fs.readdirSync(postsDistDir)) {
  if (f.endsWith('.html')) fs.unlinkSync(path.join(postsDistDir, f));
}

for (const p of parsedPosts) {
  const date = p.frontmatter.date || '';
  const tags = normalizeTags(p.frontmatter.tags);
  const postContent = `
<header class="page-head">
  <p class="page-eyebrow">${date}</p>
  <h1 data-split>${p.frontmatter.title || '日志'}</h1>
  ${tags.length ? `<p class="page-sub">${tags.join(' · ')}</p>` : ''}
</header>
<section class="reading">
  <article>
    ${p.html}
  </article>
  <p class="back-row"><a class="arrow-link" href="/posts.html"><span>←</span>返回日志列表</a></p>
</section>
`;
  fs.writeFileSync(path.join(postsDistDir, `${p.file.replace('.md', '')}.html`), layout(p.frontmatter.title || '日志', postContent, 'posts'));
}

// ---------- 关于页面 ----------
const aboutContent = `
<header class="page-head">
  <p class="page-eyebrow">关于</p>
  <h1 data-split>${about.name}（${about.english_name}）</h1>
  <p class="page-sub">${about.role} · ${about.location}</p>
</header>
<section class="reading">
  <article>
    <p>${about.goal}。</p>

    <h2 id="now">当前状态</h2>
    <p>${safe(now.status)} · ${safe(now.location)} · ${safe(now.focus)}</p>

    <h2 id="focus">当前专注</h2>
    <ul>
      ${about.current_focus.map(f => `<li>${f}</li>`).join('\n      ')}
    </ul>

    <h2 id="skills">技能</h2>
    ${Object.entries(about.skills || {}).map(([k, v]) => {
      const labels = { languages: '语言', frameworks: '框架', ai: 'AI / LLM', cloud: '云服务 / 工具' };
      return `<p><strong>${labels[k] || k}</strong>：${v.join('、')}</p>`;
    }).join('\n    ')}

    <h2 id="projects">项目</h2>
  </article>
  <div class="rows">${about.projects.map(projectRow).join('')}</div>
  <article>
    <h2 id="creative">创作</h2>
  </article>
  <div class="rows">${safeArr(about.creative_works).map(creativeRow).join('')}</div>
  <article>
    <h2 id="contact">联系</h2>
    <ul>
      <li>GitHub：<a href="https://github.com/${about.github}">@${about.github}</a></li>
      <li>邮箱：<a href="mailto:${about.email}">${about.email}</a></li>
    </ul>

    <h2 id="data">AI 可读数据</h2>
    <p>AI 可以通过 <a href="/about.json">about.json</a> 获取结构化状态。</p>
  </article>
</section>
`;
fs.writeFileSync('dist/about.html', layout('关于我', aboutContent, 'about'));

// 把 public 文件拷过去
fs.cpSync('public/about.json', 'dist/about.json');
fs.cpSync('public/style.css', 'dist/style.css');
fs.cpSync('public/main.js', 'dist/main.js');

console.log('✅ 博客构建完成！dist/ 目录已生成');
console.log('   - dist/index.html (首页)');
console.log('   - dist/posts.html (日志列表)');
console.log('   - dist/about.html (关于我)');
console.log('   - dist/about.json (AI 可读数据)');
console.log('   - dist/style.css (样式表)');
console.log('   - dist/main.js (交互脚本)');
console.log(`   - dist/posts/ (${postFiles.length} 篇日志)`);
