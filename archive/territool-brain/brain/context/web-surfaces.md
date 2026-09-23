---
area: context
tags: [brain/context]
ref: "The three web surfaces, and how each one is built"
---

# The three web surfaces, and how each one is built

Territool's web side is **not one design**. It is three, built in different eras with different
toolchains, and none of them uses the approved `--tt-*` token set yet. Anyone designing or building a
web screen has to know which surface they are on before they pick a single value.

Evidence: the owner's 101 screenshots of 2026-09-15, indexed in `brain/context/web-screenshot-index.md`
and stored at `brain/assets/screenshots/web-owner/`.

> [!note] All 101 have now been read
> Every screenshot was opened and described on 2026-09-16 — see `brain/context/web-screenshot-index.md`
> for what each one shows, and `brain/context/business-rules.md` for the plan, credit and money rules
> they revealed. The three surface descriptions below come from `MGR-01`, `ADM-01` and `SLS-31`.

---

## 1. Manager portal — "TerriTool Cockpit" (`MGR-01`)

React 18 + Vite, `repos/web/resources/manager-portal`. **The most modern surface by a wide margin**,
and the only one that looks designed rather than assembled.

| Part | What it is |
|---|---|
| Shell | Fixed left sidebar ≈260 px on a very light page ground; content is a single scrolling column |
| Brand | Blue gradient card, TT cube in a white rounded tile, "TerriTool Cockpit" over "Sales Intelligence Hub" |
| Identity | Translucent card inside the gradient: role, email, **Credits 100** |
| Nav | Dashboard · AI Find Leads · Salespeople · Activity · Support · Settings — icon + label; the active item is a **white card with blue text**, not a filled bar |
| Sidebar panels | Small uppercase blue-grey section labels over white cards: **TEAM OVERVIEW** (Team Size / Avg Score / Active Today), **LICENSE USAGE** (Total / Used / Remaining), **SUBSCRIPTION** (Plan / Status / Cost per user / Billing / Credits) |
| Logout | Pale red pill with icon, at the foot of the sidebar |
| Page head | H1 + grey subtitle, with a segmented **This Week / This Month / Quarter** control and a refresh icon button on the right |
| KPI row | 6 cards: a **tinted rounded icon tile** (a different tint per metric), a delta badge top-right, a large figure, a label, and a "vs N last week" footer |
| Map | "Territory Coverage Map" card with a segmented **Zones / Visited / Accounts**, a Google map, and a right-hand **Sales Rep Zones** list — one coloured dot per rep with a count |
| Tables | Two leaderboard cards side by side: rank badge (gold for 1st, grey after), rep name over email, metric columns, an **SPR** column as a red badge, and a green "▲ vs. Avg" badge |
| Feed | "Real-Time Activity Feed" with filter chips (All / Visits / Activity / Routes / Lists); each row has an icon tile, bold actor, relative time and a coloured **type tag** (Activity lavender, Visit teal) |

**Business facts visible on this one screen** — these bear directly on gap W2 (no business-rules sheet):
plan **"Deluxe Business"**, status Active, **cost per user $79**, billing **Monthly**, credits
**100 per Sales Person**, licences **10 total / 2 used / 8 remaining**. Treat as one account's state on
one day, not as the pricing table — but it is the first hard evidence the brain has.

## 2. Admin HQ (`ADM-01`)

Backpack over AdminLTE. A different language entirely from the portal.

| Part | What it is |
|---|---|
| Shell | Narrow **icon rail** ≈100 px, white, icon above label, stacked vertically |
| Active state | Amber/orange text on a pale ground — not the portal's blue |
| Top bar | TT logo, **Google Play and App Store badges**, Logout |
| Page head | Title with a grey inline subtitle ("Home — The first page you see after login") and a breadcrumb on the right |
| Stat cards | 4 plain white bordered cards, centred title over a large figure. **No icons, no tints, no deltas** — the opposite of the portal's KPI row |
| Tables | Classic **DataTables**: "records per page" select, Search box, per-column sort arrows, striped rows, "Showing 1 to 10 of 1,232 entries", numbered pagination |
| Nav | Home · Subscription Dashboard · Cancelled subscribers · Sales Agents · **Business Client** · Promotion Codes · Settings · Support (red count badge) · Logout |

**`Business Client` is a retired term** — the glossary says **Business Agent**, and `static-checks.js`
already flags that exact string (`S-glossary`). Recorded as **KG-GLOSS2**.

## 3. Web user app (`SLS-31`)

Blade + AdminLTE + jQuery. Shares the Admin icon-rail shell, but its own top bar and content style.

