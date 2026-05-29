/* ============================================
   MaxRides — Live bike viewer (photo + parallax)
   Replaces the old procedural Three.js model.
   Per-bike photo with mouse/touch drag rotation,
   subtle 3D parallax to feel alive, plate overlay
   tinted to user selection, frame hue-rotate to
   match frame color, smooth bike swap.

   Exposes the same API as the old `window.bike3d`
   so build.js can call it without changes:
     window.bike3d.isReady()
     window.bike3d.setBike(slug)
     window.bike3d.setFrameColor(hex)
     window.bike3d.setPlateColor(hex)
     window.bike3d.setPlateText(text)
     window.bike3d.setWheelRimColor(hex)   // no-op in v1
   ============================================ */

(function () {
  'use strict';

  // ---- Per-bike viewer tuning -----------------------------------
  // x/y are percentages of the photo wrapper (where the plate sits
  // visually on each bike's front number-plate area). These are
  // hand-tuned for the existing single-photo product images. When
  // we get real 360° frames in Phase 2 this becomes a per-angle map.
  // Right-facing bikes have photoFlip:false. Left-facing bikes get
  // photoFlip:true so the rendered output is consistently right-facing
  // (matches the rotation drag direction and unifies the lineup).
  // plateX/Y are percentages of the photo wrapper, in the bike's *unflipped*
  // coordinate space — when photoFlip is true we mirror plateX in applyTransform.
  // photoFlip: true for original photos that face LEFT, so they render facing
  // RIGHT and the lineup is consistent. Verified by direct inspection of each
  // cutout image — only 2 of 13 actually need flipping.
  // plateX/Y are percentages of the photo wrapper (rendered space), tuned
  // to sit just above the front wheel between the fork stems for each bike.
  var BIKE_TUNING = {
    'sur-ron-light-bee-x':    { plateX: 78, plateY: 30, plateScale: 0.55, photoFlip: false },
    'sur-ron-ultra-bee':      { plateX: 78, plateY: 30, plateScale: 0.55, photoFlip: false },
    'talaria-dragon':         { plateX: 76, plateY: 26, plateScale: 0.60, photoFlip: false },
    'talaria-sting-mx4':      { plateX: 76, plateY: 28, plateScale: 0.55, photoFlip: true  },
    'stark-varg':             { plateX: 80, plateY: 28, plateScale: 0.65, photoFlip: false },
    'etm-rtr-xl':             { plateX: 76, plateY: 30, plateScale: 0.55, photoFlip: false },
    'etm-rtr-sport':          { plateX: 76, plateY: 26, plateScale: 0.50, photoFlip: false },
    'etm-rtr-lite':           { plateX: 80, plateY: 36, plateScale: 0.45, photoFlip: false },
    'rawrr-mantis':           { plateX: 76, plateY: 22, plateScale: 0.55, photoFlip: true  },
    'super73-rx':             { plateX: 64, plateY: 44, plateScale: 0.40, photoFlip: false },
    'super73-zx':             { plateX: 64, plateY: 44, plateScale: 0.40, photoFlip: false },
    'onyx-rcr':               { plateX: 64, plateY: 42, plateScale: 0.45, photoFlip: false },
    'super73-zx-le-speedway': { plateX: 64, plateY: 44, plateScale: 0.40, photoFlip: false }
  };

  function tuningFor(slug) {
    return BIKE_TUNING[slug] || { plateX: 50, plateY: 50, plateScale: 0.5, photoFlip: false };
  }

  // ---- DOM handles ----------------------------------------------
  var viewer, stage, photoWrap, bikeLayer, photoEl, tintEl, rimEl, plateEl, hintEl, shadowEl, eyebrowEl, titleEl;
  var initialized = false;

  // ---- View state ------------------------------------------------
  var v = {
    slug: null,
    frameHex: '#FF5A1F',
    rimHex: null,           // set by setWheelRimColor or wheel-option mapping
    plateHex: null,
    plateText: '73',
    plateLightText: false,
    // rotation
    yaw: 0,                 // current y rotation in degrees (-22..22)
    targetYaw: 0,           // damped target
    autoRotate: true,       // idle drift
    autoT: 0,               // auto-rotate phase
    dragging: false,
    dragStartX: 0,
    yawAtDragStart: 0,
    lastInteractTs: 0
  };

  var MAX_YAW = 22;             // peak rotation in degrees
  var AUTO_AMP = 6;             // idle drift amplitude in degrees
  var AUTO_PERIOD_MS = 12000;   // idle drift period
  var DAMP = 0.18;              // 0=stiff, 1=loose
  var IDLE_RESUME_MS = 2200;    // after release, this long until auto-drift resumes

  function ready() { return initialized; }

  // ---- Init ------------------------------------------------------
  function init() {
    if (initialized) return;
    viewer    = document.getElementById('bike-3d-viewer');
    stage     = document.getElementById('bike-3d-stage');
    photoWrap = document.getElementById('bike-3d-photo-wrap');
    bikeLayer = document.getElementById('bike-3d-bike-layer');
    photoEl   = document.getElementById('bike-3d-photo');
    tintEl    = document.getElementById('bike-3d-tint');
    rimEl     = document.getElementById('bike-3d-rim-tint');
    plateEl   = document.getElementById('bike-3d-plate');
    hintEl    = document.getElementById('bike-3d-hint');
    shadowEl  = document.getElementById('bike-3d-shadow');
    eyebrowEl = document.getElementById('bike-3d-eyebrow');
    titleEl   = document.getElementById('bike-3d-title');
    if (!viewer || !photoEl) return;

    bindDrag();
    requestAnimationFrame(loop);
    initialized = true;
  }

  // ---- Drag / pointer ------------------------------------------
  function bindDrag() {
    viewer.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    // Hide the hint after first interaction
    viewer.addEventListener('pointerdown', function () {
      if (hintEl) hintEl.classList.add('is-hidden');
    }, { once: true });
  }
  function onDown(e) {
    v.dragging = true;
    v.dragStartX = e.clientX;
    v.yawAtDragStart = v.yaw;
    v.autoRotate = false;
    v.lastInteractTs = performance.now();
    try { viewer.setPointerCapture(e.pointerId); } catch (_) {}
  }
  function onMove(e) {
    if (!v.dragging) return;
    var dx = e.clientX - v.dragStartX;
    // 240px of drag = full yaw range
    var nextYaw = v.yawAtDragStart + (dx / 240) * MAX_YAW * 2;
    if (nextYaw > MAX_YAW) nextYaw = MAX_YAW;
    if (nextYaw < -MAX_YAW) nextYaw = -MAX_YAW;
    v.targetYaw = nextYaw;
    v.lastInteractTs = performance.now();
  }
  function onUp() {
    if (!v.dragging) return;
    v.dragging = false;
    v.lastInteractTs = performance.now();
  }

  // ---- Render loop ---------------------------------------------
  function loop(ts) {
    requestAnimationFrame(loop);

    // Resume auto-drift after idle
    if (!v.dragging && !v.autoRotate &&
        (ts - v.lastInteractTs) > IDLE_RESUME_MS) {
      v.autoRotate = true;
      v.autoT = ts; // restart phase from rest position
    }

    // Auto-drift target
    if (v.autoRotate && !v.dragging) {
      var phase = ((ts - v.autoT) / AUTO_PERIOD_MS) * Math.PI * 2;
      v.targetYaw = Math.sin(phase) * AUTO_AMP;
    }

    // Damp yaw toward target
    v.yaw += (v.targetYaw - v.yaw) * DAMP;
    applyTransform();
  }

  function applyTransform() {
    if (!stage) return;
    var yaw = v.yaw;
    // Subtle scale-up at oblique angles fakes the "the bike is turning toward me" feel
    var scaleBoost = 1 + (Math.abs(yaw) / MAX_YAW) * 0.04;
    var rotX = -2 + (Math.abs(yaw) / MAX_YAW) * 1.2; // very slight pitch
    // photoWrap rotates in 3D. Mirroring is handled by the inner bike-layer
    // (via .is-flipped class), so we don't multiply yaw by a flip factor anymore.
    photoWrap.style.transform =
      'rotateY(' + yaw + 'deg)' +
      ' rotateX(' + rotX + 'deg)' +
      ' scale(' + scaleBoost + ')';

    // Shadow scales/offsets opposite to rotation for grounded feel
    if (shadowEl) {
      var sx = 1 - Math.abs(yaw) / (MAX_YAW * 4);
      var tx = -50 + (yaw / MAX_YAW) * 4;       // percentage
      var op = 0.85 - Math.abs(yaw) / (MAX_YAW * 6);
      shadowEl.style.transform = 'translateX(' + tx + '%) scaleX(' + sx + ')';
      shadowEl.style.opacity = op.toFixed(3);
    }
  }

  // Resolve the per-part mask URLs for a bike. Hand-cut PNGs live at
  // assets/img/bikes/masks/<slug>-<part>.webp. We only ship frame/rims/wheels
  // for now; everything else falls back to the full cutout silhouette.
  function maskUrl(slug, part) {
    return 'assets/img/bikes/masks/' + slug + '-' + part + '.webp';
  }

  // ---- Public API ----------------------------------------------
  function setBike(slug) {
    if (!initialized) return;
    if (slug === v.slug) return;
    v.slug = slug;
    var data = window.MAXRIDES_DATA;
    var bike = data && data.findBike(slug);
    if (!bike) return;
    // Prefer the clean transparent cutout; fall back to original photoUrl.
    var src = bike.cutoutUrl || bike.photoUrl || '';
    var t = tuningFor(slug);
    // Apply photoFlip immediately — the bike-layer mirrors before the photo loads,
    // so when the new photo comes in it appears already-flipped (no pop).
    if (bikeLayer) {
      bikeLayer.classList.toggle('is-flipped', !!t.photoFlip);
    }
    // Smooth photo swap
    photoEl.classList.add('is-swapping');
    if (tintEl) tintEl.classList.remove('is-active');
    if (rimEl) rimEl.classList.remove('is-active');
    setTimeout(function () {
      photoEl.src = src;
      photoEl.alt = bike.name;
      photoEl.classList.remove('is-swapping');
      if (tintEl && src) {
        // --bike-mask still gets set (kept around for legacy reasons / fallback)
        tintEl.style.setProperty('--bike-mask', 'url("' + src + '")');
        // --frame-mask drives the frame-only tint. Falls back to the cutout if
        // the per-bike frame.webp doesn't exist (mask-image handles 404 by
        // showing nothing, so we wire fallback in CSS via two background-images
        // — see build.html .bike-3d-tint).
        tintEl.style.setProperty('--frame-mask', 'url("' + maskUrl(slug, 'frame') + '")');
      }
      if (rimEl) {
        rimEl.style.setProperty('--rim-mask', 'url("' + maskUrl(slug, 'rims') + '")');
      }
      // Re-apply frame color + plate anchor once mask is set
      applyFrameTint();
      applyRimTint();
      repositionPlate();
    }, 150);
    if (eyebrowEl) eyebrowEl.textContent = bike.brand;
    if (titleEl)   titleEl.textContent   = bike.name;
  }

  function applyFrameTint() {
    if (!tintEl) return;
    var hex = v.frameHex;
    var hsl = hexToHSL(hex);
    // Per-color blend strategy. The frame mask isolates JUST the frame now,
    // so we can be aggressive — wheels/tires/seat stay their original color.
    var blend, op, bg;
    if (hsl.l > 0.82 && hsl.s < 0.2) {
      // Arctic white: paint frame mask white with screen blend, high opacity.
      // Screen + high opacity lifts even deeply pigmented frames (Stark VARG red).
      bg = '#FFFFFF';
      blend = 'screen';
      op = 0.85;
    } else if (hsl.s < 0.15 && hsl.l < 0.25) {
      // Jet black: multiply darkens the frame strongly.
      bg = hex;
      blend = 'multiply';
      op = 0.92;
    } else if (hsl.s < 0.15) {
      // Mid-grey: color blend desaturates without darkening.
      bg = hex;
      blend = 'color';
      op = 0.9;
    } else {
      // Chromatic (orange, lime, purple, red): color blend preserves luminance,
      // shifts hue. Highlights and decals stay readable.
      bg = hex;
      blend = 'color';
      op = 0.95;
    }
    tintEl.style.backgroundColor = bg;
    tintEl.style.mixBlendMode = blend;
    tintEl.style.opacity = op;
    tintEl.classList.add('is-active');
  }

  function applyRimTint() {
    if (!rimEl) return;
    // Rim tint comes from either an explicit color (setWheelRimColor) or the
    // currently-selected wheel option (Warp 9 = gold anodized, Excel KKE =
    // blackened, stock = no tint). Default to no tint.
    if (!v.rimHex) {
      rimEl.classList.remove('is-active');
      return;
    }
    rimEl.style.backgroundColor = v.rimHex;
    rimEl.style.mixBlendMode = 'color';
    rimEl.style.opacity = 0.9;
    rimEl.classList.add('is-active');
  }

  function setFrameColor(hex) {
    v.frameHex = hex;
    applyFrameTint();
  }

  function setPlateColor(hex) {
    if (hex === null || hex === undefined) {
      v.plateHex = null;
      if (plateEl) plateEl.classList.add('is-hidden');
      return;
    }
    v.plateHex = hex;
    plateEl.style.backgroundColor = hex;
    // Auto-pick text color for contrast
    var hsl = hexToHSL(hex);
    var lightText = hsl.l < 0.55;
    plateEl.classList.toggle('bike-3d-plate--light', !lightText);
    plateEl.style.color = lightText ? '#FFFFFF' : '#0A0A0A';
    plateEl.classList.remove('is-hidden');
  }

  function setPlateText(text) {
    v.plateText = (text || '').trim() || '73';
    if (plateEl) plateEl.textContent = v.plateText;
  }

  function repositionPlate() {
    // Anchor the plate to the bike's front number-plate region using per-bike
    // tuning. plateX/Y are percentages of the photo wrap (0=left/top, 100=right/bottom).
    if (!plateEl) return;
    var t = tuningFor(v.slug);
    plateEl.style.left = t.plateX + '%';
    plateEl.style.top = t.plateY + '%';
    plateEl.style.right = 'auto';
    plateEl.style.bottom = 'auto';
    plateEl.style.transform = 'translate(-50%, -50%) rotate(-4deg) scale(' + (t.plateScale || 1) + ')';
  }

  function setWheelRimColor(hex) {
    v.rimHex = hex || null;
    applyRimTint();
  }

  // Generic per-category hook. build.js calls this when a non-color, non-plate
  // category selection changes. Most categories just trigger the "react" feedback
  // — a brief yaw nudge + price-pulse + chip-fly — so the user feels their tap
  // landed on the bike even when we don't have an anchored overlay yet.
  var WHEEL_TINT_BY_OPT = {
    'warp9-1619': '#D4A537',   // gold anodized
    'excel-kke':  '#0F0F0F',   // blackened
    'stock-wheels': null
  };
  function setMod(catId, optId) {
    if (!initialized) return;
    // Wheels override rim tint based on the selected option.
    if (catId === 'wheels') {
      var c = WHEEL_TINT_BY_OPT.hasOwnProperty(optId) ? WHEEL_TINT_BY_OPT[optId] : null;
      v.rimHex = c;
      applyRimTint();
    }
    reactToTap();
  }

  // Brief yaw wiggle + scale-pulse on the bike + price-pulse so every
  // customization tap visibly lands. De-bounces rapid taps.
  var reactTs = 0;
  function reactToTap() {
    var now = performance.now();
    if (now - reactTs < 220) return;
    reactTs = now;
    // 8° yaw nudge that the damped loop relaxes back toward zero / auto-drift
    var dir = Math.random() < 0.5 ? -1 : 1;
    v.targetYaw = (v.yaw || 0) + 8 * dir;
    v.autoRotate = false;
    v.lastInteractTs = now;
    // Scale-pulse the bike (CSS animation, restart-friendly)
    if (bikeLayer) {
      bikeLayer.classList.remove('is-reacting');
      // force reflow so the animation restarts even on rapid taps
      void bikeLayer.offsetWidth;
      bikeLayer.classList.add('is-reacting');
      setTimeout(function () {
        if (bikeLayer) bikeLayer.classList.remove('is-reacting');
      }, 340);
    }
    // Pulse the visible price elements
    var priceEls = document.querySelectorAll(
      '#builder-total, #footer-total, .builder-hero__total, .builder-footer__total .value'
    );
    priceEls.forEach(function (el) {
      el.classList.remove('is-pulsing');
      void el.offsetWidth;
      el.classList.add('is-pulsing');
      setTimeout(function () { el.classList.remove('is-pulsing'); }, 340);
    });
  }

  // ---- Color utils ---------------------------------------------
  function hexToHSL(hex) {
    hex = String(hex || '').replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(function (c) { return c + c; }).join('');
    }
    if (hex.length !== 6) return { h: 0, s: 0, l: 0.5 };
    var r = parseInt(hex.slice(0,2), 16) / 255;
    var g = parseInt(hex.slice(2,4), 16) / 255;
    var b = parseInt(hex.slice(4,6), 16) / 255;
    var max = Math.max(r,g,b), min = Math.min(r,g,b);
    var h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h *= 60;
    }
    return { h: h, s: s, l: l };
  }

  // ---- Boot ----------------------------------------------------
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  window.bike3d = {
    isReady: ready,
    setBike: setBike,
    setFrameColor: setFrameColor,
    setPlateColor: setPlateColor,
    setPlateText: setPlateText,
    setWheelRimColor: setWheelRimColor,
    // Generic per-category hook — build.js routes every customization change here
    setMod: setMod
  };
})();
