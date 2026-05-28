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
  var BIKE_TUNING = {
    'sur-ron-light-bee-x':    { plateX: 22,  plateY: 36, plateScale: 1.00, photoFlip: false, baseHue: 17 },
    'sur-ron-ultra-bee':      { plateX: 22,  plateY: 36, plateScale: 1.00, photoFlip: false, baseHue: 0  },
    'talaria-dragon':         { plateX: 24,  plateY: 32, plateScale: 1.05, photoFlip: false, baseHue: 0  },
    'talaria-sting-mx4':      { plateX: 24,  plateY: 34, plateScale: 1.00, photoFlip: false, baseHue: 220 },
    'stark-varg':             { plateX: 26,  plateY: 30, plateScale: 1.10, photoFlip: false, baseHue: 0  },
    'etm-rtr-xl':             { plateX: 22,  plateY: 34, plateScale: 1.00, photoFlip: false, baseHue: 0  },
    'etm-rtr-sport':          { plateX: 22,  plateY: 34, plateScale: 1.00, photoFlip: false, baseHue: 0  },
    'etm-rtr-lite':           { plateX: 22,  plateY: 38, plateScale: 0.85, photoFlip: false, baseHue: 0  },
    'rawrr-mantis':           { plateX: 22,  plateY: 36, plateScale: 1.00, photoFlip: false, baseHue: 0  },
    'super73-rx':             { plateX: 14,  plateY: 48, plateScale: 0.80, photoFlip: false, baseHue: 0  },
    'super73-zx':             { plateX: 14,  plateY: 50, plateScale: 0.75, photoFlip: false, baseHue: 0  },
    'onyx-rcr':               { plateX: 16,  plateY: 46, plateScale: 0.85, photoFlip: false, baseHue: 0  },
    'super73-zx-le-speedway': { plateX: 14,  plateY: 50, plateScale: 0.75, photoFlip: false, baseHue: 0  }
  };

  function tuningFor(slug) {
    return BIKE_TUNING[slug] || { plateX: 22, plateY: 36, plateScale: 1, photoFlip: false, baseHue: 17 };
  }

  // ---- DOM handles ----------------------------------------------
  var viewer, stage, photoWrap, photoEl, plateEl, hintEl, shadowEl, eyebrowEl, titleEl;
  var initialized = false;

  // ---- View state ------------------------------------------------
  var v = {
    slug: null,
    frameHex: '#FF5A1F',
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
    photoEl   = document.getElementById('bike-3d-photo');
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
    var t = tuningFor(v.slug);
    var flip = t.photoFlip ? -1 : 1;
    // Subtle scale-up at oblique angles fakes the "the bike is turning toward me" feel
    var scaleBoost = 1 + (Math.abs(yaw) / MAX_YAW) * 0.04;
    var rotX = -2 + (Math.abs(yaw) / MAX_YAW) * 1.2; // very slight pitch
    // The photo wrapper rotates in 3D. We also gently scaleX flip when needed.
    photoWrap.style.transform =
      'rotateY(' + (yaw * flip) + 'deg)' +
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

  // ---- Public API ----------------------------------------------
  function hueToRotateDeg(targetHex, baseHue) {
    // Approximate hue rotation needed to move a "baseHue"-tinted
    // photo toward the target color. Greyscale targets get a saturation
    // wash; chromatic targets get a hue-rotate.
    var hsl = hexToHSL(targetHex);
    if (hsl.s < 0.18) {
      // Approaching grey/white/black — desaturate + brightness shift
      var bri = 0.6 + (hsl.l * 0.9);
      var sat = 0.25;
      return { filter: 'brightness(' + bri.toFixed(2) + ') saturate(' + sat.toFixed(2) + ')' };
    }
    var delta = (hsl.h - (baseHue || 0));
    return { filter: 'hue-rotate(' + Math.round(delta) + 'deg) saturate(1.05)' };
  }

  function setBike(slug) {
    if (!initialized) return;
    if (slug === v.slug) return;
    v.slug = slug;
    var data = window.MAXRIDES_DATA;
    var bike = data && data.findBike(slug);
    if (!bike) return;
    // Smooth photo swap
    photoEl.classList.add('is-swapping');
    setTimeout(function () {
      photoEl.src = bike.photoUrl || '';
      photoEl.alt = bike.name;
      photoEl.classList.remove('is-swapping');
    }, 150);
    if (eyebrowEl) eyebrowEl.textContent = bike.brand;
    if (titleEl)   titleEl.textContent   = bike.name;
    // Re-position plate per bike
    repositionPlate();
    // Re-apply frame color filter (baseHue may have changed)
    applyFrameFilter();
  }

  function applyFrameFilter() {
    if (!photoEl) return;
    var t = tuningFor(v.slug);
    var out = hueToRotateDeg(v.frameHex, t.baseHue);
    photoEl.style.filter =
      'drop-shadow(0 36px 38px rgba(0,0,0,0.22))' +
      ' drop-shadow(0 6px 10px rgba(0,0,0,0.12))' +
      ' ' + out.filter;
  }

  function setFrameColor(hex) {
    v.frameHex = hex;
    applyFrameFilter();
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
    // Plate is a fixed lower-right preview chip — positioning is CSS-driven
    // so it works across all 13 bike photos without per-photo masks.
    // This function stays as a hook for Phase 2 when we have per-bike masks.
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
    // Phase-2 hooks (no-op in v1 — needs per-part masks):
    setWheelRimColor: function () {}
  };
})();
