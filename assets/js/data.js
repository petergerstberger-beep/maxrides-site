/* ============================================
   MaxRides — Product & content data
   Single source of truth for bikes, builder components,
   mock rides feed, and reviews. Now a curated dropship store
   for real-world teen e-bike brands.
   ============================================ */

(function () {
  'use strict';

  // ----- Bikes ----------------------------------------------------
  //
  // Each bike has a `tier` (budget|mid|premium|halo) that gates which
  // builder mods are shown — cheaper bikes hide the expensive mods so
  // buyers aren't overwhelmed. The `silhouette` field maps the bike
  // to one of three placeholder SVG shapes until real product
  // photography is wired in (photoUrl).
  // Prices verified against 2025–2026 real-world MSRP.

  var BIKES = [
    // ===== DIRT =====
    {
      slug: 'sur-ron-light-bee-x',
      brand: 'Sur-Ron',
      name: 'Sur-Ron Light Bee X',
      category: 'dirt',
      tier: 'mid',
      silhouette: 'dirt',
      photoUrl: 'https://alienrides.com/cdn/shop/files/Surron-Light-Bee-Silver-New_1024x1024.png',
      tagline: 'The OG teen rocket.',
      heroCopy: '8 kW peak. 46 mph top speed. 60V/40Ah Samsung 50S pack. The bike every Sur-Ron rival is chasing.',
      basePrice: 4400,
      rating: 4.9,
      reviewCount: 1247,
      specs: {
        topSpeed: '46.6 mph (75 km/h)',
        range: 'Up to 50 mi',
        motor: '8 kW peak PMSM mid-drive',
        weight: '126 lb (57 kg)',
        battery: '60V 40Ah Samsung 50S (UL-certified)',
        acceleration: '0–31 mph in 2.7 sec'
      }
    },
    {
      slug: 'sur-ron-ultra-bee',
      brand: 'Sur-Ron',
      name: 'Sur-Ron Ultra Bee HP',
      category: 'dirt',
      tier: 'premium',
      silhouette: 'dirt',
      photoUrl: 'https://ronhack.com/cdn/shop/files/black_2bdf4744-5f39-492c-b906-3cfd9edbb3be.png?width=1024',
      tagline: 'Bigger battery. Bigger send.',
      heroCopy: '21 kW Turbo / 18 kW Sport. Hairpin motor. 74V/60Ah pack. 377 lb-ft of torque to the wheel.',
      basePrice: 6499,
      rating: 4.9,
      reviewCount: 612,
      specs: {
        topSpeed: '59 mph',
        range: '71 mi',
        motor: '21 kW peak / 18 kW continuous (Hairpin)',
        torque: '377 lb-ft (wheel)',
        battery: '74V 60Ah Li-ion',
        chargeTime: '~4 hr to 100%'
      }
    },
    {
      slug: 'talaria-sting-mx4',
      brand: 'Talaria',
      name: 'Talaria Sting R MX4',
      category: 'dirt',
      tier: 'mid',
      silhouette: 'dirt',
      photoUrl: 'https://revrides.com/cdn/shop/files/talaria-talaria-sting-r-mx4.webp',
      tagline: 'More low-end torque than the Sur-Ron.',
      heroCopy: 'The Sur-Ron rival. IPM mid-drive, gearbox-driven, 2,700 Wh battery, factory-limited until you unlock it.',
      basePrice: 4500,
      rating: 4.8,
      reviewCount: 893,
      specs: {
        topSpeed: '71 mph (unlocked)',
        range: '75 mi (120 km @ 25 km/h)',
        motor: '8,000 W peak (4,000 W nominal) IPM mid-drive',
        weight: '146 lb (66 kg)',
        battery: '60V 45Ah (2,700 Wh)',
        chargeTime: '~3 hr to 100%'
      }
    },
    {
      slug: 'stark-varg',
      brand: 'Stark Future',
      name: 'Stark VARG MX 1.2 Alpha',
      category: 'dirt',
      tier: 'halo',
      silhouette: 'dirt',
      photoUrl: 'https://lithiumpowersports.com/cdn/shop/files/stark-varg-mx-1-2-electric-motocross-bike-60-80-hp-off-road-red-erides-691.webp?v=1773489192',
      tagline: 'The supercar of electric dirt bikes.',
      heroCopy: '80 hp. 7.2 kWh battery (20% more range than MX 1.0). Arkenstone handlebar dashboard. Pros race pro motocross on it.',
      basePrice: 13490,
      rating: 5.0,
      reviewCount: 142,
      specs: {
        topSpeed: '75 mph (rider-tunable)',
        rideTime: '1.3–6 hr depending on rider + terrain',
        motor: '80 hp peak (Alpha) / 60 hp (Standard)',
        weight: '260 lb (118 kg)',
        battery: '7.2 kWh Li-ion',
        suspension: 'KYB AOS factory race'
      }
    },
    {
      slug: 'etm-rtr-xl',
      brand: 'Electro & Co',
      name: 'ETM RTR XL',
      category: 'dirt',
      tier: 'premium',
      silhouette: 'dirt',
      photoUrl: 'https://emotosuperstore.com/cdn/shop/files/Screenshot_2025-07-14_at_6.39.19_PM_7945818c-e650-4116-b091-1861c4f4c24a.png?v=1756932480',
      tagline: 'Ready to Rip. Flagship.',
      heroCopy: '16,000 W max output. Hot-swap Samsung pack. 65+ mph top speed. Built in-house by Electro & Co.',
      basePrice: 3799,
      rating: 4.8,
      reviewCount: 312,
      specs: {
        topSpeed: '65 mph',
        range: '30–60 mi',
        motor: '16,000 W max',
        weight: '165 lb',
        battery: '72V 35Ah Samsung (hot-swap)',
        suspension: 'Tunable hydraulic'
      }
    },
    {
      slug: 'etm-rtr-sport',
      brand: 'Electro & Co',
      name: 'ETM RTR Sport',
      category: 'dirt',
      tier: 'mid',
      silhouette: 'dirt',
      photoUrl: 'https://lithiumpowersports.com/cdn/shop/files/etm-rtr-sport-ready-to-rip-electric-trail-machine-bike-erides-994.webp?v=1773421026&width=600',
      tagline: 'Newly engineered. Newly powered.',
      heroCopy: '8,000 W peak. 55+ mph. 72V/25Ah battery. The evolution of the original ETM RTR.',
      basePrice: 2999,
      rating: 4.7,
      reviewCount: 421,
      specs: {
        topSpeed: '55 mph',
        range: '30 mi',
        motor: '8,000 W peak',
        weight: '145 lb',
        battery: '72V 25Ah',
        suspension: 'Hydraulic open-bath'
      }
    },
    {
      slug: 'etm-rtr-lite',
      brand: 'Electro & Co',
      name: 'ETM RTR Lite',
      category: 'dirt',
      tier: 'budget',
      silhouette: 'starter',
      photoUrl: 'https://www.epicwheelz.com/cdn/shop/files/rtr_6_1024x1024.jpg?v=1762968116',
      tagline: 'Ready to Rip — entry tier.',
      heroCopy: 'Designed for teens and adults. 60V/20Ah hot-swap battery, expandable to 72V/40Ah. The Affordable 110-killer.',
      basePrice: 2199,
      rating: 4.6,
      reviewCount: 287,
      specs: {
        topSpeed: '45+ mph',
        range: '20 mi (stock 60V 20Ah)',
        motor: '5,000 W peak E&C IPM brushless',
        weight: '120 lb (48/52 F/R balance)',
        battery: '60V 20Ah hot-swap (expandable to 72V 40Ah)',
        tires: '60/100-14 F · 80/100-12 R'
      }
    },
    {
      slug: 'rawrr-mantis',
      brand: 'Rawrr',
      name: 'Rawrr Mantis X',
      category: 'dirt',
      tier: 'mid',
      silhouette: 'dirt',
      photoUrl: 'https://cdn.prod.website-files.com/6675b4f433c2c32076d88aa3/690ce4ce70dd0f4c6908fa25_XTransparent1%20copy.avif',
      tagline: 'US-built. 72V. Honest performance.',
      heroCopy: '9.5 kW peak motor. 72V pack. 50 N·m of torque. Assembled and tested in the US.',
      basePrice: 2999,
      rating: 4.5,
      reviewCount: 502,
      specs: {
        topSpeed: '50 mph',
        range: 'Up to 75 mi',
        motor: '9,500 W peak',
        weight: '139 lb (with battery)',
        battery: '72V Li-ion',
        seatHeight: '32 in'
      }
    },

    // ===== STREET =====
    {
      slug: 'super73-rx',
      brand: 'Super73',
      name: 'Super73-RX Mojave',
      category: 'street',
      tier: 'mid',
      silhouette: 'cruiser',
      photoUrl: 'https://www.incycle.com/cdn/shop/products/FS-V0070-HS2_678d0839-062b-4630-ae72-a8f217d4a2cb.jpg?v=1665668158',
      tagline: 'Top-of-the-line R-series.',
      heroCopy: 'Adjustable full suspension. 4-piston hydraulic brakes. Speedster low-profile seat. The performance Super73.',
      basePrice: 3695,
      rating: 4.8,
      reviewCount: 2104,
      specs: {
        topSpeed: '28+ mph (Class 3 / Unlimited)',
        range: '40 mi throttle / 75 mi pedal-assist',
        motor: '2,000 W peak internally-geared hub',
        weight: '84 lb (38 kg)',
        battery: '48V 20Ah removable (960 Wh)',
        suspension: 'Fully adjustable dual suspension'
      }
    },
    {
      slug: 'super73-zx',
      brand: 'Super73',
      name: 'Super73 S2',
      category: 'street',
      tier: 'mid',
      silhouette: 'cruiser',
      photoUrl: 'https://www.incycle.com/cdn/shop/products/FS-V0037-HS.jpg?v=1665621972',
      tagline: 'The iconic Super73.',
      heroCopy: 'Full-size frame. Removable battery. The Class-3 e-bike everyone recognizes — your school drop-off, but cooler.',
      basePrice: 2995,
      rating: 4.7,
      reviewCount: 1894,
      specs: {
        topSpeed: '28+ mph (Class 3 / Unlimited)',
        range: '40 mi throttle / 75 mi pedal-assist',
        motor: '750 W (1,200 W road / 2,000 W off-road peak)',
        weight: '73 lb',
        battery: '48V 20Ah removable (960 Wh)',
        modes: 'Class 1 / 2 / 3 / Off-road'
      }
    },
    {
      slug: 'onyx-rcr',
      brand: 'Onyx Motors',
      name: 'Onyx RCR 80V',
      category: 'street',
      tier: 'mid',
      silhouette: 'cruiser',
      photoUrl: 'https://onyxmotors.com/cdn/shop/files/ONYX_RCR_80V_STD_LUNAR_SILVER.00_1.webp?v=1750702767',
      tagline: '75 mph moped with pedals.',
      heroCopy: '18 kW peak. 80V/45Ah pack. 0–30 in 1.7 sec. Regenerative braking. Still has pedals.',
      basePrice: 5199,
      rating: 4.7,
      reviewCount: 1208,
      specs: {
        topSpeed: '75 mph (Hyper) / 65 mph (Sport)',
        range: '55 mi Sport / 75 mi Normal / 130 mi Eco',
        motor: '18 kW peak hub motor',
        battery: '80V 45Ah Li-ion',
        modes: 'Eco 20mph / Normal 40mph / Sport 65+ / Hyper 75',
        charging: '0–100% in 4.5 hr (10A)'
      }
    },

    // ===== COMMUTER =====
    {
      slug: 'macfox-x2',
      brand: 'Macfox',
      name: 'Macfox X2',
      category: 'commuter',
      tier: 'budget',
      silhouette: 'starter',
      photoUrl: 'https://emotosuperstore.com/cdn/shop/files/macfox-x2-electric-mountain-bikeemoto-superstore-4784904.png?v=1762492798',
      tagline: 'Fat-tire commuter. TikTok-famous.',
      heroCopy: '750 W hub motor (1,000 W peak). 65 N·m torque. Dual-battery option for 90-mile range. 20"×4" fat tires.',
      basePrice: 1699,
      rating: 4.6,
      reviewCount: 3412,
      specs: {
        topSpeed: '28 mph',
        range: '40–45 mi (90 mi w/ dual battery)',
        motor: '750 W rear hub (1,000 W peak)',
        torque: '65 N·m',
        weight: '65 lb',
        battery: '48V 20Ah (960 Wh, dual optional)'
      }
    }
  ];

  // ----- Bike categories (used by home page grid) -----------------

  var BIKE_CATEGORIES = [
    { id: 'dirt',     label: 'Dirt rockets',     tagline: 'Built for the trail and the air.' },
    { id: 'street',   label: 'Street cruisers',  tagline: 'Made for the road and the school drop-off.' },
    { id: 'commuter', label: 'Commuter',         tagline: 'Fat-tire, long-range, fully practical.' }
  ];

  // ----- Tier ranks (used by Builder mod-filter) ------------------
  //
  // The Builder hides options where TIER_RANK[opt.tier] > TIER_RANK[bike.tier].
  // So a $2,500 bike never shows $1,500 mods, but a $13,900 Stark VARG
  // sees the whole catalog.

  var TIER_RANK = { budget: 1, mid: 2, premium: 3, halo: 4 };

  // ----- Frame colors (used by Builder as wrap option) ------------

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
  // Each option has a `tier`:
  //   - budget   ($0–$250 range, visible on every bike)
  //   - mid      ($250–$700, visible on mid/premium/halo bikes)
  //   - premium  ($700–$1,900, visible on premium/halo only)
  //   - halo     ($1,900+, visible only on Stark VARG-class bikes)
  //
  // `applicableBikes` is an optional explicit allow-list (overrides tier).
  // Prices verified against real 2025–2026 MSRP.

  var COMPONENT_CATEGORIES = [
    {
      id: 'finish',
      number: '02',
      title: 'Finish',
      blurb: 'Premium full-bike treatments.',
      options: [
        { id: 'gloss-standard', name: 'Standard gloss', brand: 'MaxRides', tier: 'budget',
          priceDelta: 0, summary: 'Factory clear coat over the frame color.',
          specs: { finish: 'PPG gloss clear', uv: 'UV-stable', layers: '3-coat base + clear', warranty: '2 yr color' } },
        { id: 'matte-clear', name: 'Matte clear', brand: 'MaxRides', tier: 'mid',
          priceDelta: 280, summary: 'Stealth flat finish, very Sur-Ron tuner.',
          specs: { finish: 'PPG matte clear', sheen: '15% gloss', layers: '3-coat + matte clear', warranty: '2 yr color' } },
        { id: 'satin-black-pvd', name: 'Satin black PVD-look', brand: 'Avery Dennison', tier: 'mid',
          priceDelta: 520, summary: 'Deep mirror-black wrap. Like the bike was poured.',
          specs: { material: 'Avery SW900 satin black', look: 'PVD-mimic', install: 'Heat-bonded', warranty: '3 yr' } },
        { id: 'carbon-wrap', name: 'Forged carbon wrap', brand: 'REV797', tier: 'mid',
          priceDelta: 680, summary: 'F1 / supercar carbon texture. Pre-cut per panel.',
          specs: { material: '3M 2080 carbon vinyl', cut: 'Pre-cut templates', install: 'Heat-bonded', removal: 'Peel-clean to 5 yr' } },
        { id: 'color-shift', name: 'Color-shift chameleon', brand: 'Inozetek', tier: 'premium',
          priceDelta: 1200, summary: 'Shifts color through the spectrum as you ride.',
          specs: { material: 'Inozetek SuperGloss CR', shift: 'Magenta → teal → gold', install: 'Pro-shop application', removal: 'Peel-clean to 5 yr' } }
      ]
    },
    {
      id: 'wheels',
      number: '03',
      title: 'Wheels',
      blurb: 'Spoked sets built for real abuse.',
      options: [
        { id: 'stock-wheels', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'Factory wheelset.',
          specs: { rim: 'Aluminum', hub: 'Sealed bearing', spokes: '32ct steel' } },
        { id: 'warp9-1619', name: 'Warp 9 Racing 16/19 anodized', brand: 'Warp 9', tier: 'mid',
          priceDelta: 320, summary: 'Aftermarket gold standard for Sur-Ron and Talaria.',
          specs: { rim: '7000-series anodized aluminum', hub: '7075-T6 CNC, sealed bearings', spokes: '36ct stainless, factory-laced', weight: '9.2 lb (set)' } },
        { id: 'excel-kke', name: 'Excel × KKE 19/16 premium', brand: 'Excel + KKE', tier: 'premium',
          priceDelta: 540, summary: 'Takasago Japanese rims with CNC-anodized hubs.',
          specs: { rim: 'Takasago 7050-T6', hub: '6082-T6 CNC anodized', spokes: 'Blackened iron, hand-laced', weight: '8.8 lb (set)' } }
      ]
    },
    {
      id: 'tires',
      number: '04',
      title: 'Tires',
      blurb: 'Picked for the surface you ride on.',
      options: [
        { id: 'stock-tires', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'Factory tires.', specs: { use: 'Mixed' } },
        { id: 'shinko-sr241', name: 'SR241 trials', brand: 'Shinko', tier: 'budget',
          priceDelta: 140, summary: 'Hybrid pick. Trails + pavement.',
          specs: { use: 'Hybrid', tread: 'Trials pattern', dot: 'DOT-legal' } },
        { id: 'shinko-525', name: '525 Cheater', brand: 'Shinko', tier: 'budget',
          priceDelta: 160, summary: 'DOT-legal hare-scramble favorite.',
          specs: { use: 'Hare scramble', tread: 'Aggressive knobby', dot: 'DOT-legal' } },
        { id: 'maxxis-maxxenduro', name: 'MaxxEnduro', brand: 'Maxxis', tier: 'mid',
          priceDelta: 180, summary: 'Top-rated dirt all-rounder.',
          specs: { use: 'Dirt / trail', tread: 'Intermediate knobby', compound: 'Soft + medium dual', dot: 'Off-road' } },
        { id: 'pirelli-mt60', name: 'MT 60 RS', brand: 'Pirelli', tier: 'mid',
          priceDelta: 200, summary: 'Street-default for Super73 RX builds.',
          specs: { use: 'Street / scrambler', tread: 'Dual-sport', dot: 'DOT-legal' } },
        { id: 'pirelli-mx32', name: 'Scorpion MX32', brand: 'Pirelli', tier: 'mid',
          priceDelta: 210, summary: 'Soft/intermediate race compound.',
          specs: { use: 'Race / loose terrain', tread: 'Mid-soft knobby', dot: 'Off-road' } }
      ]
    },
    {
      id: 'plate',
      number: '05',
      title: 'ODI Plate',
      blurb: 'Your number, front and center.',
      options: [
        { id: 'no-plate', name: 'No plate', brand: '—', tier: 'budget',
          priceDelta: 0, summary: 'Run plateless.', specs: {} },
        { id: 'plate-orange', name: 'Orange plate', brand: 'ODI', tier: 'budget',
          priceDelta: 45, summary: 'Signature MaxRides orange.',
          specs: { material: 'Impact-resistant polymer', mount: 'Universal triple-clamp', graphic: 'White vinyl overlay (custom #)' } },
        { id: 'plate-white', name: 'White plate', brand: 'ODI', tier: 'budget',
          priceDelta: 45, summary: 'Classic MX look.',
          specs: { material: 'Impact-resistant polymer', mount: 'Universal triple-clamp', graphic: 'Black vinyl overlay (custom #)' } },
        { id: 'plate-black', name: 'Black plate', brand: 'ODI', tier: 'budget',
          priceDelta: 45, summary: 'Stealth.',
          specs: { material: 'Impact-resistant polymer', mount: 'Universal triple-clamp', graphic: 'White vinyl overlay (custom #)' } },
        { id: 'plate-holo', name: 'Holographic overlay', brand: 'UXA', tier: 'mid',
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
        { id: 'stock-battery', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'Factory battery.', specs: { warranty: '2 yr' } },
        { id: 'dual-pack', name: 'Dual-battery setup', brand: 'ChiBatterySystems', tier: 'premium',
          priceDelta: 1295, summary: '~120 mi range. Two packs in parallel.',
          specs: { range: '~120 mi', config: 'Parallel dual-pack', warranty: '2 yr' } },
        { id: 'nexbat-72v-50ah', name: 'Nexbat 72V 50Ah', brand: 'Nexbat', tier: 'premium',
          priceDelta: 1650, summary: 'Molicel P50B cells. The no-compromise pack.',
          specs: { cells: 'Molicel P50B', voltage: '72V', capacity: '50Ah', range: '~75 mi', charge: '4 hr @ 10A', bms: 'Smart 300A continuous', warranty: '3 yr' } },
        { id: 'ebmx-72v-42ah', name: 'EBMX 72V 42Ah QS8', brand: 'EBMX', tier: 'premium',
          priceDelta: 1890, summary: 'Race-tuned pack built to feed the X-9000.',
          specs: { cells: 'NMC pouch', voltage: '72V', capacity: '42Ah', range: '~70 mi', charge: '4 hr @ 10A', case: 'Potted stainless', warranty: '5 yr' } }
      ]
    },
    {
      id: 'controller',
      number: '07',
      title: 'Controller',
      blurb: 'How smart the throttle is.',
      options: [
        { id: 'stock-controller', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'Tuned for stock battery.',
          specs: { peakAmps: '150A', control: 'Trapezoidal' } },
        { id: 'handlworks-bac855', name: 'Handlworks BAC855', brand: 'Handlworks', tier: 'mid',
          priceDelta: 1250, summary: 'Super73-specific. 1.1 kW → 2.9 kW / 37 mph.',
          specs: { fitment: 'Super73 R / RX / S2', power: '2.9 kW peak', topSpeed: '37 mph', leadtime: '2–6 wk' },
          applicableBikes: ['super73-rx', 'super73-zx'] },
        { id: 'ebmx-x9000', name: 'EBMX X-9000 V3', brand: 'EBMX', tier: 'premium',
          priceDelta: 1420, summary: '2025 dominant choice. IMU + launch control.',
          specs: { peakAmps: '1,000A continuous / 1,600A burst', power: '60 kW peak', voltage: '60–96V', control: 'FOC + IMU', app: 'Bluetooth, 6 power modes', warranty: '2 yr' } },
        { id: 'asi-bac8000', name: 'ASI BAC8000', brand: 'ASI', tier: 'premium',
          priceDelta: 1690, summary: 'Premium FOC tuning. Legacy favorite.',
          specs: { peakAmps: '850A', power: '32 kW peak', voltage: '24–96V', control: 'FOC', warranty: '2 yr' } }
      ]
    },
    {
      id: 'motor',
      number: '08',
      title: 'Motor',
      blurb: 'Last upgrade. Only after battery + controller.',
      options: [
        { id: 'stock-motor', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'Factory motor.', specs: {} },
        { id: 'sotion-13kw', name: 'Sotion 13 kW IPM', brand: 'Sotion', tier: 'premium',
          priceDelta: 1100, summary: 'Strong torque + thermal headroom.',
          specs: { power: '13 kW peak', type: 'IPM brushless', fitment: 'Sur-Ron LBX' },
          applicableBikes: ['sur-ron-light-bee-x', 'sur-ron-ultra-bee'] },
        { id: 'komoto-factory', name: 'KO Moto Factory-Spec', brand: 'KO Moto', tier: 'premium',
          priceDelta: 1200, summary: 'Direct upgrade with stock mounting.',
          specs: { power: '13 kW peak', mounting: 'Stock-fit' },
          applicableBikes: ['sur-ron-light-bee-x', 'sur-ron-ultra-bee', 'talaria-sting-mx4'] }
      ]
    },
    {
      id: 'fork',
      number: '09',
      title: 'Front fork',
      blurb: 'Suspension transforms how the bike rides.',
      options: [
        { id: 'stock-fork', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'OEM USD fork.',
          specs: { stanchion: '32 mm', travel: '180 mm' } },
        { id: 'fastace-alx13rc', name: 'FastAce ALX13RC 2.0', brand: 'FastAce', tier: 'premium',
          priceDelta: 820, summary: 'Runaway #1 fork in 2025. 37 mm stanchions.',
          specs: { stanchion: '37 mm', travel: '200 mm', valving: 'Open-bath, coil + shim', springs: '50 / 60 / 70 lb by rider weight' } },
        { id: 'ext-ferro', name: 'EXT Ferro Fork', brand: 'EXT', tier: 'halo',
          priceDelta: 2500, summary: 'Race-tier. Dual-crown, HS3 air spring.',
          specs: { spring: 'HS3 air', crown: 'Dual-crown', adjust: '3-way cartridge' } }
      ]
    },
    {
      id: 'shock',
      number: '10',
      title: 'Rear shock',
      blurb: 'Match the spring rate to the rider.',
      options: [
        { id: 'stock-shock', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'OEM rear shock.', specs: { spring: '450 lb stock' } },
        { id: 'luna-550-spring', name: 'Luna 550 lb spring kit', brand: 'Luna Cycle', tier: 'budget',
          priceDelta: 120, summary: 'Cheapest acceptable upgrade for adult riders.',
          specs: { product: 'DNM 550 lb spring' } },
        { id: 'fastace-rear', name: 'FastAce rear shock + matched spring', brand: 'FastAce', tier: 'mid',
          priceDelta: 420, summary: 'Better hydraulic valving. Pick your spring.',
          specs: { springs: '450 / 500 / 550 / 600 lb', valving: 'Hydraulic, custom shim' } },
        { id: 'ohlins-ttx', name: 'Öhlins TTX custom', brand: 'Öhlins', tier: 'halo',
          priceDelta: 1250, summary: 'Race tier. Custom-built per rider.',
          specs: { length: '10.5" eye-to-eye', spring: 'Per-rider weight' } }
      ]
    },
    {
      id: 'seat',
      number: '11',
      title: 'Seat',
      blurb: 'Most-requested cosmetic SKU.',
      options: [
        { id: 'stock-seat', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'Factory.', specs: {} },
        { id: 'kanebilt-leather', name: 'Brown leather banana', brand: 'Kanebilt', tier: 'mid',
          priceDelta: 220, summary: 'Cafe-racer leather banana.',
          specs: { profile: 'Banana', material: 'Hand-stitched brown leather' },
          applicableBikes: ['super73-rx', 'super73-zx', 'onyx-rcr'] },
        { id: 'ccw-mx-seat', name: 'MX seat (taller, slim)', brand: 'Charged Cycle Works', tier: 'mid',
          priceDelta: 240, summary: 'Taller, slimmer moto profile.',
          specs: { profile: 'Tall slim moto', material: 'Gripper top + smooth sides' } },
        { id: 'guts-gripper', name: 'Hardcore Gripper', brand: 'Guts Racing', tier: 'mid',
          priceDelta: 260, summary: 'Gold standard. California-built since 1990.',
          specs: { profile: 'Tall slim moto', cover: 'Custom ribbed gripper', colors: 'Top / sides / ribs configurable' } }
      ]
    },
    {
      id: 'grips',
      number: '12',
      title: 'Grips',
      blurb: 'Tiny upgrade, huge feel difference.',
      options: [
        { id: 'stock-grips', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'OEM rubber.', specs: { type: 'Slip-on rubber' } },
        { id: 'odi-rogue', name: 'Rogue lock-on', brand: 'ODI', tier: 'budget',
          priceDelta: 25, summary: 'Top dirt pick.',
          specs: { type: 'Lock-on MX', compound: 'Soft', diameter: '120 mm' } },
        { id: 'odi-cush', name: 'Cush comfort', brand: 'ODI', tier: 'budget',
          priceDelta: 28, summary: 'Comfort street pick.',
          specs: { type: 'Lock-on cushioned', compound: 'Medium' } },
        { id: 'odi-emig', name: 'Emig Pro V2 lock-on', brand: 'ODI', tier: 'budget',
          priceDelta: 30, summary: 'Race-derived. Softer compound.',
          specs: { type: 'Lock-on race', compound: 'Extra soft' } }
      ]
    },
    {
      id: 'bars',
      number: '13',
      title: 'Handlebars',
      blurb: 'Most-cited bar on every forum.',
      options: [
        { id: 'stock-bars', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'OEM bars.', specs: { material: 'Aluminum' } },
        { id: 'protaper-a50', name: 'ProTaper A50 (2" rise)', brand: 'ProTaper', tier: 'mid',
          priceDelta: 95, summary: 'Lower rise for compact riders.',
          specs: { rise: '2"', width: '810 mm (cuttable)' } },
        { id: 'protaper-a76', name: 'ProTaper A76 (3" rise)', brand: 'ProTaper', tier: 'mid',
          priceDelta: 95, summary: 'Universal dirt pick.',
          specs: { rise: '3"', width: '810 mm (cuttable to 740)', damping: 'Vibrocore foam' } },
        { id: 'renthal-fatbar', name: 'Renthal Fatbar / Twinwall', brand: 'Renthal', tier: 'premium',
          priceDelta: 135, summary: 'Premium race choice.',
          specs: { construction: '7050-T6 aluminum + steel stay' } }
      ]
    },
    {
      id: 'brakes',
      number: '14',
      title: 'Brakes',
      blurb: 'Going fast is easy. Stopping fast is the upgrade.',
      options: [
        { id: 'stock-brakes', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'OEM 2-piston caliper.',
          specs: { caliper: '2-piston', rotor: '203 mm' } },
        { id: 'galfer-wave', name: 'Galfer Wave 220 mm rotor', brand: 'Galfer', tier: 'budget',
          priceDelta: 120, summary: 'Best per-dollar brake upgrade.',
          specs: { rotor: '220 mm wave', material: 'Stainless heat-treated', boost: '+20% stopping power vs stock' } },
        { id: 'magura-mt5', name: 'Magura MT5 4-piston', brand: 'Magura', tier: 'mid',
          priceDelta: 640, summary: '2025 best-value 4-piston system.',
          specs: { caliper: '4-piston aluminum', lever: '2-finger', pads: 'Organic, pre-bled hoses' } },
        { id: 'magura-mt7', name: 'Magura MT7 Pro', brand: 'Magura', tier: 'premium',
          priceDelta: 1090, summary: 'Premium 1-finger HC lever.',
          specs: { caliper: '4-piston pro', lever: 'HC 1-finger', pads: 'Race compound' } }
      ]
    },
    {
      id: 'headlight',
      number: '15',
      title: 'Headlight',
      blurb: 'Plug-and-play kits built for these bikes.',
      options: [
        { id: 'stock-light', name: 'Stock', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'OEM halogen.', specs: { lumens: '~600' } },
        { id: 'cyclops-flush', name: 'Cyclops Headlight Kit', brand: 'Cyclops', tier: 'mid',
          priceDelta: 240, summary: 'Talaria flush-mount favorite.',
          specs: { lumens: '~1,800', install: 'Hardwire required' } },
        { id: 'bd-s2-pro', name: 'Baja Designs S2 Pro kit', brand: 'Baja Designs', tier: 'mid',
          priceDelta: 310, summary: '2,245 raw lumens. Plug-and-play.',
          specs: { lumens: '2,245', beam: 'Driving/combo' } },
        { id: 'bd-squadron-pro', name: 'Baja Designs Squadron Pro', brand: 'Baja Designs', tier: 'premium',
          priceDelta: 410, summary: 'Serious night-trail. 4,095 raw lumens.',
          specs: { lumens: '4,095', beam: 'Driving/combo', amber: 'Amber lens included' } }
      ]
    },
    {
      id: 'mirrors',
      number: '16',
      title: 'Mirrors',
      blurb: 'Cross-platform favorite. Lifetime warranty.',
      options: [
        { id: 'none-mirrors', name: 'None', brand: '—', tier: 'budget',
          priceDelta: 0, summary: 'No mirrors.', specs: {} },
        { id: 'doubletake-v2', name: 'Adventure Mirror V2 pair', brand: 'Doubletake', tier: 'budget',
          priceDelta: 126, summary: 'Baseball-bat tested. Zytel + RAM ball.',
          specs: { body: 'Glass-filled Zytel', mount: 'RAM ball', warranty: 'Lifetime' } },
        { id: 'crg-bar-end', name: 'CRG Hindsight bar-end', brand: 'CRG', tier: 'mid',
          priceDelta: 135, summary: 'Premium street look.',
          specs: { mount: 'Bar-end clamp', glass: 'Convex tinted' } }
      ]
    },
    {
      id: 'fender',
      number: '17',
      title: 'Mudguards',
      blurb: 'Keep the mud off you and the bike.',
      options: [
        { id: 'none-fender', name: 'None', brand: '—', tier: 'budget',
          priceDelta: 0, summary: 'No fenders.', specs: {} },
        { id: 'acerbis-front', name: 'Acerbis Front Fender', brand: 'Acerbis', tier: 'budget',
          priceDelta: 45, summary: 'Race-style standard.',
          specs: { fitment: 'Universal MX' } },
        { id: 'gritshift-v2', name: 'Extended Rear Fender V2 + shrouds', brand: 'GritShift', tier: 'budget',
          priceDelta: 95, summary: 'Most-recommended on r/Sur_Ron.',
          specs: { fitment: 'Sur-Ron LBX, Talaria, Segway', material: 'ABS', install: 'Bolt-on, no drill' } },
        { id: 'mto-carbon', name: 'MTO Brothers Carbon Front Fender', brand: 'MTO Brothers', tier: 'mid',
          priceDelta: 159, summary: 'Premium plug-and-play carbon.',
          specs: { material: 'Real carbon fiber', install: 'Plug-and-play' } }
      ]
    },
    {
      id: 'charger',
      number: '18',
      title: 'Charger',
      blurb: 'Cut your charge time in half.',
      options: [
        { id: 'stock-charger', name: 'Stock 5A', brand: 'OEM', tier: 'budget',
          priceDelta: 0, summary: 'OEM 5A charger.',
          specs: { amperage: '5A', time: '4.5 hr full' } },
        { id: 'luna-10a', name: 'Luna 10A', brand: 'Luna Cycle', tier: 'mid',
          priceDelta: 209, summary: 'Trustworthy 10A replacement.',
          specs: { amperage: '10A', time: '~2.5 hr full' } },
        { id: 'ebmx-15a', name: 'EBMX 15A fast charger', brand: 'EBMX', tier: 'mid',
          priceDelta: 359, summary: '1,005 W. Waterproof. 150% faster.',
          specs: { amperage: '15A', power: '1,005 W', time: '~1.5 hr full', case: 'IP65 waterproof' } },
        { id: 'allchargers-prog', name: 'AllChargers programmable', brand: 'AllChargers', tier: 'premium',
          priceDelta: 399, summary: 'Set end voltage to 80% for battery longevity.',
          specs: { endVoltage: 'Programmable 80–100%', interface: 'Onboard display' } }
      ]
    },
    {
      id: 'lock',
      number: '19',
      title: 'Lock',
      blurb: 'The U-lock arms race ended in 2025.',
      options: [
        { id: 'none-lock', name: 'None', brand: '—', tier: 'budget',
          priceDelta: 0, summary: 'No lock.', specs: {} },
        { id: 'kryptonite-ny-mini', name: 'NY Fahgettaboudit Mini', brand: 'Kryptonite', tier: 'budget',
          priceDelta: 160, summary: 'Sold Secure Gold. 18 mm shackle.',
          specs: { shackle: '18 mm hardened', rating: 'Sold Secure Gold' } },
        { id: 'abus-bordo', name: 'Bordo XPlus 6500A Alarm folding', brand: 'ABUS', tier: 'mid',
          priceDelta: 219, summary: 'Super73 co-branded. 100 dB alarm.',
          specs: { type: 'Folding', alarm: '100 dB', rating: 'Sold Secure Gold' } },
        { id: 'hiplok-d1000', name: 'Hiplok D1000', brand: 'Hiplok', tier: 'mid',
          priceDelta: 379, summary: '2025 gold standard. Angle-grinder resistant.',
          specs: { rating: 'Sold Secure Diamond', resistance: 'Angle-grinder tested', warranty: '10 yr' } }
      ]
    },
    {
      id: 'cargo',
      number: '20',
      title: 'Rack & bags',
      blurb: 'For commuters and overnight rides.',
      options: [
        { id: 'none-cargo', name: 'None', brand: '—', tier: 'budget',
          priceDelta: 0, summary: 'No racks or bags.', specs: {} },
        { id: 'kemimoto-rack', name: 'KEMIMOTO rear rack', brand: 'KEMIMOTO', tier: 'budget',
          priceDelta: 70, summary: 'Model-specific. Holds 12 lb.',
          specs: { fitment: 'Sur-Ron / Talaria / Segway', capacity: '12 lb', material: 'Powder-coated steel' } },
        { id: 'ccw-tank-bag', name: 'CCW tank bag', brand: 'Charged Cycle Works', tier: 'mid',
          priceDelta: 120, summary: 'Soft luggage. Dominant CCW pick.',
          specs: { capacity: '4 L', mounting: 'Magnetic + strap', water: 'Water-resistant' } },
        { id: 'cnc-s-series', name: 'S-Series rack + crate (Super73)', brand: 'Chained and Charged', tier: 'mid',
          priceDelta: 229, summary: 'Most-purchased Super73 cargo kit.',
          specs: { fitment: 'Super73 S2 / RX', material: 'Aluminum' },
          applicableBikes: ['super73-rx', 'super73-zx'] }
      ]
    },
    {
      id: 'safety',
      number: '21',
      title: 'Safety pack',
      blurb: 'Helmet + gloves bundled, properly sized.',
      options: [
        { id: 'none-safety', name: 'None', brand: '—', tier: 'budget',
          priceDelta: 0, summary: 'Bring your own.', specs: {} },
        { id: 'street-pack', name: 'Street pack', brand: 'Ruroc / 100%', tier: 'mid',
          priceDelta: 430, summary: 'Ruroc Atlas 4.0 + 100% Brisker gloves.',
          specs: { helmet: 'Ruroc Atlas 4.0 — ECE 22.06', gloves: '100% Brisker', wind: '57% quieter than prior Atlas' } },
        { id: 'dirt-pack', name: 'Dirt pack', brand: 'Fox / Fox', tier: 'mid',
          priceDelta: 610, summary: 'Fox V3 RS helmet + Fox Dirtpaw gloves.',
          specs: { helmet: 'Fox V3 RS — MIPS Integra Split', gloves: 'Fox Dirtpaw', cert: 'DOT / ECE 22.06' } },
        { id: 'street-premium-pack', name: 'Street premium pack', brand: 'Ruroc / Knox', tier: 'premium',
          priceDelta: 615, summary: 'Ruroc Eox + Knox Orsa OR3.',
          specs: { helmet: 'Ruroc Eox — 2025 flagship', gloves: 'Knox Orsa OR3' } },
        { id: 'premium-dirt-pack', name: 'Premium dirt pack', brand: '6D / Alpinestars', tier: 'premium',
          priceDelta: 795, summary: '6D ATR-3 + Alpinestars SP-8 V3.',
          specs: { helmet: '6D ATR-3 — ODS rotational tech', gloves: 'Alpinestars SP-8 V3', warranty: 'Rebuildable after impact' } }
      ]
    }
  ];

  // ----- Rides (mock social feed) — refreshed for new bike slugs --

  var RIDES = [
    { id: 'r1', handle: '@jadenrides', age: 13, city: 'Austin, TX', bike: 'sur-ron-light-bee-x',
      kind: 'TRICK CLIP', when: '2 min ago', likes: 8243, comments: 412, shares: 412,
      caption: 'First ride on the LBX. PVD-look wrap in sunlight is unreal.',
      mods: ['Satin black PVD-look', 'EBMX 72V 42Ah QS8', 'Warp 9 Racing 16/19 anodized'],
      finish: '#1A1A1A' },
    { id: 'r2', handle: '@mayacruises', age: 14, city: 'San Diego, CA', bike: 'super73-rx',
      kind: 'REVEAL', when: '12 min ago', likes: 2143, comments: 89, shares: 41,
      caption: 'Mom let me get this for my birthday and I haven\'t stopped riding all weekend.',
      mods: ['Brown leather banana', 'Matte clear', 'CRG Hindsight bar-end'],
      finish: '#5A2D14' },
    { id: 'r3', handle: '@coletheripper', age: 15, city: 'Boulder, CO', bike: 'talaria-sting-mx4',
      kind: 'TRICK CLIP', when: '1 hr ago', likes: 6812, comments: 220, shares: 198,
      caption: 'Hit a 6ft step-down at the spillway. MX4 frame is bulletproof.',
      mods: ['FastAce ALX13RC 2.0', 'MaxxEnduro', 'Galfer Wave 220 mm rotor'],
      finish: '#D11515' },
    { id: 'r4', handle: '@eli11', age: 11, city: 'Tulsa, OK', bike: 'macfox-x2',
      kind: 'REVEAL', when: '3 hr ago', likes: 1411, comments: 56, shares: 22,
      caption: 'My very first e-bike. I named her Sparky.',
      mods: ['Orange plate', 'Adventure Mirror V2 pair'],
      finish: '#C8FF00' },
    { id: 'r5', handle: '@sofiarides', age: 13, city: 'Brooklyn, NY', bike: 'super73-zx',
      kind: 'BUILD UPDATE', when: '6 hr ago', likes: 3214, comments: 102, shares: 78,
      caption: 'Day 3 of the build. Just installed the BAC855. So smooth.',
      mods: ['Handlworks BAC855', 'MX seat (taller, slim)', 'ProTaper A50 (2" rise)'],
      finish: '#0A0A0A' },
    { id: 'r6', handle: '@theogarage', age: 12, city: 'Portland, OR', bike: 'sur-ron-ultra-bee',
      kind: 'GARAGE TOUR', when: 'yesterday', likes: 4502, comments: 184, shares: 90,
      caption: 'Three Sur-Rons in one garage. Living the dream.',
      mods: ['Forged carbon wrap', 'Rogue lock-on', 'Orange plate'],
      finish: '#0F0F0F' },
    { id: 'r7', handle: '@noahsdirt', age: 16, city: 'Denver, CO', bike: 'etm-rtr-xl',
      kind: 'MOD DROP', when: '2 days ago', likes: 5601, comments: 278, shares: 121,
      caption: 'Just dropped the X-9000 V3 in the RTR XL. Throttle response is a different planet.',
      mods: ['EBMX X-9000 V3', 'EBMX 72V 42Ah QS8', 'Magura MT7 Pro'],
      finish: '#FF5A1F' },
    { id: 'r8', handle: '@racing_kai', age: 16, city: 'Costa Mesa, CA', bike: 'stark-varg',
      kind: 'EVENT', when: '3 days ago', likes: 9821, comments: 502, shares: 311,
      caption: 'Took the VARG to a local AMA race. Beat everyone on a 250F.',
      mods: ['EXT Ferro Fork', 'Öhlins TTX custom', 'Premium dirt pack'],
      finish: '#000000' }
  ];

  // ----- Reviews (touched to use new bike names) ------------------

  var REVIEWS = [
    { id: 'rv1', stars: 5, when: '2 weeks ago', author: 'Jake B.', age: '14', city: 'San Diego',
      verifiedBuild: 'Sur-Ron Light Bee X + Satin black PVD-look', helpful: 87, withPhotos: true,
      title: 'Better than my friend\'s old Sur-Ron.',
      body: 'Got the 2025 LBX with the EBMX battery and Galfer brakes. Hits 47 like nothing and the wrap looks crazy. Customer service answered in 2 hours. 10/10.' },
    { id: 'rv2', stars: 5, when: '3 weeks ago', author: 'Sarah M.', age: 'parent', city: 'Boulder',
      verifiedBuild: 'Super73 RX + Matte clear', helpful: 64, withPhotos: false, isParent: true,
      title: 'Worth every penny (says the parent).',
      body: 'Bought the RX for my daughter\'s 13th. The builder was fun for HER to use. Shipped in a week. She hasn\'t stopped riding. Safer than a moped, faster than her old bike.' },
    { id: 'rv3', stars: 4, when: '1 month ago', author: 'Eli K.', age: '11', city: 'Tulsa',
      verifiedBuild: 'MacFox X2 — stock build', helpful: 41, withPhotos: true,
      title: 'Sick bike, wish I\'d sprung for the dual-battery.',
      body: 'Looks insane, handles great, but the single-battery only gets me about 30 miles. Should\'ve paid for the dual. Lesson learned.' },
    { id: 'rv4', stars: 5, when: '1 month ago', author: 'Marcus T.', age: '15', city: 'Phoenix',
      verifiedBuild: 'Talaria Sting MX4 + Forged carbon + Magura MT5', helpful: 56, withPhotos: true,
      title: 'The brakes alone justify the upgrade.',
      body: 'Did the Magura MT5 swap day one. Night and day difference vs stock. The carbon wrap holds up to dust like a champ.' },
    { id: 'rv5', stars: 5, when: '6 weeks ago', author: 'Priya R.', age: 'parent', city: 'Seattle',
      verifiedBuild: 'Super73 ZX', helpful: 38, withPhotos: false, isParent: true,
      title: 'Bought it with my son. Best birthday yet.',
      body: 'We did the split-pay. He put down his birthday money and I covered the rest. Whole experience felt like buying a Tesla. Highly recommend the parent-share feature.' },
    { id: 'rv6', stars: 5, when: '6 weeks ago', author: 'Cole P.', age: '15', city: 'Boulder',
      verifiedBuild: 'Sur-Ron Light Bee X + FastAce + EBMX X-9000 V3', helpful: 92, withPhotos: true,
      title: 'Full send.',
      body: 'I race local hare scrambles and the bike keeps up with full-size 250s on the right setup. Fork upgrade made the biggest single difference.' },
    { id: 'rv7', stars: 4, when: '7 weeks ago', author: 'Sofia L.', age: '13', city: 'Brooklyn',
      verifiedBuild: 'Super73 RX + Brown leather banana', helpful: 28, withPhotos: true,
      title: 'Cute, fast, school is jealous.',
      body: 'Wish there was a smaller leg-reach option. Otherwise perfect. The wishlist feature got my parents to actually buy this without arguing.' },
    { id: 'rv8', stars: 5, when: '2 months ago', author: 'Theo M.', age: '12', city: 'Portland',
      verifiedBuild: 'ETM RTR Sport', helpful: 31, withPhotos: false,
      title: 'My friends saved up for one too.',
      body: 'Once one of us got the RTR, three more friends bought one. The Rides feed is sick — I see my own video on there now.' },
    { id: 'rv9', stars: 5, when: '2 months ago', author: 'Ben H.', age: 'parent', city: 'Atlanta',
      verifiedBuild: 'Rawrr Mantis', helpful: 22, withPhotos: false, isParent: true,
      title: 'Build quality is real for the price.',
      body: 'I expected a toy. It\'s not a toy. Welds are clean, electronics are well-routed, battery has a real BMS. Worth the price.' },
    { id: 'rv10', stars: 4, when: '3 months ago', author: 'Noah Z.', age: '16', city: 'Denver',
      verifiedBuild: 'ETM RTR XL + EBMX X-9000 V3 + 72V 42Ah', helpful: 47, withPhotos: true,
      title: 'X-9000 V3 is wild but expect a learning curve.',
      body: 'Took me a day to dial in the power-mode presets. Once tuned, it\'s incredible. Knock a star off for the learning curve at first.' }
  ];

  // ----- Star rating breakdown for Reviews hero -------------------

  var REVIEW_BREAKDOWN = { five: 82, four: 11, three: 4, two: 2, one: 1 };
  var REVIEW_OVERALL = { stars: 4.8, count: 1243 };

  window.MAXRIDES_DATA = {
    BIKES: BIKES,
    BIKE_CATEGORIES: BIKE_CATEGORIES,
    FRAME_COLORS: FRAME_COLORS,
    COMPONENT_CATEGORIES: COMPONENT_CATEGORIES,
    TIER_RANK: TIER_RANK,
    RIDES: RIDES,
    REVIEWS: REVIEWS,
    REVIEW_BREAKDOWN: REVIEW_BREAKDOWN,
    REVIEW_OVERALL: REVIEW_OVERALL,

    findBike: function (slug) { return BIKES.find(function (b) { return b.slug === slug; }); },
    bikesByCategory: function (catId) { return BIKES.filter(function (b) { return b.category === catId; }); }
  };
})();
