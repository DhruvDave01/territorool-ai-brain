---
name: territool-design
description: Territool design specialist for the mobile app, Blade web app and manager portal. Routes every request that adds UI first (does a screen already exist? same intent?), then runs one of four named modes - AUDIT existing screens against the design system, PLACE something new on an existing screen (candidate placements, complexity gate, all states, before/after), EXTEND an existing flow with a new screen, or CREATE a new flow with all screens, states and mobile/web variants. Output goes to workspace/design-proposals/ as implementable specs using exact tokens.
area: skills
tags: [brain/skills]
ref: "Skill – design"
---

# territool-design

**Load:**
- `brain/context/design-assets.md` (**asset rules: project library only**) + `brain/assets/README.md`
- `brain/context/design-system.md` (tokens + component rules + do-not-copy list + §7 verified mobile specifics)
- Mobile work: **`brain/context/mobile-flows-captured.md`** (newest captures, build 42.32: flows, shared sub-flows, observations; files via `brain/context/mobile-screenshot-index.md`), then `brain/audits/08-design-brain-review.md`, then `brain/assets/brand/design-brain-root/MINI-DESIGN-BRAIN.md` (as-shipped mobile reference; approved tokens override its "don't normalize" advice) and `brain/assets/brand/coverage-notes/Screenshot-Video-Index.md` (find the `IMG_*` / video segment for a screen)
- `brain/context/glossary.md`
- `brain/context/flows.md` + `parity-map.md` (for the flow)
- `brain/gates/design-gate.md`

No Figma exists (USER SAID). Evidence comes from screenshots.

## Screenshot sources (current state)

