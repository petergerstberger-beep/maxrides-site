# MaxRides Build Plan — Ship Tomorrow

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A live URL showing all 8 designed MaxRides pages working — Home, Bike Detail (×3), Builder, Rides, Remix sheet, Reviews, Cart, Wishlist + Share-to-parent — deployed to Vercel by tomorrow.

**Architecture:** Next.js 14 App Router + TypeScript + Tailwind for the brand theme (dark + orange) + Framer Motion for cinematic scroll + Stripe (test mode) for checkout + localStorage for wishlist/cart state (no DB or accounts in v1). All product data hardcoded in `data/` as typed JSON until the real catalog lands.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Stripe (test), Vercel.

---

## File Structure

```
/src
  /app
    /layout.tsx                  — root layout, dark theme, font
    /page.tsx                    — Home (cinematic scroll story)
    /bikes/[slug]/page.tsx       — Bike Detail (3 slugs: dirt-01, cruiser, starter)
    /build/page.tsx              — Builder (configurator)
    /rides/page.tsx              — TikTok-style feed
    /reviews/page.tsx            — Reviews list
    /cart/page.tsx               — Cart + Stripe test checkout
    /wishlist/page.tsx           — Wishlist + Share-to-parent
    /share/[id]/page.tsx         — Parent-facing share view (public, no login)
  /components
    BikeSilhouetteSVG.tsx        — color-swappable SVG (used everywhere as placeholder)
    NavBar.tsx                   — top header
    BottomNav.tsx                — Home/Shop/+/Saved/You with the giant orange +
    PhoneShell.tsx               — used only on the marketing pages for demo
    BuilderCategorySection.tsx   — one category in the Builder (color, wheels, etc.)
    OptionCard.tsx               — spec-rich option card in Builder
    RideCard.tsx                 — single Rides feed video card
    RemixSheet.tsx               — bottom sheet that opens from a Ride
    ReviewCard.tsx
    WishlistBuildCard.tsx
    ShareToParentSheet.tsx
  /data
    bikes.ts                     — the 3 bikes with prices & specs
    components.ts                — all 21 category options with prices & specs
    rides.ts                     — 12 mock Rides posts
    reviews.ts                   — 10 mock reviews
  /lib
    brand.ts                     — color tokens (#0A0A0A, #FF5A1F, etc.)
    cart.ts                      — localStorage helpers
    wishlist.ts                  — localStorage helpers
    stripe.ts                    — Stripe checkout-session creator
  /styles
    globals.css                  — Tailwind base + brand vars
```

---

## Task list (bite-sized steps)

### Task 1: Scaffold the Next.js project

- [ ] Initialize `npx create-next-app@latest maxrides --typescript --tailwind --app --no-src-dir`
- [ ] Install dependencies: `npm i framer-motion @stripe/stripe-js stripe lucide-react clsx`
- [ ] Verify it runs: `npm run dev` and confirm localhost:3000 shows the boilerplate
- [ ] Commit: `git init && git add . && git commit -m "feat: scaffold maxrides next.js project"`

### Task 2: Wire the brand theme

- [ ] Create `lib/brand.ts` exporting: `BG = '#0A0A0A'`, `ACCENT = '#FF5A1F'`, `TEXT_PRIMARY = '#FFFFFF'`, `TEXT_SECONDARY = '#888888'`, `TEXT_TERTIARY = '#666666'`, `SURFACE = '#141414'`
- [ ] Extend `tailwind.config.ts` with these colors as theme tokens (`brand.bg`, `brand.accent`, etc.)
- [ ] Set `app/layout.tsx` to apply `bg-brand-bg text-white` on `<body>`, import Inter font
- [ ] Verify by visiting `/` — page should be near-black

### Task 3: Build the BikeSilhouetteSVG component

