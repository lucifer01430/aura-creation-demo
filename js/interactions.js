/* ==========================================================================
   Aura Creations — visual interactions
   Header state, floating button, scroll reveals, active nav, hero depth,
   gentle parallax and card tilt. Everything is progressive: the page reads
   fully without any of it, and prefers-reduced-motion switches motion off.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var hasIO = 'IntersectionObserver' in window;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  /* ----------------------------------------- header + floating WhatsApp */
  var header = $('[data-header]');
  var fab = $('[data-fab]');
  var hero = $('.hero');
  var fabBlocked = false; // true while the closing CTA or footer is on screen

  function updateChrome() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (fab) {
      var pastHero = hero ? y > hero.offsetTop + hero.offsetHeight * 0.6 : y > 400;
      fab.classList.toggle('is-visible', pastHero && !fabBlocked);
    }
  }

  var chromeTicking = false;
  window.addEventListener('scroll', function () {
    if (chromeTicking) return;
    chromeTicking = true;
    requestAnimationFrame(function () { updateChrome(); chromeTicking = false; });
  }, { passive: true });

  if (hasIO && fab) {
    var blockers = $$('.final-cta, .site-footer');
    var visibleBlockers = new Set();
    var fabObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visibleBlockers.add(entry.target);
        else visibleBlockers.delete(entry.target);
      });
      fabBlocked = visibleBlockers.size > 0;
      updateChrome();
    }, { threshold: 0.05 });
    blockers.forEach(function (el) { fabObserver.observe(el); });
  }
  updateChrome();

  /* ------------------------------------------------------- scroll reveals */
  if (hasIO && !reduced.matches) {
    root.classList.add('reveal-ready');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $$('.reveal').forEach(function (el, i) {
      // Small stagger between neighbouring blocks
      var siblings = el.parentElement ? $$('.reveal', el.parentElement) : [];
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx, 4) * 80 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------- active nav links */
  if (hasIO) {
    var navMap = { collections: 'collections', catalogue: 'collections', story: 'story', visit: 'visit' };
    var links = $$('[data-nav-link]');
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var target = navMap[entry.target.id];
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(navMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navObserver.observe(el);
    });
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) links.forEach(function (a) { a.classList.remove('is-active'); });
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }
  }

  if (reduced.matches) return; // Everything below is decorative motion

  /* ---------------------------------------------- hero depth (pointer) */
  var heroVisual = $('[data-hero-visual]');
  if (heroVisual && hero && finePointer.matches) {
    var layers = $$('[data-depth]', heroVisual);
    var px = 0, py = 0, depthTicking = false;

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - 0.5;
      py = (e.clientY - r.top) / r.height - 0.5;
      if (depthTicking) return;
      depthTicking = true;
      requestAnimationFrame(function () {
        layers.forEach(function (layer) {
          var d = parseFloat(layer.getAttribute('data-depth')) || 1;
          layer.style.setProperty('--dx', (px * d * -14).toFixed(2) + 'px');
          layer.style.setProperty('--dy', (py * d * -10).toFixed(2) + 'px');
        });
        depthTicking = false;
      });
    });
    hero.addEventListener('pointerleave', function () {
      layers.forEach(function (layer) {
        layer.style.setProperty('--dx', '0px');
        layer.style.setProperty('--dy', '0px');
      });
    });
  }

  /* ------------------------------------------------ parallax (scroll) */
  var parallaxEls = $$('[data-parallax]');
  if (parallaxEls.length && hasIO) {
    var active = new Set();
    var plxTicking = false;
    var small = window.matchMedia('(max-width: 759px)');

    var plxObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) active.add(entry.target); else active.delete(entry.target);
      });
      requestParallax();
    });
    parallaxEls.forEach(function (el) { plxObserver.observe(el); });

    function updateParallax() {
      var vh = window.innerHeight;
      active.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var factor = parseFloat(el.getAttribute('data-parallax')) || 0.06;
        if (small.matches) factor *= 0.5;
        // -1 when the element enters from below, +1 when it leaves at the top
        var progress = clamp((vh - r.top) / (vh + r.height) * 2 - 1, -1, 1);
        el.style.setProperty('--py', (progress * r.height * factor * -1).toFixed(1) + 'px');
      });
      plxTicking = false;
    }
    function requestParallax() {
      if (plxTicking) return;
      plxTicking = true;
      requestAnimationFrame(updateParallax);
    }
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);
  }

  /* --------------------------------------- collection card tilt (pointer) */
  if (finePointer.matches) {
    $$('.collection-card').forEach(function (card) {
      var ticking = false, rx = 0, ry = 0;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        ry = ((e.clientX - r.left) / r.width - 0.5) * 5;   // max ±2.5deg
        rx = ((e.clientY - r.top) / r.height - 0.5) * -4;  // max ±2deg
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          card.style.transform = 'perspective(1100px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
          ticking = false;
        });
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }
})();
