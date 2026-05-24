/* ============================================
   MaxRides — Builder page (configurator)
   Reads MAXRIDES_DATA; renders all categories from the data layer.
   Manages selections state, live price, live bike preview color.
   Persists selections to localStorage and writes to cart/wishlist.
   ============================================ */

(function () {
  'use strict';

  var DATA = window.MAXRIDES_DATA;
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return document.querySelectorAll(sel); };
  function $el(tag, attrs, html) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'dataset') Object.assign(el.dataset, attrs[k]);
      else el.setAttribute(k, attrs[k]);
    });
    if (html != null) el.innerHTML = html;
    return el;
  }
  function fmt(n) { return '$' + n.toLocaleString('en-US'); }

  // ---------- State ----------
  var state = {
    bikeSlug: 'dirt-01',
    frameColor: DATA.FRAME_COLORS[0],   // gloss orange
    plateNumber: '73',
    selections: {}                       // categoryId -> optionId
  };

  // Read ?bike= query param
  var params = new URLSearchParams(window.location.search);
  var qBike = params.get('bike');
  if (qBike && DATA.findBike(qBike)) state.bikeSlug = qBike;

  // Default selections: first option in every category
  DATA.COMPONENT_CATEGORIES.forEach(function (cat) {
    state.selections[cat.id] = cat.options[0].id;
  });

  // Try to load a preload payload from ?preload= (used by Remix → Builder handoff)
  var qPreload = params.get('preload');
  if (qPreload) {
    try {
      var decoded = JSON.parse(atob(qPreload));
      if (decoded.bike && DATA.findBike(decoded.bike)) state.bikeSlug = decoded.bike;
      if (decoded.color) {
        var found = DATA.FRAME_COLORS.find(function (c) { return c.id === decoded.color; });
        if (found) state.frameColor = found;
      }
      if (decoded.selections) Object.assign(state.selections, decoded.selections);
      if (decoded.plate) state.plateNumber = decoded.plate;
    } catch (e) { /* ignore malformed preload */ }
  }

  // ---------- Computed helpers ----------
  function getOption(catId, optId) {
    var cat = DATA.COMPONENT_CATEGORIES.find(function (c) { return c.id === catId; });
    if (!cat) return null;
    return cat.options.find(function (o) { return o.id === optId; });
  }

  function applicableOptions(cat) {
    return cat.options.filter(function (o) {
      if (!o.applicableBikes) return true;
      return o.applicableBikes.indexOf(state.bikeSlug) !== -1;
    });
  }

  function computeTotal() {
    var bike = DATA.findBike(state.bikeSlug);
    var total = bike.basePrice + (state.frameColor.priceDelta || 0);
    Object.keys(state.selections).forEach(function (catId) {
      var opt = getOption(catId, state.selections[catId]);
      if (opt) total += (opt.priceDelta || 0);
    });
    return total;
  }

  function buildSummary() {
    var bike = DATA.findBike(state.bikeSlug);
    var summary = {
      bike: bike.slug,
      bikeName: bike.name,
      color: state.frameColor.id,
      colorName: state.frameColor.name,
      colorHex: state.frameColor.hex,
      plate: state.plateNumber,
      selections: {},
      lineItems: [{ label: bike.name + ' frame', price: bike.basePrice }],
      total: 0
    };
    if (state.frameColor.priceDelta) {
      summary.lineItems.push({ label: state.frameColor.name + ' paint', price: state.frameColor.priceDelta });
    }
    DATA.COMPONENT_CATEGORIES.forEach(function (cat) {
      var optId = state.selections[cat.id];
      var opt = getOption(cat.id, optId);
      if (!opt) return;
      summary.selections[cat.id] = optId;
      if (opt.priceDelta > 0) {
        summary.lineItems.push({ label: cat.title + ': ' + opt.name, price: opt.priceDelta });
      }
    });
    summary.total = computeTotal();
    return summary;
  }

  // ---------- Render: frame color swatches ----------
  function renderColorRow() {
    var row = $('#color-row');
    row.innerHTML = '';
    DATA.FRAME_COLORS.forEach(function (color) {
      var btn = $el('button', { type: 'button', 'class': 'color-swatch-btn', 'data-color-id': color.id }, '');
      var sel = (color.id === state.frameColor.id);
      var deltaTxt = color.priceDelta ? '+$' + color.priceDelta : 'included';
      btn.innerHTML =
        '<span class="swatch' + (sel ? ' is-selected' : '') + '" style="background:' + color.hex + ';' +
        (color.hex === '#FFFFFF' ? ' border-color:#3a3a3a;' : '') + '"></span>' +
        '<span class="name">' + color.name + '</span>' +
        '<span class="delta">' + deltaTxt + '</span>';
      if (sel) btn.classList.add('is-selected');
      btn.addEventListener('click', function () {
        state.frameColor = color;
        renderColorRow();
        renderPreview();
        renderTotal();
        $('#selected-color').textContent = color.name;
        persist();
      });
      row.appendChild(btn);
    });
  }

  // ---------- Render: a category section ----------
  function renderCategory(cat) {
    var opts = applicableOptions(cat);
    var section = $el('section', { 'class': 'builder-section', id: 'cat-' + cat.id });
    var selOpt = getOption(cat.id, state.selections[cat.id]) || opts[0];
    section.innerHTML =
      '<div class="builder-section__head">' +
        '<p class="eyebrow">' + cat.number + ' &middot; ' + cat.title + '</p>' +
        '<span class="selected-name" data-selected-for="' + cat.id + '">' + selOpt.name + '</span>' +
      '</div>' +
      '<p class="builder-section__blurb">' + cat.blurb + '</p>' +
      '<div class="option-grid" data-grid-for="' + cat.id + '"></div>';

    // Build the option grid
    var grid = section.querySelector('[data-grid-for="' + cat.id + '"]');
    opts.forEach(function (opt) {
      grid.appendChild(renderOptionCard(cat, opt));
    });

    // For the plate category, add the number input
    if (cat.id === 'plate') {
      var input = $el('div', { 'class': 'plate-input' });
      input.innerHTML =
        '<label for="plate-number">Your number / name</label>' +
        '<input id="plate-number" type="text" maxlength="6" value="' + state.plateNumber + '" placeholder="73">';
      input.querySelector('input').addEventListener('input', function (e) {
        state.plateNumber = e.target.value.trim() || '73';
        persist();
      });
      section.appendChild(input);
    }

    return section;
  }

  function renderOptionCard(cat, opt) {
    var isSelected = (state.selections[cat.id] === opt.id);
    var priceText = opt.priceDelta === 0 ? 'Included' : '+$' + opt.priceDelta.toLocaleString();
    var card = $el('article', {
      'class': 'option' + (isSelected ? ' is-selected' : ''),
      'data-cat': cat.id,
      'data-opt': opt.id,
      'role': 'button',
      'tabindex': '0'
    });

    var specsHtml = '';
    if (opt.specs && Object.keys(opt.specs).length) {
      var rows = Object.keys(opt.specs).map(function (k) {
        return '<dt>' + humanizeKey(k) + '</dt><dd>' + escapeHtml(opt.specs[k]) + '</dd>';
      }).join('');
      specsHtml = '<dl class="option__specs">' + rows + '</dl>';
    }

    card.innerHTML =
      '<div class="option__head">' +
        '<div>' +
          '<div class="option__title">' + escapeHtml(opt.name) + '</div>' +
          '<div class="option__brand">' + escapeHtml(opt.brand) + '</div>' +
        '</div>' +
        '<div class="option__price' + (opt.priceDelta === 0 ? ' is-included' : '') + '">' + priceText + '</div>' +
      '</div>' +
      (opt.summary ? '<p class="option__summary">' + escapeHtml(opt.summary) + '</p>' : '') +
      specsHtml;

    function activate() {
      state.selections[cat.id] = opt.id;
      // Toggle visual selection in this category's grid
      var grid = card.parentElement;
      grid.querySelectorAll('.option').forEach(function (c) { c.classList.remove('is-selected'); });
      card.classList.add('is-selected');
      // Update the selected-name badge
      var badge = document.querySelector('[data-selected-for="' + cat.id + '"]');
      if (badge) badge.textContent = opt.name;
      renderTotal();
      persist();
    }
    card.addEventListener('click', activate);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
    return card;
  }

  function renderAllCategories() {
    var host = $('#categories-host');
    host.innerHTML = '';
    DATA.COMPONENT_CATEGORIES.forEach(function (cat) {
      host.appendChild(renderCategory(cat));
    });
  }

  // ---------- Bike preview + total ----------
  function renderPreview() {
    var stage = $('#builder-stage');
    stage.setAttribute('data-bike', state.bikeSlug);
    stage.setAttribute('data-accent', state.frameColor.hex);
    if (window.BIKE_SVG && window.BIKE_SVG[state.bikeSlug]) {
      stage.innerHTML = window.BIKE_SVG[state.bikeSlug](state.frameColor.hex);
    }
    var bike = DATA.findBike(state.bikeSlug);
    $('#builder-bike-label').textContent = 'Building · ' + bike.name;
  }

  function renderTotal() {
    var t = computeTotal();
    $('#builder-total').textContent = fmt(t);
    $('#footer-total').textContent = fmt(t);
  }

  // ---------- Bike pills ----------
  function setupBikePills() {
    var pills = $$('[data-bike-pill]');
    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        var slug = p.getAttribute('data-bike-pill');
        if (slug === state.bikeSlug) return;
        state.bikeSlug = slug;
        pills.forEach(function (q) { q.classList.toggle('chip--active', q === p); });
        renderPreview();
        // Reset selections that are no longer applicable
        DATA.COMPONENT_CATEGORIES.forEach(function (cat) {
          var opts = applicableOptions(cat);
          var current = state.selections[cat.id];
          if (!opts.find(function (o) { return o.id === current; })) {
            state.selections[cat.id] = opts[0].id;
          }
        });
        renderAllCategories();
        renderTotal();
        persist();
      });
    });
    // Reflect initial selection
    pills.forEach(function (p) {
      p.classList.toggle('chip--active', p.getAttribute('data-bike-pill') === state.bikeSlug);
    });
  }

  // ---------- Persistence ----------
  function persist() {
    try {
      localStorage.setItem('maxrides.builder', JSON.stringify({
        bike: state.bikeSlug,
        color: state.frameColor.id,
        plate: state.plateNumber,
        selections: state.selections
      }));
    } catch (e) { /* ignore */ }
  }

  function hydrateFromStorage() {
    if (qPreload || qBike) return; // URL takes priority
    try {
      var raw = localStorage.getItem('maxrides.builder');
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed.bike && DATA.findBike(parsed.bike)) state.bikeSlug = parsed.bike;
      if (parsed.color) {
        var c = DATA.FRAME_COLORS.find(function (x) { return x.id === parsed.color; });
        if (c) state.frameColor = c;
      }
      if (parsed.plate) state.plateNumber = parsed.plate;
      if (parsed.selections) {
        Object.keys(parsed.selections).forEach(function (catId) {
          var optId = parsed.selections[catId];
          if (getOption(catId, optId)) state.selections[catId] = optId;
        });
      }
    } catch (e) { /* ignore */ }
  }

  // ---------- Save / cart ----------
  function saveToWishlist() {
    var summary = buildSummary();
    summary.id = 'wl_' + Date.now();
    summary.savedAt = new Date().toISOString();
    summary.title = 'My ' + summary.bikeName.replace(/^The /, '') + ' build';
    var raw = localStorage.getItem('maxrides.wishlist');
    var list = raw ? JSON.parse(raw) : [];
    list.unshift(summary);
    localStorage.setItem('maxrides.wishlist', JSON.stringify(list));
    flash('Saved to wishlist');
  }

  function addToCart() {
    var summary = buildSummary();
    summary.id = 'ci_' + Date.now();
    summary.qty = 1;
    var raw = localStorage.getItem('maxrides.cart');
    var cart = raw ? JSON.parse(raw) : [];
    cart.push(summary);
    localStorage.setItem('maxrides.cart', JSON.stringify(cart));
    if (window.MAXRIDES && window.MAXRIDES.refreshCartBadge) window.MAXRIDES.refreshCartBadge();
    window.location.href = 'cart.html';
  }

  function flash(message) {
    var el = $el('div', {
      style:
        'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);' +
        'background:var(--surface);color:var(--text-primary);' +
        'padding:10px 18px;border-radius:12px;border:1px solid var(--border-strong);' +
        'font-size:13px;font-weight:500;z-index:60;'
    }, message);
    document.body.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transition = 'opacity 300ms'; }, 1400);
    setTimeout(function () { el.remove(); }, 1900);
  }

  // ---------- Utility ----------
  function humanizeKey(k) {
    return k.replace(/([A-Z])/g, ' $1').replace(/^./, function (s) { return s.toUpperCase(); }).trim();
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  // ---------- Init ----------
  hydrateFromStorage();
  document.addEventListener('DOMContentLoaded', function () {
    setupBikePills();
    renderPreview();
    renderColorRow();
    $('#selected-color').textContent = state.frameColor.name;
    renderAllCategories();
    renderTotal();
    $('#save-wishlist-btn').addEventListener('click', saveToWishlist);
    $('#add-to-cart-btn').addEventListener('click', addToCart);
  });
})();
