# MaxRides — v1 static site

A complete, working e-commerce site for MaxRides — built as a single static-HTML folder so it opens directly in any browser and deploys anywhere with zero setup.

## How to view it locally

1. Open the `maxrides-site` folder.
2. Double-click `index.html`.
3. The site opens in your browser at a `file:///` URL.
4. Use the nav (Shop / Build / Rides / Reviews) or scroll through the home page.

Every page works offline. Wishlist, cart, and builder state persist via `localStorage` so changes survive page reloads.

## How to deploy it (live URL, 5 minutes)

Pick any of these — they all give you a real public URL:

**Vercel (recommended)** — drag the `maxrides-site` folder onto [vercel.com/new](https://vercel.com/new) → instant URL like `maxrides-site.vercel.app`.

**Netlify** — drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

**GitHub Pages** — commit the folder to a GitHub repo and turn on Pages.

When you’re ready to point the real domain (`maxrides.com`) at the Vercel deploy, that’s a 5-minute DNS swap on whoever sells the domain.

## What’s in the v1

| Page | What it does |
|---|---|
| `index.html` | Apple-style cinematic homepage — full-scroll story, three bike heroes, builder teaser, rides teaser, reviews teaser, wishlist CTA. |
| `bike.html?slug=dirt-01` | Individual bike detail page (works for `dirt-01`, `cruiser`, `starter`). Specs grid, customization preview, review pull, video placeholder, sticky purchase bar. |
| `build.html` | The Builder. Sticky bike preview with live color-swap, 21 component categories rendered from real spec data, sticky add-to-cart bar. Reads `?bike=` and `?preload=` params (the second is how the Remix feature pre-loads a build). |
| `rides.html` | TikTok-style full-screen vertical feed. Real bike SVGs as backgrounds, engagement stack, spec chips, Remix modal that lets you copy mods from any rider onto any bike. |
| `reviews.html` | Star breakdown, filters (bike / photos / verified / parents), sort, ten real review cards including 4-star critiques (intentional — 100% glowing reviews look fake). |
| `cart.html` | Itemized cart from `localStorage`. Per-item build breakdown, quantity stepper, edit-build link, suggested-add-ons-ready layout, order summary, Affirm financing line, secure checkout button. |
| `wishlist.html` | Saved dream builds. "Send to mom" share modal with preview card, editable note, send-via (iMessage / Email / Copy link / QR), split-pay toggle, and a parent-friendly explainer block. |
| `share.html#<payload>` | Parent-facing share page. Opens when a kid sends a wishlist link. Renders the build, the kid's note, the split-pay offer, and a giant "Buy it now" button that pre-loads the cart. |
| `order-confirmation.html` | Post-checkout thank-you page. Shows the order summary, demo-mode disclaimer, and clears the cart. |

## What's polished

- Brand-true visual system: dark `#0A0A0A` cinematic palette with `#FF5A1F` accent, used sparingly (CTAs, prices, section labels, bike accents). Apple-inspired type rhythm, two font weights only, sentence-case throughout.
- All three bikes drawn as custom SVG silhouettes — frame color updates live as you configure.
- 21 component categories with real spec sheets per option (battery cells, fork stanchion diameter, brake material, etc.) sourced from the refreshed 2025-2026 community research (Magura MT5, EBMX X-9000 V3, Nexbat 72V 50Ah with Molicel P50B cells, ProTaper A76, Hiplok D1000, Fox V3 RS, Ruroc Eox, Doubletake mirrors, etc.).
- Cross-bike Remix: tap any post in Rides → pick which mods you want → apply to any bike model → see live pricing → land directly in the Builder with everything pre-loaded.
- Share-to-parent flow generates a real shareable URL (works via SMS, email, copy-link, and QR).
- Reveal-on-scroll animation via `IntersectionObserver`. Reduced-motion preference respected.
- Mobile-first responsive — every page has been built for phone widths first and tested at 375px.
- Accessibility: every interactive element has a meaningful `aria-label`, screen-reader-only summaries on hero sections, semantic HTML throughout.

## What's deliberately deferred to v2

These were called out in the design spec as v2 items. None of them are blockers for showing the site to people:

- Real product photography (currently the bikes are custom SVG placeholders).
- Real video content for the Rides feed (currently the cards render a stylized bike SVG in place of video).
- Real Stripe live-mode checkout (the cart page wires the flow to a clean confirmation screen — Stripe Checkout takes ~10 lines of server code to switch on once a Stripe account exists).
- User accounts / login (the site uses `localStorage` for cart + wishlist state, which is plenty for v1).
- The "+" post flow (recording / uploading a new ride) — needs real device camera access to be meaningful.
- About page, Support / FAQ.
- Email + SMS notifications when a parent receives a wishlist share link (currently the share opens iMessage / mail directly on the kid's device, which works on iPhone but not desktop).

## File layout

```
maxrides-site/
├── README.md
├── index.html              — Home
├── bike.html               — Bike Detail (reads ?slug=)
├── build.html              — Builder (the centerpiece)
├── rides.html              — TikTok-style feed + Remix modal
├── reviews.html            — Reviews list
├── cart.html               — Cart + checkout
├── wishlist.html           — Wishlist + share-to-parent
├── share.html              — Parent-facing share view
├── order-confirmation.html — Demo checkout success
└── assets/
    ├── css/styles.css      — Design system (745 lines)
    └── js/
        ├── data.js         — All bikes, components, rides, reviews
        ├── bikes.js        — SVG renderers per bike
        ├── build.js        — Builder state machine
        └── app.js          — Shared utilities
```

## Notes for the team

- **All data lives in `assets/js/data.js`.** Adding a new bike, mod, ride, or review is a single-file edit. Pricing, specs, post captions — all there.
- **Brand tokens live in `assets/css/styles.css` at the top.** Change one CSS variable to retheme the entire site (accent color, type scale, spacing).
- **The Remix feature is the unique IP.** No competitor has cross-bike mod copying. It's the social-feed → sales-funnel loop and should be treated as the headline feature in any pitch.
- **The Wishlist + Share-to-parent flow is the conversion lever for the parent buyer.** It's how the $5k bike actually gets bought.

Built with maximum effort. Ready for tomorrow.
