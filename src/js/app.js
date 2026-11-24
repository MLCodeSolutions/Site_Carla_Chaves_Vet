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
  var cancelEmbedScroll = null;

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
    burger.addEventListener('click', function (event) {
      event.stopPropagation();
      var willOpen = !menu.hasAttribute('data-open');
      if (willOpen && cancelEmbedScroll) cancelEmbedScroll();
      setMenu(willOpen);
    });
  }

  document.querySelectorAll('[data-menu-close]').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  /* Fecha o menu em qualquer link interno, inclusive sem data-menu-close. */
  document.addEventListener('click', function (event) {
    var target = event.target;
    var link = target && target.closest ? target.closest('a[href^="#"]') : null;
    if (link) setMenu(false);

    if (!menu || !menu.hasAttribute('data-open')) return;
    if (target.closest && (target.closest('[data-sc-menu]') || target.closest('[data-burger]'))) return;
    setMenu(false);
  });

  window.addEventListener('hashchange', function () {
    setMenu(false);
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

  /*
   * Modo app (embed.html no Google Sites): links internos com href="#..."
   * fazem o Google Sites rolar o frame pai (~88 px) para esconder o header,
   * cortando o header do site. Removemos o href e rolamos com window.scrollTo,
   * que fica restrito ao iframe.
   */
  function initEmbeddedNav() {
    if (!document.body || document.body.getAttribute('data-embed-mode') !== 'single') return;

    document.documentElement.style.scrollBehavior = 'auto';

    var offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    if (!isFinite(offset) || offset <= 0) {
      var header = document.querySelector('.site-header');
      offset = header ? header.offsetHeight + 8 : 96;
    }

    var rafId = 0;
    var highlightTimer = 0;
    var navToken = 0;

    function cancelScroll() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    cancelEmbedScroll = function () {
      navToken += 1;
      cancelScroll();
    };

    function animateTo(targetY, target) {
      var startY = window.pageYOffset;
      var diff = targetY - startY;
      if (Math.abs(diff) < 2 || reduceMotion) {
        window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
        return;
      }

      var duration = Math.min(650, Math.max(350, 350 + Math.abs(diff) * 0.05));
      var start = performance.now();

      function step(now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo({ top: startY + diff * eased, left: 0, behavior: 'auto' });
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          /* Corrige se fontes/imagens mudaram a posição do alvo durante a animação. */
          var finalY = target.getBoundingClientRect().top + window.pageYOffset - offset;
          if (Math.abs(finalY - targetY) > 2) {
            window.scrollTo({ top: Math.max(0, finalY), left: 0, behavior: 'auto' });
          }
          rafId = 0;
        }
      }

      rafId = requestAnimationFrame(step);
    }

    function goTo(hash) {
      var target = document.querySelector(hash);
      if (!target) return;

      var token = ++navToken;

      function run() {
        if (token !== navToken) return;
        var targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
        cancelScroll();
        setMenu(false);
        animateTo(Math.max(0, targetY), target);

        target.classList.add('is-nav-target');
        clearTimeout(highlightTimer);
        highlightTimer = setTimeout(function () {
          target.classList.remove('is-nav-target');
        }, 1300);
      }

      if (document.fonts && document.fonts.status === 'loading') {
        document.fonts.ready.then(run);
      } else {
        run();
      }
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      link.removeAttribute('href');
      link.setAttribute('data-embed-target', hash);
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');

      link.addEventListener('click', function (event) {
        event.preventDefault();
        goTo(hash);
      });

      link.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        goTo(hash);
      });
    });

    window.addEventListener('wheel', cancelScroll, { passive: true });
    window.addEventListener('touchstart', cancelScroll, { passive: true });
  }

  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var selectors = [
      '.section-head', '.testimonial', '.service-card', '.ebook-card', '.contact-card',
      '.faq-item', '.video-frame', '.about-copy', '.about-photo', '.benefits-grid > *',
      '.cta-copy', '.cta-panel'
    ];
    var elements = [];
    var seen = new Set();

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (seen.has(el) || el.hasAttribute('data-reveal')) return;
        seen.add(el);
        el.setAttribute('data-reveal', '');
        elements.push(el);
      });
    });

    if (!elements.length) return;

    var groups = new Map();
    elements.forEach(function (el) {
      var parent = el.parentElement;
      var group = groups.get(parent) || [];
      group.push(el);
      groups.set(parent, group);
    });

    groups.forEach(function (group) {
      group.forEach(function (el, index) {
        el.style.setProperty('--reveal-delay', Math.min(index, 5) * 70 + 'ms');
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.documentElement.classList.add('reveal-ready');
    elements.forEach(function (el) { observer.observe(el); });
  }

  initEmbeddedNav();
  initReveal();

  document.documentElement.classList.add('is-ready');
})();
