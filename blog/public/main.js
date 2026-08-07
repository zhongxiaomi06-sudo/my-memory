/* Ashley's Blog — Editorial Studio 交互
   统一 rAF 动效引擎：雕塑漂浮 + 鼠标视差 + 滚动消散
   逐字母入场 / 自定义光标 / 全屏覆盖菜单 / 磁吸链接 / 滚动揭示 */

(function () {
  'use strict';

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 鼠标与滚动的全局平滑值 ---------- */
  var mouse = { x: 0, y: 0, sx: 0, sy: 0 };      // 目标 / 平滑
  var scrollS = 0;                                // 平滑滚动值
  if (fine && !reduced) {
    document.addEventListener('mousemove', function (e) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* ---------- 第一屏雕塑：rAF 驱动 ---------- */
  var sculptEls = Array.from(document.querySelectorAll('.sculpt [data-depth]'));
  var stage = document.querySelector('.stage');

  function tickSculpt(t) {
    // 平滑跟随
    mouse.sx += (mouse.x - mouse.sx) * 0.045;
    mouse.sy += (mouse.y - mouse.sy) * 0.045;
    scrollS += (window.scrollY - scrollS) * 0.08;

    if (stage && scrollS < window.innerHeight * 1.2) {
      var p = scrollS / window.innerHeight;       // 0 → 1
      sculptEls.forEach(function (el, i) {
        var depth = parseFloat(el.dataset.depth);
        // 有机漂浮：每个元素不同频率与相位
        var fx = Math.sin(t * 0.00016 + i * 1.7) * 14;
        var fy = Math.cos(t * 0.00013 + i * 2.3) * 11;
        // 只有标记了 data-rot 的元素才旋转（圆形旋转会失去有机感）
        var rot = el.dataset.rot ? Math.sin(t * 0.00008 + i) * 4 : 0;
        // 鼠标视差 + 滚动消散（元素以不同速度离场）
        var px = mouse.sx * depth;
        var py = mouse.sy * depth * 0.75;
        var sxx = -p * depth * 22;
        var syy = p * p * (60 + Math.abs(depth) * 14);
        el.style.transform =
          'translate3d(' + (fx + px + sxx).toFixed(2) + 'px,' +
                           (fy + py + syy).toFixed(2) + 'px,0)' +
          ' rotate(' + rot.toFixed(2) + 'deg)';
      });
      // 十字线与交点：滚动时轻微淡出
      var fade = Math.max(0, 1 - p * 1.6);
      document.querySelectorAll('.sculpt-line-h, .sculpt-line-v, .sculpt-dot, .stage-cue').forEach(function (el) {
        el.style.opacity = fade.toFixed(3);
      });
    }
    requestAnimationFrame(tickSculpt);
  }
  if (!reduced) requestAnimationFrame(tickSculpt);

  /* ---------- 逐字母切分（内页标题） ---------- */
  document.querySelectorAll('h1[data-split]').forEach(function (h1) {
    var text = h1.textContent;
    h1.textContent = '';
    var index = 0;
    text.split(/(\s+)/).forEach(function (segment) {
      if (!segment) return;
      if (/^\s+$/.test(segment)) {
        h1.appendChild(document.createTextNode(' '));
        return;
      }
      var word = document.createElement('span');
      word.className = 'word';
      Array.from(segment).forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'char';
        span.style.setProperty('--i', index++);
        span.textContent = ch;
        word.appendChild(span);
      });
      h1.appendChild(word);
    });
  });

  /* ---------- 自定义光标 ---------- */
  if (fine) {
    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var cx = -100, cy = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      dot.style.left = cx + 'px';
      dot.style.top = cy + 'px';
    }, { passive: true });
    (function loopCursor() {
      rx += (cx - rx) * 0.18;
      ry += (cy - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loopCursor);
    })();

    var hoverSel = 'a, button, .row';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
    });
  }

  /* ---------- 全屏覆盖菜单 + 磁吸链接 ---------- */
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.body.classList.remove('menu-open');
    });
  }

  if (fine && !reduced) {
    document.querySelectorAll('.menu-link').forEach(function (link) {
      var tx = 0, ty = 0, lx = 0, ly = 0, raf = null;
      function loop() {
        lx += (tx - lx) * 0.12;
        ly += (ty - ly) * 0.12;
        link.style.transform = 'translate(' + lx.toFixed(2) + 'px,' + ly.toFixed(2) + 'px)';
        if (Math.abs(tx - lx) > 0.1 || Math.abs(ty - ly) > 0.1) {
          raf = requestAnimationFrame(loop);
        } else { raf = null; }
      }
      link.addEventListener('mousemove', function (e) {
        if (!document.body.classList.contains('menu-open')) return;
        var r = link.getBoundingClientRect();
        tx = (e.clientX - r.left - r.width / 2) * 0.08;
        ty = (e.clientY - r.top - r.height / 2) * 0.18;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      link.addEventListener('mouseleave', function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      link.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
      });
    });
  } else {
    document.querySelectorAll('.menu-overlay a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ---------- 导航滚动态 ---------- */
  var nav = document.querySelector('nav');
  var onScroll = function () {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 滚动揭示 ---------- */
  var revealTargets = document.querySelectorAll('section, .row, .stat, .skills-line, .page-head');
  var groups = new Map();
  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
    var parent = el.parentElement;
    var count = groups.get(parent) || 0;
    el.style.setProperty('--d', Math.min(count * 0.06, 0.36) + 's');
    groups.set(parent, count + 1);
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  revealTargets.forEach(function (el) { io.observe(el); });
})();
