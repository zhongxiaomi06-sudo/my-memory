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

// 简单的 Markdown 解析
function parseMD(text) {
  const lines = text.split('\n');
  let html = '';
  let frontmatter = {};
  let inFM = false;
  let fmDone = false;
  let inList = false;
  let listType = null; // 'ul' 或 'ol'
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
      if (!inCode) {
        html += '<pre><code>';
        inCode = true;
      } else {
        html += '</code></pre>\n';
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      html += line + '\n';
      continue;
    }

    if (line.startsWith('### ')) {
      closeList();
      html += `<h3>${line.slice(4)}</h3>\n`;
    } else if (line.startsWith('## ')) {
      closeList();
      html += `<h2>${line.slice(3)}</h2>\n`;
    } else if (line.startsWith('# ')) {
      closeList();
      html += `<h1>${line.slice(2)}</h1>\n`;
    } else if (line.startsWith('- [x] ')) {
      openList('ul');
      html += `<li class="done">${line.slice(6)}</li>\n`;
    } else if (line.startsWith('- [ ] ')) {
      openList('ul');
      html += `<li class="todo">${line.slice(6)}</li>\n`;
    } else if (line.startsWith('- ')) {
      openList('ul');
      html += `<li>${line.slice(2)}</li>\n`;
    } else if (line.startsWith('> ')) {
      closeList();
      html += `<blockquote>${line.slice(2)}</blockquote>\n`;
    } else if (line.trim() === '') {
      closeList();
      html += '<br/>\n';
    } else if (line.match(/^\d+\.\s/)) {
      openList('ol');
      html += `<li>${line.replace(/^\d+\.\s/, '')}</li>\n`;
    } else if (line.startsWith('|')) {
      continue;
    } else if (line.match(/\[(.+?)\]\((.+?)\)/)) {
      closeList();
      html += line.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>') + '<br/>\n';
    } else {
      closeList();
      html += `<p>${line}</p>\n`;
    }
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
const layout = (title, content, activeNav = '') => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — ${about.name}</title>
<meta name="description" content="${safe(about.tagline, about.goal)}">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<nav>
  <div class="nav-inner">
    <a class="brand" href="/">${about.name}<span> / ${about.english_name}</span></a>
    <div class="links">
      <a href="/" class="${activeNav === 'home' ? 'active' : ''}">首页</a>
      <a href="/posts.html" class="${activeNav === 'posts' ? 'active' : ''}">日志</a>
      <a href="/about.html" class="${activeNav === 'about' ? 'active' : ''}">关于</a>
    </div>
  </div>
</nav>
${content}
<footer>
  <div class="footer-inner">
    <p>${about.name} · ${about.role} · 更新于 ${about.last_updated}</p>
    <p>${footerSocial ? footerSocial + ' · ' : ''}<a href="mailto:${about.email}">${about.email}</a></p>
  </div>
</footer>
</body>
</html>`;

// 所有技能扁平化
const allSkills = Object.values(about.skills || {}).flat();

// 最近日志
let postsHTML = '';
const parsedPosts = postFiles.map(file => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  return { file, ...parseMD(content) };
});

for (const p of parsedPosts.slice(0, 3)) {
  const date = p.frontmatter.date || p.file.replace('.md', '').slice(0, 10);
  const tags = normalizeTags(p.frontmatter.tags);
  postsHTML += `
    <div class="post-card">
      <div class="meta">${date}</div>
      <h4><a href="/posts/${p.file.replace('.md', '')}.html">${p.frontmatter.title || '无标题'}</a></h4>
      ${tags.length ? `<div class="tags">${tags.map(t => `<code>${t}</code>`).join(' ')}</div>` : ''}
    </div>`;
}

// 统计数据
const statsHTML = safeArr(about.stats).map(s => `
  <div class="stat-card">
    <div class="number">${s.number}</div>
    <div class="label">${s.label}</div>
    <div class="desc">${safe(s.description)}</div>
  </div>`).join('');

// 项目卡片
const projectsHTML = safeArr(about.projects).map(p => `
  <div class="project-card">
    <div class="status">${p.status}</div>
    <h4>${p.name}</h4>
    <p>${safe(p.tech || p.type || p.description)}</p>
    <div class="meta">${p.role}</div>
  </div>`).join('');

// 创作作品卡片
const creativeHTML = safeArr(about.creative_works).map(c => `
  <div class="creative-card">
    <div class="status">${c.status}</div>
    <h4>${c.name}</h4>
    <p>${safe(c.description)}</p>
    <div class="meta">${c.role}</div>
  </div>`).join('');

// 技能标签云
const skillsHTML = allSkills.map(s => `<span class="tag">${s}</span>`).join('');

// 社交链接
const socialHTML = safeArr(about.social).map(s => `
  <a class="social-link" href="${s.url}" ${s.status === 'active' ? 'target="_blank" rel="noopener"' : ''}>
    <span class="platform">${s.name}</span>
    <span class="handle">${s.label}</span>
  </a>`).join('');

// 当前状态栏
const now = about.now || {};
const nowHTML = now.status ? `
  <div class="now-bar">
    <span class="label">Now</span>
    <span class="value">${safe(now.status)} · ${safe(now.location)} · ${safe(now.focus)}</span>
  </div>
` : '';

// 视频占位区
const video = about.video_section || {};
const videoHTML = `
  <div class="video-placeholder">
    <svg class="play-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="31" stroke="currentColor" stroke-width="2"/>
      <path d="M26 20L44 32L26 44V20Z" fill="currentColor"/>
    </svg>
    <h4>${safe(video.placeholder || '视频即将到来')}</h4>
    <p>${safe(video.description, '这里会陆续放入项目演示、Build in Public 短视频与创作片段。')}</p>
  </div>
`;

// 生成首页
const indexContent = `
<header class="hero">
  <div class="hero-eyebrow">${about.name} / ${about.english_name}</div>
  <h1>${safe(about.tagline, `${about.role} · ${about.location}`)}</h1>
  <p class="lead">${about.goal}。这个站点是我的个人主页、项目展厅与 Build in Public 日志中心。</p>
  ${nowHTML}
  <a class="button" href="/about.html">了解更多</a>
  <a class="button secondary" href="mailto:${about.email}">联系我</a>
</header>

<section class="stats-section">
  <div class="section-header">
    <span class="section-title">数据</span>
  </div>
  <div class="stats-grid">
    ${statsHTML}
  </div>
</section>

<section class="projects-section">
  <div class="section-header">
    <span class="section-title">项目</span>
    <a class="section-more" href="/about.html#projects">全部项目 →</a>
  </div>
  <div class="portfolio-grid">
    ${projectsHTML}
  </div>
</section>

<section class="creative-section">
  <div class="section-header">
    <span class="section-title">创作</span>
  </div>
  <p class="section-desc">代码之外的叙事、游戏与角色。</p>
  <div class="portfolio-grid">
    ${creativeHTML}
  </div>
</section>

<section class="logs-section">
  <div class="section-header">
    <span class="section-title">最近日志</span>
    <a class="section-more" href="/posts.html">查看全部 →</a>
  </div>
  <div class="portfolio-grid">
    ${postsHTML}
  </div>
</section>

<section class="skills-section">
  <div class="section-header">
    <span class="section-title">技能与工具</span>
  </div>
  <div class="skill-cloud">
    ${skillsHTML}
  </div>
</section>

<section class="video-section">
  <div class="section-header">
    <span class="section-title">${safe(video.title, '视频')}</span>
  </div>
  ${videoHTML}
</section>

<section class="social-section">
  <div class="section-header">
    <span class="section-title">社交平台</span>
  </div>
  <p class="section-desc">后续会在这里接入小红书、即刻、公众号、知乎、B站等账号。</p>
  <div class="social-grid">
    ${socialHTML}
  </div>
</section>

<section class="contact-section">
  <div class="section-header">
    <span class="section-title">联系</span>
  </div>
  <p class="section-desc">欢迎通过邮件或 GitHub 联系我，讨论项目、技术或合作。</p>
  <a class="button" href="mailto:${about.email}">发送邮件</a>
  <a class="button secondary" href="https://github.com/${about.github}">GitHub</a>
</section>
`;

fs.writeFileSync('dist/index.html', layout('首页', indexContent, 'home'));

// 生成日志列表页
const postsListHTML = parsedPosts.map(p => {
  const date = p.frontmatter.date || p.file.replace('.md', '').slice(0, 10);
  const tags = normalizeTags(p.frontmatter.tags);
  return `
    <div class="post-card">
      <div class="meta">${date}</div>
      <h4><a href="/posts/${p.file.replace('.md', '')}.html">${p.frontmatter.title || '无标题'}</a></h4>
      ${tags.length ? `<div class="tags">${tags.map(t => `<code>${t}</code>`).join(' ')}</div>` : ''}
    </div>`;
}).join('');

const postsListContent = `
<header class="hero">
  <div class="hero-eyebrow">Build in Public</div>
  <h1>所有日志</h1>
  <p class="lead">记录项目迭代、技术踩坑、创作过程与成长思考。</p>
</header>
<section>
  <div class="portfolio-grid">
    ${postsListHTML || '<p>暂无日志</p>'}
  </div>
</section>
`;
fs.writeFileSync('dist/posts.html', layout('所有日志', postsListContent, 'posts'));

// 生成每篇日志的独立页面
const postsDistDir = path.join(__dirname, 'dist/posts');
fs.mkdirSync(postsDistDir, { recursive: true });

// 清理旧的日志 HTML，避免重命名/删除后残留
for (const f of fs.readdirSync(postsDistDir)) {
  if (f.endsWith('.html')) fs.unlinkSync(path.join(postsDistDir, f));
}

for (const p of parsedPosts) {
  const date = p.frontmatter.date || '';
  const tags = normalizeTags(p.frontmatter.tags);
  const postContent = `
<header class="hero">
  <div class="hero-eyebrow">${date}</div>
  <h1>${p.frontmatter.title || '日志'}</h1>
</header>
<section class="reading">
  <article>
    ${tags.length ? `<div class="tags">${tags.map(t => `<code>${t}</code>`).join(' ')}</div>` : ''}
    ${p.html}
  </article>
  <p style="margin-top:2rem"><a class="button" href="/posts.html">← 返回日志列表</a></p>
</section>
`;
  fs.writeFileSync(path.join(postsDistDir, `${p.file.replace('.md', '')}.html`), layout(p.frontmatter.title || '日志', postContent, 'posts'));
}

// 生成关于页面
const aboutContent = `
<header class="hero">
  <div class="hero-eyebrow">关于</div>
  <h1>${about.name}（${about.english_name}）</h1>
  <p class="lead">${about.role} · ${about.location}</p>
</header>
<section class="reading">
  <article>
    <p>${about.goal}</p>

    <h2 id="now">当前状态</h2>
    ${nowHTML || `<p>${about.current_focus.slice(0, 3).join('、')}。</p>`}

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
    <div class="portfolio-grid">
      ${about.projects.map(p => `
      <div class="project-card">
        <div class="status">${p.status}</div>
        <h4>${p.name}</h4>
        <p>${safe(p.tech || p.type || '')}</p>
        <div class="meta">${p.role}</div>
      </div>`).join('')}
    </div>

    <h2 id="creative">创作</h2>
    <div class="portfolio-grid">
      ${safeArr(about.creative_works).map(c => `
      <div class="creative-card">
        <div class="status">${c.status}</div>
        <h4>${c.name}</h4>
        <p>${safe(c.description)}</p>
        <div class="meta">${c.role}</div>
      </div>`).join('')}
    </div>

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

console.log('✅ 博客构建完成！dist/ 目录已生成');
console.log('   - dist/index.html (首页)');
console.log('   - dist/posts.html (日志列表)');
console.log('   - dist/about.html (关于我)');
console.log('   - dist/about.json (AI 可读数据)');
console.log('   - dist/style.css (样式表)');
console.log(`   - dist/posts/ (${postFiles.length} 篇日志)`);
