(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d = document;

  // Header: bayangan setelah digulir + menu HP
  var header = d.querySelector('header.top');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var btn = d.querySelector('.menu-btn'), nav = d.getElementById('menu');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  }

  // Munculkan elemen saat terlihat (jeda bertahap untuk saudara-saudaranya)
  var items = [].slice.call(d.querySelectorAll('.rv'));
  d.querySelectorAll('.stagger').forEach(function (p) {
    [].slice.call(p.children).forEach(function (c, i) { c.classList.add('rv'); c.style.setProperty('--d', (i * 0.09) + 's'); if (items.indexOf(c) < 0) items.push(c); });
  });
  var watch = [].slice.call(d.querySelectorAll('.timeline, .rings'));
  if (reduce || !('IntersectionObserver' in window)) {
    items.concat(watch).forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
    items.concat(watch).forEach(function (el) { io.observe(el); });
  }

  // Hitung naik untuk angka kapasitas
  var fmt = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  function count(el) {
    var to = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var t0 = null, dur = 1400;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt.format(to);
    }
    requestAnimationFrame(step);
  }
  var counters = [].slice.call(d.querySelectorAll('[data-count]'));
  if (!reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { c.textContent = '0'; co.observe(c); });
  }

  // Gerak halus foto utama mengikuti kursor (hanya perangkat dengan mouse)
  var hero = d.querySelector('.collage');
  if (hero && !reduce && window.matchMedia('(hover: hover)').matches) {
    var a = hero.querySelector('.a'), b = hero.querySelector('.b');
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      a.style.translate = (x * -14) + 'px ' + (y * -10) + 'px';
      b.style.translate = (x * 16) + 'px ' + (y * 12) + 'px';
    });
    hero.addEventListener('pointerleave', function () { a.style.translate = ''; b.style.translate = ''; });
  }
})();
