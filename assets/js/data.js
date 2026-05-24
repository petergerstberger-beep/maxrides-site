/* ============================================
   MaxRides — Product & content data
   Single source of truth for bikes, builder components,
   mock rides feed, and reviews. All accessory picks
   refreshed against 2025–2026 community consensus.
   ============================================ */

(function () {
  'use strict';

  // ----- Bikes ----------------------------------------------------

  var BIKES = [
    {
      slug: 'dirt-01',
      label: '01 · DIRT',
      name: 'The Dirt 01',
      tagline: 'Built for the trail.',
      heroCopy: 'Sur-Ron silhouette. MaxRides finish. Built to disappear into the dirt and reappear on every feed.',
      basePrice: 2499,
      rating: 4.9,
      reviewCount: 487,
      specs: {
        topSpeed: '38 mph',
        range: '40 mi (stock)',
        motor: '6,000 W mid-drive',
        weight: '110 lb',
        battery: '60V 32Ah Li-ion',
        suspension: 'FastAce-tuned'
      }
    },
    {
      slug: 'cruiser',
      label: '02 · CRUISER',
      name: 'The Cruiser',
      tagline: 'Made for the streets.',
      heroCopy: 'Long, low, banana-seated. Made to roll up to school and have everyone ask what it is.',
      basePrice: 1899,
      rating: 4.8,
      reviewCount: 412,
      specs: {
        topSpeed: '28 mph',
        range: '45 mi (stock)',
        motor: '1,200 W rear hub',
        weight: '82 lb',
        battery: '52V 20Ah Li-ion',
        suspension: 'Front telescopic'
      }
    },
    {
      slug: 'starter',
      label: '03 · STARTER',
      name: 'The Starter',
      tagline: 'Every kid’s first ride.',
      heroCopy: 'Smaller frame, lower top speed, same MaxRides DNA. The bike a younger sibling actually gets to keep.',
      basePrice: 999,
      rating: 4.7,
      reviewCount: 344,
      specs: {
        topSpeed: '20 mph',
        range: '30 mi (stock)',
        motor: '500 W rear hub',
        weight: '54 lb',
        battery: '48V 14Ah Li-ion',
        suspension: 'Front fork only'
      }
    }
  ];

  // ----- Frame colors (used by Builder #01) -----------------------

  var FRAME_COLORS = [
    { id: 'gloss-orange', name: 'Gloss orange', hex: '#FF5A1F', priceDelta: 0 },
    { id: 'jet-black',    name: 'Jet black',    hex: '#0A0A0A', priceDelta: 0 },
    { id: 'arctic-white', name: 'Arctic white', hex: '#FFFFFF', priceDelta: 0 },
    { id: 'acid-lime',    name: 'Acid lime',    hex: '#C8FF00', priceDelta: 60 },
    { id: 'royal-purple', name: 'Royal purple', hex: '#5A2DDD', priceDelta: 60 },
    { id: 'race-red',     name: 'Race red',     hex: '#D11515', priceDelta: 60 }
  ];

  // ----- Builder component categories -----------------------------
  //
  // Each option carries a `specs` object — a spec sheet rendered inline
  // in the option card to communicate the "this is real gear" quality bar.
  // Prices in USD. `applicableBikes` filters category options per bike.

  var COMPONENT_CATEGORIES = [
    // 01 · Frame color is handled separately (FRAME_COLORS) but kept in count.
    {
      id: 'finish',
      number: '02',
      title: 'Finish',
      blurb: 'Premium full-bike treatments that change everything.',
      options: [
        { id: 'gloss-standard', name: 'Standard gloss', brand: 'MaxRides',
          priceDelta: 0, summary: 'Factory clear coat over your frame color.',
          specs: { finish: 'PPG gloss clear', uv: 'UV-stable', layers: '3-coat base + clear', warranty: '2 yr color' } },
        { id: 'matte-clear', name: 'Matte clear', brand: 'MaxRides',
          priceDelta: 280, summary: 'Stealth flat finish, very Sur-Ron tuner.',
          specs: { finish: 'PPG matte clear', sheen: '15% gloss', layers: '3-coat + matte clear', warranty: '2 yr color' } },
        { id: 'carbon-wrap', name: 'Forged carbon wrap', brand: 'REV797',
          priceDelta: 680, summary: 'F1 / supercar carbon texture, pre-cut per panel.',
          specs: { material: '3M 2080 carbon vinyl', cut: 'Pre-cut templates', install: 'Heat-bonded', removal: 'Peel-clean to 5 yr' } },
        { id: 'color-shift', name: 'Color-shift chameleon', brand: 'Inozetek',
          priceDelta: 1200, summary: 'Shifts color through the spectrum as you ride.',
          specs: { material: 'Inozetek SuperGloss CR', shift: 'Magenta → teal → gold', install: 'Pro-shop application', removal: 'Peel-clean to 5 yr' } },
        { id: 'ecd-dazzle', name: 'Dazzle color-shift kit', brand: 'ECD Customs',
          priceDelta: 450, summary: 'ECD’s signature dazzle wrap kit for Talaria / Sur-Ron plastics.',
          specs: { coverage: 'Plastics only', lead: '3–5 business days', release: 'Air-release adhesive', warranty: '1 yr peel' } },
        { id: 'satin-black-pvd', name: 'Satin black "PVD-look"', brand: 'Avery Dennison',
          priceDelta: 520, summary: 'Deep mirror-black wrap. Like the bike was poured.',
          specs: { material: 'Avery SW900 satin black', look: 'PVD-mimic', install: 'Heat-bonded', warranty: '3 yr' } }
      ]
    },
    {
      id: 'wheels',
      number: '03',
      title: 'Wheels',
      blurb: 'Spoked sets that take real abuse and look the part.',
      options: [
        { id: 'stock-18', name: 'Stock 18"', brand: 'MaxRides',
          priceDelta: 0, summary: 'Aluminum rim, sealed-bearing hub.',
          specs: { rim: 'Aluminum', hub: 'Sealed bearing', spokes: '32ct steel', weight: '11.4 lb (set)' } },
        { id: 'warp9-1619', name: 'Warp 9 Racing 16/19 anodized', brand: 'Warp 9',
          priceDelta: 320, summary: 'The aftermarket gold standard for Sur-Ron and Talaria.',
          specs: { rim: '7000-series anodized aluminum', hub: '7075-T6 CNC, sealed bearings', spokes: '36ct stainless, factory-laced', weight: '9.2 lb (set)' } },
        { id: 'excel-kke', name: 'Excel × KKE 19/16 premium', brand: 'Excel + KKE',
          priceDelta: 540, summary: 'Takasago Japanese rims with CNC-anodized hubs.',
          specs: { rim: 'Takasago 7050-T6', hub: '6082-T6 CNC anodized', spokes: 'Blackened iron, hand-laced', weight: '8.8 lb (set)' } }
      ]
    },
    {
      id: 'tires',
      number: '04',
      title: 'Tires',
      blurb: 'Picked for the surface you actually ride on.',
      options: [
        { id: 'maxxis-maxxenduro', name: 'MaxxEnduro', brand: 'Maxxis',
          priceDelta: 180, summary: 'Top-rated dirt all-rounder. Grippy + durable.',
          specs: { use: 'Dirt / trail', tread: 'Intermediate knobby', compound: 'Soft + medium dual', dot: 'Off-road' } },
        { id: 'pirelli-mx32', name: 'Scorpion MX32', brand: 'Pirelli',
          priceDelta: 210, summary: 'Soft/intermediate race compound.',
          specs: { use: 'Race / loose terrain', tread: 'Mid-soft knobby', dot: 'Off-road', life: 'Short, high grip' } },
        { id: 'shinko-525', name: '525 Cheater', brand: 'Shinko',
          priceDelta: 160, summary: 'DOT-legal hare-scramble favorite — trail + road.',
          specs: { use: 'Hare scramble', tread: 'Aggressive knobby', dot: 'DOT-legal' } },
        { id: 'shinko-sr241', name: 'SR241 trials', brand: 'Shinko',
          priceDelta: 140, summary: 'The #1 hybrid pick. Trails + pavement.',
          specs: { use: 'Hybrid', tread: 'Trials pattern', dot: 'DOT-legal' } },
        { id: 'pirelli-mt60', name: 'MT 60 RS', brand: 'Pirelli',
          priceDelta: 200, summary: 'Street-default for Super73 RX builds.',
          specs: { use: 'Street / scrambler', tread: 'Dual-sport', dot: 'DOT-legal' } }
      ]
    },
    {
      id: 'plate',
      number: '05',
      title: 'ODI Plate',
      blurb: 'Your number, front and center. Customize the text.',
      options: [
        { id: 'plate-orange', name: 'Orange plate', brand: 'ODI',
          priceDelta: 45, summary: 'The signature MaxRides plate color.',
          specs: { material: 'Impact-resistant polymer', mount: 'Universal triple-clamp', graphic: 'White vinyl overlay (custom #)', warranty: '1 yr' } },
        { id: 'plate-white', name: 'White plate', brand: 'ODI',
          priceDelta: 45, summary: 'Classic MX look.',
          specs: { material: 'Impact-resistant polymer', mount: 'Universal triple-clamp', graphic: 'Black vinyl overlay (custom #)' } },
        { id: 'plate-black', name: 'Black plate', brand: 'ODI',
          priceDelta: 45, summary: 'Stealth.',
          specs: { material: 'Impact-resistant polymer', mount: 'Universal triple-clamp', graphic: 'White vinyl overlay (custom #)' } },
        { id: 'plate-holo', name: 'Holographic overlay', brand: 'UXA',
          priceDelta: 70, summary: 'ODI plate + UXA holographic-chrome graphic.',
          specs: { graphic: 'Holographic chrome vinyl', fade: 'UV-stable 3 yr', custom: 'Number + name field' } }
      ]
    },
    {
      id: 'battery',
      number: '06',
      title: 'Battery',
      blurb: 'The single mod that changes how the bike feels.',
      options: [
        { id: 'stock-60v', name: 'Stock 60V 32Ah', brand: 'MaxRides',
          priceDelta: 0, summary: 'Factory battery. Good for ~40 mi.',
          specs: { voltage: '60V', capacity: '32Ah', range: '~40 mi mixed', charge: '4.5 hr', warranty: '2 yr' } },
        { id: 'nexbat-72v-50ah', name: 'Nexbat 72V 50Ah', brand: 'Nexbat',
          priceDelta: 1650, summary: 'Molicel P50B cells. The 2025 no-compromise pack.',
          specs: { cells: 'Molicel P50B', voltage: '72V', capacity: '50Ah', range: '~75 mi', charge: '4 hr @ 10A', bms: 'Smart 300A continuous', warranty: '3 yr' } },
        { id: 'ebmx-72v-42ah', name: 'EBMX 72V 42Ah QS8', brand: 'EBMX',
          priceDelta: 1890, summary: 'Race-tuned pack built to feed the X-9000 controller.',
          specs: { cells: 'NMC pouch', voltage: '72V', capacity: '42Ah', range: '~70 mi', charge: '4 hr @ 10A', case: 'Potted stainless', warranty: '5 yr / 1000 cycles' } },
        { id: 'dual-pack', name: 'Dual-battery setup', brand: 'ChiBatterySystems',
          priceDelta: 1295, summary: '~120 mi range. Two packs run in parallel.',
          specs: { range: '~120 mi', config: 'Parallel dual-pack', use: 'All-day rides', warranty: '2 yr' } }
      ]
    },
    {
      id: 'controller',
      number: '07',
      title: 'Controller',
      blurb: 'How smart the throttle is. Big jump in feel.',
      options: [
        { id: 'stock-controller', name: 'Stock', brand: 'MaxRides',
          priceDelta: 0, summary: 'Tuned for stock battery.',
          specs: { peakAmps: '150A', voltage: '60V', control: 'Trapezoidal' } },
        { id: 'ebmx-x9000', name: 'EBMX X-9000 V3', brand: 'EBMX',
          priceDelta: 1420, summary: '2025 dominant choice. IMU + launch control.',
          specs: { peakAmps: '1,000A continuous / 1,600A burst', power: '60 kW peak', voltage: '60–96V', control: 'FOC + IMU', app: 'Bluetooth, 6 power modes', warranty: '2 yr' } },
        { id: 'asi-bac8000', name: 'ASI BAC8000', brand: 'ASI',
          priceDelta: 1690, summary: 'Premium FOC tuning. Legacy favorite.',
          specs: { peakAmps: '850A', power: '32 kW peak', voltage: '24–96V', control: 'FOC', tuning: 'ASI Bac software', warranty: '2 yr' } },
        { id: 'handlworks-bac855', name: 'Handlworks BAC855 (Super73 only)', brand: 'Handlworks',
          priceDelta: 1250, summary: 'Super73-specific. 1.1 kW / 31 mph → 2.9 kW / 37 mph.',
          specs: { fitment: 'Super73 R / RX / S2', power: '2.9 kW peak', topSpeed: '37 mph', leadtime: '2–6 wk' },
          applicableBikes: ['cruiser'] }
      ]
    },
    {
      id: 'motor',
      number: '08',
      title: 'Motor',
      blurb: 'Last upgrade. Only worth it after battery + controller.',
      options: [
        { id: 'stock-motor', name: 'Stock', brand: 'MaxRides',
          priceDelta: 0, summary: 'Factory motor.',
          specs: { power: '6,000 W (Dirt) / 1,200 W (Cruiser)', cooling: 'Sealed' } },
        { id: 'sotion-13kw', name: 'Sotion 13 kW IPM (LBX)', brand: 'Sotion',
          priceDelta: 1100, summary: 'Strong torque + thermal headroom.',
          specs: { power: '13 kW peak', type: 'IPM brushless', fitment: 'Sur-Ron LBX' } },
        { id: 'komoto-factory', name: 'KO Moto Factory-Spec', brand: 'KO Moto',
          priceDelta: 1200, summary: 'Direct upgrade with stock mounting.',
          specs: { power: '13 kW peak', mounting: 'Stock-fit', pairing: 'Recommended with BAC8000 / X-9000' } }
      ]
    },
    {
      id: 'fork',
      number: '09',
      title: 'Front fork',
      blurb: 'Suspension upgrade transforms how the bike rides.',
      options: [
        { id: 'stock-fork', name: 'Stock', brand: 'MaxRides',
          priceDelta: 0, summary: 'OEM USD fork.',
          specs: { stanchion: '32 mm', travel: '180 mm' } },
        { id: 'fastace-alx13rc', name: 'FastAce ALX13RC 2.0', brand: 'FastAce',
          priceDelta: 820, summary: 'Runaway #1 fork in 2025. 37 mm stanchions.',
          specs: { stanchion: '37 mm (largest in class)', travel: '200 mm', valving: 'Open-bath, coil + shim', springs: '50 / 60 / 70 lb by rider weight' } },
        { id: 'ext-ferro', name: 'EXT Ferro Fork', brand: 'EXT',
          priceDelta: 2500, summary: 'Race-tier. Dual-crown, HS3 air spring.',
          specs: { spring: 'HS3 air', crown: 'Dual-crown', adjust: '3-way cartridge', use: 'Race / expert' } }
      ]
    },
    {
      id: 'shock',
      number: '10',
      title: 'Rear shock',
      blurb: 'Match the spring rate to the rider.',
      options: [
        { id: 'stock-shock', name: 'Stock', brand: 'MaxRides',
          priceDelta: 0, summary: 'OEM rear shock with default spring.',
          specs: { spring: '450 lb stock' } },
        { id: 'fastace-rear', name: 'FastAce rear shock + matched spring', brand: 'FastAce',
          priceDelta: 420, summary: 'Better hydraulic valving. Pick your spring rate.',
          specs: { springs: '450 / 500 / 550 / 600 lb', valving: 'Hydraulic, custom shim', sizing: '500 ≥5 150 lb rider; 550 ≥5 175 lb; 600 ≥5 200 lb' } },
        { id: 'luna-550-spring', name: 'Luna 550 lb spring kit', brand: 'Luna Cycle',
          priceDelta: 120, summary: 'Cheapest acceptable upgrade for adult riders.',
          specs: { product: 'DNM 550 lb replacement spring', use: 'Stock DNM body' } },
        { id: 'ohlins-ttx', name: 'Öhlins TTX custom', brand: 'Öhlins',
          priceDelta: 1250, summary: 'Race tier. Custom-built per rider.',
          specs: { length: '10.5" eye-to-eye', spring: 'Per-rider weight', use: 'Race only' } }
      ]
    },
    {
      id: 'seat',
      number: '11',
      title: 'Seat',
      blurb: 'Most-requested cosmetic SKU on these bikes.',
      options: [
        { id: 'stock-seat', name: 'Stock', brand: 'MaxRides', priceDelta: 0, summary: 'Factory.',
          specs: { profile: 'OEM low' } },
        { id: 'guts-gripper', name: 'Hardcore Gripper', brand: 'Guts Racing',
          priceDelta: 260, summary: 'The gold standard. California-built since 1990.',
          specs: { profile: 'Tall slim moto', cover: 'Custom ribbed gripper', colors: 'Top / sides / ribs configurable', lead: '7–14 days' } },
        { id: 'ccw-mx-seat', name: 'MX seat (taller, slim)', brand: 'Charged Cycle Works',
          priceDelta: 240, summary: 'Taller, slimmer moto profile.',
          specs: { profile: 'Tall slim moto', material: 'Gripper top + smooth sides' } },
        { id: 'kanebilt-leather', name: 'Brown leather banana (Super73)', brand: 'Kanebilt',
          priceDelta: 220, summary: 'Cafe-racer leather banana for the Cruiser.',
          specs: { profile: 'Banana', material: 'Hand-stitched brown leather', fitment: 'Super73 R / RX / S2' },
          applicableBikes: ['cruiser'] }
      ]
    },
    {
      id: 'grips',
      number: '12',
      title: 'Grips',
      blurb: 'Tiny upgrade, huge feel difference.',
      options: [
        { id: 'stock-grips', name: 'Stock', brand: 'MaxRides', priceDelta: 0,
          summary: 'OEM rubber.', specs: { type: 'Slip-on rubber' } },
        { id: 'odi-rogue', name: 'Rogue lock-on', brand: 'ODI',
          priceDelta: 25, summary: 'Top dirt pick. Diamond pattern.',
          specs: { type: 'Lock-on MX', compound: 'Soft', diameter: '120 mm' } },
        { id: 'odi-emig', name: 'Emig Pro V2 lock-on', brand: 'ODI',
          priceDelta: 30, summary: 'Race-derived. Softer compound.',
          specs: { type: 'Lock-on race', compound: 'Extra soft' } },
        { id: 'odi-cush', name: 'Cush comfort', brand: 'ODI',
          priceDelta: 28, summary: 'Comfort street pick. Common Super73 swap.',
          specs: { type: 'Lock-on cushioned', compound: 'Medium' } }
      ]
    },
    {
      id: 'bars',
      number: '13',
      title: 'Handlebars',
      blurb: 'The most-cited bar across every forum.',
      options: [
        { id: 'stock-bars', name: 'Stock', brand: 'MaxRides', priceDelta: 0,
          summary: 'OEM bars.', specs: { material: 'Aluminum', rise: 'Stock' } },
        { id: 'protaper-a76', name: 'ProTaper A76 (3" rise)', brand: 'ProTaper',
          priceDelta: 95, summary: 'The universal dirt pick.',
          specs: { rise: '3"', width: '810 mm (cuttable to 740)', damping: 'Vibrocore foam' } },
        { id: 'protaper-a50', name: 'ProTaper A50 (2" rise)', brand: 'ProTaper',
          priceDelta: 95, summary: 'Lower rise for compact riders.',
          specs: { rise: '2"', width: '810 mm (cuttable)' } },
        { id: 'renthal-fatbar', name: 'Renthal Fatbar / Twinwall', brand: 'Renthal',
          priceDelta: 135, summary: 'Premium race choice.',
          specs: { construction: '7050-T6 aluminum + steel stay', use: 'Pro race' } }
      ]
    },
    {
      id: 'brakes',
      number: '14',
      title: 'Brakes',
      blurb: 'Going fast is easy. Stopping fast is the upgrade.',
      options: [
        { id: 'stock-brakes', name: 'Stock', brand: 'MaxRides', priceDelta: 0,
          summary: 'OEM 2-piston caliper + 203 mm rotor.',
          specs: { caliper: '2-piston', rotor: '203 mm' } },
        { id: 'galfer-wave', name: 'Galfer Wave 220 mm front rotor', brand: 'Galfer',
          priceDelta: 120, summary: 'Best per-dollar upgrade. +20% stopping power.',
          specs: { rotor: '220 mm wave', material: 'Stainless heat-treated', boost: '+20% stopping power vs stock', fit: 'Stock caliper + spacer' } },
        { id: 'magura-mt5', name: 'Magura MT5 4-piston system', brand: 'Magura',
          priceDelta: 640, summary: 'New 2025 best-value benchmark. 4-piston.',
          specs: { caliper: '4-piston aluminum', lever: '2-finger', pads: 'Organic, pre-bled hoses', warranty: '2 yr' } },
        { id: 'magura-mt7', name: 'Magura MT7 Pro', brand: 'Magura',
          priceDelta: 1090, summary: 'Premium 1-finger HC lever. Defined bite point.',
          specs: { caliper: '4-piston pro', lever: 'HC 1-finger', pads: 'Race compound', use: 'Heavy / fast riders' } }
      ]
    },
    {
      id: 'headlight',
      number: '15',
      title: 'Headlight',
      blurb: 'Plug-and-play kits built for these bikes.',
      options: [
        { id: 'stock-light', name: 'Stock', brand: 'MaxRides', priceDelta: 0,
          summary: 'OEM 35 W halogen.', specs: { lumens: '~600' } },
        { id: 'bd-s2-pro', name: 'Baja Designs S2 Pro kit', brand: 'Baja Designs',
          priceDelta: 310, summary: 'Balanced pick. 2,245 raw lumens. Plug-and-play.',
          specs: { lumens: '2,245 raw', beam: 'Driving/combo', install: 'Plug-and-play harness' } },
        { id: 'bd-squadron-pro', name: 'Baja Designs Squadron Pro kit', brand: 'Baja Designs',
          priceDelta: 410, summary: 'Serious night-trail. 4,095 raw lumens.',
          specs: { lumens: '4,095 raw', beam: 'Driving/combo', amber: 'Amber lens included', mount: 'Bracket + switch incl.' } },
        { id: 'cyclops-flush', name: 'Cyclops Headlight Kit', brand: 'Cyclops',
          priceDelta: 240, summary: 'Talaria X3 flush-mount favorite.',
          specs: { lumens: '~1,800', install: 'Hardwire required', look: 'Flush' } }
      ]
    },
    {
      id: 'mirrors',
      number: '16',
      title: 'Mirrors',
      blurb: 'Cross-platform favorite. Lifetime warranty.',
      options: [
        { id: 'none-mirrors', name: 'None', brand: 'MaxRides', priceDelta: 0,
          summary: 'No mirrors.', specs: {} },
        { id: 'doubletake-v2', name: 'Adventure Mirror V2 pair', brand: 'Doubletake',
          priceDelta: 126, summary: '"Baseball-bat tested." Zytel body + RAM ball.',
          specs: { body: 'Glass-filled Zytel', mount: 'RAM ball', warranty: 'Lifetime' } },
        { id: 'crg-bar-end', name: 'CRG Hindsight Lanesplitter bar-end', brand: 'CRG',
          priceDelta: 135, summary: 'Premium street look. Convex tinted glass.',
          specs: { mount: 'Bar-end clamp', glass: 'Convex tinted', dampening: 'Vibration-damped rubber' } }
      ]
    },
    {
      id: 'fender',
      number: '17',
      title: 'Mudguards',
      blurb: 'Keep the mud off you and the bike.',
      options: [
        { id: 'none-fender', name: 'None', brand: 'MaxRides', priceDelta: 0,
          summary: 'No fenders.', specs: {} },
        { id: 'gritshift-v2', name: 'Extended Rear Fender V2 + side shrouds', brand: 'GritShift',
          priceDelta: 95, summary: 'Most-recommended rear fender across r/Sur_Ron.',
          specs: { fitment: 'Sur-Ron LBX, Talaria, Segway X160/X260', material: 'ABS', install: 'Bolt-on, no drill' } },
        { id: 'acerbis-front', name: 'Acerbis Front Fender', brand: 'Acerbis',
          priceDelta: 45, summary: 'Race-style standard upgrade.',
          specs: { fitment: 'Universal MX', mount: 'OEM mounting points' } },
        { id: 'mto-carbon', name: 'MTO Brothers Carbon Front Fender', brand: 'MTO Brothers',
          priceDelta: 159, summary: 'Premium plug-and-play.',
          specs: { material: 'Real carbon fiber', install: 'Plug-and-play' } }
      ]
    },
    {
      id: 'charger',
      number: '18',
      title: 'Charger',
      blurb: 'Cut your charge time in half.',
      options: [
        { id: 'stock-charger', name: 'Stock 5A', brand: 'MaxRides', priceDelta: 0,
          summary: 'OEM 5A charger.', specs: { amperage: '5A', time: '4.5 hr full' } },
        { id: 'luna-10a', name: 'Luna 10A', brand: 'Luna Cycle',
          priceDelta: 209, summary: 'Trustworthy 10A replacement.',
          specs: { amperage: '10A', time: '~2.5 hr full', case: 'Aluminum' } },
        { id: 'ebmx-15a', name: 'EBMX 15A fast charger', brand: 'EBMX',
          priceDelta: 359, summary: '1,005 W. Waterproof case. 150% faster than stock.',
          specs: { amperage: '15A', power: '1,005 W', time: '~1.5 hr full', case: 'IP65 waterproof' } },
        { id: 'allchargers-prog', name: 'AllChargers programmable', brand: 'AllChargers',
          priceDelta: 399, summary: 'Set end voltage to 80% for battery longevity.',
          specs: { endVoltage: 'Programmable 80–100%', use: 'Battery longevity', interface: 'Onboard display' } }
      ]
    },
    {
      id: 'lock',
      number: '19',
      title: 'Lock',
      blurb: 'The U-lock arms race ended in 2025.',
      options: [
        { id: 'none-lock', name: 'None', brand: 'MaxRides', priceDelta: 0,
          summary: 'No lock.', specs: {} },
        { id: 'hiplok-d1000', name: 'Hiplok D1000', brand: 'Hiplok',
          priceDelta: 379, summary: '2025 gold standard. Sold Secure Diamond — angle-grinder resistant.',
          specs: { rating: 'Sold Secure Diamond', resistance: 'Angle-grinder tested', warranty: '10 yr' } },
        { id: 'kryptonite-ny-mini', name: 'NY Fahgettaboudit Mini', brand: 'Kryptonite',
          priceDelta: 160, summary: 'Sold Secure Gold. 18 mm shackle.',
          specs: { shackle: '18 mm hardened', rating: 'Sold Secure Gold', grinderTime: '~60 sec' } },
        { id: 'abus-bordo', name: 'Bordo XPlus 6500A Alarm folding', brand: 'ABUS',
          priceDelta: 219, summary: 'Super73 co-branded. 100 dB alarm, 3D motion sensor.',
          specs: { type: 'Folding', alarm: '100 dB', rating: 'Sold Secure Gold' } }
      ]
    },
    {
      id: 'cargo',
      number: '20',
      title: 'Rack & bags',
      blurb: 'For commuters and overnight rides.',
      options: [
        { id: 'none-cargo', name: 'None', brand: 'MaxRides', priceDelta: 0,
          summary: 'No racks or bags.', specs: {} },
        { id: 'kemimoto-rack', name: 'KEMIMOTO rear rack', brand: 'KEMIMOTO',
          priceDelta: 70, summary: 'Model-specific. Holds 12 lb.',
          specs: { fitment: 'Sur-Ron LBX, X160/X260, Talaria MX3/MX4', capacity: '12 lb', material: 'Powder-coated steel' } },
        { id: 'ccw-tank-bag', name: 'CCW tank bag', brand: 'Charged Cycle Works',
          priceDelta: 120, summary: 'Soft luggage, dominant CCW pick.',
          specs: { capacity: '4 L', mounting: 'Magnetic + strap', water: 'Water-resistant' } },
        { id: 'cnc-s-series', name: 'S-Series rack + cargo crate (Super73)', brand: 'Chained and Charged',
          priceDelta: 229, summary: 'Most-purchased S2 cargo kit.',
          specs: { fitment: 'Super73 S2 / RX', material: 'Aluminum', crate: 'Modular cargo crate included' },
          applicableBikes: ['cruiser'] }
      ]
    },
    {
      id: 'safety',
      number: '21',
      title: 'Safety pack',
      blurb: 'Helmet + gloves bundled, properly sized.',
      options: [
        { id: 'none-safety', name: 'None', brand: 'MaxRides', priceDelta: 0,
          summary: 'Bring your own.', specs: {} },
        { id: 'dirt-pack', name: 'Dirt pack', brand: 'Fox / Fox',
          priceDelta: 610, summary: 'Fox V3 RS helmet + Fox Dirtpaw gloves.',
          specs: { helmet: 'Fox V3 RS — MIPS Integra Split', gloves: 'Fox Dirtpaw', cert: 'DOT / ECE 22.06', weight: '2.9 lb helmet' } },
        { id: 'premium-dirt-pack', name: 'Premium dirt pack', brand: '6D / Alpinestars',
          priceDelta: 795, summary: '6D ATR-3 + Alpinestars SP-8 V3.',
          specs: { helmet: '6D ATR-3 — ODS rotational tech', gloves: 'Alpinestars SP-8 V3', cert: 'ECE 22.06', warranty: 'Rebuildable after impact' } },
        { id: 'street-pack', name: 'Street pack (Super73 / Cruiser)', brand: 'Ruroc / 100%',
          priceDelta: 430, summary: 'Ruroc Atlas 4.0 + 100% Brisker gloves.',
          specs: { helmet: 'Ruroc Atlas 4.0 — ECE 22.06', bluetooth: 'Shockwave insert compatible', gloves: '100% Brisker (cold-weather)', wind: '57% quieter than prior Atlas' } },
        { id: 'street-premium-pack', name: 'Street premium pack', brand: 'Ruroc / Knox',
          priceDelta: 615, summary: 'Ruroc Eox + Knox Orsa OR3.',
          specs: { helmet: 'Ruroc Eox — 2025 flagship', gloves: 'Knox Orsa OR3', cert: 'ECE 22.06' } }
      ]
    }
  ];

  // ----- Rides (mock social feed) ---------------------------------

  var RIDES = [
    { id: 'r1', handle: '@jadenrides', age: 13, city: 'Austin, TX', bike: 'dirt-01',
      kind: 'TRICK CLIP', when: '2 min ago', likes: 8243, comments: 412, shares: 412, watching: 23,
      caption: 'This is INSANE. First ride. The chrome dip in the sun is unreal.',
      mods: ['Satin black "PVD-look"', 'EBMX 72V 42Ah', 'Warp 9 16/19', 'Plate #73'],
      finish: '#202020' },
    { id: 'r2', handle: '@mayacruises', age: 14, city: 'San Diego, CA', bike: 'cruiser',
      kind: 'REVEAL', when: '12 min ago', likes: 2143, comments: 89, shares: 41,
      caption: 'Mom let me get this for my birthday and I haven’t stopped riding all weekend.',
      mods: ['Brown leather banana', 'Matte clear', 'Plate #14'],
      finish: '#222' },
    { id: 'r3', handle: '@coletheripper', age: 15, city: 'Boulder, CO', bike: 'dirt-01',
      kind: 'TRICK CLIP', when: '1 hr ago', likes: 6812, comments: 220, shares: 198,
      caption: 'Hit a 6ft step-down at the spillway. Frame is bulletproof.',
      mods: ['Race red frame', 'FastAce ALX13RC 2.0', 'MaxxEnduro tires', 'Galfer Wave 220'],
      finish: '#D11515' },
    { id: 'r4', handle: '@eli11', age: 11, city: 'Tulsa, OK', bike: 'starter',
      kind: 'REVEAL', when: '3 hr ago', likes: 1411, comments: 56, shares: 22,
      caption: 'My very first e-bike. I named her Sparky.',
      mods: ['Acid lime frame', 'Plate "ELI"'],
      finish: '#C8FF00' },
    { id: 'r5', handle: '@sofiarides', age: 13, city: 'Brooklyn, NY', bike: 'cruiser',
      kind: 'BUILD UPDATE', when: '6 hr ago', likes: 3214, comments: 102, shares: 78,
      caption: 'Day 3 of the build. Just installed the BAC855. So smooth.',
      mods: ['Handlworks BAC855', 'CCW MX seat', 'ProTaper A50'],
      finish: '#0A0A0A' },
    { id: 'r6', handle: '@theogarage', age: 12, city: 'Portland, OR', bike: 'dirt-01',
      kind: 'GARAGE TOUR', when: 'yesterday', likes: 4502, comments: 184, shares: 90,
      caption: 'Three MaxRides in one garage. Living the dream.',
      mods: ['Forged carbon wrap', 'ODI Rogue grips', 'Plate #88'],
      finish: '#0F0F0F' },
    { id: 'r7', handle: '@maya_r_rides', age: 14, city: 'Phoenix, AZ', bike: 'starter',
      kind: 'EVENT', when: '2 days ago', likes: 1112, comments: 38, shares: 14,
      caption: 'Local meetup. So many MaxRides on one street.',
      mods: ['Royal purple frame', 'Plate "MR14"'],
      finish: '#5A2DDD' },
    { id: 'r8', handle: '@noahsdirt', age: 16, city: 'Denver, CO', bike: 'dirt-01',
      kind: 'MOD DROP', when: '3 days ago', likes: 5601, comments: 278, shares: 121,
      caption: 'Just dropped the X-9000 V3 in. Throttle response is a different planet.',
      mods: ['EBMX X-9000 V3', 'EBMX 72V 42Ah', 'Magura MT7 Pro'],
      finish: '#FF5A1F' }
  ];

  // ----- Reviews --------------------------------------------------

  var REVIEWS = [
    { id: 'rv1', stars: 5, when: '2 weeks ago', author: 'Jake B.', age: '14', city: 'San Diego',
      verifiedBuild: 'Dirt 01 + Satin black PVD-look', helpful: 87, withPhotos: true,
      title: 'Way better than the Sur-Ron my friend has.',
      body: 'Got the Dirt 01 with the EBMX battery and Galfer brakes. Hits 38 like nothing and the wrap looks crazy. Customer service answered in 2 hours when I had a question. 10/10.' },
    { id: 'rv2', stars: 5, when: '3 weeks ago', author: 'Sarah M.', age: 'parent', city: 'Boulder',
      verifiedBuild: 'Cruiser + Matte clear', helpful: 64, withPhotos: false, isParent: true,
      title: 'Worth every penny (says the parent).',
      body: 'Bought the Cruiser for my daughter’s 13th. The builder was fun for HER to use. Shipped in a week. She hasn’t stopped riding. Safer than a moped, faster than her old bike.' },
    { id: 'rv3', stars: 4, when: '1 month ago', author: 'Eli K.', age: '11', city: 'Tulsa',
      verifiedBuild: 'Starter — stock build', helpful: 41, withPhotos: true,
      title: 'Sick bike, wish the stock battery had more range.',
      body: 'Looks insane, handles great, but the stock battery only gets me about 30 miles. Should’ve paid the extra for the EBMX. Upgrade in the builder.' },
    { id: 'rv4', stars: 5, when: '1 month ago', author: 'Marcus T.', age: '15', city: 'Phoenix',
      verifiedBuild: 'Dirt 01 + Forged carbon + Magura MT5', helpful: 56, withPhotos: true,
      title: 'The brakes alone justify the upgrade.',
      body: 'Did the Magura MT5 swap day one. Night and day difference vs stock. The carbon wrap holds up to dust like a champ.' },
    { id: 'rv5', stars: 5, when: '6 weeks ago', author: 'Priya R.', age: 'parent', city: 'Seattle',
      verifiedBuild: 'Cruiser', helpful: 38, withPhotos: false, isParent: true,
      title: 'Bought it with my son. Best birthday yet.',
      body: 'We did the split-pay. He put down his birthday money and I covered the rest. Whole experience felt like buying a Tesla. Highly recommend the parent-share feature — made the conversation easy.' },
    { id: 'rv6', stars: 5, when: '6 weeks ago', author: 'Cole P.', age: '15', city: 'Boulder',
      verifiedBuild: 'Dirt 01 + FastAce ALX13RC 2.0 + EBMX X-9000 V3', helpful: 92, withPhotos: true,
      title: 'Full send.',
      body: 'I race local hare scrambles and the bike keeps up with full-size 250s on the right setup. Fork upgrade made the biggest single difference.' },
    { id: 'rv7', stars: 4, when: '7 weeks ago', author: 'Sofia L.', age: '13', city: 'Brooklyn',
      verifiedBuild: 'Cruiser + Brown leather banana', helpful: 28, withPhotos: true,
      title: 'Cute, fast, school is jealous.',
      body: 'Wish there was a smaller leg-reach option. Otherwise perfect. The wishlist feature got my parents to actually buy this without arguing.' },
    { id: 'rv8', stars: 5, when: '2 months ago', author: 'Theo M.', age: '12', city: 'Portland',
      verifiedBuild: 'Dirt 01', helpful: 31, withPhotos: false,
      title: 'My friends saved up for one too.',
      body: 'Once one of us got it, three more friends bought MaxRides. The Reveals feed is sick — I see my own video on there now.' },
    { id: 'rv9', stars: 5, when: '2 months ago', author: 'Ben H.', age: 'parent', city: 'Atlanta',
      verifiedBuild: 'Starter', helpful: 22, withPhotos: false, isParent: true,
      title: 'Build quality is real.',
      body: 'I expected a toy. It’s not a toy. Welds are clean, electronics are well-routed, battery has a real BMS. Worth the price.' },
    { id: 'rv10', stars: 4, when: '3 months ago', author: 'Noah Z.', age: '16', city: 'Denver',
      verifiedBuild: 'Dirt 01 + EBMX X-9000 V3 + 72V 42Ah', helpful: 47, withPhotos: true,
      title: 'X-9000 V3 is wild but expect a learning curve.',
      body: 'Took me a day to dial in the power-mode presets. Once tuned, it’s incredible. Knock a star off for the steep learning curve at first.' }
  ];

  // ----- Star rating breakdown for Reviews hero -------------------

  var REVIEW_BREAKDOWN = { five: 82, four: 11, three: 4, two: 2, one: 1 };
  var REVIEW_OVERALL = { stars: 4.8, count: 1243 };

  window.MAXRIDES_DATA = {
    BIKES: BIKES,
    FRAME_COLORS: FRAME_COLORS,
    COMPONENT_CATEGORIES: COMPONENT_CATEGORIES,
    RIDES: RIDES,
    REVIEWS: REVIEWS,
    REVIEW_BREAKDOWN: REVIEW_BREAKDOWN,
    REVIEW_OVERALL: REVIEW_OVERALL,

    findBike: function (slug) { return BIKES.find(function (b) { return b.slug === slug; }); }
  };
})();
