# MaxRides — Design Specification

**Date:** 2026-05-23
**Owner:** Max (with Pete)
**Status:** Wireframes approved · ready for engineering plan

---

## 1. Project Overview

**MaxRides** (maxrides.com) is an e-commerce website selling customizable e-bikes to teens and young riders. Every other major e-bike brand on the market is either utilitarian, loud, or aimed at adults — MaxRides occupies a deliberately untapped position: **Apple-style premium teen e-bikes with deep customization and a social feed that doubles as a sales engine.**

### Three things make MaxRides different

1. **Deep customization** — Customers pick a stock bike, then configure 21 component categories with real-world parts (ODI plates, EBMX batteries, Galfer brakes, Warp9 wheels, FastAce forks, etc.)
2. **Rides feed + Remix** — TikTok-style vertical video feed showing real customers' bikes, where any rider's mod combo can be copied with one tap and applied to any bike model in the lineup.
3. **Wishlist + Share-to-parent** — Kids save dream builds and send them to their parents with optional split-payment offers. Closes the kid-aspires / parent-buys gap that plagues teen e-bike sales.

---

## 2. Audience & Positioning

- **Primary customer:** teens and young riders, roughly ages 10–17
- **Secondary customer / real buyer:** parents of those teens (especially for higher tiers)
- **Positioning gap:** the teen e-bike market is dominated by Super73 (loud / colorful), Sur-Ron and Talaria (utilitarian / tuner-aesthetic), and Rad (entry-level / commuter). No competitor occupies the "Apple-style premium teen e-bike" space.
- **Price tier:** ~$999 entry → ~$5,000+ for a fully built top-tier bike with premium finishes
- **Mobile-first:** ~80%+ of teens browse on phones; site is designed phone-first, desktop second

---

## 3. Brand Identity

### Visual

| Element | Spec |
|---|---|
| Background | Near-black `#0A0A0A` |
| Primary text | Pure white `#FFFFFF` for headlines; gray `#888`–`#AAA` for secondary |
| Accent (electric orange) | `#FF5A1F` |
| Typography | Clean sans-serif (planned: Inter or SF Pro); two weights only (regular 400, medium 500) |
| Corner radius | Buttons / cards `8–12px`; large surface cards `14–16px` |
| Photography | Studio-clean, single spotlight, no clutter. Like Apple iPhone product pages. |

**Accent usage rule:** the orange is used **sparingly** — only on section labels, prices, primary CTAs, and bike accents. This discipline is what makes it feel premium instead of loud.

### Voice

- Confident, short, kid-readable
- Sentence-case headlines with periods: "The Dirt 01." · "Make it yours." · "Real kids. Real first rides."
- Uppercase section labels with letter-spacing: "01 · DIRT" · "BUILDER" · "REVIEWS"
- No corporate filler. "Built for the ride." not "Welcome to MaxRides, your premium destination for…"

---

## 4. Information Architecture

### Page list

1. **Home** — full-scroll cinematic story (one bike per screen, then Builder teaser, Rides teaser, Reviews teaser, footer)
2. **Bike Detail** — one per model (Dirt 01, Cruiser, Starter); hero photo carousel, specs, customization preview, reviews snippet, embedded first-ride video, sticky purchase CTA
3. **Builder** — the centerpiece. Sticky bike preview + live price; 21 component category sections each with spec-rich option cards; sticky add-to-cart bar.
4. **Rides** — TikTok-style vertical video feed. Replaces the earlier "Reveals" concept; broader content scope (trick clips, build updates, garage tours, mod drops, events — not just unboxings).
5. **Reviews** — overall rating + breakdown bars; filterable by bike model, by reviewer type (kids / parents / verified / with photos); individual review cards.
6. **Cart / Checkout** — itemized cart with full build breakdown, suggested add-ons, promo code, order summary, Affirm financing, Apple Pay.
7. **Wishlist** — saved dream builds, kid-named, with Send-to-parent action.
8. **Post Flow** — entry from a giant orange "+" button on every page; one-tap-easy posting.

### Global navigation

