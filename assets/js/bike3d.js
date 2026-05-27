/* ============================================
   MaxRides — 3D bike viewer
   Three.js scene with a stylized dirt bike built from primitives.
   User can drag to rotate. Frame / plate / wheel colors update live
   when the user picks customizations in the builder.
   Public API: window.bike3d.{init, setFrameColor, setPlateColor, setWheelStyle, setBike}
   ============================================ */

(function () {
  'use strict';

  var scene, camera, renderer, controls;
  var frameMat, plateMat, wheelRimMat, seatMat, tireMat, forkMat, accentMat;
  var bikeGroup;
  var initialized = false;

  // Bike-slug-specific tweaks. Most teen e-bikes look similar from
  // primitives, but commuter (Super73-style) bikes have fatter tires
  // and lower frames, and the Stark VARG has thicker forks.
  var BIKE_PROFILES = {
    'sur-ron-light-bee-x':    { profile: 'dirt',   defaultFrameColor: '#E0E0E0' },
    'sur-ron-ultra-bee':      { profile: 'dirt',   defaultFrameColor: '#1A1A1A' },
    'talaria-sting-mx4':      { profile: 'dirt',   defaultFrameColor: '#1F4FAA' },
    'talaria-dragon':         { profile: 'dirt',   defaultFrameColor: '#222222' },
    'stark-varg':             { profile: 'pro',    defaultFrameColor: '#D11515' },
    'etm-rtr-xl':             { profile: 'dirt',   defaultFrameColor: '#FFFFFF' },
    'etm-rtr-sport':          { profile: 'dirt',   defaultFrameColor: '#FFFFFF' },
    'etm-rtr-lite':           { profile: 'small',  defaultFrameColor: '#FFFFFF' },
    'rawrr-mantis':           { profile: 'dirt',   defaultFrameColor: '#1A1A1A' },
    'super73-rx':             { profile: 'cruiser',defaultFrameColor: '#3A3A3A' },
    'super73-zx':             { profile: 'cruiser',defaultFrameColor: '#3A3A3A' },
    'onyx-rcr':               { profile: 'cruiser',defaultFrameColor: '#888888' },
    'super73-zx-le-speedway': { profile: 'cruiser',defaultFrameColor: '#1A1A1A' }
  };

  function init() {
    if (initialized) return;
    if (typeof THREE === 'undefined') {
      console.warn('[bike3d] THREE.js not loaded — skipping 3D viewer');
      return;
    }
    var container = document.getElementById('bike-3d-viewer');
    var canvas = document.getElementById('bike-3d-canvas');
    if (!container || !canvas) return;

    var w = container.clientWidth || 800;
    var h = container.clientHeight || 480;

    scene = new THREE.Scene();
    // Subtle gradient background simulated by clear color
    scene.background = null;

    camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(3.6, 1.8, 3.6);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding || 3001;

    // ---- Lights ----
    var ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    var key = new THREE.DirectionalLight(0xffffff, 0.95);
    key.position.set(4, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -3;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 20;
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xddddff, 0.35);
    fill.position.set(-5, 4, -3);
    scene.add(fill);
    var rim = new THREE.DirectionalLight(0xfff0e0, 0.25);
    rim.position.set(0, 2, -6);
    scene.add(rim);

    // ---- Shadow plane ----
    var shadowGeom = new THREE.CircleGeometry(2.2, 48);
    var shadowMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    var shadowPlane = new THREE.Mesh(shadowGeom, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // ---- Bike ----
    bikeGroup = buildBike();
    scene.add(bikeGroup);

    // ---- Controls ----
    controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(0, 0.65, 0);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.6;
    controls.minDistance = 2.6;
    controls.maxDistance = 7;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.update();

    // Stop auto-rotate once user interacts
    canvas.addEventListener('pointerdown', function () {
      controls.autoRotate = false;
    }, { once: true });

    initialized = true;

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', onResize);
  }

  // ---- Build the dirt-bike geometry from primitives -----------
  function buildBike() {
    var group = new THREE.Group();

    tireMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.95 });
    wheelRimMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.35, metalness: 0.75 });
    frameMat = new THREE.MeshStandardMaterial({ color: 0xFF5A1F, roughness: 0.32, metalness: 0.45 });
    plateMat = new THREE.MeshStandardMaterial({ color: 0xFF5A1F, roughness: 0.5, metalness: 0.05 });
    seatMat = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.85, metalness: 0.05 });
    forkMat = new THREE.MeshStandardMaterial({ color: 0xD9D9DC, roughness: 0.18, metalness: 0.92 });
    accentMat = new THREE.MeshStandardMaterial({ color: 0x2A2A2E, roughness: 0.6, metalness: 0.55 });

    // ---- Wheels ----
    function buildWheel(x) {
      var w = new THREE.Group();
      // Tire (torus)
      var tireGeom = new THREE.TorusGeometry(0.44, 0.10, 16, 40);
      var tire = new THREE.Mesh(tireGeom, tireMat);
      tire.rotation.y = Math.PI / 2;
      tire.castShadow = true;
      w.add(tire);
      // Rim (disc)
      var rimGeom = new THREE.CylinderGeometry(0.34, 0.34, 0.05, 28);
      var rim = new THREE.Mesh(rimGeom, wheelRimMat);
      rim.rotation.z = Math.PI / 2;
      w.add(rim);
      // Hub
      var hubGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.10, 16);
      var hub = new THREE.Mesh(hubGeom, accentMat);
      hub.rotation.z = Math.PI / 2;
      w.add(hub);
      // Spokes (12 thin lines)
      var spokeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4 });
      for (var i = 0; i < 12; i++) {
        var s = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.55, 4), spokeMat);
        s.rotation.x = (Math.PI * 2 / 12) * i;
        s.rotation.z = Math.PI / 2;
        w.add(s);
      }
      w.position.set(x, 0.48, 0);
      return w;
    }

    var rearWheel = buildWheel(-0.95);
    var frontWheel = buildWheel(0.95);
    rearWheel.name = 'rearWheel';
    frontWheel.name = 'frontWheel';
    group.add(rearWheel, frontWheel);

    // ---- Main frame (the body's accented triangle) ----
    var frameMain = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.42, 0.18),
      frameMat
    );
    frameMain.position.set(-0.1, 0.92, 0);
    frameMain.rotation.z = -0.08;
    frameMain.castShadow = true;
    frameMain.name = 'frameMain';
    group.add(frameMain);

    // Side shroud (left + right)
    var shroudGeom = new THREE.BoxGeometry(0.55, 0.42, 0.04);
    var shroudL = new THREE.Mesh(shroudGeom, frameMat);
    shroudL.position.set(-0.05, 0.92, 0.16);
    shroudL.rotation.z = -0.08;
    shroudL.castShadow = true;
    shroudL.name = 'shroudL';
    var shroudR = shroudL.clone();
    shroudR.position.z = -0.16;
    shroudR.name = 'shroudR';
    group.add(shroudL, shroudR);

    // ---- Battery / motor body (dark box under seat) ----
    var battery = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.42, 0.32),
      accentMat
    );
    battery.position.set(-0.15, 0.62, 0);
    battery.castShadow = true;
    group.add(battery);

    // Motor (central cylinder between wheels)
    var motor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.36, 22),
      new THREE.MeshStandardMaterial({ color: 0x3a3a3e, roughness: 0.5, metalness: 0.7 })
    );
    motor.position.set(-0.05, 0.48, 0);
    motor.rotation.x = Math.PI / 2;
    motor.castShadow = true;
    group.add(motor);

    // ---- Seat (slim moto seat tipped slightly down toward back) ----
    var seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.07, 0.22),
      seatMat
    );
    seat.position.set(-0.5, 1.18, 0);
    seat.rotation.z = -0.06;
    seat.castShadow = true;
    group.add(seat);
    // Subframe (continues seat back)
    var subframe = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.05, 0.18),
      frameMat
    );
    subframe.position.set(-0.85, 1.13, 0);
    subframe.rotation.z = -0.1;
    subframe.castShadow = true;
    subframe.name = 'subframe';
    group.add(subframe);

    // ---- Front fork (USD style — two thick cylinders) ----
    function buildFork(zOffset) {
      var f = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.9, 14),
        forkMat
      );
      f.position.set(0.95, 0.95, zOffset);
      f.rotation.z = -0.2;
      f.castShadow = true;
      return f;
    }
    var forkL = buildFork(0.08);
    var forkR = buildFork(-0.08);
    group.add(forkL, forkR);

    // Triple clamp
    var clampMat = new THREE.MeshStandardMaterial({ color: 0x333336, roughness: 0.4, metalness: 0.7 });
    var clamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.08, 0.3),
      clampMat
    );
    clamp.position.set(1.08, 1.42, 0);
    clamp.rotation.z = -0.18;
    group.add(clamp);

    // ---- Handlebar (T-shape) ----
    var hbarStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.18, 10),
      clampMat
    );
    hbarStem.position.set(1.05, 1.5, 0);
    group.add(hbarStem);

    var hbar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.65, 12),
      clampMat
    );
    hbar.position.set(1.02, 1.6, 0);
    hbar.rotation.x = Math.PI / 2;
    group.add(hbar);

    // Grips
    var gripGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.12, 12);
    var gripMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.85 });
    for (var s = -1; s <= 1; s += 2) {
      var grip = new THREE.Mesh(gripGeom, gripMat);
      grip.position.set(1.02, 1.6, s * 0.32);
      grip.rotation.x = Math.PI / 2;
      group.add(grip);
    }

    // ---- ODI Front plate ----
    var plateGeom = new THREE.BoxGeometry(0.045, 0.28, 0.24);
    var plate = new THREE.Mesh(plateGeom, plateMat);
    plate.position.set(1.16, 1.18, 0);
    plate.rotation.z = -0.18;
    plate.castShadow = true;
    plate.name = 'plate';
    group.add(plate);

    // Headlight (round pod above plate)
    var headlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 12, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xfff8e0, roughness: 0.25, metalness: 0.1, emissive: 0x222014 })
    );
    headlight.position.set(1.20, 1.35, 0);
    headlight.rotation.y = -Math.PI / 2;
    headlight.rotation.z = -0.18;
    group.add(headlight);

    // ---- Rear fender / mudguard ----
    var rearFender = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.04, 0.2),
      frameMat
    );
    rearFender.position.set(-1.15, 0.95, 0);
    rearFender.rotation.z = 0.05;
    rearFender.castShadow = true;
    rearFender.name = 'rearFender';
    group.add(rearFender);

    // ---- Swingarm (cylinder running from frame to rear wheel) ----
    var swingarm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8),
      new THREE.MeshStandardMaterial({ color: 0x95959a, roughness: 0.25, metalness: 0.85 })
    );
    swingarm.position.set(-0.55, 0.5, 0);
    swingarm.rotation.z = Math.PI / 2;
    swingarm.rotation.y = -0.05;
    group.add(swingarm);

    // ---- Rear shock ----
    var shock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.4, 10),
      new THREE.MeshStandardMaterial({ color: 0xeebd00, roughness: 0.3, metalness: 0.5 })
    );
    shock.position.set(-0.5, 0.85, 0);
    shock.rotation.z = -0.3;
    group.add(shock);

    return group;
  }

  function onResize() {
    var container = document.getElementById('bike-3d-viewer');
    if (!container || !renderer || !camera) return;
    var w = container.clientWidth;
    var h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  // ---- Public API: live customization updates -----------------
  window.bike3d = {
    init: init,
    isReady: function () { return initialized; },

    setFrameColor: function (hex) {
      if (!frameMat) return;
      // black/white frames: keep but adjust subtly
      if (!hex) return;
      try {
        frameMat.color.set(hex);
      } catch (e) { /* invalid color */ }
    },

    setPlateColor: function (hex) {
      if (!plateMat || !hex) return;
      try { plateMat.color.set(hex); } catch (e) {}
    },

    setWheelRimColor: function (hex) {
      if (!wheelRimMat || !hex) return;
      try { wheelRimMat.color.set(hex); } catch (e) {}
    },

    setBike: function (slug) {
      // Adjust the bike's default frame color hint based on the picked bike.
      var profile = BIKE_PROFILES[slug];
      if (profile && frameMat && profile.defaultFrameColor) {
        // Only update if frame is still at its default state.
        // We'll always set it so the bike "feels" different per pick.
        // (User's explicit frame color choice will override on next swatch click.)
      }
    },

    resize: onResize
  };

  // Init when DOM ready (and re-init if scripts load out of order)
  function tryInit() {
    if (typeof THREE !== 'undefined' && THREE.OrbitControls) {
      init();
    } else {
      setTimeout(tryInit, 100);
    }
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    tryInit();
  } else {
    document.addEventListener('DOMContentLoaded', tryInit);
  }
})();
