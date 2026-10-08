(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Scroll progress bar
  const bar = $('.progress');
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Count up a stat once it appears
  const countUp = (el) => {
    if (reduced) return;
    const end = parseFloat(el.dataset.count);
    const dec = +el.dataset.decimals || 0;
    const suffix = el.dataset.suffix || '';
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Staggered reveal on scroll
  const items = $$('.reveal');
  items.forEach((el, i) => el.style.setProperty('--d', `${(i % 4) * 70}ms`));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));

  // Cursor spotlight on cards
  $$('.spot').forEach((el) => el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));

  // Highlight the current section in the nav
  const links = $$('.nav nav a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.hash === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  // Hero data field: points drift, link up when close, and lean toward the cursor
  const canvas = $('#field');
  const ctx = canvas.getContext('2d');
  const ACCENT = '198,255,61';
  let w, h, pts = [], mouse = { x: -999, y: -999 }, visible = true, raf;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(w * h / 11000, 120));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.6 + .6,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      if (!reduced) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 160 && d > 0) { p.x += (dx / d) * .35; p.y += (dy / d) * .35; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      ctx.fillStyle = `rgba(${ACCENT},.85)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(${ACCENT},${(1 - d / 120) * .28})`;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
    }
    if (!reduced && visible) raf = requestAnimationFrame(draw);
  };

  resize(); draw();
  addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); });
  canvas.parentElement.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !reduced) { cancelAnimationFrame(raf); draw(); }
  }).observe(canvas);

  // Command palette (Cmd/Ctrl+K)
  const dlg = $('.palette');
  const input = $('input', dlg);
  const list = $('ul', dlg);
  const cmds = [
    ['Impact', '#impact', 'section'], ['Experience', '#work', 'section'], ['Projects', '#projects', 'section'],
    ['Stack and education', '#skills', 'section'], ['Contact', '#contact', 'section'],
    ['Download resume', 'jinwoo_choi_resume.pdf', 'pdf'], ['GitHub', 'https://github.com/jinwoo1015', 'link'],
    ['LinkedIn', 'https://linkedin.com/in/jinwoochoi1015', 'link'], ['Email Jinwoo', 'mailto:jinwooc@uchicago.edu', 'email'],
  ];
  let sel = 0;
  const render = () => {
    const q = input.value.trim().toLowerCase();
    const hits = cmds.filter((c) => c[0].toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(hits.length - 1, 0));
    list.replaceChildren();
    hits.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = i === sel ? 'sel' : '';
      const a = document.createElement('a');
      a.href = c[1];
      if (c[2] === 'link') { a.target = '_blank'; a.rel = 'noopener'; }
      if (c[2] === 'pdf') a.download = '';
      const name = document.createElement('span');
      const kind = document.createElement('small');
      name.textContent = c[0];
      kind.textContent = c[2];
      a.append(name, kind);
      a.addEventListener('click', () => dlg.close());
      li.append(a); list.append(li);
    });
  };
  const open = () => { input.value = ''; sel = 0; render(); dlg.showModal(); input.focus(); };
  $('.kbd').addEventListener('click', open);
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.open ? dlg.close() : open(); }
  });
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', (e) => {
    const n = list.children.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % n; render(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + n) % n; render(); }
    if (e.key === 'Enter') { e.preventDefault(); $('li.sel a', list)?.click(); }
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  $('#year').textContent = new Date().getFullYear();
})();