- **Top of every page:** tiny "maxrides" logo + minimal nav (cart icon + menu)
- **Bottom of social pages:** 5-icon nav with a prominent orange "+" in the center (Home · Shop · **+** · Saved · You)

### Deferred / not in MVP

- About / Our story
- Support / FAQ
- Account / Profile page (login flow not designed)
- Creator economy (revenue-sharing for remixed builds)

---

## 5. Bike Lineup

| Bike | Style | Inspired by | Starting price |
|---|---|---|---|
| **The Dirt 01** | Moto-style electric dirt bike | Sur-Ron Light Bee / Talaria | $2,499 |
| **The Cruiser** | Street cruiser / moped-style | Super73 R / RX | $1,899 |
| **The Starter** | Entry-level e-bike | Rad Power / smaller frame | $999 |

Model names are working titles and may evolve.

---

## 6. The Builder — Centerpiece Feature

### Pattern

```
[Sticky top]
  - Back / "Building · Dirt 01" / Save
  - Live bike preview (updates as components are selected)
  - Live total ($X,XXX)

[Scrollable middle]
  - Component categories 1 through 21
  - Each option = card with name + spec grid + price delta + visual indicator
  - Selected option highlighted with 2px orange border

[Sticky bottom]
  - "Your build · $X,XXX"
  - "Add to cart →" (orange) OR "Save to wishlist" (secondary)
```

### Component categories (21 total) — refreshed 2025-2026 picks

Pricing is suggested retail; final prices set when we plumb to a vendor catalog.