- [ ] Component takes `bike: 'dirt-01' | 'cruiser' | 'starter'` and `accentColor: string` props
- [ ] Returns the SVG we used in the wireframes, with the accent color applied to frame triangle, plate, banner-seat outline, and handlebar fork
- [ ] Test by rendering three of these on a scratch page in all three colors

### Task 4: Build the shared layout components

- [ ] `NavBar.tsx` — top header with "maxrides" wordmark + Cart link + menu icon
- [ ] `BottomNav.tsx` — 5-icon nav with Home / Shop / **+** (giant orange, links to `/build`) / Saved (Wishlist) / You. Renders only on pages that benefit from social-feed style (Rides, Wishlist).
- [ ] Add both to `layout.tsx`

### Task 5: Encode the product data

- [ ] `data/bikes.ts` — 3 bikes with: slug, name, tagline, basePrice, topSpeed, range, motor, weight, battery, suspension
- [ ] `data/components.ts` — all 21 categories, each with an array of options including: name, brand, priceDelta, spec object (a key-value spec sheet rendered in OptionCard), optional `applicableBikes` filter
- [ ] Use the REFRESHED 2025-2026 picks from the design spec (Magura MT5, EBMX X-9000 V3, Nexbat 72V, Fox V3 RS, Ruroc Atlas 4.0, ProTaper A76, Doubletake mirrors, Hiplok D1000, etc.)

### Task 6: Build the Home page (cinematic scroll)

- [ ] `app/page.tsx` renders 7 sections stacked vertically with snap-scroll:
  1. Dirt 01 hero
  2. Cruiser hero
  3. Starter hero
  4. Builder teaser ("Make it yours.")
  5. Rides teaser ("Real kids. Real first rides.")
  6. Reviews teaser ("4.8★ from 1,243 riders.")
  7. Footer
- [ ] Each bike hero: section label ("01 · DIRT"), big BikeSilhouetteSVG, name, tagline, price in orange, two buttons (Build it / Specs)
- [ ] Use Framer Motion to animate each section's fade-in on scroll

### Task 7: Build the Bike Detail page

- [ ] `app/bikes/[slug]/page.tsx` — dynamic route, loads from `data/bikes.ts`
- [ ] Sections: hero photo placeholder (BikeSilhouetteSVG in big frame), title block (label/name/tagline/price/CTA), Specs grid, "Make it yours" customization preview, "What's in the box", Riders Say (first review), Watch (first ride video placeholder), sticky bottom purchase bar
- [ ] CTA "Build it →" routes to `/build?bike=<slug>`

### Task 8: Build the Builder page

- [ ] `app/build/page.tsx` — reads `?bike=` query param to pre-select a bike
- [ ] State: `selections` object keyed by category id → selected option id
- [ ] Sticky top: bike name, BikeSilhouetteSVG with the selected frame color, "Total" in orange (live recalculated from selections)
- [ ] Body: render all 21 `BuilderCategorySection` components from `data/components.ts`
- [ ] Each `OptionCard` shows: name, brand, spec grid (2-col label/value), price delta, ✓ checkmark when selected, 2px orange border when selected
- [ ] Sticky bottom: "Your build · $X,XXX" + "Add to cart →" (orange) + "Save to wishlist" (secondary)

### Task 9: Build the Rides feed

- [ ] `app/rides/page.tsx` — vertical full-screen feed
- [ ] Use `data/rides.ts` mock — 12 posts each with: handle, ageCity, bike slug, finish, mods array, caption, postType (TRICK/REVEAL/BUILD/GARAGE/EVENT), likes, comments
- [ ] Render one post per viewport height, snap scroll
- [ ] Each post: BikeSilhouetteSVG in the "video area" with the post's color/finish, post-type badge top-left, right-rail engagement stack, bottom-left overlay (handle / caption / spec chips / location), sticky "Remix this build →" CTA
- [ ] Tapping a spec chip toggles a filter pill on the feed

### Task 10: Build the Remix sheet