| Platform | Existing | Fresh capture |
|---|---|---|
| Mobile | `brain/assets/screenshots/mobile/Archive-2/IMG_*.PNG` + video frames `brain/assets/screenshots/mobile/Video-Frames/` + recordings `brain/assets/videos/mobile/` (screen mapping in `brain/audits/04-design.md` §6) | A **second** iOS simulator (never the user's booted one): `xcrun simctl list devices` → boot a dedicated device → `xcrun simctl io <UDID> screenshot <file>.png`, or Maestro `takeScreenshot` |
| Web / portal | `brain/assets/screenshots/web/{public,sales-agent,business-sales-agent,business-agent}/` + `CAPTURED-BY-CLAUDE.md` | `cd tools && PLAYWRIGHT_BROWSERS_PATH="$PWD/ms-playwright" node capture-web.js`. Staging only, destructive requests blocked. For pages not in its plans, add a plan entry in a copy of the script that keeps the same `guard()` and staging hostname check. **Token-level measurement:** `PLAYWRIGHT_BROWSERS_PATH="$PWD/ms-playwright" node probe-styles.js --role "<role>" --path <path> --targets <targets.json> --out <dir>/screens` measures computed font, size, colour, contrast, radius, height, off-canvas and gradient at 1440/768/390 (example targets: `workspace/design-proposals/2026-09-15-manager-salespeople-audit/targets.json`). |

Pixel colours: `sips -s format bmp` + Node BMP read, as in the Phase 4 audit. Contrast: WCAG formula (≥ 4.5:1; ≥ 3:1 only for text ≥ 17 pt/px bold).

## Modes — names, not letters

Owner decision 2026-09-17 added a placement mode. The modes are **named**, because "Mode A" already meant *Audit*
in dated records (`brain/audits/07-validation.md` §3, `workspace/design-proposals/2026-09-15-manager-salespeople-audit/`,
`CLAUDE-CODE-BOOTSTRAP.md`) and must never mean two things.

| Mode | Use when | Old name |
|---|---|---|
| **AUDIT** | review existing screens against the design system; no spec, no code | Mode A |
| **PLACE** | something new goes **on a screen that already exists** | — (new) |
| **EXTEND** | a new screen is **inserted into an existing flow** | Mode B ("new screen"), narrowed |
| **CREATE** | a **new flow**, all screens | Mode C ("full flow") |

## Routing — run first for any request that adds UI, and state the answer before designing

Never assume the mode. Work through these in order and write the answers at the top of the output:

1. **Does a screen already exist where a user would look for this?** Search `brain/context/mobile-screenshot-index.md`,
   `brain/context/web-screenshot-index.md`, `brain/assets/screenshots/`, and the real navigation in both repos
   (`repos/mobile/App/App.js` stack, web `routes/web.php` + the sidebar). Not "could it go there" — where would someone
   genuinely expect it, given how they got there.
2. **Is it the same user intent as that screen's primary job?**
   - same intent → **PLACE** · adjacent intent, same flow → **EXTEND** · different job → **CREATE**
3. **Complexity gate (PLACE only).** Escalate to EXTEND, and say why, if the addition would mean any of:
   - a second primary action competing with the existing one
   - more than roughly **seven interactive groups** on the screen
   - an existing primary action pushed below the fold
   - a new scroll region, or a second independent scroll
   - a new mental model to explain the screen ("it does X, and also Y")

   **Interactive group** = controls that **share a single user intent and are visually contiguous** (owner
   definition, 2026-09-17). Being next to each other is not enough to merge two groups; **purpose decides**.
   - A search field and its clear button are one group.
   - A filter button beside the search field is a **separate** group: it opens a different panel and serves a
     different intent.
   - A tab bar is one group.

   **Always state the count before and after, and list the groups**, so the trend is visible. Use the **stricter
   count by default**. When the grouping is ambiguous, give both counts.

If the owner asked for a new screen and the answer is PLACE, say so and make the case — being argued out of a new
screen is the preferred outcome.

## AUDIT

1. List every screen of the flow on each platform, with its screenshot path.
2. Check each screen against `design-system.md` §1–§5 and the §6 do-not-copy list:
   - colours, type, spacing, radius, elevation
   - button / segment / chip variants, shell, loading / empty states
   - dates, copy / glossary, contrast, hit targets
3. Report each problem as a row. Severity:
   - **HIGH:** blocks or misleads the user, fails contrast on essential text, breaks a BLOCKER/HIGH flow.
   - **MEDIUM:** token/component inconsistency visible to users.
   - **LOW:** cosmetic.
4. Output: `workspace/design-proposals/<YYYY-MM-DD>-<flow>-audit/audit.md` with the table:

| # | Severity | Platform | Screen | Screenshot | Problem | Rule (design-system § / D-DS) | Evidence (pixel/contrast/file:line) | Recommendation (tokens) |
|---|---|---|---|---|---|---|---|---|

AUDIT doesn't write code or specs.

## PLACE

**A1. Read the screen as it is now.** Before proposing anything:
- every screenshot and state: default, loading, empty, error, long content, role variants
- the implementation in both repos: components, layout primitives, spacing values, tokenised or hard-coded
- the primary action and the secondary ones, and why the current elements sit where they sit
- earlier placement decisions for this screen (memory `decision` entries; until `brain/memory/` exists, the
  "Placement decision record" in earlier `workspace/design-proposals/*` for the same screen)
- both platforms if the screen exists on both — they may have diverged

**A2. Enumerate candidate placements — always more than one.** Zones:
- **Mobile:** header / nav bar · above-fold summary · list or content body · inline in a list item · sticky section
  header · floating action button · bottom sheet · tab bar · overflow or settings menu · empty-state area · pull-down region
- **Web:** top bar · sidebar · page header · toolbar or filter row · main content · new table column · row action ·
  side panel · modal · bulk-action bar · footer

For each realistic candidate: **cost** (what it displaces, competes with, pushes below the fold) · **gain**
(discoverability, proximity to its data, taps saved) · **when it wins** · **reach** (thumb zone, mobile) ·
**density impact**. Look for the pattern **sibling screens already use** before inventing one. Rank, recommend
one, and state the reasoning so the owner can disagree with the reasoning, not just the conclusion.

**A3. Specify the integration.** Implementable without questions:
- token names only (colour, type, space, radius, elevation) — never invented
- **the existing component to reuse** (search `brain/assets/brand/ui-notes/Components.md` and the repo first); a new
  component needs a written justification
- what shifts in the surrounding layout, by how much, and what re-flows
- behaviour: hit target, transition, slow network

**A4. Re-specify every state** — where placement work usually fails:
- **empty:** the screen's empty state and the element's own; does the element show with no data, and does the empty
  state still look intended?
- **loading:** with the screen, or independently? (a second spinner usually looks wrong)
- **error:** the element's data fails while the rest succeeds (partial failure)
- **long content:** longest realistic label, name, number
- **permissions:** hidden or disabled per role — pick one and say why
- **zero-to-one:** a brand-new user with nothing yet

**A5. Before / after.** Annotated, with what moved and by how much. Anything that crosses the fold is called out.

**A6. Cross-platform.** Decide placement per platform. They may differ (web filter row ↔ mobile sheet) but never by
accident: record the decision and reason in `brain/context/parity-map.md` either way.

**A7. PLACE never:**
- restructures the rest of the screen (a needed restructure is a separate proposal)
- invents a component, token, colour or spacing value
- breaks the layout grid
- pushes an element below the fold without saying so
- changes existing copy, labels or terminology in passing

Output: `workspace/design-proposals/<YYYY-MM-DD>-<screen>-<addition>/placement.md` (routing, A1–A6, decision record).

## EXTEND

1. **Read the flow end to end** (AUDIT limited to the flow): entry point, every step, exit states.
2. Specify:
   - where the new screen sits, and what changes on the screens either side (forward navigation, back behaviour)
   - mandatory or skippable, and what happens on skip
   - back-navigation and interrupts: app backgrounded here, page refreshed here
   - **direction:** 1–2 options with pros/cons and a recommendation; stop for the owner's choice if they change
     behaviour, pick silently only if purely visual and within the rules
   - the full screen spec (`spec-template.md`), all states, both platforms (or the parity-map citation for why not)
   - the updated flow diagram (mermaid) with the new step in place
3. Self-check `design-gate.md` §A. Every item PASS or N/A with a reason.
4. Output: `workspace/design-proposals/<YYYY-MM-DD>-<slug>/spec.md` (+ `screens/` for reference captures).

## CREATE

1. **Audit two or three existing flows with a similar shape** and follow their conventions — a new flow that looks
   like a different product is worse than a slightly imperfect consistent one. AUDIT the neighbouring screens on all
   platforms.
2. **Flow notes** (`flow.md`):
   - purpose, roles, entry points, success state, every failure path
   - screen map (mermaid `flowchart`) and the transition map, including back and interrupt behaviour
   - what each step is for, what the user can and can't do there
   - business rules from `conventions-shared.md` S3
   - edge cases; error paths (network, validation, permission per role, credits exhausted, subscription expired)
   - offline behaviour (dropped, S3.9: error state + retry, never offline data)
3. `spec.md` for **every** screen, every state, with mobile and web variants and any intentional divergence recorded.
4. **Reused vs new:** two separate lists.
5. Self-check `design-gate.md` §A for each screen.
6. Output folder as in EXTEND.

## Impact — all modes that add UI

Adding UI to a screen is a code change to that screen; the loop's impact rules apply (`LOOP.md` §4 IMPACT). Flag up front:
- **existing tests and visual baselines for the screen that will break** — list them, so an expected break isn't
  mistaken for a regression (test cases in `workspace/test-cases/`, Maestro flows in `workspace/test-suites/mobile/`
  and `repos/mobile/.maestro`, owner captures used as visual references)
- the screen's flows, and its counterpart on the other platform
- **whether the element needs data the screen doesn't fetch today** — a new API call is a performance and
  error-state change, not only a UI change

## Placement decision record — every PLACE (and EXTEND) output

Record: screen (+ screenshot id) · what was added · candidates considered · winner and why · rejected and why ·
**interactive-group count before → after** (with the list) · per-platform decision.

It becomes a `decision` entry in `brain/memory/` (not built yet — until then it lives in the proposal and is queued in
`workspace/qa-reports/2026-09-17-knowledge-memory-audit.md` §4). This compounds: the fourth thing added to a screen is
placed by something that knows why the first three sit where they do, and a screen approaching the gate shows the
trend in the record.

## Asset rules (non-negotiable, USER SAID 2026-09-15)

- **Only the project library** `brain/assets/` provides fonts, icons, logos, app icons, images and colours.
  - **Never** Google Fonts or any external font, icon CDN, stock image, placeholder service, or a colour you pick.
  - A missing asset → ask the owner, don't substitute.
- **Mockups / HTML proposals / artifact pages:**
  - Link `brain/assets/tokens/tt-tokens.css` + `brain/assets/tokens/fonts.css`.
  - Icons from `brain/assets/icon-fonts/…` or `brain/assets/icons/…`.
  - Images and logos from `brain/assets/brand/…` / `brain/assets/images/…`.
  - When publishing, ship those files as supporting files (the DIN fonts stay in private artifacts).
- **Legacy styles** (`themes/`, `styles/`, `colors/PALETTE.md`) describe existing screens. Use them to audit or match an existing screen when the task targets it, never as a source of new values.
- **Stale?** Run `node tools/sync-design-assets.js` (MANIFEST.md shows the repo commits the copy came from).

## Spec rules (non-negotiable)

- **Only token names** (`color.brand.primary`, `type.body`, `space.4`, `radius.md`, `elevation.1`). No raw hex/px/pt. If a needed token is missing, propose it in a "New tokens" section (D-DS1: additive; don't change existing values).
- **Every state enumerated:**
  - default, loading, refreshing (mobile lists), empty, error
  - disabled, validation error per field
  - long content / truncation, offline (where data loads)
  - permission-denied (per role)
- **Components mapped:** existing component path (e.g. `App/components/common/AppButton.js`) or a new component with its file path and variant.
- **Copy:** exact strings, glossary terms, D-DS7 date formats, humanised enums, required fields marked.
- **Accessibility:** contrast listed for every coloured text pair; hit targets ≥ `size.touch-min`; `testID` names for mobile interactive elements (semantic, e.g. `screen.lists.createButton`).
- **No open "TBD".** If a product decision is needed, stop and ask via `territool-router`.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (46)

**Documents (40):** [[brain/memory/entries/decision/20260917-fd1df7-an-interactive-group-is-one-user-intent-and-visu|An interactive group is one user intent and visually contiguous; purpose decides]] · [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/context/glossary|Approved words (glossary)]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[brain/gates/design-gate|Checklist – design]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/assets/colors/PALETTE|Colour inventory (generated: do not edit)]] · [[workspace/design-proposals/2026-09-15-manager-salespeople-audit/audit|Design audit – manager Salespeople page]] · [[brain/assets/docs/design-audits/2026-09-15-manager-salespeople-audit/audit|Design audit (Mode A): Manager portal · Salespeople]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/assets/README|Design library guide]] · [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[brain/memory/entries/decision/20260917-b1a00e-design-modes-are-named-audit-place-extend-create|Design modes are named AUDIT, PLACE, EXTEND, CREATE (letters clashed)]] · [[brain/skills/territool-design/spec-template|Design spec template]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[brain/context/mobile-screenshot-index|List of all screenshots]] · [[log|Log]] · [[brain/context/parity-map|Mobile vs web differences]] · [[workspace/design-proposals/2026-09-17-lists-library-filter/placement|Placement walk-through: "add a filter to the Lists library"]] · [[brain/context/flows|Product features list]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/audits/08-design-brain-review|Review of the old Design-Brain]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/assets/brand/coverage-notes/Screenshot-Video-Index|Screenshot and video index]] · [[brain/assets/brand/ui-notes/Components|Shared components]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[CLAUDE|Start here – brain overview]] · [[workspace/tasks/2026-09-16-prove-the-loop-f01|Task brief: prove the loop end to end on F01 (API contract)]] · [[brain/assets/brand/design-brain-root/MINI-DESIGN-BRAIN|TerriTool Mobile — Mini Design Brain]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]] · [[_code/brain/tools/probe-styles.js|Tool – measure page styles]] · [[_code/brain/tools/capture-web.js|Tool – take web screenshots]] · [[brain/assets/screenshots/web/CAPTURED-BY-CLAUDE|Web screenshots — CAPTURED BY CLAUDE]] · [[brain/context/web-screenshot-index|Web screenshots (owner, by role)]] · [[workspace/README|Work output folders]]

**Product feature (1):** [[_id/F01|Login & session]]

**Coding rule (1):** [[_id/S3.9|Offline mode dropped]]

**Owner decisions (3):** [[_id/BT-11|Offline mode dropped]] · [[_id/D-DS1|Only add new design tokens]] · [[_id/D-DS7|Standard date formats]]

**Code file (1):** [[_code/mobile/App/components/common/AppButton.js|AppButton.js]]

%% brain-links:end %%
