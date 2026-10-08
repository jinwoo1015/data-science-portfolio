(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  const bar = document.querySelector('.progress');
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Count up a stat once it appears
  const countUp = (el) => {
    const end = parseFloat(el.dataset.count);
    const dec = +el.dataset.decimals || 0;
    const suffix = el.dataset.suffix || '';
    if (reduced) return;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Staggered reveal on scroll
  const items = document.querySelectorAll('.reveal');
  items.forEach((el, i) => el.style.setProperty('--d', `${(i % 4) * 70}ms`));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));

  // Highlight the current section in the nav
  const links = [...document.querySelectorAll('.nav nav a')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.hash === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

  document.getElementById('year').textContent = new Date().getFullYear();
})();
