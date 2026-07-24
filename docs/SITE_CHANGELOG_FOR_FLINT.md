# Flint — Website Changes Handoff

**Date:** 2026-07-24
**Author:** Arctic (George)
**Branch:** `arctic-branch` (you're reading this because it just got pushed here — this is the first thing on this branch you'll see)
**Scope:** Marketing website only (`lodestone-web`). No desktop app, backend, or billing changes.

> This handoff describes the state of the **git repo** on this branch — i.e. what's actually live once this branch ships — **not** whatever is currently deployed at **staging.heylodestone.com**. If staging looks different from what's described here, trust the code/this doc, not staging; staging may be running an older build.

Flint — this is Arctic's newest set of changes since the last handoff (the full website rewrite doc that used to live in this file). That older report is superseded; everything from it already shipped and merged into `main`. This document only covers what changed in **this** pass, on top of that baseline.

---

## Summary

Four small, targeted changes:

1. **Landing hero** — added a "zero setup" callout so skeptical visitors immediately see Lodestone isn't a self-hosted/terminal tool.
2. **`/compare`** — added a named comparison table against **OpenClaw** (a self-hosted, messaging-first agent runtime), distinct from the existing browser/chat-AI comparison.
3. **`/pricing`** — reworked framing so it's unambiguous these are *post-launch (GA)* prices, not something visitors can buy today, and pointed them at `/early-access` for current pricing.
4. **`/early-access`** — minor copy/consistency fixes (see below).

---

## 1. Landing hero — zero-setup framing (`src/pages/Landing.tsx`, `src/content/site.ts`)

Goal: reassure visitors coming from self-hosted/DIY agent tools (Docker, terminal, Node scripts) that Lodestone isn't that, without touching the existing headline.

- New `ZERO_SETUP` export in `content/site.ts`:
  - `badge`: `"No terminal, no Docker, no Node.js required"`
  - `steps`: `["Download", "Open", "Enter your key or pick a plan", "It works"]`
- Rendered directly under the existing hero subtitle/description, **above** the CTA buttons, so it's the first thing skeptical readers see after the headline:
  - An emerald "no terminal/Docker/Node" pill (`ShieldCheck` icon).
  - A 4-step horizontal flow (`Download → Open → Enter your key or pick a plan → It works`), each step with its own icon (`Download`, `MousePointerClick`, `KeyRound`, `Sparkles`) and a connecting arrow on desktop, stacking on mobile.
- The `<h1>` itself (**"An AI that does the work while you're away"**) was **not** changed, per instructions.

## 2. `/compare` — new OpenClaw comparison (`src/pages/Compare.tsx`, `src/content/site.ts`)

The existing `/compare` page only compared Lodestone to hosted chat AI (ChatGPT/Claude/Copilot). Self-hosted/open-source runtimes like OpenClaw are a different competitive category (DIY infra vs. a native app), so this got its own section rather than being folded into the existing tables.

- New `OPENCLAW_ROWS` export in `content/site.ts` — 9 rows: Setup, Interface, Built-in tools, Maintenance, Security posture, Messaging access, Away-from-desktop access, Cost, Support. Copy matches what was provided, lightly normalized for punctuation/tone consistency with the rest of the site.
- New section on `/compare`, placed after the existing "Agent vs. chatbot" table and before the final CTA: eyebrow "Vs. self-hosted runtimes", heading "Lodestone vs OpenClaw", short framing subtitle, then a Lodestone-vs-OpenClaw table (same visual pattern as the other comparison tables on the page — check/minus icon accents, brand-tinted Lodestone column).
- Added a disclaimer line under the table noting OpenClaw is independent open-source software, not affiliated with Lodestone, and that individual self-hosted configurations vary.
- **Not fact-checked against OpenClaw's actual docs/repo** — table content is exactly what was supplied. Worth a sanity pass before this goes live given it makes specific security-posture claims about a third party.

## 3. `/pricing` — make GA-vs-now unambiguous (`src/pages/Pricing.tsx`)

Feedback before this pass: it wasn't clear enough that `/pricing` shows *future* (GA/launch) prices, and that `/early-access` is the only place with pricing you can actually act on today. Went through a couple of rounds — the second round pulled back a few things that felt like overkill.

**Landed state:**
- Eyebrow badge: "Pricing after general availability — not on sale yet" (was "Launch pricing").
- Hero subtitle rewritten to state plainly these are GA prices, not for sale during early access, with an inline link to `/early-access`.
- The old brand-colored "Early access is open" banner was restyled as an amber notice: **"Nothing on this page is available for purchase yet"**, explaining founding packages are the only current path, with a button linking to `/early-access` (button copy: **"See early-access"**).
- Added a "Preview" section heading ("What plans look like at launch") directly above the plan cards.
- Feature comparison table subtitle now says these are GA-tier features.

**Explicitly reverted after first pass** (per feedback — don't reintroduce without asking):
- Removed the "Most popular" ribbon on the highlighted plan card.
- Removed the per-card amber "GA · not available yet" badges (the page-level banner + section heading were judged sufficient).

## 4. `/early-access` — consistency fixes (`src/pages/EarlyAccess.tsx`, `src/content/site.ts`)

- **Founding Studio benefit copy**: changed from a range to a single figure — now "~5 months of Studio included usage at launch (~$300 value)" (was "~4–5 months … ~$240–300 value)"). Price ($250) and rate lock ($50/mo) unchanged.
- **Buy buttons**: "Sign in to purchase" / "Get early access" now render in the same purple (`bg-brand-500`) style on every package card. Previously, only the "highlighted" card (Founding Pro) got the solid brand color and the rest used a neutral surface button — now all five are visually consistent regardless of which tier is marked popular.
- **FAQ**: removed the "Can I buy a package on this page?" question (redundant with the buttons themselves now that checkout is live — see note below).

> Note for Flint: this page's `handleCheckout` already calls `/api/stripe/checkout` and redirects to a real Stripe session when a signed-in user clicks through — the old "checkout is not live" framing from the previous handoff doc may be stale. Worth confirming current checkout status with whoever owns that before publishing, since the hero still has a line saying "Checkout is not live on this page yet" that may now be inaccurate.

---

## Files touched this pass

- `src/content/site.ts` — `ZERO_SETUP`, `OPENCLAW_ROWS` added; Founding Studio benefit copy edited.
- `src/pages/Landing.tsx` — hero zero-setup badge + step flow.
- `src/pages/Compare.tsx` — new OpenClaw section.
- `src/pages/Pricing.tsx` — GA/early-access framing pass (banner, eyebrow, hero copy, section heading; ribbon/badges added then removed per feedback).
- `src/pages/EarlyAccess.tsx` — button color consistency, FAQ trim.

Nothing else on the site (desktop app, backend, billing, other marketing pages) was touched in this pass.

## Not done / left for later

- No fact-check pass on the OpenClaw claims against their public docs.
- No visual QA pass on mobile for the new hero step-flow beyond basic responsive classes (stacks vertically under `sm`).
- Checkout-status discrepancy on `/early-access` (see note in §4) — flagging, not fixing, since it's outside this pass's scope.
- **Mailing list signup on `/early-access` is still a placeholder** — not touched this pass, but flagging since it's live-looking and easy to miss:
  - The `[data-signup-counter]` span hardcodes `"1,200+"`. Flint needs to swap this for the real, current subscriber count (live or pulled from whatever list provider we're using) before this ships.
  - The email form's `onSubmit` just calls `preventDefault()` — it isn't wired to anything. Flint needs to confirm the button actually submits the email to the signup list/endpoint before this goes live, not just that it looks like it does.
