/* ==========================================================================
   Aura Creations — core behaviour
   Config hydration, catalogue, dialogs, WhatsApp enquiry flow, mobile menu.
   ========================================================================== */
(function () {
  'use strict';

  var AURA = window.AURA || {};
  var cfg = AURA.config || {};
  var products = Array.isArray(AURA.products) ? AURA.products : [];
  var categories = Array.isArray(AURA.categories) ? AURA.categories : [];

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------ utils */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function hasText(value) { return typeof value === 'string' && value.trim() !== ''; }

  function formatPrice(price) {
    if (typeof price !== 'number' || !isFinite(price) || price <= 0) return '';
    return '₹' + price.toLocaleString('en-IN');
  }

  function categoryLabel(id) {
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id === id) return categories[i].label;
    }
    return id || '';
  }

  function findProduct(id) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) return products[i];
    }
    return null;
  }

  function findProductByName(name) {
    var n = String(name || '').trim().toLowerCase();
    if (!n) return null;
    for (var i = 0; i < products.length; i++) {
      if (String(products[i].name).toLowerCase() === n) return products[i];
    }
    return null;
  }

  /* Unsplash URLs get a responsive srcset; local paths are used as-is. */
  function imageAttrs(url, sizes) {
    if (!hasText(url)) return null;
    if (/^https:\/\/images\.unsplash\.com\//.test(url) && url.indexOf('?') === -1) {
      var base = url + '?auto=format&fit=crop&q=70&w=';
      return {
        src: base + '800',
        srcset: [480, 800, 1200, 1600].map(function (w) { return base + w + ' ' + w + 'w'; }).join(', '),
        sizes: sizes
      };
    }
    return { src: url, srcset: '', sizes: '' };
  }

  function imgTag(url, alt, sizes, extraClass) {
    var a = imageAttrs(url, sizes);
    if (!a) return '';
    return '<img class="media-img' + (extraClass ? ' ' + extraClass : '') + '" src="' + esc(a.src) + '"' +
      (a.srcset ? ' srcset="' + esc(a.srcset) + '" sizes="' + esc(a.sizes) + '"' : '') +
      ' alt="' + esc(alt) + '" width="900" height="1200" loading="lazy" decoding="async">';
  }

  function setImage(img, url, alt, sizes) {
    var a = imageAttrs(url, sizes);
    var parent = img.parentElement;
    if (parent) parent.classList.remove('img-missing');
    if (!a) {
      img.removeAttribute('srcset');
      img.removeAttribute('src');
      img.alt = alt || '';
      markMissing(img);
      return;
    }
    if (a.srcset) { img.srcset = a.srcset; img.sizes = a.sizes; } else { img.removeAttribute('srcset'); }
    img.src = a.src;
    img.alt = alt || '';
  }

  /* --------------------------------------------- image fallback (no broken icons) */
  function markMissing(img) {
    var parent = img.parentElement;
    if (!parent) return;
    parent.classList.add('img-missing');
    parent.setAttribute('data-fallback-label', img.alt || '');
  }

  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.classList.contains('media-img')) markMissing(t);
  }, true);

  function checkExistingImages() {
    $$('img.media-img').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markMissing(img);
    });
  }

  /* ------------------------------------------------------------ scroll lock */
  var lockCount = 0;
  function lockScroll() {
    if (lockCount === 0) {
      var comp = window.innerWidth - document.documentElement.clientWidth;
      root.style.setProperty('--scrollbar-comp', comp + 'px');
      root.classList.add('is-locked');
    }
    lockCount++;
  }
  function unlockScroll() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      root.classList.remove('is-locked');
      root.style.setProperty('--scrollbar-comp', '0px');
    }
  }

  function scrollToEl(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }

  /* ================================================================ WhatsApp */
  var whatsapp = {
    number: function () {
      return String((cfg.contact && cfg.contact.whatsappNumber) || '').replace(/\D/g, '');
    },
    isConfigured: function () {
      var n = this.number();
      return n.length >= 10 && n.length <= 15;
    },
    buildUrl: function (message) {
      var url = 'https://wa.me/' + this.number();
      if (hasText(message)) url += '?text=' + encodeURIComponent(message);
      return url;
    },
    /* Builds the prefilled message. Empty fields are left out entirely. */
    buildMessage: function (d) {
      d = d || {};
      var brand = (cfg.brand && cfg.brand.name) || 'Aura Creations';
      var lines = ['Hello ' + brand + '!'];
      if (hasText(d.name)) lines.push('My name is ' + d.name.trim() + '.');
      lines.push(hasText(d.product)
        ? 'I would like to enquire about ' + d.product.trim() + '.'
        : 'I would like to make an enquiry.');
      if (hasText(d.category)) lines.push('Category: ' + d.category + '.');
      if (hasText(d.size)) lines.push('Preferred size: ' + d.size + '.');
      if (hasText(d.phone)) lines.push('Contact number: ' + d.phone.trim() + '.');
      if (hasText(d.message)) lines.push('Additional message: ' + d.message.trim());
      return lines.join('\n');
    },
    /* Opens the chat with the message prefilled. The visitor sends it. */
    open: function (message) {
      var a = document.createElement('a');
      a.href = this.buildUrl(message);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    notConfiguredText: 'WhatsApp enquiries are not set up on this page yet. Please reach the boutique through Instagram for now.'
  };
  AURA.whatsapp = whatsapp;

  if (!whatsapp.isConfigured()) {
    // Developer hint; visitors see the friendly message in the forms.
    console.warn('[Aura] Set config.contact.whatsappNumber in js/config.js (digits only, with country code).');
  }

  /* ======================================================= config hydration */
  function hydrate() {
    // Announcement
    var bar = $('[data-announcement]');
    if (bar) {
      if (hasText(cfg.announcement)) $('p', bar).textContent = cfg.announcement;
      else bar.hidden = true;
    }

    // Instagram
    if (cfg.instagram) {
      $$('[data-instagram-link]').forEach(function (a) { a.href = cfg.instagram.url; });
      $$('[data-instagram-handle]').forEach(function (el) { el.textContent = cfg.instagram.handle; });
    }

    // Location
    var loc = cfg.location || {};
    $$('[data-loc-landmark]').forEach(function (el) {
      if (hasText(loc.landmark)) el.textContent = loc.landmark;
      else { var br = el.nextElementSibling; el.remove(); if (br && br.tagName === 'BR') br.remove(); }
    });
    $$('[data-loc-area]').forEach(function (el) { if (hasText(loc.area)) el.textContent = loc.area; });
    $$('[data-loc-city]').forEach(function (el) { if (hasText(loc.city)) el.textContent = loc.city; });
    $$('[data-maps-link]').forEach(function (a) {
      var q = loc.mapsQuery || [loc.area, loc.city].filter(Boolean).join(', ');
      a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
    });

    // WhatsApp links + phone
    var configured = whatsapp.isConfigured();
    $$('[data-wa-link]').forEach(function (a) {
      if (configured) {
        a.href = a.hasAttribute('data-open-enquiry')
          ? whatsapp.buildUrl('')
          : whatsapp.buildUrl(whatsapp.buildMessage({}));
      } else {
        // No number: every WhatsApp link opens the enquiry form, which explains.
        a.href = '#visit';
        a.removeAttribute('target');
        a.setAttribute('data-open-enquiry', '');
      }
    });
    var showPhone = configured && cfg.contact && cfg.contact.showPhone && hasText(cfg.contact.displayPhone);
    $$('[data-phone-row]').forEach(function (el) { el.hidden = !showPhone; });
    $$('[data-phone-display]').forEach(function (el) { if (showPhone) el.textContent = cfg.contact.displayPhone; });

    // Year
    $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

    // Demo notices
    var demo = cfg.demo || {};
    $$('[data-concept-notice]').forEach(function (el) {
      if (!demo.isDemo) el.remove();
    });
    var note = $('[data-sample-note]');
    var anySample = products.some(function (p) { return p.isSample; });
    if (note && demo.isDemo && anySample && hasText(demo.sampleNote)) {
      note.textContent = demo.sampleNote;
      note.hidden = false;
    }

    // Canonical + og:url updated to match config if already present, or appended
    if (hasText(cfg.canonicalUrl)) {
      var link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = cfg.canonicalUrl;

      var og = document.querySelector('meta[property="og:url"]');
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', 'og:url');
        document.head.appendChild(og);
      }
      og.content = cfg.canonicalUrl;
    }
  }

  /* ================================================================ dialogs */
  var dialogTriggers = new WeakMap();

  function openDialog(dlg, trigger) {
    if (!dlg || dlg.open) return;
    dialogTriggers.set(dlg, trigger || document.activeElement);
    lockScroll();
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    // Next frame so the entrance transition runs
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { dlg.classList.add('is-open'); });
    });
  }

  function closeDialog(dlg) {
    if (!dlg || !dlg.open || dlg.dataset.closing) return;
    dlg.dataset.closing = '1';
    dlg.classList.remove('is-open');
    var done = function () {
      delete dlg.dataset.closing;
      if (typeof dlg.close === 'function') dlg.close();
      else { dlg.removeAttribute('open'); dlg.dispatchEvent(new Event('close')); }
    };
    if (reducedMotion.matches) done();
    else setTimeout(done, 320);
  }

  function setupDialog(dlg) {
    if (!dlg) return;
    var downOnBackdrop = false;

    dlg.addEventListener('cancel', function (e) { // Escape key
      e.preventDefault();
      closeDialog(dlg);
    });
    dlg.addEventListener('pointerdown', function (e) { downOnBackdrop = e.target === dlg; });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg && downOnBackdrop) closeDialog(dlg);
    });
    $$('[data-dialog-close]', dlg).forEach(function (btn) {
      btn.addEventListener('click', function () { closeDialog(dlg); });
    });
    dlg.addEventListener('close', function () {
      unlockScroll();
      var trigger = dialogTriggers.get(dlg);
      if (trigger && document.contains(trigger) && typeof trigger.focus === 'function') {
        trigger.focus({ preventScroll: true });
      }
      dlg.dispatchEvent(new CustomEvent('aura:closed'));
    });
  }

  /* ======================================================= product dialog */
  var pd = {
    dlg: $('[data-product-dialog]'),
    current: null
  };

  function openProduct(id, trigger) {
    var p = findProduct(id);
    if (!p || !pd.dlg) return;
    pd.current = p;
    var d = pd.dlg;

    setImage($('[data-pd-image]', d), p.image, p.imageAlt || p.name, '(min-width: 760px) 520px, 100vw');
    $('[data-pd-category]', d).textContent = categoryLabel(p.category);
    $('[data-pd-title]', d).textContent = p.name;

    var priceEl = $('[data-pd-price]', d);
    var price = formatPrice(p.price);
    priceEl.textContent = price;
    priceEl.hidden = !price;

    var sampleEl = $('[data-pd-sample]', d);
    var isDemo = cfg.demo && cfg.demo.isDemo;
    sampleEl.hidden = !(isDemo && p.isSample);
    sampleEl.textContent = 'Sample listing for this website concept. It does not represent a real piece or stock.';

    var descEl = $('[data-pd-description]', d);
    descEl.textContent = hasText(p.description)
      ? p.description
      : 'Ask the boutique about fabric, sizes and availability for this piece.';

    var sizesWrap = $('[data-pd-sizes]', d);
    var sizeOptions = $('[data-pd-size-options]', d);
    sizeOptions.innerHTML = '';
    if (Array.isArray(p.availableSizes) && p.availableSizes.length) {
      p.availableSizes.forEach(function (size, i) {
        var label = document.createElement('label');
        label.className = 'size-option';
        label.innerHTML = '<input type="radio" name="size" value="' + esc(size) + '" id="pd-size-' + i + '"><span>' + esc(size) + '</span>';
        sizeOptions.appendChild(label);
      });
      sizesWrap.hidden = false;
    } else {
      sizesWrap.hidden = true;
    }

    var form = $('[data-pd-form]', d);
    form.reset();
    var err = $('[data-pd-error]', d);
    err.hidden = true;
    if (!whatsapp.isConfigured()) { err.textContent = whatsapp.notConfiguredText; err.hidden = false; }

    openDialog(d, trigger);
  }

  function setupProductDialog() {
    if (!pd.dlg) return;
    setupDialog(pd.dlg);
    var form = $('[data-pd-form]', pd.dlg);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = pd.current;
      var err = $('[data-pd-error]', pd.dlg);
      if (!p) return;
      if (!whatsapp.isConfigured()) {
        err.textContent = whatsapp.notConfiguredText;
        err.hidden = false;
        return;
      }
      var checked = $('input[name="size"]:checked', form);
      var note = form.elements.note ? form.elements.note.value : '';
      whatsapp.open(whatsapp.buildMessage({
        product: p.name,
        category: categoryLabel(p.category),
        size: checked ? checked.value : '',
        message: note
      }));
      closeDialog(pd.dlg);
    });
  }

  /* ======================================================= enquiry dialog */
  var eq = {
    dlg: $('[data-enquiry-dialog]'),
    product: null
  };

  function fillSizeSelect(p) {
    var field = $('[data-eq-size-field]', eq.dlg);
    var select = $('[data-eq-size]', eq.dlg);
    select.innerHTML = '';
    if (p && Array.isArray(p.availableSizes) && p.availableSizes.length) {
      select.innerHTML = '<option value="">No preference</option>' + p.availableSizes.map(function (s) {
        return '<option value="' + esc(s) + '">' + esc(s) + '</option>';
      }).join('');
      field.hidden = false;
    } else {
      field.hidden = true;
    }
  }

  function setFieldError(input, message) {
    var errEl = document.getElementById(input.id + '-error');
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (errEl) { errEl.textContent = message; errEl.hidden = false; }
    } else {
      input.removeAttribute('aria-invalid');
      if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
    }
  }

  function validateEnquiry(form) {
    var firstInvalid = null;
    var name = form.elements.name;
    var phone = form.elements.phone;

    var nameVal = name.value.trim();
    if (!nameVal) setFieldError(name, 'Enter your name so the boutique knows who is asking.');
    else if (nameVal.length < 2) setFieldError(name, 'Enter at least 2 characters.');
    else setFieldError(name, '');
    if (name.getAttribute('aria-invalid')) firstInvalid = firstInvalid || name;

    var phoneVal = phone.value.trim();
    var digits = phoneVal.replace(/\D/g, '');
    if (phoneVal && (!/^[+\d\s()-]+$/.test(phoneVal) || digits.length < 7 || digits.length > 15)) {
      setFieldError(phone, 'Enter a phone number using digits, for example +91 98765 43210, or leave it blank.');
      firstInvalid = firstInvalid || phone;
    } else {
      setFieldError(phone, '');
    }
    return firstInvalid;
  }

  function openEnquiry(trigger, productId) {
    if (!eq.dlg) return;
    var form = $('[data-enquiry-form]', eq.dlg);
    form.reset();
    $$('[aria-invalid]', form).forEach(function (el) { setFieldError(el, ''); });

    var p = productId ? findProduct(productId) : null;
    eq.product = p;
    form.elements.product.value = p ? p.name : '';
    fillSizeSelect(p);

    var err = $('[data-eq-error]', eq.dlg);
    err.hidden = true;
    if (!whatsapp.isConfigured()) { err.textContent = whatsapp.notConfiguredText; err.hidden = false; }

    openDialog(eq.dlg, trigger);
    // Focus the first field (after showModal's own focus)
    setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, 30);
  }

  function setupEnquiryDialog() {
    if (!eq.dlg) return;
    setupDialog(eq.dlg);
    var form = $('[data-enquiry-form]', eq.dlg);

    // Datalist of products for the "Product of interest" field
    var list = $('[data-product-datalist]', eq.dlg);
    if (list) {
      list.innerHTML = products.map(function (p) { return '<option value="' + esc(p.name) + '"></option>'; }).join('');
    }

    form.elements.product.addEventListener('change', function () {
      eq.product = findProductByName(this.value);
      fillSizeSelect(eq.product);
    });

    // Clear an error as soon as it is fixed
    ['name', 'phone'].forEach(function (key) {
      form.elements[key].addEventListener('input', function () {
        if (this.getAttribute('aria-invalid')) validateEnquiry(form);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = $('[data-eq-error]', eq.dlg);
      var invalid = validateEnquiry(form);
      if (invalid) { invalid.focus(); return; }
      if (!whatsapp.isConfigured()) {
        err.textContent = whatsapp.notConfiguredText;
        err.hidden = false;
        return;
      }
      var productName = form.elements.product.value;
      var p = findProductByName(productName);
      var sizeSelect = $('[data-eq-size]', eq.dlg);
      whatsapp.open(whatsapp.buildMessage({
        name: form.elements.name.value,
        phone: form.elements.phone.value,
        product: productName,
        category: p ? categoryLabel(p.category) : '',
        size: sizeSelect && !$('[data-eq-size-field]', eq.dlg).hidden ? sizeSelect.value : '',
        message: form.elements.message.value
      }));
      closeDialog(eq.dlg);
    });

    // Reset after closing so nothing typed lingers on the page
    eq.dlg.addEventListener('aura:closed', function () { form.reset(); });
  }

  /* ============================================================== catalogue */
  var catalogue = {
    grid: $('[data-product-grid]'),
    empty: $('[data-product-empty]'),
    count: $('[data-result-count]'),
    filters: $('[data-filters]'),
    filter: 'all'
  };

  function filterLabel(id) {
    if (id === 'all') return '';
    if (id === 'new') {
      var n = categories.filter(function (c) { return c.id === 'new'; })[0];
      return n ? n.label : 'New Arrivals';
    }
    return categoryLabel(id);
  }

  function productCard(p, i) {
    var name = esc(p.name);
    var hasAlt = hasText(p.secondaryImage);
    var price = formatPrice(p.price);
    var sizes = '(min-width: 1100px) 22vw, (min-width: 760px) 30vw, 46vw';
    return '' +
      '<li class="product-card" style="--i:' + i + '" data-product-id="' + esc(p.id) + '">' +
        '<button type="button" class="product-media' + (hasAlt ? ' has-alt' : '') + '" data-view="' + esc(p.id) + '" tabindex="-1" aria-hidden="true">' +
          imgTag(p.image, p.imageAlt || p.name, sizes) +
          (hasAlt ? imgTag(p.secondaryImage, '', sizes, 'media-img--alt') : '') +
          (p.isNewArrival ? '<span class="tag-new">New arrival</span>' : '') +
        '</button>' +
        '<div class="product-info">' +
          '<p class="product-category">' + esc(categoryLabel(p.category)) + '</p>' +
          '<h3 class="product-name">' + name + '</h3>' +
          (price ? '<p class="product-price">' + esc(price) + '</p>' : '') +
          '<div class="product-actions">' +
            '<button type="button" class="product-action" data-view="' + esc(p.id) + '" aria-label="View details: ' + name + '">View details</button>' +
            '<button type="button" class="product-action" data-enquire="' + esc(p.id) + '" aria-label="Enquire about ' + name + '">' +
              '<svg class="icon" aria-hidden="true"><use href="#i-whatsapp"/></svg>Enquire</button>' +
          '</div>' +
        '</div>' +
      '</li>';
  }

  function renderCatalogue() {
    if (!catalogue.grid) return;
    var f = catalogue.filter;
    var list = products.filter(function (p) {
      if (f === 'all') return true;
      if (f === 'new') return p.isNewArrival === true;
      return p.category === f;
    });

    catalogue.grid.innerHTML = list.map(productCard).join('');
    catalogue.empty.hidden = list.length > 0;
    catalogue.grid.hidden = list.length === 0;

    var label = filterLabel(f);
    var noun = list.length === 1 ? 'piece' : 'pieces';
    catalogue.count.textContent = 'Showing ' + list.length + ' ' + noun + (label ? ' in ' + label : '');

    $$('.media-img', catalogue.grid).forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markMissing(img);
    });
  }

  function setFilter(id) {
    var valid = id === 'all' || id === 'new' || categories.some(function (c) { return c.id === id; });
    catalogue.filter = valid ? id : 'all';
    $$('[data-filter]', catalogue.filters).forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === catalogue.filter));
    });
    renderCatalogue();
  }
  AURA.setFilter = setFilter;

  function setupCatalogue() {
    if (!catalogue.grid) return;

    // Filter labels follow the configured category names
    $$('[data-filter]', catalogue.filters).forEach(function (btn) {
      var id = btn.dataset.filter;
      if (id !== 'all') btn.textContent = filterLabel(id);
    });

    catalogue.filters.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (btn) setFilter(btn.dataset.filter);
    });

    var reset = $('[data-filter-reset]');
    if (reset) reset.addEventListener('click', function () { setFilter('all'); });

    catalogue.grid.addEventListener('click', function (e) {
      var view = e.target.closest('[data-view]');
      var enquire = e.target.closest('[data-enquire]');
      if (enquire) {
        openEnquiry(enquire, enquire.dataset.enquire);
      } else if (view) {
        // The image button is hidden from assistive tech; return focus to the text button
        var card = view.closest('.product-card');
        var focusTarget = view.getAttribute('tabindex') === '-1' && card ? $('.product-action[data-view]', card) : view;
        openProduct(view.dataset.view, focusTarget);
      }
    });

    // Collection cards filter the catalogue and scroll to it
    $$('[data-filter-link]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.preventDefault();
        setFilter(card.dataset.filterLink);
        var section = document.getElementById('catalogue');
        scrollToEl(section);
        var heading = document.getElementById('catalogue-title');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
        }
      });
    });

    setFilter('all');
  }

  /* ============================================================ mobile menu */
  var menu = {
    el: $('[data-mobile-menu]'),
    toggle: $('[data-menu-toggle]'),
    isOpen: false,
    timer: null
  };

  function focusables(container) {
    return $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter(function (el) { return el.offsetParent !== null; });
  }

  function openMenu() {
    if (!menu.el || menu.isOpen) return;
    clearTimeout(menu.timer);
    menu.isOpen = true;
    menu.el.hidden = false;
    menu.toggle.setAttribute('aria-expanded', 'true');
    menu.toggle.setAttribute('aria-label', 'Close menu');
    lockScroll();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { menu.el.classList.add('is-open'); });
    });
    var first = $('[data-menu-link]', menu.el);
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
  }

  function closeMenu(returnFocus) {
    if (!menu.el || !menu.isOpen) return;
    menu.isOpen = false;
    menu.el.classList.remove('is-open');
    menu.toggle.setAttribute('aria-expanded', 'false');
    menu.toggle.setAttribute('aria-label', 'Open menu');
    unlockScroll();
    menu.timer = setTimeout(function () { menu.el.hidden = true; }, reducedMotion.matches ? 0 : 420);
    if (returnFocus) menu.toggle.focus({ preventScroll: true });
  }

  function setupMenu() {
    if (!menu.el || !menu.toggle) return;
    menu.toggle.addEventListener('click', function () {
      if (menu.isOpen) closeMenu(true); else openMenu();
    });
    $('[data-menu-close]', menu.el).addEventListener('click', function () { closeMenu(true); });
    // Unlock before the browser follows the anchor so the jump can happen
    $$('[data-menu-link]', menu.el).forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    menu.el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); return; }
      if (e.key !== 'Tab') return;
      var items = focusables(menu.el);
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (mq) {
      if (mq.matches) closeMenu(false);
    });
  }

  /* ============================================================= preloader */
  function setupPreloader() {
    var pl = document.getElementById('preloader');
    if (!pl) return;
    var hidden = false;
    function dismiss() {
      if (hidden) return;
      hidden = true;
      pl.classList.add('is-hidden');
      setTimeout(function () {
        if (pl && pl.parentNode) pl.parentNode.removeChild(pl);
      }, 800);
    }
    // Dismiss shortly after full window load, with safety fallback
    if (document.readyState === 'complete') {
      setTimeout(dismiss, 500);
    } else {
      window.addEventListener('load', function () {
        setTimeout(dismiss, 500);
      });
      setTimeout(dismiss, 2400); // Safety fallback so preloader never blocks
    }
  }

  /* =================================================== inline contact form */
  function setupInlineContactForm() {
    var form = document.querySelector('[data-inline-contact]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.elements.name ? form.elements.name.value : '').trim();
      var phone = (form.elements.phone ? form.elements.phone.value : '').trim();
      var interest = (form.elements.interest ? form.elements.interest.value : '').trim();
      var msg = (form.elements.message ? form.elements.message.value : '').trim();

      var brand = (cfg.brand && cfg.brand.name) || 'Aura Creations';
      var lines = ['Hello ' + brand + '!'];
      if (name) lines.push('My name is ' + name + '.');
      if (phone) lines.push('Contact number: ' + phone + '.');
      if (interest) lines.push('I am interested in: ' + interest + '.');
      if (msg) lines.push('Message: ' + msg);

      whatsapp.open(lines.join('\n'));
      form.reset();
    });
  }

  /* ============================================ global enquiry triggers */
  function setupEnquiryTriggers() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-open-enquiry]');
      if (!trigger) return;
      e.preventDefault();
      if (menu.isOpen) closeMenu(false);
      openEnquiry(trigger, trigger.dataset.productId || null);
    });
  }

  /* =================================================================== init */
  function init() {
    setupPreloader();
    hydrate();
    setupProductDialog();
    setupEnquiryDialog();
    setupCatalogue();
    setupMenu();
    setupEnquiryTriggers();
    setupInlineContactForm();
    checkExistingImages();
    window.addEventListener('load', checkExistingImages);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