- [ ] `components/RemixSheet.tsx` — bottom modal sheet
- [ ] Opens when "Remix this build" is tapped, pre-loads the post's mods as checkboxes
- [ ] Personalized items (custom plate with the original poster's number) default-unchecked
- [ ] Apply-to picker shows all 3 bikes; user picks which to apply mods to; selected price recalculates
- [ ] "Build it →" navigates to `/build?bike=<slug>&preload=<encoded-selections>`

### Task 11: Build the Reviews page

- [ ] `app/reviews/page.tsx`
- [ ] Hero: big "4.8" + star row + total count + breakdown bars (% per star tier)
- [ ] Filter pills (bike model + With photos / Verified / Parents) and Sort dropdown
- [ ] List of `ReviewCard`s from `data/reviews.ts` (10 mock reviews, mix of 5★ and 4★)
- [ ] "Load more" button (no-op for v1 since data is static)
- [ ] "Your review" CTA at bottom (no-op)

### Task 12: Build the Cart + Stripe checkout

- [ ] `app/cart/page.tsx`
- [ ] Cart state from `lib/cart.ts` (localStorage-backed)
- [ ] Each cart item shows: bike thumbnail (BikeSilhouetteSVG with selected colors), name, build spec breakdown (per-mod price), quantity stepper, edit / remove
- [ ] Order summary block (subtotal, shipping FREE, tax estimate, total)
- [ ] "Checkout securely →" button posts to `/api/checkout` (server route) which creates a Stripe Checkout session in **test mode** and redirects to the Stripe hosted page
- [ ] Stripe test card `4242 4242 4242 4242` works for verification

### Task 13: Build the Wishlist + Share-to-parent

- [ ] `app/wishlist/page.tsx`
- [ ] Wishlist state from `lib/wishlist.ts` (localStorage-backed; "Save to wishlist" on Builder writes here)
- [ ] Each wishlist item: BikeSilhouetteSVG + kid-named title + spec summary + total + three buttons (Send to mom / Edit / Share)
- [ ] "+ Add another dream build" tile
- [ ] "FOR PARENTS · Pay together?" footer block
- [ ] `ShareToParentSheet.tsx` opens on "Send to mom": preview card with what parent sees + note textarea + send-via tiles (iMessage / Email / Copy link / QR) + split-cost toggle
- [ ] "Copy link" generates a URL `/share/<id>` where `<id>` is a base64-encoded build payload
- [ ] `app/share/[id]/page.tsx` — public parent-facing page: shows the build + a giant "Buy it now →" button straight to Stripe Checkout

### Task 14: Polish + deploy

- [ ] Smoke-test every page on a phone-width viewport (375px)
- [ ] Fix any obvious wrapping / overflow issues
- [ ] Add `metadata` to each page (title + description)
- [ ] Push to a new GitHub repo
- [ ] Connect to Vercel, deploy, confirm the live URL works end-to-end
- [ ] Verify: load home → tap bike → tap Build → configure → add to cart → checkout with `4242 4242 4242 4242` → success page

---

## What this delivers tomorrow

A live URL (`maxrides.vercel.app` or similar) where:
- You can scroll the cinematic homepage
- Tap into any of the 3 bikes
- Open the Builder and customize across all 21 categories with live price updates
- Open the Rides feed, see mock content, tap Remix on any post
- See Reviews
- Add a build to cart and run a real Stripe test-mode checkout
- Save dream builds to a wishlist and generate a shareable link for a parent

## Deferred to v2 (with low effort)

- Swap SVG placeholders for real product photography when available
- Swap mock Rides JSON for real video uploads from a CMS or Cloudflare Stream
- Add user accounts (Clerk or NextAuth) — replaces localStorage
- Flip Stripe to live mode and add real payment processing
- Point the real `maxrides.com` domain at Vercel (5-minute DNS change)
- Email/SMS the parent-share link (Resend or Twilio)

---

*End of build plan.*
