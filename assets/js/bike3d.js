/* ============================================
   MaxRides — 3D bike viewer (v2: high-detail)
   Three.js scene with a detailed dirt-bike-style 3D model built
   from extruded shapes + tuned primitives. Per-bike proportions
   so the Super73 cruiser looks different from the Stark VARG.
   Drag/touch to rotate, scroll/pinch to zoom.
   Customizations (frame/plate/wheel rim) update materials live.
   ============================================ */

(function () {
  'use strict';

  var scene, camera, renderer, controls;
  var bikeGroup;
  // Customizable materials — exposed so the builder can change colors
  var frameMat, plateMat, wheelRimMat, sideShroudMat, seatMat;
  var initialized = false;
  var currentSlug = null;

  // Per-bike proportions and default frame color hint.
  // profile: 'dirt' | 'pro' (Stark VARG) | 'small' (ETM Lite) | 'cruiser' (Super73 / Onyx)
  var BIKE_PROFILES = {
    'sur-ron-light-bee-x':    { profile: 'dirt',   wheelR: 0.42, tireT: 0.10, wheelbase: 1.85, seatH: 1.18, frameAccent: '#E2E2E4' },
    'sur-ron-ultra-bee':      { profile: 'dirt',   wheelR: 0.46, tireT: 0.13, wheelbase: 1.95, seatH: 1.24, frameAccent: '#222226' },
    'talaria-sting-mx4':      { profile: 'dirt',   wheelR: 0.44, tireT: 0.11, wheelbase: 1.88, seatH: 1.20, frameAccent: '#1F4FAA' },
    'talaria-dragon':         { profile: 'dirt',   wheelR: 0.50, tireT: 0.13, wheelbase: 2.05, seatH: 1.30, frameAccent: '#1A1A1A' },
    'stark-varg':             { profile: 'pro',    wheelR: 0.52, tireT: 0.14, wheelbase: 2.10, seatH: 1.32, frameAccent: '#D11515' },
    'etm-rtr-xl':             { profile: 'dirt',   wheelR: 0.46, tireT: 0.12, wheelbase: 1.95, seatH: 1.24, frameAccent: '#F4F4F6' },
    'etm-rtr-sport':          { profile: 'dirt',   wheelR: 0.42, tireT: 0.10, wheelbase: 1.85, seatH: 1.18, frameAccent: '#F4F4F6' },
    'etm-rtr-lite':           { profile: 'small',  wheelR: 0.36, tireT: 0.09, wheelbase: 1.65, seatH: 1.05, frameAccent: '#F4F4F6' },
    'rawrr-mantis':           { profile: 'dirt',   wheelR: 0.42, tireT: 0.10, wheelbase: 1.82, seatH: 1.16, frameAccent: '#1A1A1A' },
    'super73-rx':             { profile: 'cruiser',wheelR: 0.40, tireT: 0.15, wheelbase: 1.70, seatH: 0.95, frameAccent: '#3A3A3A' },
    'super73-zx':             { profile: 'cruiser',wheelR: 0.36, tireT: 0.14, wheelbase: 1.55, seatH: 0.90, frameAccent: '#3A3A3A' },
    'onyx-rcr':               { profile: 'cruiser',wheelR: 0.42, tireT: 0.15, wheelbase: 1.78, seatH: 1.00, frameAccent: '#888888' },
    'super73-zx-le-speedway': { profile: 'cruiser',wheelR: 0.36, tireT: 0.14, wheelbase: 1.55, seatH: 0.90, frameAccent: '#1A1A1A' }
  };

  function init() {
    if (initialized) return;
    if (typeof THREE === 'undefined') {
      console.warn('[bike3d] THREE not loaded');
      return;
    }
    var container = document.getElementById('bike-3d-viewer');
    var canvas = document.getElementById('bike-3d-canvas');
    if (!container || !canvas) return;

    // Bail silently if the browser can't do WebGL — fallback message handles UX.
    try {
      var probe = document.createElement('canvas');
      if (!(probe.getContext('webgl') || probe.getContext('experimental-webgl'))) {
        document.documentElement.classList.add('no-webgl');
        return;
      }
    } catch (e) {
      document.documentElement.classList.add('no-webgl');
      return;
    }

    var w = container.clientWidth || 800;
    var h = container.clientHeight || 480;

    scene = new THREE.Scene();
    scene.background = null;

    camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(3.6, 1.6, 3.6);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas, antialias: true, alpha: true
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    if (renderer.physicallyCorrectLights !== undefined) renderer.physicallyCorrectLights = true;

    setupLights();
    setupShadowPlane();

    bikeGroup = new THREE.Group();
    scene.add(bikeGroup);
    buildBike('sur-ron-light-bee-x');

    controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(0, 0.75, 0);
    controls.enablePan = false;
    controls.zoomSpeed = 0.5;
    controls.minDistance = 2.6;
    controls.maxDistance = 7;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;

    canvas.addEventListener('pointerdown', function () {
      controls.autoRotate = false;
    }, { once: true });

    initialized = true;

    (function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', onResize);
  }

  function setupLights() {
    var ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    var key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4.5, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -3;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 25;
    key.shadow.bias = -0.0005;
    scene.add(key);

    var fill = new THREE.DirectionalLight(0xc8d5ff, 0.6);
    fill.position.set(-5, 5, -3);
    scene.add(fill);

    var rim = new THREE.DirectionalLight(0xfff0d6, 0.5);
    rim.position.set(0, 3, -6);
    scene.add(rim);
  }

  function setupShadowPlane() {
    var shadowGeom = new THREE.CircleGeometry(2.4, 64);
    var shadowMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    var shadowPlane = new THREE.Mesh(shadowGeom, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.005;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
  }

  // ==========================================================
  // BIKE CONSTRUCTION
  // ==========================================================

  function buildBike(slug) {
    // Wipe previous
    while (bikeGroup.children.length) {
      var c = bikeGroup.children.pop();
      c.traverse(function (n) {
        if (n.geometry) n.geometry.dispose();
        if (n.material) {
          if (Array.isArray(n.material)) n.material.forEach(function (m) { m.dispose(); });
          else n.material.dispose();
        }
      });
    }

    var P = BIKE_PROFILES[slug] || BIKE_PROFILES['sur-ron-light-bee-x'];
    currentSlug = slug;

    // ---- Shared materials (fresh per build so dispose() above is safe) ----
    frameMat       = new THREE.MeshStandardMaterial({ color: P.frameAccent, roughness: 0.28, metalness: 0.55 });
    sideShroudMat  = new THREE.MeshStandardMaterial({ color: P.frameAccent, roughness: 0.45, metalness: 0.15 });
    plateMat       = new THREE.MeshStandardMaterial({ color: 0xFF5A1F, roughness: 0.55, metalness: 0.02 });
    wheelRimMat    = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.35, metalness: 0.85 });
    seatMat        = new THREE.MeshStandardMaterial({ color: 0x0d0d10, roughness: 0.88, metalness: 0.02 });

    var tireMat       = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.95, metalness: 0.0 });
    var forkUpperMat  = new THREE.MeshStandardMaterial({ color: 0xE8C400, roughness: 0.18, metalness: 0.9 }); // gold stanchion
    var forkLowerMat  = new THREE.MeshStandardMaterial({ color: 0x2A2A30, roughness: 0.45, metalness: 0.7 });
    var motorMat      = new THREE.MeshStandardMaterial({ color: 0x36363c, roughness: 0.45, metalness: 0.75 });
    var rotorMat      = new THREE.MeshStandardMaterial({ color: 0xb0b0b8, roughness: 0.35, metalness: 0.95 });
    var hubMat        = new THREE.MeshStandardMaterial({ color: 0x1c1c20, roughness: 0.4,  metalness: 0.8 });
    var spokeMat      = new THREE.MeshStandardMaterial({ color: 0xd0d0d4, roughness: 0.35, metalness: 0.85 });
    var chromeMat     = new THREE.MeshStandardMaterial({ color: 0xc8c8cc, roughness: 0.18, metalness: 0.95 });
    var blackPlasticMat = new THREE.MeshStandardMaterial({ color: 0x0e0e10, roughness: 0.65, metalness: 0.0 });

    // Build wheels first (used by other parts to position)
    var halfWB = P.wheelbase / 2;
    var rearWheel = buildWheel(P.wheelR, P.tireT, tireMat, wheelRimMat, hubMat, spokeMat, rotorMat, P.profile);
    rearWheel.position.set(-halfWB, P.wheelR, 0);
    rearWheel.name = 'rearWheel';
    bikeGroup.add(rearWheel);
    var frontWheel = buildWheel(P.wheelR, P.tireT, tireMat, wheelRimMat, hubMat, spokeMat, rotorMat, P.profile);
    frontWheel.position.set(halfWB, P.wheelR, 0);
    frontWheel.name = 'frontWheel';
    bikeGroup.add(frontWheel);

    if (P.profile === 'cruiser') {
      buildCruiserBody(P, motorMat, blackPlasticMat, chromeMat);
    } else {
      buildDirtBody(P, motorMat, forkUpperMat, forkLowerMat, blackPlasticMat, chromeMat);
    }

    // Slight tilt forward so the bike looks dynamic, then center
    bikeGroup.rotation.y = 0;
    bikeGroup.position.set(0, 0, 0);
  }

  // ---- Wheel (rim + tire + hub + spokes + brake rotor) -------
  function buildWheel(radius, tireT, tireMat, rimMat, hubMat, spokeMat, rotorMat, profile) {
    var g = new THREE.Group();
    // Tire
    var tireGeom = new THREE.TorusGeometry(radius, tireT, 18, 50);
    var tire = new THREE.Mesh(tireGeom, tireMat);
    tire.rotation.y = Math.PI / 2;
    tire.castShadow = true;
    g.add(tire);

    // Knobby tire texture: add a ring of small bumps around the tire (for dirt)
    if (profile !== 'cruiser') {
      var knobGeom = new THREE.BoxGeometry(0.04, 0.04, 0.06);
      var knobs = 36;
      for (var i = 0; i < knobs; i++) {
        var theta = (i / knobs) * Math.PI * 2;
        var knob = new THREE.Mesh(knobGeom, tireMat);
        knob.position.set(Math.cos(theta) * (radius + tireT * 0.6), Math.sin(theta) * (radius + tireT * 0.6), 0);
        knob.rotation.x = theta;
        g.add(knob);
      }
    }

    // Rim (anodized aluminum)
    var rimGeom = new THREE.CylinderGeometry(radius - tireT * 0.4, radius - tireT * 0.4, tireT * 0.7, 36, 1, true);
    var rim = new THREE.Mesh(rimGeom, rimMat);
    rim.rotation.z = Math.PI / 2;
    g.add(rim);

    // Rim outer ring (closes the open cylinder visually)
    var rimRingGeom = new THREE.TorusGeometry(radius - tireT * 0.4, 0.018, 8, 36);
    var rimRing = new THREE.Mesh(rimRingGeom, rimMat);
    rimRing.rotation.y = Math.PI / 2;
    g.add(rimRing);

    // Hub
    var hubGeom = new THREE.CylinderGeometry(0.07, 0.07, tireT * 1.4, 16);
    var hub = new THREE.Mesh(hubGeom, hubMat);
    hub.rotation.z = Math.PI / 2;
    g.add(hub);

    // Brake rotor (front side)
    var rotorGeom = new THREE.CylinderGeometry(radius * 0.62, radius * 0.62, 0.008, 32);
    var rotor = new THREE.Mesh(rotorGeom, rotorMat);
    rotor.rotation.z = Math.PI / 2;
    rotor.position.x = tireT * 0.6;
    g.add(rotor);

    // Spokes — each spoke goes from hub edge to rim edge.
    // Wheel sits in XY plane (axle along Z) because we rotated the tire torus.
    // So we radiate spokes around Z axis.
    var spokeCount = 16;
    var hubR = 0.07;
    var rimR = radius - tireT * 0.5;
    var spokeLen = rimR - hubR;
    var spokeMid = (rimR + hubR) / 2;
    var spokeGeom = new THREE.CylinderGeometry(0.007, 0.007, spokeLen, 4);
    for (var s = 0; s < spokeCount; s++) {
      var theta = (s / spokeCount) * Math.PI * 2;
      var spokeMesh = new THREE.Mesh(spokeGeom, spokeMat);
      spokeMesh.position.y = spokeMid;
      var spokeGroup = new THREE.Group();
      spokeGroup.add(spokeMesh);
      spokeGroup.rotation.z = theta;
      g.add(spokeGroup);
    }

    return g;
  }

  // ---- DIRT BIKE BODY (Sur-Ron / Talaria / Stark / ETM / Rawrr) ----
  function buildDirtBody(P, motorMat, forkUpperMat, forkLowerMat, blackPlasticMat, chromeMat) {
    var halfWB = P.wheelbase / 2;
    var seatY = P.seatH;
    var motorY = P.wheelR + 0.06;

    // ---- Side shroud (curved profile via bezier) ----
    // X = front(+) to rear(-), Y = up. Bezier curves make it look like a real shroud.
    var shape = new THREE.Shape();
    shape.moveTo(0.92, 1.10);                              // front-top corner near fork crown
    shape.bezierCurveTo(0.95, 1.05, 0.90, 0.95, 0.80, 0.88); // curve down front
    shape.bezierCurveTo(0.70, 0.78, 0.55, 0.72, 0.40, 0.70); // along shroud bottom
    shape.bezierCurveTo(0.10, 0.66, -0.18, 0.68, -0.35, 0.78); // engine top + under-seat
    shape.bezierCurveTo(-0.55, 0.92, -0.75, seatY - 0.05, -0.95, seatY + 0.02); // rear tail rise
    shape.bezierCurveTo(-1.00, seatY + 0.10, -0.95, seatY + 0.10, -0.80, seatY + 0.05); // tail top
    shape.bezierCurveTo(-0.55, seatY + 0.06, -0.20, seatY + 0.05, 0.10, seatY - 0.04); // seat/tank top
    shape.bezierCurveTo(0.35, seatY - 0.12, 0.55, seatY - 0.14, 0.72, 1.20);  // tank into front shroud
    shape.bezierCurveTo(0.85, 1.25, 0.92, 1.18, 0.92, 1.10);   // close
    var extrudeSettings = {
      depth: 0.20,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.018,
      bevelThickness: 0.018,
      curveSegments: 28
    };

    function makeShroudSide(z) {
      var geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      var mesh = new THREE.Mesh(geom, sideShroudMat);
      mesh.position.z = z - extrudeSettings.depth / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }
    bikeGroup.add(makeShroudSide(0.20));
    bikeGroup.add(makeShroudSide(-0.20));

    // ---- Gas tank cap area (subtle dome on top of the tank) ----
    var tankCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.10, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1d, roughness: 0.4, metalness: 0.6 })
    );
    tankCap.position.set(0.38, seatY - 0.05, 0);
    bikeGroup.add(tankCap);

    // ---- Side number plates (one per side, slightly offset from shroud) ----
    var nplateShape = new THREE.Shape();
    nplateShape.moveTo(0, 0.13);
    nplateShape.bezierCurveTo(0.18, 0.15, 0.32, 0.10, 0.32, 0);
    nplateShape.bezierCurveTo(0.32, -0.10, 0.18, -0.15, 0, -0.13);
    nplateShape.bezierCurveTo(-0.18, -0.15, -0.32, -0.10, -0.32, 0);
    nplateShape.bezierCurveTo(-0.32, 0.10, -0.18, 0.15, 0, 0.13);
    var nplateGeom = new THREE.ExtrudeGeometry(nplateShape, {
      depth: 0.015, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005, curveSegments: 14
    });
    var nplateMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.45, metalness: 0.05 });
    for (var sn = -1; sn <= 1; sn += 2) {
      var np = new THREE.Mesh(nplateGeom, nplateMat);
      np.position.set(-0.55, seatY - 0.05, sn * 0.215);
      np.rotation.y = sn > 0 ? 0 : Math.PI;
      bikeGroup.add(np);
    }

    // Frame steel (tube structure under the shrouds, visible at edges)
    // Use cylinders to simulate steel tubes
    var tubeMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.5, metalness: 0.75 });
    function tube(x1, y1, x2, y2, r, z) {
      var dx = x2 - x1, dy = y2 - y1;
      var len = Math.hypot(dx, dy);
      var geom = new THREE.CylinderGeometry(r, r, len, 12);
      var m = new THREE.Mesh(geom, tubeMat);
      m.position.set((x1 + x2) / 2, (y1 + y2) / 2, z || 0);
      m.rotation.z = Math.atan2(dy, dx) - Math.PI / 2;
      m.castShadow = true;
      return m;
    }
    // Down tube (steering head to engine)
    bikeGroup.add(tube(0.85, 1.30, 0.40, 0.65, 0.025, 0));
    // Top tube (steering head to tank/seat)
    bikeGroup.add(tube(0.85, 1.30, 0.30, seatY + 0.02, 0.022, 0));
    // Subframe (tank to tail)
    bikeGroup.add(tube(0.30, seatY + 0.02, -0.85, seatY + 0.05, 0.022, 0));
    // Cradle to swingarm pivot
    bikeGroup.add(tube(-0.10, 0.55, -0.30, 0.55, 0.028, 0));

    // ---- Motor (cylinder block between wheels) ----
    var motorBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.28, 0.28),
      motorMat
    );
    motorBlock.position.set(0.0, motorY, 0);
    motorBlock.castShadow = true;
    bikeGroup.add(motorBlock);

    // Cooling fins on motor (5 thin discs)
    for (var f = 0; f < 5; f++) {
      var fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.40, 0.02, 0.30),
        chromeMat
      );
      fin.position.set(0.0, motorY - 0.13 + f * 0.06, 0);
      bikeGroup.add(fin);
    }

    // ---- Swingarm (rear wheel to pivot) ----
    var swingarmL = swingarm(-halfWB + 0.05, P.wheelR, -0.32, motorY - 0.05, 0.16);
    var swingarmR = swingarm(-halfWB + 0.05, P.wheelR, -0.32, motorY - 0.05, -0.16);
    bikeGroup.add(swingarmL, swingarmR);

    // ---- Rear shock (yellow, angled) ----
    var shock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.5, 14),
      new THREE.MeshStandardMaterial({ color: 0xeebd00, roughness: 0.3, metalness: 0.6 })
    );
    shock.position.set(-0.45, 0.85, 0);
    shock.rotation.z = -0.18;
    shock.castShadow = true;
    bikeGroup.add(shock);

    // ---- Front fork (USD style: gold uppers, black lowers, dual sides) ----
    var forkAngle = -0.18; // rake
    function makeFork(z) {
      var g = new THREE.Group();
      // Lower (thick, hugs the wheel)
      var lower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.45, 16),
        forkLowerMat
      );
      lower.position.y = P.wheelR + 0.22;
      lower.castShadow = true;
      g.add(lower);
      // Upper stanchion (thinner, slides into triple clamp)
      var upper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.030, 0.030, 0.55, 14),
        forkUpperMat
      );
      upper.position.y = P.wheelR + 0.7;
      upper.castShadow = true;
      g.add(upper);
      g.position.set(halfWB, 0, z);
      g.rotation.z = forkAngle;
      return g;
    }
    bikeGroup.add(makeFork(0.10));
    bikeGroup.add(makeFork(-0.10));

    // Triple clamp (upper + lower)
    var tcMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.35, metalness: 0.8 });
    var tcLower = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.045, 0.32),
      tcMat
    );
    tcLower.position.set(halfWB + 0.07, P.wheelR + 1.0, 0);
    tcLower.rotation.z = forkAngle;
    bikeGroup.add(tcLower);
    var tcUpper = tcLower.clone();
    tcUpper.position.y = P.wheelR + 1.12;
    bikeGroup.add(tcUpper);

    // ---- Handlebar ----
    var hbarMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1d, roughness: 0.5, metalness: 0.75 });
    var hbar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.65, 14),
      hbarMat
    );
    hbar.position.set(halfWB - 0.05, P.wheelR + 1.22, 0);
    hbar.rotation.x = Math.PI / 2;
    hbar.rotation.z = -0.08;
    bikeGroup.add(hbar);
    // Stem
    var stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.15, 10),
      hbarMat
    );
    stem.position.set(halfWB - 0.02, P.wheelR + 1.16, 0);
    stem.rotation.z = forkAngle;
    bikeGroup.add(stem);

    // Grips
    var gripMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.88, metalness: 0.0 });
    for (var sign = -1; sign <= 1; sign += 2) {
      var grip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.034, 0.12, 14),
        gripMat
      );
      grip.position.set(halfWB - 0.05, P.wheelR + 1.22, sign * 0.30);
      grip.rotation.x = Math.PI / 2;
      bikeGroup.add(grip);
    }

    // ---- Headlight (round pod) ----
    var headlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.095, 18, 14, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xfff8dc, roughness: 0.25, metalness: 0.05, emissive: 0x2a2818, emissiveIntensity: 0.25 })
    );
    headlight.position.set(halfWB + 0.08, P.wheelR + 0.95, 0);
    headlight.rotation.y = -Math.PI / 2 + forkAngle;
    bikeGroup.add(headlight);

    // Headlight bezel
    var bezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.10, 0.012, 8, 24),
      tubeMat
    );
    bezel.position.copy(headlight.position);
    bezel.position.x -= 0.02;
    bezel.rotation.y = Math.PI / 2;
    bikeGroup.add(bezel);

    // ---- Front plate (the ODI plate Max wanted) ----
    var plateShape = new THREE.Shape();
    plateShape.moveTo(0, 0.15);
    plateShape.lineTo(0.10, 0.16);
    plateShape.lineTo(0.12, 0);
    plateShape.lineTo(0.10, -0.16);
    plateShape.lineTo(0, -0.18);
    plateShape.lineTo(-0.10, -0.16);
    plateShape.lineTo(-0.12, 0);
    plateShape.lineTo(-0.10, 0.16);
    plateShape.lineTo(0, 0.15);
    var plateGeom = new THREE.ExtrudeGeometry(plateShape, {
      depth: 0.025, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 1, curveSegments: 8
    });
    var plate = new THREE.Mesh(plateGeom, plateMat);
    plate.position.set(halfWB + 0.14, P.wheelR + 0.78, 0);
    plate.rotation.y = Math.PI / 2;
    plate.rotation.z = forkAngle;
    plate.castShadow = true;
    plate.name = 'plate';
    bikeGroup.add(plate);

    // ---- Seat (curved, slim moto) ----
    var seatShape = new THREE.Shape();
    seatShape.moveTo(-0.45, 0.0);
    seatShape.bezierCurveTo(-0.40, 0.06, 0.20, 0.08, 0.42, 0.02);
    seatShape.lineTo(0.42, -0.04);
    seatShape.bezierCurveTo(0.20, -0.02, -0.40, -0.02, -0.45, 0.0);
    var seatGeom = new THREE.ExtrudeGeometry(seatShape, {
      depth: 0.18, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2, curveSegments: 14
    });
    var seat = new THREE.Mesh(seatGeom, seatMat);
    seat.position.set(-0.20, seatY + 0.08, -0.09);
    seat.castShadow = true;
    bikeGroup.add(seat);

    // ---- Rear fender ----
    var rfShape = new THREE.Shape();
    rfShape.moveTo(0, 0);
    rfShape.lineTo(0.35, 0.02);
    rfShape.lineTo(0.4, -0.05);
    rfShape.lineTo(0.0, -0.04);
    rfShape.lineTo(0, 0);
    var rfGeom = new THREE.ExtrudeGeometry(rfShape, { depth: 0.20, bevelEnabled: false });
    var rearFender = new THREE.Mesh(rfGeom, sideShroudMat);
    rearFender.position.set(-1.10, seatY + 0.0, -0.10);
    rearFender.name = 'rearFender';
    bikeGroup.add(rearFender);

    // Front fender (small curved guard over front wheel)
    var ff = new THREE.Mesh(
      new THREE.TorusGeometry(P.wheelR + 0.05, 0.04, 8, 20, Math.PI * 0.7),
      sideShroudMat
    );
    ff.position.set(halfWB, P.wheelR + 0.06, 0);
    ff.rotation.set(Math.PI / 2, Math.PI / 2, 0.5);
    ff.castShadow = true;
    bikeGroup.add(ff);

    // ---- Brake caliper (red) on front fork lower ----
    var caliperMat = new THREE.MeshStandardMaterial({ color: 0xc81a1a, roughness: 0.4, metalness: 0.55 });
    var caliper = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 0.06),
      caliperMat
    );
    caliper.position.set(halfWB + 0.10, P.wheelR + 0.05, 0.13);
    caliper.castShadow = true;
    bikeGroup.add(caliper);

    // ---- Rear sprocket (visible behind rear wheel) ----
    var sprocketMat = new THREE.MeshStandardMaterial({ color: 0xaaaab0, roughness: 0.3, metalness: 0.92 });
    var sprocket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.012, 28),
      sprocketMat
    );
    sprocket.position.set(-halfWB, P.wheelR, -0.13);
    sprocket.rotation.x = Math.PI / 2;
    bikeGroup.add(sprocket);
    // Sprocket teeth (thin radial bars)
    var teethGeom = new THREE.BoxGeometry(0.02, 0.012, 0.025);
    for (var ti = 0; ti < 14; ti++) {
      var tooth = new THREE.Mesh(teethGeom, sprocketMat);
      var ta = (ti / 14) * Math.PI * 2;
      tooth.position.set(-halfWB + Math.cos(ta) * 0.13, P.wheelR + Math.sin(ta) * 0.13, -0.13);
      tooth.rotation.z = ta;
      bikeGroup.add(tooth);
    }

    // ---- Engine sprocket (smaller, near motor) ----
    var eSprocket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.014, 18),
      sprocketMat
    );
    eSprocket.position.set(-0.08, motorY, -0.13);
    eSprocket.rotation.x = Math.PI / 2;
    bikeGroup.add(eSprocket);

    // ---- Chain (a series of small dark cylinders along the chainline) ----
    // Top run: from engine sprocket to rear sprocket
    var chainMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1d, roughness: 0.55, metalness: 0.7 });
    function chainSegment(x1, y1, x2, y2, z) {
      var dx = x2 - x1, dy = y2 - y1;
      var len = Math.hypot(dx, dy);
      var geom = new THREE.CylinderGeometry(0.012, 0.012, len, 6);
      var m = new THREE.Mesh(geom, chainMat);
      m.position.set((x1 + x2) / 2, (y1 + y2) / 2, z);
      m.rotation.z = Math.atan2(dy, dx) - Math.PI / 2;
      return m;
    }
    bikeGroup.add(chainSegment(-0.08, motorY + 0.05, -halfWB, P.wheelR + 0.12, -0.13)); // top run
    bikeGroup.add(chainSegment(-0.08, motorY - 0.05, -halfWB, P.wheelR - 0.12, -0.13)); // bottom run

    // ---- Foot pegs (small platforms either side of motor) ----
    var pegMat = new THREE.MeshStandardMaterial({ color: 0x44444a, roughness: 0.5, metalness: 0.85 });
    for (var sp = -1; sp <= 1; sp += 2) {
      var peg = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.025, 0.05),
        pegMat
      );
      peg.position.set(-0.05, motorY - 0.18, sp * 0.25);
      peg.castShadow = true;
      bikeGroup.add(peg);
    }

    // ---- Brake pedal + shift lever ----
    var bpMat = new THREE.MeshStandardMaterial({ color: 0x9a9a9e, roughness: 0.35, metalness: 0.85 });
    var brakePedal = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.014, 0.014),
      bpMat
    );
    brakePedal.position.set(0.06, motorY - 0.20, 0.22);
    bikeGroup.add(brakePedal);
    var shiftLever = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.012, 0.012),
      bpMat
    );
    shiftLever.position.set(0.04, motorY - 0.20, -0.22);
    bikeGroup.add(shiftLever);

    // ---- Bar pad (foam piece across the handlebars) ----
    var barPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.06, 0.34),
      new THREE.MeshStandardMaterial({ color: 0xc81a1a, roughness: 0.85 })
    );
    barPad.position.set(halfWB - 0.05, P.wheelR + 1.24, 0);
    bikeGroup.add(barPad);

    // ---- Brake / clutch levers ----
    var leverMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c4, roughness: 0.25, metalness: 0.9 });
    for (var lv = -1; lv <= 1; lv += 2) {
      var lever = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.012, 0.012),
        leverMat
      );
      lever.position.set(halfWB - 0.10, P.wheelR + 1.22, lv * 0.24);
      lever.rotation.z = -0.2;
      bikeGroup.add(lever);
    }

    // ---- Kickstand (a small foot down-left from motor) ----
    var kick = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.20, 0.025),
      pegMat
    );
    kick.position.set(-0.18, motorY - 0.30, 0.20);
    kick.rotation.z = 0.35;
    bikeGroup.add(kick);

    // ---- Front axle (visible at wheel center) ----
    var axleMat = new THREE.MeshStandardMaterial({ color: 0x88888c, roughness: 0.3, metalness: 0.9 });
    var frontAxle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.28, 12),
      axleMat
    );
    frontAxle.position.set(halfWB, P.wheelR, 0);
    frontAxle.rotation.x = Math.PI / 2;
    bikeGroup.add(frontAxle);
    var rearAxle = frontAxle.clone();
    rearAxle.position.x = -halfWB;
    bikeGroup.add(rearAxle);

    // ---- Bash plate (skid plate under engine) ----
    var bashGeom = new THREE.BoxGeometry(0.48, 0.025, 0.30);
    var bash = new THREE.Mesh(bashGeom, new THREE.MeshStandardMaterial({ color: 0x1a1a1d, roughness: 0.5, metalness: 0.7 }));
    bash.position.set(0.0, motorY - 0.25, 0);
    bash.castShadow = true;
    bikeGroup.add(bash);
  }

  // ---- CRUISER BODY (Super73 / Onyx) -- low long frame, fat tires ----
  function buildCruiserBody(P, motorMat, blackPlasticMat, chromeMat) {
    var halfWB = P.wheelbase / 2;
    var seatY = P.seatH;
    var lowFrameY = P.wheelR + 0.10;

    // Banana seat — wide flat, runs almost full length
    var seatShape = new THREE.Shape();
    seatShape.moveTo(-halfWB + 0.20, 0.0);
    seatShape.bezierCurveTo(-halfWB + 0.10, 0.08, 0.50, 0.10, halfWB - 0.20, 0.04);
    seatShape.lineTo(halfWB - 0.20, -0.05);
    seatShape.bezierCurveTo(0.50, -0.02, -halfWB + 0.10, -0.02, -halfWB + 0.20, 0.0);
    var seatGeom = new THREE.ExtrudeGeometry(seatShape, {
      depth: 0.24, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2, curveSegments: 14
    });
    var seat = new THREE.Mesh(seatGeom, seatMat);
    seat.position.set(0, seatY + 0.0, -0.12);
    seat.castShadow = true;
    bikeGroup.add(seat);

    // Down-tube + cradle (single low loop)
    var tubeMat = new THREE.MeshStandardMaterial({ color: P.frameAccent, roughness: 0.35, metalness: 0.6 });
    function tube(x1, y1, x2, y2, r, z) {
      var dx = x2 - x1, dy = y2 - y1;
      var len = Math.hypot(dx, dy);
      var geom = new THREE.CylinderGeometry(r, r, len, 14);
      var m = new THREE.Mesh(geom, tubeMat);
      m.position.set((x1 + x2) / 2, (y1 + y2) / 2, z || 0);
      m.rotation.z = Math.atan2(dy, dx) - Math.PI / 2;
      m.castShadow = true;
      return m;
    }
    // Top tube along seat
    bikeGroup.add(tube(-halfWB + 0.25, seatY - 0.03, halfWB - 0.20, seatY - 0.03, 0.045, 0));
    // Down tube to front
    bikeGroup.add(tube(halfWB - 0.20, seatY - 0.03, halfWB - 0.10, P.wheelR + 0.20, 0.040, 0));
    // Bottom (engine cradle)
    bikeGroup.add(tube(-halfWB + 0.30, P.wheelR + 0.04, halfWB - 0.10, P.wheelR + 0.20, 0.040, 0));

    // Battery box (large, hidden under seat) — Super73 signature visible look
    var battery = new THREE.Mesh(
      new THREE.BoxGeometry(0.70, 0.22, 0.30),
      blackPlasticMat
    );
    battery.position.set(0.10, seatY - 0.18, 0);
    battery.castShadow = true;
    bikeGroup.add(battery);

    // ---- Single Springer-style front fork (cruiser) ----
    var forkMat = new THREE.MeshStandardMaterial({ color: 0x2A2A2E, roughness: 0.4, metalness: 0.7 });
    function makeCruiserFork(z) {
      var g = new THREE.Group();
      var leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.95, 14),
        forkMat
      );
      leg.position.y = P.wheelR + 0.5;
      leg.castShadow = true;
      g.add(leg);
      g.position.set(halfWB, 0, z);
      g.rotation.z = -0.12;
      return g;
    }
    bikeGroup.add(makeCruiserFork(0.08));
    bikeGroup.add(makeCruiserFork(-0.08));

    // Handlebar (cruiser/bmx high rise)
    var hbarMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1d, roughness: 0.5, metalness: 0.75 });
    var hbar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.65, 14),
      hbarMat
    );
    hbar.position.set(halfWB - 0.08, P.wheelR + 1.1, 0);
    hbar.rotation.x = Math.PI / 2;
    bikeGroup.add(hbar);
    var hbarRise = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.22, 10),
      hbarMat
    );
    hbarRise.position.set(halfWB - 0.05, P.wheelR + 0.98, 0);
    bikeGroup.add(hbarRise);

    // Grips
    var gripMat = new THREE.MeshStandardMaterial({ color: 0x6b3a1a, roughness: 0.7 }); // brown grips
    for (var sign = -1; sign <= 1; sign += 2) {
      var grip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.034, 0.12, 14),
        gripMat
      );
      grip.position.set(halfWB - 0.08, P.wheelR + 1.1, sign * 0.30);
      grip.rotation.x = Math.PI / 2;
      bikeGroup.add(grip);
    }

    // ---- Big round headlight (cruiser signature) ----
    var headlight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24),
      new THREE.MeshStandardMaterial({ color: 0xfff8dc, roughness: 0.25, metalness: 0.05, emissive: 0x2a2818, emissiveIntensity: 0.25 })
    );
    headlight.position.set(halfWB + 0.06, P.wheelR + 0.85, 0);
    headlight.rotation.z = Math.PI / 2;
    bikeGroup.add(headlight);

    // Number plate (just as small front graphic)
    var plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.20, 0.22),
      plateMat
    );
    plate.position.set(halfWB + 0.04, P.wheelR + 0.60, 0);
    plate.castShadow = true;
    plate.name = 'plate';
    bikeGroup.add(plate);

    // Pedals + crank (cruiser/moped has them)
    var crankMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.5, metalness: 0.7 });
    var crank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16),
      crankMat
    );
    crank.position.set(0, P.wheelR + 0.04, 0);
    crank.rotation.x = Math.PI / 2;
    bikeGroup.add(crank);
  }

  // Swingarm helper
  function swingarm(x1, y1, x2, y2, z) {
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.hypot(dx, dy);
    var geom = new THREE.CylinderGeometry(0.035, 0.045, len, 12);
    var mat = new THREE.MeshStandardMaterial({ color: 0xa0a0a4, roughness: 0.25, metalness: 0.85 });
    var m = new THREE.Mesh(geom, mat);
    m.position.set((x1 + x2) / 2, (y1 + y2) / 2, z);
    m.rotation.z = Math.atan2(dy, dx) - Math.PI / 2;
    m.castShadow = true;
    return m;
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

  // ==========================================================
  // PUBLIC API
  // ==========================================================
  window.bike3d = {
    init: init,
    isReady: function () { return initialized; },

    setFrameColor: function (hex) {
      if (!hex) return;
      try {
        if (frameMat) frameMat.color.set(hex);
        if (sideShroudMat) sideShroudMat.color.set(hex);
      } catch (e) {}
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
      if (!initialized || slug === currentSlug) return;
      buildBike(slug);
    },

    resize: onResize
  };

  // Lazy init once Three.js + OrbitControls are ready
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