1. **Frame color** — 6 paint options (gloss orange, black, white, lime, purple, red)
2. **Finish (premium full-bike treatments)** — standard gloss (incl.); matte clear +$280; carbon-fiber wrap by REV797 / GGMS +$680; color-shift / chameleon wrap (3M 2080, Inozetek, Hexis) +$1,200; ECD Customs Dazzle color-shift kit +$450; satin black PVD-look wrap +$520. Hydro-dipping deliberately omitted (kills resale, UV fades 2–3 yr).
3. **Wheels** — stock 18" (incl.); **Warp9 Racing 16/19 anodized** set +$320 (7000-series rim, 7075-T6 hub, stainless spokes, 9.2 lb); **Excel × KKE 19/16** premium set +$540 (Takasago 7050-T6 rim, CNC 6082-T6 hub).
4. **Tires** — by riding style: **Dirt** — Maxxis MaxxEnduro +$180, Pirelli Scorpion MX32 +$210, Shinko 525 Cheater (DOT-legal hare-scramble) +$160; **Hybrid** — Shinko SR241 trials +$140, Shinko 244 +$120; **Street** — Pirelli MT 60 RS +$200 (Super73 default), Avon Street Runner +$110.
5. **ODI Plate** (with optional graphics stack) — orange / white / black plate +$45; UXA holographic graphic overlay +$25; Kalair custom plate skin +$40. Custom number/name field.
6. **Battery** — Stock 60V 32Ah (incl., ~40 mi); **Nexbat 72V 50Ah** with Molicel P50B cells +$1,650 (~75 mi, 300A continuous, integrated BMS); **EBMX 72V 42Ah** QS8 Race +$1,890 (potted stainless case, paired with X-9000 controller); **dual-battery setup** (Sur-Ron) or **ChiBatterySystems Ranger** (Super73 R/RX/S2) +$1,295 (~120 mi).
7. **Controller** — Stock (incl.); **EBMX X-9000 V3** +$1,420 (60kW peak, 1000A continuous, IMU with launch control, Bluetooth, 6 power modes — current 2025 dominant choice); **ASI BAC8000** +$1,690 (32kW peak, premium FOC tuning, legacy favorite); **Handlworks BAC855** +$1,250 (Super73-specific, 2.9 kW / 37 mph).
8. **Motor** — Stock (incl.); **Sotion 13kW (LBX) / 16kW (Ultra Bee, Talaria X3)** +$1,100; **KO Moto Factory-Spec** +$1,200. Note: motor swap is the *last* upgrade — battery + controller first.
9. **Front fork** — Stock (incl.); **FastAce ALX13RC 2.0** +$820 (37mm stanchions, 200mm travel — runaway #1 in 2025); **EXT Ferro Fork** +$2,500 (race / expert pick); spring-rate options 50/60/70 lb by rider weight.
10. **Rear shock** — Stock (incl.); **FastAce rear shock** + matched spring +$420 (450 lb stock / 500 / 550 / 600 lb by rider weight); **Luna DNM 550 lb spring kit** +$120 (cheapest acceptable upgrade); **Öhlins TTX** custom +$1,250 (race tier).
11. **Seat** — Stock (incl.); **Guts Racing Hardcore Gripper** custom (tall slim moto, two-tone ribbed) +$260; **Charged Cycle Works MX seat** +$240; **Super73-only:** Kanebilt brown leather +$220 or Blur Boundaries synthetic +$180.
12. **Grips** — Stock (incl.); **ODI Rogue lock-on** +$25 (top dirt pick); **ODI Emig Pro V2** +$30 (race-derived); **ODI Cush** +$28 (street/Super73); **Renthal Kevlar** dual-compound +$28.
13. **Handlebars** — Stock (incl.); **ProTaper A76 (3" rise)** +$95 (universal dirt pick); **ProTaper A50 (2" rise)** +$95; **Renthal Fatbar / Twinwall** +$135 (premium race choice); optional 1" stem riser +$45.
14. **Brakes** — Stock (incl.); **Galfer Wave 220mm front rotor** + caliper spacer +$120 (best per-dollar upgrade, +20% stopping); **Magura MT5 4-piston** full system +$640 (current best-value benchmark); **Magura MT7 Pro** +$1,090 (1-finger HC lever, premium pick); plus **Galfer purple e-bike pads** +$40.
15. **Headlight** — Stock (incl.); **Baja Designs S2 Pro kit** +$310 (2,245 raw lumens, plug-and-play, balanced pick); **Baja Designs Squadron Pro kit** +$410 (4,095 raw lumens, serious-night-trail pick); **Cyclops Headlight Kit** +$240 (Talaria X3 flush mount).
16. **Mirrors** — None (incl.); **Doubletake Adventure Mirror V2 pair** +$126 (cross-platform favorite, Zytel + RAM ball, lifetime warranty); **CRG Hindsight Lanesplitter bar-end** +$135 (premium street look, Super73).
17. **Mudguards / fenders** — None (incl.); **GritShift Extended Rear Fender V2 + Side Shrouds** +$95 (most-recommended); **Acerbis Front Fender** +$45 (race-style); **MTO Brothers Carbon Front Fender** +$159 (premium plug-and-play).
18. **Charger** — Stock 5A (incl.); **Luna 10A** fast charger +$209; **EBMX 15A** fast charger +$359 (1,005W, waterproof case); **AllChargers programmable** +$399 (set end-voltage to 80% for battery longevity).
19. **Lock** — None (incl.); **Hiplok D1000** +$379 (Sold Secure Diamond — only U-lock with proven angle-grinder resistance — new 2025 gold standard); **Kryptonite NY Fahgettaboudit Mini** +$160 (Sold Secure Gold); **ABUS Bordo XPlus 6500A Alarm folding** +$219 (Super73 co-branded).
20. **Rack & bags** — None (incl.); **KEMIMOTO Sur-Ron / Talaria rear rack** +$70 (model-specific); **Chained and Charged S-Series rear rack + crate** (Super73) +$229; **JFG battery cover bag** +$45; **Charged Cycle Works tank bag** +$120.
21. **Safety pack (helmet + gloves bundle)** — by style:
    - **Dirt pack** — Fox V3 RS helmet ($625) + Fox Dirtpaw gloves ($35) — bundled +$610
    - **Premium dirt pack** — 6D ATR-3 helmet ($790) + Alpinestars SP-8 V3 gloves ($89) — bundled +$795
    - **Street pack (Super73 / Cruiser)** — Ruroc Atlas 4.0 helmet ($429) + 100% Brisker gloves ($45) — bundled +$430
    - **Street premium pack** — Ruroc Eox ($599) + Knox Orsa OR3 gloves ($95) — bundled +$615

### Spec depth per option

Every option card displays a compact 2-column spec grid (e.g. for battery: cells, capacity, range, charge time, BMS, weight, warranty). This is what makes MaxRides feel premium — the customer sees they're not buying generic Chinese parts, they're buying named, spec'd components.

---

## 7. Rides — Social Feed + Remix

### Feed UX

- TikTok / YouTube Shorts-style vertical full-screen video feed
- Tabs at top: Latest / **For You** (default) / Following
- Right-rail engagement stack: profile + follow / ♡ likes / 💬 comments / ↗ share / ☆ save
- Bottom-left overlay: @handle, caption, **tappable spec chips** (bike model + each mod), location, timestamp
- Right edge progress dots showing video position in feed
- Tap to play/pause; swipe up = next video

### Content types (badges shown top-left)

- **TRICK CLIP** — kids landing jumps, doing stunts
- **REVEAL** — unboxing / first ride
- **BUILD UPDATE** — work-in-progress mods
- **GARAGE TOUR** — collections, setups
- **MOD DROP** — new accessory showcase
- **EVENT** — race / meetup footage

### Remix bottom sheet (the killer feature)

Triggered by tapping the orange "Remix this build" CTA at the bottom of any video.

```
[Remix @username]
"Pick the mods you want. Apply to any bike."

JADEN'S MODS
☑ Black chrome dip       +$950
☑ EBMX 72V battery       +$748
☑ Warp9 16/19 wheels     +$320
☐ ODI plate #73 (use mine)  +$45    ← auto-unchecked (personalized)
☑ Galfer Wave brakes     +$210

APPLY TO
○ Dirt 01 (Jaden's pick) $2,499
● Cruiser                $1,899     ← selected
○ Starter                $999

Cruiser + 4 mods · $4,127   (save 11%)

[Build it →]
```

The "Build it" button opens the full Builder pre-loaded with this remix. Critical: original creator should eventually earn store credit when their build is remixed (future iteration).

### Post Flow (must be dead-easy)

Mission-critical to the flywheel: posting must take ~10 seconds end-to-end.

**Entry:** Giant orange "+" button in bottom nav, on every page.

**Post screen UI:**
- Live recording preview (top, 9:16) with floating music / filter / text icons
- **Caption** — pre-filled by AI suggestion; "↻ generate" button for new suggestions; editable
- **Build chips** — auto-tagged from user's purchase record; each chip removable
- **Post type pills** — TRICK / REVEAL / BUILD / GARAGE; auto-selected based on AI-detected content; overridable
- **Cross-post checkboxes** — TikTok ☑, Instagram ☑, YouTube ☐
- **One sticky button** — "Share → to Rides + 2 socials"

Total user effort: hit + → record → hit Share. **The AI does the rest.**

---

## 8. Reviews

- **Hero:** big 4.8★ rating + total review count, with bar-graph breakdown of % at each star level
- **Filters:** by bike model (All / Dirt 01 / Cruiser / Starter), plus "With photos · 412" / "Verified · 1,127" / "Parents · 318" — the Parents filter is intentional: parents trust other parents
- **Sort:** Most helpful (default) / Most recent / Highest / Lowest
- **Review cards:** stars, title, body, photo strip (when present), name + age + city, ✓ Verified [bike + finish] badge in orange, helpful counter, timestamp
- **Critical reviews shown:** 4★ reviews with constructive feedback (e.g. "battery range is short — upgrade in builder") are deliberately not buried. Real critiques build more trust than wall-to-wall 5★.
- **CTA:** $25 store credit for verified buyers who submit reviews with photos

---

## 9. Cart / Checkout

- **Per-item card** showing the bike, **"Remixed from @username"** attribution if applicable, and the full **YOUR BUILD** spec sheet listing each mod and its price delta
- **Quantity stepper + Edit build + Remove** controls per item
- **"You might also like"** suggested add-ons (Fast charger, Kryptonite lock) inline before checkout
- **Promo code** field
- **Order summary:** Subtotal, Shipping (FREE over $999), Tax estimate, **Total** (large, orange)
- **Affirm** offer: "or 4 payments of $X with Affirm"
- **Two purchase buttons:** primary "Checkout securely →" (orange) and "Pay with apple pay" (secondary, native one-tap)
- **Trust signal row:** Free shipping over $999 · 2-yr warranty · 30-day returns · Secure checkout

---

## 10. Wishlist + Share-to-parent (conversion accelerator)

### Wishlist page

- Title: **"Dream builds · 2 saved · Send one to mom or dad to ask."**
- Stacked build cards. Each shows: thumbnail, kid-named title ("My dream Dirt 01"), one-line spec summary, total price, and three buttons: **"Send to mom →"** (primary, orange), "Edit" (returns to Builder), and ⌃ (share elsewhere)
- "+ Add another dream build" dashed card at the bottom — encourages multi-saving (kids will stack dreams)
- **"FOR PARENTS · Pay together?"** quiet section at the bottom that surfaces the split-payment option from the parent's angle

### Share-to-parent sheet (the kid-to-parent moment)

Triggered by tapping "Send to mom →".

- **Preview card** — exactly what the parent sees: "Max wants this for his birthday: The Dirt 01 · $5,319" + spec chips + a giant orange **"Buy it now →"** button. **One tap for the parent to purchase.** No login, no rebuilding the bike, no friction.
- **Add a note** — optional message from the kid; pre-filled with a default ("I'll do all my chores for a year 🙏") that's editable
- **Send via:** iMessage / Email / Copy link / QR code — four options because every family communicates differently
- **"Offer to split the cost"** — toggle. Kid contributes $X (from savings / birthday money / chore money), parent covers the rest. Order ships when both halves clear. Massive psychological lever — turns "no" into "yes with skin in the game"
- **Sticky orange button:** "Send to mom"

This is engineered to turn aspirational dreaming into actual purchases.

---

## 11. MVP Scope (what to build first)

### In scope for v1

1. Home (full-scroll cinematic)
2. Bike Detail (3 pages)
3. Builder (21 component categories with spec-rich option cards)
4. Rides feed
5. Remix bottom sheet (cross-bike mod copying)
6. Post flow (one-tap easy)
7. Reviews
8. Cart + Checkout (with Affirm + Apple Pay)
9. Wishlist + Share-to-parent (with split-pay)

### Defer to v2 / future

- About / Our story page
- Support / FAQ page
- Account / Profile + login
- Creator economy (rewards for remixed builds)
- Live streaming
- Comments + DMs
- Group-gift mode (multiple grandparents pool to buy a bike)
- Trick / build-of-the-week challenges
- Kid-funded layaway

---

## 12. Open Questions

These are decisions we deliberately deferred during the brainstorm:

- **Logo / wordmark** — "maxrides" lowercase is a working placeholder. Final mark TBD.
- **Bike model names** — "The Dirt 01," "The Cruiser," "The Starter" are working titles.
- **Tagline** — "Built for the ride." is the current placeholder.
- **Premium finish pricing** — chrome dip, color-shift, etc. pricing is estimated. Real-world cost-basis needs vendor research.
- **Photography / 3D render strategy** — current wireframes use SVG silhouettes; real product imagery is a major workstream.
- **Affirm / Klarna integration** — needs technical feasibility check.
- **Video hosting + moderation for Rides** — UGC content moderation will be ongoing (especially because users are minors).
- **Shipping logistics** for $999–$5,000 e-bikes — freight partners, white-glove delivery, returns process.
- **Warranty terms** and parts replacement policy.
- **Age verification** for performance tiers (top-spec Dirt 01 may need parent consent for purchase).

---

## 13. Why This Will Work

A short summary of the strategic bet, in plain language:

- Teens are an under-served, fast-growing segment in e-bikes. Existing brands ignore them or treat them like commuters.
- A premium minimal brand for teens is unclaimed white space.
- Deep customization gives every customer a personal bike — and gives the brand 21 upsell touchpoints per sale.
- Rides + Remix turns customers into content creators and content into a sales funnel — every post is shoppable, every shopper is a future poster.
- Wishlist + Share-to-parent converts kid aspiration into actual transactions by removing the kid-to-parent friction that kills most teen purchases.
- One-tap posting + cross-share to TikTok and Instagram makes MaxRides marketing free and continuous.

---

*End of design specification.*
