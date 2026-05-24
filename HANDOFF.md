# MaxRides — Handoff from Cowork to Claude Code

## READ THIS BEFORE YOU DO ANYTHING ELSE

You are about to work with **Max, age 13**. This is **the very first time he has ever used Claude** for anything. His dad **Pete** (peter.gerstberger@jiffyshirts.com) will be next to him for some of it but Max should drive whenever possible. He designed an e-commerce site for customizable teen e-bikes called **MaxRides** and now we need to put it on a real URL so he can finally **see his own creation on the internet** instead of just as files on a computer.

### The operating mode that must NOT be lost in this handoff

The Cowork Claude that built this site with Max operated in a specific way that worked for him. **Carry it forward exactly.**

1. **Ask before you move.** Never do more than one step in a row without checking in. After each step say something like "I just did X. Want me to do Y next?" and wait. Don't batch.
2. **Ask clarifying questions like he's the boss.** When something could go two ways, ask Max which way. Use multiple-choice phrasing when possible. He likes picking from options way more than open-ended questions. Lean into "do you want A or B?" rather than "how do you want it?"
3. **No assumed jargon. Ever.** He does NOT know what Finder, git, a repo, a branch, a commit, a remote, a token, a CLI, a PAT, a fetch, a clone, "ssh", a domain, DNS, HTTPS, GitHub Pages, or Vercel is. The first time you use any of those, **define it in one short sentence** like you're explaining it to a smart kid who's never heard the word. Example: "A repo is just a folder of files that lives on GitHub instead of just on your computer."
4. **He cannot read or understand terminal output.** When you run a shell command, the green/red text in the terminal is invisible to him in the experiential sense — he doesn't know what success looks like there. **Every command-line action MUST end with something he can SEE in a browser or app.** Tell him what to click or what URL to refresh after every meaningful step. The command line is your workshop; the browser is his theater.
5. **Patience is the goal, not speed.** His dad has explicitly said "max effort, no shortcuts, he has to understand." If you finish in 4 careful conversational rounds instead of 1 fast dump, that's a win.

### The bridge you're building

Right now Max has a folder full of HTML files on his Mac. To him, that's not a website — it's just files. **The job of this session is to take those files and bridge them to a real URL he can text to a friend and pull up on his phone.** That bridge crosses three "rooms":

- Room A — Files on his computer (he can see these in Finder)
- Room B — Git + GitHub (invisible to him — this is the tunnel)
- Room C — A live URL on the open internet (he can see this in his browser)

Your job is to walk him through Room B as fast as possible **while keeping him oriented in Rooms A and C** so he never feels lost. Every time something happens in Room B, you tell him what just changed in Room A or Room C. "I just took a snapshot of all your files — same files in Finder, now also tracked by git." "I just uploaded the snapshot to GitHub — refresh github.com/{username}/maxrides-site and you'll see your files appear." Etc.

### Background

We built the full v1 of MaxRides in a Cowork session — 9 pages, ~4,700 lines, all working locally. The Cowork sandbox there can't reach `api.github.com`, so we're handing the deployment to you because you can.

## What's already done

All 9 pages of MaxRides v1 are built and working as a pure static site (no build step, no `npm install`). The folder you're sitting in is the entire site.

