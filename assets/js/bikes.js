/* ============================================
   MaxRides — Bike SVG renderers
   Three bike silhouettes drawn as SVG. Each accepts an accent color
   so the Builder can swap colors live. These are placeholders that
   stand in for real product photography while it's being produced.
   ============================================ */

(function () {
  'use strict';

  // Render the Dirt 01 — aggressive moto-style electric dirt bike
  // (Sur-Ron / Talaria silhouette).
  function dirt01(accent) {
    accent = accent || '#FF5A1F';
    return [
      '<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MaxRides Dirt 01 e-dirt bike">',
        // ground shadow
        '<ellipse cx="240" cy="195" rx="200" ry="8" fill="rgba(0,0,0,0.6)"/>',

        // rear wheel
        '<g transform="translate(82,150)">',
          '<circle r="48" fill="#0F0F0F" stroke="#262626" stroke-width="2"/>',
          '<circle r="36" fill="none" stroke="#1A1A1A" stroke-width="1"/>',
          '<circle r="16" fill="#0A0A0A" stroke="#333" stroke-width="1.5"/>',
          '<circle r="6" fill="#1F1F1F"/>',
          // spoke hints
          '<line x1="-30" y1="0" x2="-14" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="14" y1="0" x2="30" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="-30" x2="0" y2="-14" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="14" x2="0" y2="30" stroke="#222" stroke-width="1"/>',
          '<line x1="-21" y1="-21" x2="-10" y2="-10" stroke="#222" stroke-width="1"/>',
          '<line x1="21" y1="-21" x2="10" y2="-10" stroke="#222" stroke-width="1"/>',
          '<line x1="-21" y1="21" x2="-10" y2="10" stroke="#222" stroke-width="1"/>',
          '<line x1="21" y1="21" x2="10" y2="10" stroke="#222" stroke-width="1"/>',
        '</g>',

        // front wheel
        '<g transform="translate(398,150)">',
          '<circle r="48" fill="#0F0F0F" stroke="#262626" stroke-width="2"/>',
          '<circle r="36" fill="none" stroke="#1A1A1A" stroke-width="1"/>',
          '<circle r="16" fill="#0A0A0A" stroke="#333" stroke-width="1.5"/>',
          '<circle r="6" fill="#1F1F1F"/>',
          '<line x1="-30" y1="0" x2="-14" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="14" y1="0" x2="30" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="-30" x2="0" y2="-14" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="14" x2="0" y2="30" stroke="#222" stroke-width="1"/>',
          '<line x1="-21" y1="-21" x2="-10" y2="-10" stroke="#222" stroke-width="1"/>',
          '<line x1="21" y1="-21" x2="10" y2="-10" stroke="#222" stroke-width="1"/>',
          '<line x1="-21" y1="21" x2="-10" y2="10" stroke="#222" stroke-width="1"/>',
          '<line x1="21" y1="21" x2="10" y2="10" stroke="#222" stroke-width="1"/>',
        '</g>',

        // rear swingarm + chain hint
        '<path d="M 82 150 L 175 142 L 200 110" stroke="#2C2C2C" stroke-width="6" stroke-linecap="round" fill="none"/>',

        // motor housing (between cranks)
        '<rect x="165" y="120" width="44" height="36" rx="8" fill="#1A1A1A" stroke="#333" stroke-width="1.2"/>',
        '<circle cx="187" cy="138" r="11" fill="#0F0F0F" stroke="#3A3A3A" stroke-width="1"/>',

        // main frame triangle (battery section) — accent
        '<path d="M 200 110 L 305 70 L 320 130 L 215 145 Z" fill="' + accent + '"/>',
        // battery cell hint
        '<line x1="220" y1="120" x2="300" y2="93" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>',

        // upper frame to head tube
        '<path d="M 305 70 L 360 78 L 358 96 L 308 90 Z" fill="#181818" stroke="' + accent + '" stroke-width="1.4"/>',

        // tall slim moto seat
        '<path d="M 235 64 L 318 60 L 332 80 L 235 86 Z" fill="#181818" stroke="' + accent + '" stroke-width="1.2"/>',
        // ribbed seat texture
        '<line x1="248" y1="68" x2="248" y2="80" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="263" y1="66" x2="263" y2="80" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="278" y1="65" x2="278" y2="80" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="293" y1="64" x2="293" y2="80" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="308" y1="63" x2="308" y2="80" stroke="#2A2A2A" stroke-width="1"/>',

        // rear fender
        '<path d="M 60 132 L 130 120 L 145 130 L 75 152 Z" fill="#161616" stroke="#2A2A2A" stroke-width="1"/>',

        // upside-down fork
        '<line x1="398" y1="150" x2="368" y2="58" stroke="#3F3F3F" stroke-width="7" stroke-linecap="round"/>',
        '<line x1="398" y1="150" x2="368" y2="58" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>',
        // fork crown
        '<rect x="350" y="56" width="36" height="14" rx="3" fill="#1A1A1A" stroke="#333" stroke-width="1"/>',

        // handlebars
        '<line x1="368" y1="58" x2="350" y2="32" stroke="' + accent + '" stroke-width="4.5" stroke-linecap="round"/>',
        '<line x1="368" y1="58" x2="395" y2="44" stroke="' + accent + '" stroke-width="4.5" stroke-linecap="round"/>',
        '<circle cx="348" cy="32" r="3.5" fill="#0A0A0A" stroke="' + accent + '" stroke-width="1.2"/>',
        '<circle cx="397" cy="44" r="3.5" fill="#0A0A0A" stroke="' + accent + '" stroke-width="1.2"/>',

        // headlight pod
        '<path d="M 358 74 L 384 64 L 388 88 L 362 92 Z" fill="#0A0A0A" stroke="#2A2A2A" stroke-width="1"/>',
        '<rect x="365" y="73" width="18" height="10" rx="2" fill="' + accent + '" opacity="0.85"/>',

        // ODI front number plate
        '<rect x="316" y="86" width="38" height="36" rx="6" fill="' + accent + '" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>',
        '<text x="335" y="110" text-anchor="middle" font-family="-apple-system, system-ui" font-size="18" font-weight="600" fill="#0A0A0A">01</text>',

      '</svg>'
    ].join('');
  }

  // Render the Cruiser — Super73-style low long e-cruiser
  // Fat tires, banana seat, low frame, retro-moto vibe.
  function cruiser(accent) {
    accent = accent || '#FF5A1F';
    return [
      '<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MaxRides Cruiser e-bike">',

        '<ellipse cx="240" cy="195" rx="200" ry="8" fill="rgba(0,0,0,0.6)"/>',

        // big rear fat tire
        '<g transform="translate(95,148)">',
          '<circle r="58" fill="#0E0E0E" stroke="#222" stroke-width="2"/>',
          '<circle r="44" fill="none" stroke="#1A1A1A" stroke-width="1"/>',
          '<circle r="22" fill="#1A1A1A" stroke="#333" stroke-width="1.5"/>',
          '<circle r="8" fill="#0A0A0A"/>',
          '<line x1="-36" y1="0" x2="-18" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="18" y1="0" x2="36" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="-36" x2="0" y2="-18" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="18" x2="0" y2="36" stroke="#222" stroke-width="1"/>',
        '</g>',

        // big front fat tire
        '<g transform="translate(385,148)">',
          '<circle r="58" fill="#0E0E0E" stroke="#222" stroke-width="2"/>',
          '<circle r="44" fill="none" stroke="#1A1A1A" stroke-width="1"/>',
          '<circle r="22" fill="#1A1A1A" stroke="#333" stroke-width="1.5"/>',
          '<circle r="8" fill="#0A0A0A"/>',
          '<line x1="-36" y1="0" x2="-18" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="18" y1="0" x2="36" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="-36" x2="0" y2="-18" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="18" x2="0" y2="36" stroke="#222" stroke-width="1"/>',
        '</g>',

        // low frame (down tube + main beam)
        '<path d="M 130 138 L 240 96 L 350 138 L 320 152 L 240 116 L 160 152 Z" fill="' + accent + '"/>',
        '<line x1="130" y1="138" x2="350" y2="138" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>',

        // banana seat
        '<path d="M 150 90 L 295 78 L 305 102 L 145 110 Z" fill="#161616" stroke="' + accent + '" stroke-width="1.4"/>',
        '<line x1="160" y1="92" x2="160" y2="106" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="180" y1="89" x2="180" y2="106" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="200" y1="86" x2="200" y2="106" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="220" y1="83" x2="220" y2="106" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="240" y1="81" x2="240" y2="106" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="260" y1="79" x2="260" y2="106" stroke="#2A2A2A" stroke-width="1"/>',
        '<line x1="280" y1="78" x2="280" y2="106" stroke="#2A2A2A" stroke-width="1"/>',

        // rider grip / bars
        '<line x1="350" y1="100" x2="360" y2="48" stroke="#3A3A3A" stroke-width="6" stroke-linecap="round"/>',
        '<line x1="360" y1="48" x2="345" y2="32" stroke="' + accent + '" stroke-width="4.5" stroke-linecap="round"/>',
        '<line x1="360" y1="48" x2="390" y2="44" stroke="' + accent + '" stroke-width="4.5" stroke-linecap="round"/>',
        '<circle cx="343" cy="32" r="3.5" fill="#0A0A0A" stroke="' + accent + '" stroke-width="1.2"/>',
        '<circle cx="392" cy="44" r="3.5" fill="#0A0A0A" stroke="' + accent + '" stroke-width="1.2"/>',

        // big headlight
        '<circle cx="370" cy="88" r="14" fill="#161616" stroke="' + accent + '" stroke-width="2"/>',
        '<circle cx="370" cy="88" r="7" fill="' + accent + '"/>',

        // bash plate / front number
        '<rect x="312" y="100" width="36" height="34" rx="6" fill="' + accent + '" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>',
        '<text x="330" y="123" text-anchor="middle" font-family="-apple-system, system-ui" font-size="18" font-weight="600" fill="#0A0A0A">73</text>',

      '</svg>'
    ].join('');
  }

  // Render the Starter — smaller, simpler e-bike (Rad-style entry).
  function starter(accent) {
    accent = accent || '#FF5A1F';
    return [
      '<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MaxRides Starter e-bike">',

        '<ellipse cx="240" cy="195" rx="180" ry="7" fill="rgba(0,0,0,0.6)"/>',

        // smaller rear wheel
        '<g transform="translate(110,155)">',
          '<circle r="40" fill="#0F0F0F" stroke="#222" stroke-width="2"/>',
          '<circle r="30" fill="none" stroke="#1A1A1A" stroke-width="1"/>',
          '<circle r="14" fill="#0A0A0A" stroke="#333" stroke-width="1.5"/>',
          '<circle r="5" fill="#1F1F1F"/>',
          '<line x1="-24" y1="0" x2="-12" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="12" y1="0" x2="24" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="-24" x2="0" y2="-12" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="12" x2="0" y2="24" stroke="#222" stroke-width="1"/>',
        '</g>',

        // smaller front wheel
        '<g transform="translate(370,155)">',
          '<circle r="40" fill="#0F0F0F" stroke="#222" stroke-width="2"/>',
          '<circle r="30" fill="none" stroke="#1A1A1A" stroke-width="1"/>',
          '<circle r="14" fill="#0A0A0A" stroke="#333" stroke-width="1.5"/>',
          '<circle r="5" fill="#1F1F1F"/>',
          '<line x1="-24" y1="0" x2="-12" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="12" y1="0" x2="24" y2="0" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="-24" x2="0" y2="-12" stroke="#222" stroke-width="1"/>',
          '<line x1="0" y1="12" x2="0" y2="24" stroke="#222" stroke-width="1"/>',
        '</g>',

        // simpler triangle frame
        '<path d="M 140 150 L 240 96 L 320 140 L 280 156 L 240 116 L 175 158 Z" fill="' + accent + '"/>',

        // commuter seat (slimmer)
        '<path d="M 200 88 L 286 84 L 296 100 L 200 104 Z" fill="#161616" stroke="' + accent + '" stroke-width="1.2"/>',

        // upright handlebar post
        '<line x1="320" y1="120" x2="330" y2="48" stroke="#3A3A3A" stroke-width="5" stroke-linecap="round"/>',
        '<line x1="330" y1="48" x2="313" y2="32" stroke="' + accent + '" stroke-width="4" stroke-linecap="round"/>',
        '<line x1="330" y1="48" x2="358" y2="40" stroke="' + accent + '" stroke-width="4" stroke-linecap="round"/>',
        '<circle cx="311" cy="32" r="3" fill="#0A0A0A" stroke="' + accent + '" stroke-width="1.2"/>',
        '<circle cx="360" cy="40" r="3" fill="#0A0A0A" stroke="' + accent + '" stroke-width="1.2"/>',

        // integrated headlight
        '<rect x="340" y="92" width="20" height="14" rx="3" fill="' + accent + '"/>',

        // front number/plate
        '<rect x="288" y="108" width="32" height="30" rx="5" fill="' + accent + '" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>',
        '<text x="304" y="129" text-anchor="middle" font-family="-apple-system, system-ui" font-size="16" font-weight="600" fill="#0A0A0A">M</text>',

      '</svg>'
    ].join('');
  }

  window.BIKE_SVG = {
    'dirt-01': dirt01,
    'cruiser': cruiser,
    'starter': starter
  };

  // Helper: inject a bike SVG into a target element with optional accent color
  window.renderBike = function (selector, bikeSlug, accent) {
    var el = (typeof selector === 'string')
      ? document.querySelector(selector)
      : selector;
    if (!el || !window.BIKE_SVG[bikeSlug]) return;
    el.innerHTML = window.BIKE_SVG[bikeSlug](accent);
  };
})();
