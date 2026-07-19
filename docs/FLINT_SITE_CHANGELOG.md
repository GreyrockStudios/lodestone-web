# Flint — Lodestone Website Rewrite Report

**Date:** 2026-07-18  
**Branch:** `arctic-branch`  
**Scope completed:** Marketing website only (`lodestone-web`). Desktop app UI and billing backends were left unchanged.

Flint — this report summarizes the website rewrite that was completed on `arctic-branch` by Arctic, so you have a clear record of product positioning, pricing as published on the site, information architecture, and what this pass included versus left untouched.

---

## 1. What Lodestone is (obviously you know what it is you built it but just for completeness sake)

Lodestone is a **desktop AI agent that acts on your machine and works on its own schedule** — it runs files, apps, and self-scheduled tasks (cron-like jobs) on your computer even while you're away, and remembers every run. Users run it on their machine (Electron), optionally with local Ollama, and can connect cloud providers.

**Product relationship (important):** the **desktop app IS Lodestone** (the product). The **web app is a supplementary companion** whose purpose is remote access — reaching your Lodestone from away. Remote/web access is **not available during early access**; it arrives after early access (Pro/Studio at GA). Marketing now leads with **agency (acts + proactive)**; compounding memory is positioned as the multiplier, not the headline.

| Repo | Role |
|------|------|
| [GreyrockStudios/lodestone-web](https://github.com/GreyrockStudios/lodestone-web) | Website + shared React SPA (heylodestone.com). Marketing in browser; full product in desktop shell. |
| [GreyrockStudios/lodestone-desktop](https://github.com/GreyrockStudios/lodestone-desktop) | Electron desktop app. Injects `LodestoneNative` via preload. No terminal/Docker/Node required for end users. |

**Runtime split in web repo (`src/App.tsx`):**
- Browser (`!isDesktop`): marketing routes + auth/account. App routes like `/chat` show `DesktopOnly`.
- Desktop (`isDesktop` / Electron / Tauri): product UI (Chat, Brain, Memory, Settings). Marketing routes are not the focus.

---

## 2. Go-to-market phase (as published on the site)

**Current phase reflected in the marketing site: Early Access / Presale — product is not presented as generally available.**

- No public free tier is offered on the site right now.
- Primary conversion path on the site: **founding / early-access packages** on `/early-access`.
- At **GA (general availability)**, site copy describes a free forever **Community** tier and standard Pro / Studio prices.

Hero and nav CTAs use early-access / founding language rather than “now shipping” or “get started free” as the primary story.

---

## 3. Canonical pricing & credits (as coded)

Single source of truth written into: **`src/content/site.ts`**.

### 3a. Launch (GA) plans

| Tier | Price | Notes |
|------|-------|--------|
| Community | **$0** forever | **BYOK required**. No included Lodestone usage credits. |
| Pro | **$29.99/mo** | Included usage **$15/mo**. BYOK optional. Credit packs + auto top-up. |
| Studio | **$59.99/mo** | Included usage **$40/mo**. Multi-agent, API, etc. BYOK optional. Packs + auto top-up. |

### 3b. BYOK / credits rules (as published)

- **BYOK** = bring your own API key.
- Described as available on **all** tiers.
- Described as **required** on Community (free).
- Described as **optional** on Pro / Studio (included credits, packs, or auto top-up).
- Paid users who exceed included usage: **manual credit packs** or **auto top-up**.

### 3d. Three usage options (made explicit on `/pricing`)

`USAGE_OPTIONS` in `site.ts` drives a "Three ways to run it" section so the choices are unambiguous:

1. **Free** — BYOK or fully local Ollama models. You pay your provider directly, or nothing for local.
2. **Paid** — included monthly Lodestone usage, then buy credit packs / enable auto top-up.
3. **Paid + BYOK** — route overage beyond included credits to your own key (zero Lodestone markup on those messages).

**Optional cloud sync (paid tiers):** `CLOUD_SYNC` note + `GA_FEATURE_ROWS` row. Keeps memory/identity/settings the same across machines; can be turned off to stay **local-only** (Community is local-only). Marked "Optional" on Pro/Studio.

### 3c. Early access / founding packages (presale)

Route: **`/early-access`** → `src/pages/EarlyAccess.tsx`  
This page was built as **display only**. No Stripe, checkout, or payment APIs were wired.

| Package | Price | Benefits |
|---------|-------|----------|
| Backer | **$5** | Discord role; name in credits; campaign updates; early alpha access |
| Founding Pro | **$99** | ~4 months Pro prepaid (~$120 value); lifetime rate lock **$24.99/mo** (vs $29.99) while sub stays active |
| Founding Studio | **$249** | ~4–5 months Studio prepaid (~$240–300 value); lifetime rate lock **$49/mo** (vs $59.99) while sub stays active |
| Founding Studio+ | **$599** | ~12 months Studio prepaid (~$720 value); rate lock **$49/mo**; roadmap input call; early feature access; founders meetings |

Site copy states rate locks hold **while the subscription stays active**.

---

## 4. Website information architecture (after rewrite)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `Landing.tsx` | Agency-first marketing home; early-access primary CTA |
| `/early-access` | `EarlyAccess.tsx` | Founding packages (no billing wired) |
| `/pricing` | `Pricing.tsx` | GA plans + three usage options + cloud sync; banner → early access |
| `/compare` | `Compare.tsx` | **NEW** "us vs them" SEO page (Lodestone vs ChatGPT/Claude/Copilot) |
| `/downloads` | `Downloads.tsx` | Mac/Windows alpha builds; Linux noted as later |
| `/changelog` | `Changelog.tsx` | Product release notes |
| `/marketplace` | `MCPMarketplace.tsx` | MCP server browse/install deep links |
| `/docs/*` | Docs pages + `DocsLayout.tsx` | Getting started, features, desktop, usage, API, FAQ |
| `/terms` `/privacy` `/eula` | Legal pages | Aligned tier names/prices |
| `/chat` etc. (web) | `DesktopOnly.tsx` | Gate → download / early access; reframed to "desktop is the product, remote web access comes later" |

**Shared chrome:** `src/components/SiteLayout.tsx` (nav + footer). Top nav now: Early Access, Pricing, **Compare**, Docs, Downloads (Changelog moved to footer).  
**Canonical content:** `src/content/site.ts`.  
**SEO/schema:** `index.html` — title/OG/Twitter now agency-first ("AI that works on your computer, on its own schedule"); JSON-LD gained a `featureList`; the three offer prices (Community / Pro $29.99 / Studio $59.99) are unchanged. Note: per-route meta for `/compare` would need react-helmet/SSR (not wired).

---

## 5. What was completed in this website rewrite

### Added
- `src/content/site.ts` — plans, founding packages, pillars, comparison rows
- `src/components/SiteLayout.tsx` — shared marketing nav/footer
- `src/pages/EarlyAccess.tsx` — founding packages page (no checkout)
- `/early-access` route in `App.tsx`
- `docs/FLINT_SITE_CHANGELOG.md` (this file)
- Display font: Instrument Sans + DM Sans (kept dark brand tokens)

### Visual refresh (2nd pass)
- `src/components/Starfield.tsx` — animated constellation background (canvas, no deps). Used via new `HeroBackdrop` on all hero sections, replacing the old static grid.
- `src/components/KnowledgeGraph.tsx` — the "visual brain": a faithful **three.js** port of the live-site graph (1,225 category-coloured nodes in 3 force-relaxed clusters, additive glow, starfield/dust backdrop, OrbitControls auto-rotate + drag + scroll-to-zoom, hover tooltip) + `GraphLegend`. Requires the `three` dependency. Added a "Your knowledge, visualized" section to the Landing page and reused inside the preview's Memory → Graph tab.
- `src/components/InteractiveAppPreview.tsx` — interactive desktop-app mock (clickable conversations; **Chats / Tasks / Memory / Identity** views; memory list + graph toggle). Replaces the static hero mockup on Landing. The **Tasks** view shows self-scheduled autonomous jobs (from `AUTONOMY_EXAMPLES`). Memory counts now **derive from the sample data** (no more inflated "847" numbers) and include a founders easter egg (George + Jay) under Entities.
- Palette fixes: retuned the headline gradient to a clean violet→indigo (dropped the muddy teal transition); rebuilt `.site-card-featured` so text sits on a solid readable surface with a soft violet ring instead of a low-contrast gradient fill; shifted hero aurora/CTA accents from cyan toward indigo.

### Rewritten / cleaned
- Landing: removed redundant sections (8 workflows, Day 1/7/30, tools catalog, waitlist-as-primary, Telegram claims, “shipping” hero)
- Pricing, Downloads, DesktopOnly, Docs, FAQ, Terms — aligned to early access + GA pricing
- DocsLayout uses SiteLayout; docs no longer duplicate full pricing card spam

### Inconsistencies corrected on the site
- Studio price was **$79.99** in many places → **$59.99**
- DesktopOnly showed Pro **$10** / Studio **$30** → removed; uses GA plans
- Terms had Free / Desktop **$9.99** / Pro **$19.99** → Community / Pro / Studio
- `index.html` schema had outdated Desktop/Pro offers
- Removed false claims: Telegram, “shipping to everyone”, Mac-only desktop on Pricing
- Standardized competing “13 tools” vs “14+ tools” language

### Left out of this pass
- Billing wiring on the Early Access page
- Stripe / checkout / webhook work
- Changes to the Electron desktop repo
- Redesign of in-app Chat / Brain / Settings
- Changes to Account.tsx billing UI or backend credit amounts

---

## 6. Files touched vs left alone

### Marketing surface updated
`Landing`, `Pricing`, `Compare` (new), `EarlyAccess`, `Downloads`, `Changelog`, `DesktopOnly`, `DesktopApp`, `Features`, `Faq`, `MCPMarketplace`, `DocsLayout`, docs pages, `Terms`/`Privacy`/`Eula`, `SiteLayout`, `ProactiveTimeline` (new), `InteractiveAppPreview`, `content/site.ts`, `index.html`, `App.tsx` (route only)

### App surface left unchanged
`Chat`, `Brain`, `Memory`, `Settings`, `AppShell`, panels, `Onboarding`, admin pages, desktop-only route tree

> Note: `App.tsx` was touched only to register the new `/compare` marketing route; the desktop/app route tree and its components are unchanged.

---

## 7. Status notes (work not included in this pass)

The following remain outside what this website rewrite delivered:

1. Founding checkout (Stripe or equivalent) — package copy lives in `EARLY_ACCESS_PACKAGES` as published on the site.
2. Backend / Stripe product sync to Pro **$29.99**, Studio **$59.99**, founding locks **$24.99** / **$49**.
3. Community free + BYOK-required activation at GA, and flipping `SITE.phase` from early-access to launched.
4. Claim flow for Backer Discord role / credits / alpha download entitlements.
5. Verification of included credit amounts ($15 / $40) against live billing if they diverge.
6. Linux download availability (site currently says coming later).

---

## 8. Local preview (as used during this work)

```bash
cd /home/projects/Lodestone-Web
npm install
npm run dev                       # http://localhost:5173
```

Key URLs after rewrite:
- `/` — landing (early access)
- `/early-access` — founding packages (display only; no payment)
- `/pricing` — GA pricing
- `/docs` — documentation

---

## 9. Summary for Flint

Lodestone’s public site was rewritten into **early-access/presale mode**. Founding packages (Backer $5, Founding Pro $99, Founding Studio $249, Founding Studio+ $599) are published on `/early-access` with **no payment wiring**. Launch pricing on the site is Community free forever with **BYOK required**, Pro **$29.99**, and Studio **$59.99**, with included credits plus packs/auto top-up on paid tiers; BYOK remains optional on paid. Marketing facts were centralized in `src/content/site.ts`. The desktop chat app was not modified in this pass.

---

## 10. Repositioning pass — agency-first (later same day)

The site was re-anchored away from "compounding memory" and onto Lodestone's real differentiators: **it acts on your machine (things a browser can't) and works proactively on its own schedule.** Memory is now the multiplier, and **trust/control** is a first-class pillar.

### Positioning & structure
- New narrative + hero: "An AI that does the work while you're away." `SITE.tagline` → "AI that acts on its own"; description leads with desktop actions + scheduling.
- `content/site.ts`: reordered `PILLARS` (acts → proactive → memory); re-aimed `COMPARISON_ROWS` at agency vs. browser AI; added `BROWSER_CANT`, `AUTONOMY_EXAMPLES`, `TRUST_POINTS`, `REMOTE_ACCESS`, `VS_COLUMNS`/`VS_ROWS`, `USAGE_OPTIONS`, `CLOUD_SYNC`.
- Landing: added "Works while you're away" (new `ProactiveTimeline`) + "Trust & control"; demoted the knowledge graph to "remembers every run"; the comparison table links out to `/compare`. The standalone "What a browser can't do" grid was **removed from Landing** (it duplicated the pillars) and now lives on `/compare`.
- The "remembers every run" knowledge-graph is now a **centered square** (`max-w-xl aspect-square`) so it no longer traps the mouse wheel (scroll-to-zoom was catching page scroll).
- `index.html`: agency-first title/OG/Twitter + JSON-LD `featureList` (offer prices unchanged).

### Product relationship corrected
- Desktop app = the product; web app = supplementary remote companion; remote web access is **post-early-access**.
- Relabeled "Web access" / "Web + desktop access" → **"Remote web access"** across `site.ts`, `Pricing`, `Terms`.
- `DesktopApp.tsx` reframed ("What Lodestone does on your machine" + "Control & safety" + "Web app (companion)"); `DesktopOnly.tsx` reframed to remote-access timing.

### New `/compare` SEO page
- `src/pages/Compare.tsx` + `/compare` route + nav/footer links. Contains: "what a browser can't do", a named comparison (Lodestone vs ChatGPT/Claude/Copilot via `VS_ROWS`, with an "as of 2026" disclaimer), and the agent-vs-chatbot table.

### Usage clarity & cloud sync
- `/pricing` now has an explicit **"Three ways to run it"** section (free/BYOK-local, paid+credits, paid+own-key overage) plus an **optional cloud sync** callout (paid tiers; local-only by default). New `GA_FEATURE_ROWS` row + plan features + a `Cloud sync (optional)` feature highlight.

### Interactive preview
- Added a **Tasks** (schedule) view; memory tab counts now derive from the sample data (dropped the fake "847"); added a **founders easter egg** (George — design/frontend/business/marketing; Jay — "certified wizard") in the Memory list.
- **Chat ↔ Memory continuity:** memories the assistant recalls in the chat examples (e.g. the Q3/Priya thread, project prefs) now actually exist as entries in the Memory tab, and the reminder set in the Morning brief chat appears in the Tasks tab — the demo is internally consistent instead of referencing invisible state.
- **Chat examples refreshed to prove agency** (was: Brainstorm / Email / Weekly review / Code review — mostly plain chat, and "Weekly review" duplicated the Tasks view). New set of 5, each showing something a browser can't:
  1. **Reply to Priya (Q3)** — the star, human-in-the-loop: notices the email → `search_inbox` → `read_file` → `export_pdf` → drafts a reply with the PDF attached → **asks for confirmation before sending** (new `attachment` + `confirm` message types with Send/Edit + "Waiting for your OK"). Doubles as a Trust & control demo.
  2. **Code review — PR #42** — `read_files` → `run_command("npm test")` (1 failing) → on "yes" it `edit_file`s the fix → re-runs tests (green) → opens **PR #43** via `git.create_pr`, leaving the original PR untouched (local execution + end-to-end fix loop).
  3. **Organize Downloads** — `list_files` → `move_files` on a local Ollama model, then **proactively notices** 4 old 2023 receipts and offers to archive them → on "yes" `move_files` into `Finance/Archive/2023` (filesystem + privacy + unprompted initiative).
  4. **Competitor research** — `web_search` → `write_file("Notes/agents.md")` (produces a local artifact, not just an answer).
  5. **Morning brief** — proactive run delivered into chat, then a multi-tool human-in-the-loop chain: flags a 2pm Design sync conflict → `google_calendar.update` (moves it to tomorrow) → `create_task` (sets a reminder) → **asks to notify attendees** → on "yes" shows a `confirm` draft email to the attendees. The reminder it sets shows up in the **Tasks tab** (new "Reminders" section, distinct from recurring "Scheduled" jobs) for continuity.
- Model diversity across examples (Claude, GPT-4o, local Ollama) quietly shows multi-provider/BYOK. Default open chat is now the multi-step Priya flow.

### FAQ
- Added: "What can it do without me asking?", "Is it safe to let it run on my computer?", "Can I use Lodestone from my browser/another device?" (desktop is the product; remote web access comes after early access).

### Still not wired (unchanged from §7)
- No Stripe/checkout/entitlements. Cloud sync and remote web access are **described on the site only** — no backend implementation in this pass. `/compare` competitor claims are marketing copy (category-level, dated), not audited per-vendor.

### Pricing & early-access restructure (business pass, later)

This pass was a **business/pricing review** (not a visual one). Two things changed on the site: the per-token pricing table was corrected for accuracy, and the early-access founding ladder was restructured. Everything remains **display-only — no checkout/billing wired.**

**All prices were then switched to round dollars** (better fit for a trust-first, dev/prosumer brand than charm `.99` pricing). Canonical current values: Community **$0**, Pro **$30/mo**, Studio **$60/mo**; founding locks Pro **$25** / Studio **$50**; one-time founding packages **$15 / $50 / $100 / $250 / $600**. These **supersede the `$X.99` figures in §3, §7, and §9** (earlier snapshots left intact for history). `index.html` JSON-LD offers updated to `30.00` / `60.00`.

#### Model pricing accuracy fix — `src/pages/Pricing.tsx`
The published token rates are meant to be **provider base cost × 1.10**. The 10% is a hedge for cost fluctuations, **not** the profit driver (subscriptions are). Because included usage is billed at these published rates, **every row must stay ≥ real cost** or included credits run at a loss. Two rows were under real cost and were fixed:

| Model | Was (in/out per 1M) | Now | Reason |
|-------|---------------------|-----|--------|
| Claude Opus 4 | $5.50 / $27.50 | **$16.50 / $82.50** | Was ~63% below real (~$15/$75); would lose money on included usage. Also **re-tiered `Pro+` → `Studio`** so a single big Opus task can't blow through a Pro user's $15 included budget. |
| GPT-4o-mini | $0.08 / $0.33 | **$0.17 / $0.66** | Was using an old/batch base; brought to ~$0.15/$0.60 × 1.10. |

- Added a comment documenting the ×1.10 rule above `tokenRows`.
- **For Flint:** a cron job will scan posted model prices twice daily and live-update. The `tokenRows` array is currently hardcoded marketing copy — point it at the existing `/api/usage/provider-rates` endpoint (see `ProviderRate` in `src/lib/credits.ts`) so it can't drift from what's actually billed. Guardrail to enforce in the scanner: never publish a rate below real cost × markup.

#### Early-access founding ladder restructured — `src/content/site.ts` (`EARLY_ACCESS_PACKAGES`)
The old ladder had a **$5 → $99 cliff** (20×), and the $5 "Backer" tier gave away alpha access for less than payment-processor fees, cannibalizing the paid tiers. New ladder raises the floor, kills the cliff with a middle rung, and makes access itself the paid buy-in:

| Tier | Price | In early access | At launch |
|------|-------|-----------------|-----------|
| **Founding Access** | **$15** | Unlocks alpha download; full local app; BYOK/local usage; Discord + name in credits | Falls to free Community + **first month of Pro free** on upgrade |
| **Founding Pro · Early Bird** | **$50** | Access + BYOK | ~2 mo Pro included (~$60) + **$25/mo lock for life** |
| **Founding Pro** | **$100** | Access + BYOK | ~4 mo Pro included (~$120) + **$25/mo lock** |
| **Founding Studio** | **$250** | Access + BYOK | ~4–5 mo Studio (~$240–300) + **$50/mo lock** |
| **Founding Partner** (was Studio+) | **$600** | Access + BYOK + standing seat in founders meetings (direct roadmap input) | ~12 mo Studio (~$720) + **$50/mo lock** |

Ladder ratios: $15 → $50 → $100 → $250 → $600. The old `Backer $5` tier is gone. Founding rate locks are a consistent ~17% off standard on both paid tiers — Pro **$25** (vs $30) and Studio **$50** (vs $60) — so Studio founders never get a smaller % break than Pro founders, and a maxed-usage Studio member stays slightly more profitable than a maxed Pro member.

#### Early-access model made explicit — new `EARLY_ACCESS` export in `site.ts`
The core simplification, so nobody has to run billing against an alpha:
- **During early access:** a founding package is a **one-time buy-in that unlocks the alpha download**. **All usage is BYOK or local Ollama — usage is never metered or charged.** Founders get the full single-player desktop app (chat, memory, tasks, tools, multi-agent). Per-tier limits are **not enforced** during EA — not worth building for the alpha cohort.
- **At launch (GA):** the paid infrastructure turns on — included credits ($15 Pro / $40 Studio), packs/auto top-up, cloud sync, remote web access, hosted API. Free **Community** tier opens forever (BYOK required); **every founder keeps it** (`freeForeverPromise`, shown on the page).
- **Prepaid = activation-based, not auto-started.** Founders activate their sub when ready at GA and the prepaid clock starts *then* (so no runway is wasted). Reminder before it ends; then billing continues at the locked rate. **Activate within 12 months of launch** (bounds the liability). This lives in `EARLY_ACCESS.prepaid`.

#### Page updates — `src/pages/EarlyAccess.tsx`
- Hero rewritten: one-time buy-in unlocks alpha, usage is BYOK during EA, free-forever promise surfaced.
- `$15` Founding Access renders full-width as a **"Start here"** card; the four subscription tiers sit in the grid below.
- New **"What happens now, and at launch"** two-column section (drives off `EARLY_ACCESS.duringEarlyAccess` / `.atLaunch`).
- **"How founding rates work"** expanded with a dedicated **"How prepaid months work"** callout (activation model) + free-forever promise.
- FAQ: added *"Do I pay for usage during early access?"* and *"When do my prepaid months and rate lock start?"*; reworked the free-tier + BYOK answers.
- **From the founders** note added under the packages (Jay & George). Voice leads with agency ("an AI that actually does something / isn't locked in a browser tab"), explains why they chose founder-funded early access over investors, and states this is their full-time job (lighthearted "Lodestone or bust" line). Uses an initials-avatar placeholder (J / G): swap for real founder photos when available; a real photo strongly boosts the "real people, not a corporation" signal.
- **Founding Studio+ renamed to `Founding Partner`** (`site.ts` name + description + benefits; id `founding-studio-plus` kept stable). Benefits now spell out the standing seat in founders meetings and direct roadmap input.
- **Packages layout:** extracted a `PackageCard` component. The four founding tiers (Access, Early Bird, Founding Pro, Founding Studio) sit in a 2x2 grid, and `Founding Partner` spans both columns full-width at the bottom (`md:col-span-2` on its `Reveal`, plus the `wide` prop for a 2-col benefits list).
- **Em-dashes stripped from all rendered Early Access copy** (brand preference: em-dashes read as AI-written), now including the `EARLY_ACCESS` strings in `site.ts` that render on the page (the earlier sweep only covered JSX literals in `EarlyAccess.tsx`). Only the internal code comment on line 9 still has one. Other marketing pages (`Landing`, `Compare`, `site.ts` descriptions, etc.) still contain em-dashes and have NOT been swept yet.
- **Removed the "first month of Pro free" perk** from Founding Access. It cascaded confusingly into the paid tiers via "Everything in Founding Access" and was meaningless for tiers that already include prepaid.
- **Upgrade callout added** to "How founding rates work" (pay-the-difference upgrades; copy centralized in `EARLY_ACCESS.upgrades`).
- **Email-list capture + live counter** added near the bottom of the `/early-access` hero (display-only; see build list).

#### Business rationale (context for Flint)
- **Cost structure:** Community ≈ $0 COGS (BYOK/local). Paid tiers are high-margin because heavy users self-select into zero-COGS BYOK/local; worst-case (all included credits burned on cloud) still ~50% gross on Pro. The token markup is a hedge, **not** the income driver — do not over-optimize it.
- **Free tier is intentional and permanent** at GA: the ~$0-COGS free experience is the clout/word-of-mouth engine. Gate on **cost-to-serve and scale** (included credits, cloud sync, remote access, RAG, multi-agent, API), **never** on single-player features that cost nothing. Rule of thumb: *free if single-player and ~free to serve; paid if it costs per-use, needs our servers, or scales with pro/team use.*
- **Remote web access is the likely killer paid feature** (checking an autonomous agent from your phone) — it justifies Pro without paywalling anything free-to-serve.
- Early access is paid *because* the product isn't 1.0: it funds dev, filters for committed testers, and protects reputation. The "free tool" philosophy activates at GA, not during the alpha.

#### Build list for Flint (still not wired)
- **Checkout + entitlements:** the Stripe → downloads-gating flow (free "Community" account can't see downloads → payment flips entitlement → login/authenticate → onboarding installs an **account-linked** key). Keep the key re-validatable (not a static shared code) so it can upgrade in meaning at GA.
- **Activation flow** for prepaid/rate-lock at GA (email + in-app "activate your founding plan"; 12-month window; card requested only near prepaid end).
- **Price-scanning cron** + wiring `tokenRows` to live `/api/usage/provider-rates`.
- Backend sync of the new founding prices/locks; flip `SITE.phase` early-access → launched at GA.
- **Founding tier upgrades (pay the difference):** move to a higher founding tier for the exact price gap (revenue-neutral vs a direct sale). Upgrades only (no downgrades/refunds), only while the founding window is open, and before GA activation so no prepaid is consumed. Implementation: charge the delta, swap the entitlement, and rewrite the stored per-account lifetime lock. Copy lives in `EARLY_ACCESS.upgrades`.
- **Email list capture + live counter:** the `/early-access` hero form is display-only (`onSubmit` calls preventDefault). Wire it to the signup endpoint, and replace the placeholder in the `[data-signup-counter]` span ("1,200+") with the live subscriber count.
