/* ==========================================================================
   main.js — interações sem jQuery/Elementor
   Config, digitação do hero, contadores, slideshow, FAQ, menu e copiar cupom.
   ========================================================================== */

(function () {
  'use strict';

  var SITE = window.SITE || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Config: links de WhatsApp ---------- */

  document.querySelectorAll('[data-wa]').forEach(function (el) {
    if (!SITE.whatsapp) return;
    var msg = el.getAttribute('data-wa-msg');
    el.href = 'https://wa.me/' + SITE.whatsapp + (msg ? '?text=' + encodeURIComponent(msg) : '');
  });

  /* ---------- Config: textos ---------- */

  document.querySelectorAll('[data-config]').forEach(function (el) {
    var key = el.getAttribute('data-config');
    if (key && SITE[key]) el.textContent = SITE[key];
  });

  /* ---------- Config: e-mail e redes ---------- */

  document.querySelectorAll('[data-mail]').forEach(function (el) {
    if (SITE.email) el.href = 'mailto:' + SITE.email;
  });

  document.querySelectorAll('[data-social]').forEach(function (el) {
    var key = el.getAttribute('data-social');
    if (key && SITE[key]) el.href = SITE[key];
  });

  /* ---------- Hero: efeito de digitação ---------- */

  function typeWriter(el) {
    var full = el.getAttribute('data-sc-type') || '';
    if (!full) return;

    if (reduceMotion) {
      el.textContent = full;
      return;
    }

    var caret = document.createElement('span');
    caret.className = 'type-caret';

    var i = 0;
    var dir = 1;

    function render() {
      el.textContent = full.slice(0, i);
      el.appendChild(caret);
    }

    function tick() {
      i += dir;
      render();
      var delay = dir > 0 ? 95 : 45;
      if (i >= full.length) {
        dir = -1;
        delay = 1800;
      } else if (i <= 0) {
        dir = 1;
        delay = 500;
      }
      setTimeout(tick, delay);
    }

    render();
    setTimeout(tick, 500);
  }

  document.querySelectorAll('[data-sc-type]').forEach(typeWriter);

  /* ---------- Contadores ---------- */

  var counters = document.querySelectorAll('[data-sc-count]');

  counters.forEach(function (el) {
    var parts = (el.getAttribute('data-sc-count') || '0,0,').split(',');
    el.textContent = '0\u20130' + (parts[2] || '');
  });

  function runCounter(el) {
    var parts = (el.getAttribute('data-sc-count') || '0,0,').split(',');
    var from = +parts[0];
    var to = +parts[1];
    var suffix = parts[2] || '';

    if (reduceMotion) {
      el.textContent = Math.round(from) + '\u2013' + Math.round(to) + suffix;
      return;
    }

    var start = performance.now();

    (function step(now) {
      var progress = Math.min(1, Math.max(0, (now - start) / 1600));
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from * eased) + '\u2013' + Math.round(to * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    })(start);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        runCounter(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Slideshow de cenas animadas ---------- */

  document.querySelectorAll('[data-sc-fade]').forEach(function (group, groupIndex) {
    var slides = group.children;
    if (slides.length < 2) return;

    var current = 0;
    var interval = +group.getAttribute('data-sc-fade') || 3500;

    if (reduceMotion) return;

    setTimeout(function () {
      setInterval(function () {
        slides[current].classList.remove('is-active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('is-active');
      }, interval);
    }, groupIndex * 600);
  });

  /* ---------- FAQ ---------- */

  document.querySelectorAll('[data-sc-faq]').forEach(function (item) {
    var icon = item.querySelector('summary i');
    if (!icon) return;

    item.addEventListener('toggle', function () {
      icon.className = item.open ? 'icon-minus' : 'icon-plus';
    });
  });

  /* ---------- Menu mobile ---------- */

  var menu = document.querySelector('[data-sc-menu]');
  var burger = document.querySelector('[data-burger]');
  var burgerIcon = document.querySelector('[data-sc-burger]');

  function setMenu(open) {
    if (!menu) return;
    if (open) {
      menu.setAttribute('data-open', '');
    } else {
      menu.removeAttribute('data-open');
    }
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (burger) burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (burgerIcon) burgerIcon.className = open ? 'icon-x' : 'icon-menu';
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!menu.hasAttribute('data-open'));
    });
  }

  document.querySelectorAll('[data-menu-close]').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1181) setMenu(false);
  });

  /* Compatibilidade: funções globais usadas no HTML original */
  window.scMenu = function (force) {
    if (!menu) return;
    setMenu(force === undefined ? !menu.hasAttribute('data-open') : force);
  };

  document.documentElement.classList.add('is-ready');
})();
