const fs = require('fs');
const path = require('path');

// 读取 about.json
const about = JSON.parse(fs.readFileSync('public/about.json', 'utf-8'));

// 读取所有日志
const postsDir = path.join(__dirname, 'src/posts');
fs.mkdirSync(postsDir, { recursive: true });

const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).sort().reverse();

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

// 通用模板
const layout = (title, content, activeNav = '') => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — ${about.name}</title>
<link rel="stylesheet" href="/style.css">
</head>
<body>
<nav>
  <div class="nav-inner">
    <a class="brand" href="/">${about.name}</a>
    <div class="links">
      <a href="/" class="${activeNav === 'home' ? 'active' : ''}">首页</a>
      <a href="/posts.html" class="${activeNav === 'posts' ? 'active' : ''}">日志</a>
      <a href="/about.html" class="${activeNav === 'about' ? 'active' : ''}">关于</a>
    </div>
  </div>
</nav>
${content}
<footer>
  <p>${about.name} · ${about.role} · 更新于 ${about.last_updated}</p>
  <p>GitHub: <a href="https://github.com/${about.github}">@${about.github}</a> · Email: <a href="mailto:${about.email}">${about.email}</a></p>
</footer>
</body>
</html>`;

// 所有技能扁平化
const allSkills = Object.values(about.skills).flat();

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

// 生成首页
const indexContent = `
<header class="hero">
  <h1>${about.name}</h1>
  <p class="tagline">${about.role} · ${about.location}</p>
</header>

<section class="about">
  <h2 class="section-title">关于</h2>
  <p>${about.goal}。目前专注于 ${about.current_focus.slice(0, 3).join('、')}。</p>
  <p>这个站点是我的个人主页与日志中心，记录项目、想法与成长。</p>
</section>

<section class="focus">
  <h2 class="section-title">当前专注</h2>
  <ul>
    ${about.current_focus.map(f => `<li>${f}</li>`).join('\n    ')}
  </ul>
</section>

<section class="skills">
  <h2 class="section-title">技能</h2>
  <ul>
    ${allSkills.map(s => `<li>${s}</li>`).join('\n    ')}
  </ul>
</section>

<section class="portfolio">
  <h2 class="section-title">项目</h2>
  <div class="portfolio-grid">
    ${about.projects.map(p => `
    <div class="project-card">
      <h4>${p.name}</h4>
      <p>${p.tech || p.type || ''}</p>
      <div class="meta">${p.role} · ${p.status}</div>
    </div>`).join('')}
  </div>
</section>

<section>
  <h2 class="section-title">最近日志</h2>
  <div class="portfolio-grid">
    ${postsHTML}
  </div>
  <p style="margin-top:2rem"><a class="button" href="/posts.html">查看所有日志</a></p>
</section>

<section class="contact">
  <h2 class="section-title">联系</h2>
  <p>欢迎通过邮件或 GitHub 联系我，讨论项目、技术或合作。</p>
  <a class="button" href="mailto:${about.email}">发送邮件</a>
  <a class="button" href="https://github.com/${about.github}" style="margin-left:0.75rem">GitHub</a>
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
  <h1>所有日志</h1>
  <p class="tagline">记录项目、想法与成长</p>
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
  <h1>${p.frontmatter.title || '日志'}</h1>
  <p class="tagline">${date}</p>
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
  <h1>关于我</h1>
  <p class="tagline">${about.role} · ${about.location}</p>
</header>
<section class="reading">
  <article>
    <h2>${about.name}（${about.english_name}）</h2>
    <p>${about.goal}</p>

    <h2>当前专注</h2>
    <ul>
      ${about.current_focus.map(f => `<li>${f}</li>`).join('\n      ')}
    </ul>

    <h2>技能</h2>
    ${Object.entries(about.skills).map(([k, v]) => `<p><strong>${k}</strong>：${v.join('、')}</p>`).join('\n    ')}

    <h2>项目</h2>
    <div class="portfolio-grid">
      ${about.projects.map(p => `
      <div class="project-card">
        <h4>${p.name}</h4>
        <p>${p.tech || p.type || ''}</p>
        <div class="meta">${p.role} · ${p.status}</div>
      </div>`).join('')}
    </div>

    <h2>联系</h2>
    <ul>
      <li>GitHub：<a href="https://github.com/${about.github}">@${about.github}</a></li>
      <li>邮箱：<a href="mailto:${about.email}">${about.email}</a></li>
    </ul>

    <h2>AI 可读数据</h2>
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
