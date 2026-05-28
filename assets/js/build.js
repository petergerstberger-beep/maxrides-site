/* ============================================
   MaxRides — Builder page (configurator)
   Reads MAXRIDES_DATA; renders categories from the data layer.
   Tier-filters mods so cheaper bikes hide expensive options.
   Renders bike pills dynamically from DATA.BIKES.
   ============================================ */

(function () {
  'use strict';

  var DATA = window.MAXRIDES_DATA;
  var TIER_RANK = DATA.TIER_RANK;
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
  var DEFAULT_SLUG = (DATA.BIKES[0] && DATA.BIKES[0].slug) || 'sur-ron-light-bee-x';
  var state = {
    bikeSlug: DEFAULT_SLUG,
    frameColor: DATA.FRAME_COLORS[0],
    plateNumber: '73',
    selections: {}
  };

  var params = new URLSearchParams(window.location.search);
  var qBike = params.get('bike');
  if (qBike && DATA.findBike(qBike)) state.bikeSlug = qBike;

  // Default selections: first option in every category
  DATA.COMPONENT_CATEGORIES.forEach(function (cat) {
    state.selections[cat.id] = cat.options[0].id;
  });

  // Preload payload from ?preload= (Remix → Builder handoff)
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

  // Filter category options by:
  //   1. applicableBikes (if set, hard allow-list)
  //   2. tier (option's tier rank must be <= bike's tier rank)
  function applicableOptions(cat) {
    var bike = DATA.findBike(state.bikeSlug);
    if (!bike) return cat.options;
    var bikeRank = TIER_RANK[bike.tier] || 2;
    return cat.options.filter(function (o) {
      if (o.applicableBikes && o.applicableBikes.indexOf(state.bikeSlug) === -1) return false;
      var optRank = TIER_RANK[o.tier || 'budget'] || 1;
      return optRank <= bikeRank;
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
      lineItems: [{ label: bike.name, price: bike.basePrice }],
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
    if (!opts.length) return null;

    // If currently-selected option got filtered out, fall back to first
    var currentId = state.selections[cat.id];
    if (!opts.find(function (o) { return o.id === currentId; })) {
      state.selections[cat.id] = opts[0].id;
    }
    var selOpt = getOption(cat.id, state.selections[cat.id]) || opts[0];

    var section = $el('section', { 'class': 'builder-section', id: 'cat-' + cat.id });
    section.innerHTML =
      '<div class="builder-section__head">' +
        '<p class="eyebrow">' + cat.number + ' &middot; ' + cat.title + '</p>' +
        '<span class="selected-name" data-selected-for="' + cat.id + '">' + selOpt.name + '</span>' +
      '</div>' +
      '<p class="builder-section__blurb">' + cat.blurb + '</p>' +
      '<div class="option-grid" data-grid-for="' + cat.id + '"></div>';

    var grid = section.querySelector('[data-grid-for="' + cat.id + '"]');
    opts.forEach(function (opt) {
      grid.appendChild(renderOptionCard(cat, opt));
    });

    if (cat.id === 'plate') {
      var input = $el('div', { 'class': 'plate-input' });
      input.innerHTML =
        '<label for="plate-number">Your number / name</label>' +
        '<input id="plate-number" type="text" maxlength="6" value="' + state.plateNumber + '" placeholder="73">';
      input.querySelector('input').addEventListener('input', function (e) {
        state.plateNumber = e.target.value.trim() || '73';
        persist();
        update3D();
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
      var grid = card.parentElement;
      grid.querySelectorAll('.option').forEach(function (c) { c.classList.remove('is-selected'); });
      card.classList.add('is-selected');
      var badge = document.querySelector('[data-selected-for="' + cat.id + '"]');
      if (badge) badge.textContent = opt.name;
      renderTotal();
      persist();
      // Push live update into 3D viewer (plate / wheel / etc.)
      update3D();
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
      var section = renderCategory(cat);
      if (section) host.appendChild(section);
    });
  }

  // Convert a hex color to its hue value (degrees, 0–360)
  function hexToHue(hex) {
    hex = String(hex || '').replace('#', '');
    if (hex.length !== 6) return 0;
    var r = parseInt(hex.slice(0,2),16)/255;
    var g = parseInt(hex.slice(2,4),16)/255;
    var b = parseInt(hex.slice(4,6),16)/255;
    var max = Math.max(r,g,b), min = Math.min(r,g,b);
    if (max === min) return 0; // grayscale
    var d = max - min, h = 0;
    if (max === r) h = ((g-b)/d + (g<b?6:0))*60;
    else if (max === g) h = ((b-r)/d + 2)*60;
    else h = ((r-g)/d + 4)*60;
    return Math.round(h);
  }
  var ORANGE_HUE = hexToHue('#FF5A1F'); // ~17

  // Plate option id -> hex color (used for 3D model + future visualizations)
  var PLATE_COLOR_MAP = {
    'no-plate':       null,
    'plate-orange':   '#FF5A1F',
    'plate-white':    '#FFFFFF',
    'plate-black':    '#0A0A0A',
    'plate-red':      '#D11515',
    'plate-blue':     '#1F4FAA',
    'plate-lime':     '#C8FF00',
    'plate-pink':     '#FF50AA',
    'plate-yellow':   '#F7C800',
    'plate-holo':     '#C8C8E0',
    'plate-carbon':   '#1A1A1A',
    'plate-chrome':   '#DDDDDD',
    'plate-race-num': '#FFFFFF'
  };

  // Wheels option id -> rim hex
  var WHEEL_COLOR_MAP = {
    'stock-wheels':  '#222226',
    'warp9-1619':    '#0A0A0A',   // anodized black
    'excel-kke':     '#C9A227'    // anodized gold
  };

  // ---------- Bike preview + total ----------
  function renderPreview() {
    var stage = $('#builder-stage');
    stage.setAttribute('data-bike', state.bikeSlug);
    stage.setAttribute('data-accent', state.frameColor.hex);
    if (window.bikeImage) {
      stage.innerHTML = window.bikeImage(state.bikeSlug, state.frameColor.hex);
    }
    // Apply CSS color filter to the bike image so picking a frame color
    // visibly tints the preview. Black/white = no filter (natural bike).
    var img = stage.querySelector('img.bike-photo');
    if (img) {
      var id = state.frameColor.id;
      if (id === 'jet-black') {
        img.style.filter = 'brightness(0.85) saturate(0.6)';
      } else if (id === 'arctic-white') {
        img.style.filter = 'brightness(1.12) saturate(0.5)';
      } else {
        var offset = hexToHue(state.frameColor.hex) - ORANGE_HUE;
        img.style.filter = 'hue-rotate(' + offset + 'deg) saturate(1.15)';
      }
    }
    var bike = DATA.findBike(state.bikeSlug);
    $('#builder-bike-label').textContent = 'Building · ' + bike.name;

    // ---- 3D viewer sync ----
    update3D();
  }

  // Push the entire current builder state into the live viewer.
  // Called any time the bike, frame color, plate, or any mod changes.
  function update3D() {
    if (!window.bike3d || !window.bike3d.isReady()) return;
    var bike = DATA.findBike(state.bikeSlug);
    // Swap bike photo first (viewer guards against same-slug churn)
    window.bike3d.setBike(state.bikeSlug);
    // Frame tint
    window.bike3d.setFrameColor(state.frameColor.hex);
    // Plate (color + number). null hex hides the plate.
    var plateOptId = state.selections['plate'];
    var plateHex = PLATE_COLOR_MAP[plateOptId];
    window.bike3d.setPlateColor(plateHex == null ? null : plateHex);
    if (window.bike3d.setPlateText) window.bike3d.setPlateText(state.plateNumber);
    // Wheel rim — Phase-2 (no-op until per-part masks land)
    var wheelOptId = state.selections['wheels'];
    var wheelHex = WHEEL_COLOR_MAP[wheelOptId];
    if (wheelHex && window.bike3d.setWheelRimColor) {
      window.bike3d.setWheelRimColor(wheelHex);
    }
    // Update viewer label
    var eyebrow = document.getElementById('bike-3d-eyebrow');
    var title = document.getElementById('bike-3d-title');
    if (eyebrow) eyebrow.textContent = bike.brand;
    if (title) title.textContent = bike.name;
  }

  function renderTotal() {
    var t = computeTotal();
    $('#builder-total').textContent = fmt(t);
    $('#footer-total').textContent = fmt(t);
  }

  // ---------- Bike pills (rendered dynamically from DATA.BIKES) ---
  function renderBikePills() {
    var row = $('#bike-pill-row');
    if (!row) return;
    row.innerHTML = '';
    DATA.BIKES.forEach(function (b) {
      var btn = $el('button', {
        type: 'button',
        'class': 'chip' + (b.slug === state.bikeSlug ? ' chip--active' : ''),
        'data-bike-pill': b.slug
      }, escapeHtml(b.name));
      btn.addEventListener('click', function () {
        if (b.slug === state.bikeSlug) return;
        state.bikeSlug = b.slug;
        row.querySelectorAll('[data-bike-pill]').forEach(function (q) {
          q.classList.toggle('chip--active', q === btn);
        });
        renderPreview();
        renderAllCategories();
        renderTotal();
        persist();
      });
      row.appendChild(btn);
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
    if (qPreload || qBike) return;
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
    summary.title = 'My ' + summary.bikeName + ' build';
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

  // Poll for bike3d readiness and push state when ready
  function waitForBike3D() {
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (window.bike3d && window.bike3d.isReady && window.bike3d.isReady()) {
        clearInterval(iv);
        update3D();
      } else if (tries > 60) {
        // ~6 seconds — give up (Three.js failed to load or WebGL missing)
        clearInterval(iv);
      }
    }, 100);
  }

  // ---------- Init ----------
  hydrateFromStorage();
  document.addEventListener('DOMContentLoaded', function () {
    renderBikePills();
    renderPreview();
    renderColorRow();
    $('#selected-color').textContent = state.frameColor.name;
    renderAllCategories();
    renderTotal();
    $('#save-wishlist-btn').addEventListener('click', saveToWishlist);
    $('#add-to-cart-btn').addEventListener('click', addToCart);
    waitForBike3D();
  });
})();