Pages:
- `index.html` — Home (Apple-style cinematic scroll story with three bike heroes)
- `bike.html?slug=dirt-01|cruiser|starter` — Bike Detail
- `build.html` — Builder (21-category configurator, live bike-color preview, live total, persists to localStorage)
- `rides.html` — TikTok-style vertical feed with the Remix bottom-sheet (cross-bike mod copying — the unique IP)
- `reviews.html` — Filterable reviews list
- `cart.html` — Cart with full per-item build breakdown
- `wishlist.html` — Saved dream builds + Send-to-parent share flow
- `share.html` — Parent-facing share view (opens from kid's shared link)
- `order-confirmation.html` — Demo checkout success

Shared assets:
- `assets/css/styles.css` (745 lines — full design system)
- `assets/js/{data,bikes,build,app}.js`

Brand: dark `#0A0A0A` background, electric orange `#FF5A1F` accent used sparingly. Apple-inspired type rhythm. Real 2025-2026 component data (Magura MT5, EBMX X-9000 V3, Nexbat 72V 50Ah with Molicel P50B cells, ProTaper A76, Hiplok D1000, Fox V3 RS, Ruroc Eox, etc.).

There's a `README.md` here with a fuller walkthrough.

## Your job

**Deploy this site to a live URL via GitHub Pages**, under Pete's GitHub account, so Max can open his own site at a real URL on his phone. Pete wants the URL.

### How to pace it — one step, one check-in, one visible result

Each step below is a separate conversational round. Do the step → tell Max in one sentence what just changed in plain English → point him at something he can look at (Finder, github.com, or eventually the URL itself) → wait for him to say "ok, next" before continuing. **Do not chain steps.**

**Step 1 — Confirm we're in the right folder.**
- Action (you): `cd` into wherever the `maxrides-site` folder lives on Pete's Mac. Pete will paste the path or drag the folder onto Claude Code if your IDE supports it.
- Show Max: Open Finder to that folder. Tell him: "These are all the files that make up your website. We're going to put a copy of every one of these onto GitHub."
- Wait.

**Step 2 — Snapshot the files with git.**
- Action: `git init`, `git add .`, `git commit -m "feat: MaxRides v1"`.
- One-sentence explanation for Max: "Git just took a snapshot of every file in your folder. Nothing on your Mac looks different — it's just that now every file is also tracked so we can copy them all in one motion."
- Show Max: nothing visible yet — that's fine. Tell him "the next step is when something appears online."
- Wait.

**Step 3 — Create the empty repo on GitHub.**
- Action: `gh repo create maxrides-site --public --source=. --remote=origin` (or use the GitHub MCP, or curl the API with a PAT). Public is required for free Pages.
- Show Max: "Open github.com in your browser, sign in, and you should see an empty repository called `maxrides-site` at the top of your profile. Take a peek so you can see what 'empty' looks like." Wait for him to look.
- Wait.

**Step 4 — Push the files to GitHub.**
- Action: `git branch -M main`, `git push -u origin main`.
- Show Max: "Refresh the GitHub page. You'll see all the files from your folder now also on GitHub. Same files, different room." Let him scroll the file list and feel the moment.
- Wait.

**Step 5 — Turn on GitHub Pages.**
- Action: `gh api -X PUT /repos/{owner}/maxrides-site/pages -f source.branch=main -f source.path=/` (or click through Settings → Pages → Source: Deploy from a branch → main → / → Save).
- One-sentence explanation: "GitHub Pages is GitHub's free way to take a folder of files and turn it into a real website. We just turned it on. In about a minute it'll give us a real URL."
- Show Max: "Stay on the GitHub Pages settings tab — in about 60 seconds a green box will appear at the top with a URL that ends in `.github.io`."
- Wait.

**Step 6 — Open the URL together.**
- Action: poll `https://<owner>.github.io/maxrides-site/` until you get a 200. Could take 1–2 minutes the first time.
- Show Max: paste the URL into the chat. Tell him to open it on his phone too — say "Text yourself the link and open it on your phone."
- Sit with the moment. This is the payoff.
- Wait for his reaction before doing anything else.

**Step 7 — Tour it together at the URL.**
- Walk him through these in order, one at a time, asking him to do each before you move on:
  - Scroll the home page. See all three bikes.
  - Tap "Build it" on the Dirt 01.
  - Change the frame color. Watch the bike change.
  - Add to cart. Hit checkout. See the demo confirmation.
  - Open Rides. Tap "Remix this build" on any post.
  - Open Wishlist. Save a build. Hit "Send to mom →" and see the share preview.
- Ask Max what looks good, what looks weird, what's missing. Real feedback from him is the input to the next iteration.

## Success criteria

Max opens the URL on his phone or laptop and sees the same site he sees when he double-clicks `index.html` locally:
- Scrolling the home page reveals all three bike heroes
- "Build it →" goes to the configurator and changing the frame color updates the bike preview
- "Rides" loads with the eight mock posts
- "Remix this build" opens the modal
- Cart + checkout demo + order-confirmation flow works

## After the URL is live

- Paste the URL into the chat as a clean copy-pasteable line (he'll want to send it via iMessage).
- Tell Max in plain language: "This is now a real website on the internet. Anyone with this link can see your site on their phone, no setup needed."
- Mention casually that the checkout is currently demo-mode (no real money) and real payments turn on later when Pete sets up Stripe — but don't dwell, he doesn't need to care yet.
- Ask Max what he wants to change first. He WILL have feedback — bike names, prices, copy, a missing detail. That feedback becomes the next session.

## Other files in this folder you should read for context

All in this same directory:

- `README.md` — quick tour of every page and how to deploy
- `MaxRides-Design-Spec-2026-05-23.md` — the full validated design spec (every decision Max made)
- `MaxRides-Build-Plan-2026-05-23.md` — the original build plan
- `index.html` is the home page. Double-click it on Pete's Mac to see the whole site locally before you deploy.

## First message to Max (please use these exact words to open)

> Hey Max — same Claude, different mode running on your dad's computer. I can see the whole site you and the other me designed together. Today's job is simple: take your site off your computer and put it on a real link on the internet, so you can text it to a friend and they can pull it up on their phone.
>
> I'm going to do this in really small steps. After each step I'll either tell you something appeared, or I'll point you to a webpage to look at. Tell me when you've looked, and I'll do the next step. If you ever feel lost, say "wait" or "what did you just do" and I'll back up and explain in different words.
>
> Ready when you are.

Then wait. Don't start until he replies.