| Part | What it is |
|---|---|
| Shell | Same narrow icon rail: Home · Address Book (Companies, Contacts, Companies With Errors) · AI Find Leads · Add Company · Recently Added · Routes · Lists · Settings; active item in blue. **A Business Sales Agent's menu differs**: no credits pill, "Find Leads" instead of "AI Find Leads", no "Companies With Errors" (runtime 2026-09-16, `web-flows.md` §1) |
| Top bar | Blue **Upgrade** button, a blue **"26 Credits"** pill, store badges, Report Bug, Logout |
| Page head | Title plus a breadcrumb ("Profile › edit") |
| CRM | Right-aligned links: **Connect Salesforce · Connect HubSpot · Connect Karma CRM** (F21) |
| MCP | Three buttons on the profile block — **MCP Connections · MCP Chat · MCP Sync** (F29, F31). Two blue, one cyan |
| Badges | Subscription Date as a green badge, Lead Credits as a grey badge, "View Invoice" as a blue button |
| Subscription block | Plan name in teal ("Free Package"), "Subscription Status - Active" in teal, blue Upgrade |
| **Edit Statuses** | **7 slots**, each a text field plus a hex colour field with a live swatch. Defaults seen: `#ffd700` Gold, `#00c851` Active, `#1cdbdb` High Priority, `#c333ff` Idle, `#0000ff` Potential, `#ff4444` Reject, `#ffffff` Unclassified. **Slot 7 ("Unclassified") is disabled** |
| Category | A free list of rows with Remove buttons, plus "Add New Category" |
| Actions | Blue **Save Changes** and red **Cancel**, bottom right |

A **Business Sales Agent has six slots (no Gold)**, on web, mobile and in the API alike (runtime 2026-09-16, `web-flows.md` §1).

Status tags are therefore **user-configurable, seven of them (six for a Business Sales Agent), with a fixed reserved last slot** — a
business rule the brain had not recorded (F20).

---

## What this means for design work

1. **"Match the existing style" is ambiguous on web.** Ask which surface. The portal, Admin HQ and the
   user app disagree about sidebars, stat cards, active states and tables.
2. **The approved tokens (`brain/context/design-system.md`) match none of them yet.** They are additive
   and not yet installed in either repo — `repos/web/public/css/tt-tokens.css` is planned, not created yet. A new
   web screen either matches its neighbours *or* passes the design gate; today it cannot do both until
   the token file is added.
3. **The Manager portal is the right model for anything new**, being the only surface with a coherent
   modern component set — and it is also the closest to the approved tokens in spirit.
4. **Admin HQ is Backpack-generated.** Restyling it means fighting the framework; treat it as
   out of scope unless a task targets it (S0.2).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (22)

**Documents (12):** [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/context/business-rules|Business rules: plans, credits and money]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-f5d76b-cr-10-web-surfaces-user-app-menu-home-address-bo|CR-10 — web-surfaces: user-app menu "Home · Address Book · AI Find Leads · Recently Added · Routes · Lists · Settings…]] · [[brain/memory/entries/conflict/20260917-5e23b8-cr-11-web-surfaces-7-status-slots-a-bsa-has-6-no|CR-11 — web-surfaces: "7 status slots" ↔ a BSA has 6 (no Gold) on web, mobile and API]] · [[brain/context/design-states|Design states: loading, empty, error and their variants per surface]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[log|Log]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]] · [[brain/context/web-screenshot-index|Web screenshots (owner, by role)]]

**Product features (4):** [[_id/F21|CRM sync]] · [[_id/F29|Customer MCP connectors]] · [[_id/F31|MCP client connections & chat]] · [[_id/F20|Settings / status tags / stages]]

**Coding rules (2):** [[_id/W2|API status is 1 or 0]] · [[_id/S0.2|Change new code only]]

**Problem found (1):** [[_id/KG-GLOSS2|Admin HQ main navigation uses the retired term…]]

**Screenshots (3):** [[_capture/ADM-01|Admin HQ Home — leaderboard + timeframe stats (Logged In, Created Routes, Activity, New Users)]] · [[_capture/MGR-01|Manager's Dashboard — 6 KPI cards, Territory Coverage Map (Zones/Visited/Accounts) with Sales Rep Zones, two Leaderboards (This/Last Week), Real-Time Activity Feed]] · [[_capture/SLS-31|Settings (web user) — Edit Profile with MCP Connections / MCP Chat / MCP Sync, CRM connect links, Subscription block, **Edit Statuses** (7 slots, slot 7 disabled) and Category list]]

%% brain-links:end %%
