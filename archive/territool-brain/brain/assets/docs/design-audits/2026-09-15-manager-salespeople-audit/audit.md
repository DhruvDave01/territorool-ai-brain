---
area: design-library
tags: [brain/design-library]
ref: "Design audit (Mode A): Manager portal · Salespeople"
---

# Design audit (Mode A): Manager portal · Salespeople

- **Skill:** `territool-design` Mode A (Phase 7 validation run, 2026-09-15).
- **Flow:** F24 Business Sales Agent management (HIGH), inside F23 Manager portal (HIGH).
- **Role:** Business Agent.
- **Surface:** web portal, `/manager/salespeople`.
- **Environment:** staging, read-only.
  - Navigation guard active; 0 requests blocked.
  - Nothing clicked except login.

**Evidence:**
- **Screenshots:**
  - `screens/manager-salespeople_w1440.png`, `_w768.png`, `_w390.png` (this run)
  - `brain/assets/screenshots/web/business-agent/web_03_manager-salespeople_w1440.png`
- **Measurements:** `screens/probe.json` from `tools/probe-styles.js`, with targets in `targets.json`.
  - Computed styles at 1440 / 768 / 390.
  - WCAG contrast against the effective background.
- **Source:**
  - `repos/web/resources/manager-portal/Salespeople.jsx`
  - `repos/web/public/css/manager-portal-responsive.css`
  - `repos/web/public/css/manager-portal.css` (variables)
  - `repos/web/resources/views/front/manager/_portal_layout.blade.php`
  - `repos/web/resources/manager-portal/utils/removeSalesperson.js`
- **Standard:** `brain/context/design-system.md`, `glossary.md`, `brain/gates/design-gate.md` §B.

Data shown is staging test data. No emails are copied into this report.

## Summary

| Severity | Count |
|---|---|
| HIGH | 5 |
| MEDIUM | 7 |
| LOW | 4 |

**What already works:**
- The table collapses to cards below 768 px with a sort select (`manager-portal-responsive.css:1048-1143`).
- No horizontal overflow at 390 px.
- The primary CTA meets contrast (white on `#124AC6` = 7.45:1) and goes full width on phones.
- Disabled pagination uses 40% opacity, which matches D-DS5.
- Email addresses wrap instead of overflowing.

## Findings

| # | Severity | Platform / width | Screen area | Screenshot | Problem | Rule | Evidence (measured / file:line) | Recommendation (tokens) |
|---|---|---|---|---|---|---|---|---|
| 1 | **HIGH** | portal · 390 | Shell / navigation | `screens/manager-salespeople_w390.png` | No way to reach other portal pages on a phone: the sidebar is off-canvas and there is no menu control | design-system §5 rule 5; DG-B6 | `probe.json` w390 `menuButtonVisible: false`; sidebar absent in screenshot | Menu button top-left: 24 px icon in a 40×40 hit area, `color.text.primary`. It opens a drawer on `color.surface.card` with `elevation.3` over `color.overlay.scrim`. Drawer items reuse the sidebar list |
| 2 | **HIGH** | portal · 390 | Fixed "Download the App" banner | `screens/manager-salespeople_w390.png` (card 2) | Fixed banner covers the second card's Email field. Business Agents are web-only (owner-confirmed), so the app promotion doesn't apply to this role | design-system §5 rule 12; DG-B6 | Banner overlaps card content in the capture; `_portal_layout.blade.php` renders the portal shell | Don't show the app banner to Business Agents. If it stays for other roles: place it in the page flow, not fixed, and make it dismissible |
| 3 | **HIGH** | portal · all | Row action "Remove" + sidebar "Logout" | `web_03_manager-salespeople_w1440.png` | Red label `#EF4444` on `#FEE2E2` is **3.08:1** at 12–13 px / 600, below 4.5:1 | S4.4; DG-B8 | `probe.json` "Row action Remove", "Logout"; `manager-portal-responsive.css:951-955`; vars `manager-portal.css:23-24` | `color.danger-text` `#B91C1C` on `color.danger-subtle` `#FEE2E2` = **5.30:1** |
| 4 | **HIGH** | portal · all | Table rows | `web_03_manager-salespeople_w1440.png` | Destructive "Remove" repeated in every row with the same weight as Edit | design-system §5 rule 8 | `Salespeople.jsx:98-102` (rendered for every rep, table and cards) | Row keeps one `text` button "Edit" plus an overflow control (⋯, 40×40). "Remove" goes in the overflow menu in `color.danger-text`, then a confirmation (finding 5) |
| 5 | **HIGH** | portal · all | Subscription "Status: Active" (sidebar) | `web_03_manager-salespeople_w1440.png` | Teal text `#00A99D` on white is **2.93:1**; teal is fill-only in the token set | design-system §1 (`color.accent.teal` never text) | `probe.json` "Subscription status value" | `color.success` `#15803D` (5.02:1) for an active status, or a success pill: `color.success` on `color.success-subtle` = 4.57:1 |
| 6 | MEDIUM | portal · all | Remove confirmation | — | Uses the browser's native `window.confirm`: unbranded, can't show the rep's name in a styled danger layout, blocks the page | design-system §5 rule 11 (modals) | `utils/removeSalesperson.js:47` | Modal: `radius.lg`, `elevation.3`, scrim token, title `type.heading`, body `type.body`. Confirm is the `danger` button variant; Cancel is `tertiary`. The copy must state the real consequence (owner to confirm what removal does to the rep's access and data) |
| 7 | MEDIUM | portal · all | Typography | all widths | Three typefaces on one screen:<br>• **DM Sans**: Add button, table headers, pagination, "Showing", section eyebrows, "Manager" label<br>• **Space Grotesk**: brand title<br>• **DIN**: everything else | D-DS3 (DIN only, including the portal) | `probe.json` fontFamily per element; `_portal_layout.blade.php:6` loads DM Sans + Space Grotesk; `manager-portal-responsive.css:593, 694, 2431, 2846` | Button `type.button` (web 14 px DIN Bold); table header and section labels `type.eyebrow` (web 11 px DIN Bold, uppercase, 0.5 letter-spacing); brand title `type.heading` (18 px) |
| 8 | MEDIUM | portal · 390 | Card field labels (EMAIL, PHONE…) + card ID | `screens/manager-salespeople_w390.png` | `--text-muted` `#BFBFBF` on white is **1.84:1** at 10–11 px uppercase | S4.4; DG-B8 | `manager-portal-responsive.css:1086-1107`; `manager-portal.css:15` | `type.eyebrow` (11 px) in `color.text.secondary` `#6B7280` = 4.83:1 |
| 9 | MEDIUM | portal · all | Avatar initials | both captures | White 11–13 px bold initials on gradients: at the light stop, 8 of 9 gradients are below 3:1 (green `#34D399` 1.92:1, amber `#FBBF24` 1.67:1, cyan `#22D3EE` 1.81:1) | DG-B8 (gradients measured at the lightest stop) | `Salespeople.jsx:9-17`; `manager-portal-responsive.css:858-875` | Solid avatar fills that each reach ≥ 4.5:1 with white: `#124AC6` 7.45, `#B91C1C` 6.47, `#0F766E` 5.47, `#15803D` 5.02. Or dark initials (`color.text.primary`) on `color.brand.primary-muted` |
| 10 | MEDIUM | portal · all | Hit targets | `probe.json` heights | Row Edit/Remove **29 px**, pagination buttons **31 px**, Add CTA **39 px**; web minimum is 40 | DG-B12; `size.touch-min` (web 40) | `probe.json` w1440 and w390 element heights; CSS `:933` (padding 6px 12px), `:1016-1026` | `size.control-height` 40 px for CTA and pagination; row actions min-height 40 px (padding `space.2` + line height) |
| 11 | MEDIUM | portal · all | Sidebar values (Team Size, Plan, Billing, Credits) | `web_03_manager-salespeople_w1440.png` | Plain data values in brand blue `#124AC6` look like links next to real links (rep names) | DG-B11 (primary only for actions, links, selected state) | `probe.json` "Stat value" `#124AC6` | Values in `color.text.primary`, `type.body-strong`; labels stay `color.text.secondary` |
| 12 | MEDIUM | portal · all | Copy / glossary | both captures | Non-glossary role names:<br>• "Your Salespeople", "+ Add Salesperson"<br>• role label "Manager", "100 per Sales Person"<br>• product label "TerriTool Cockpit" | S1.1 glossary; A4 §11.2 | `Salespeople.jsx:217, 234`; sidebar shell | "Your Business Sales Agents", "Add Business Sales Agent", role label "Business Agent", "100 credits per Business Sales Agent". Portal product name: owner decision (not in the glossary) |
| 13 | LOW | portal · all | Search field icon | `web_03_manager-salespeople_w1440.png` | Emoji 🔍 as the icon: renders differently per OS, 50% opacity | design-system §5 (one component language) | `Salespeople.jsx:247`; CSS `:752-760` | FontAwesome search icon (already loaded) in `color.text.secondary`, 16 px |
| 14 | LOW | portal · all | Neutrals | all | Off-token neutrals, which read slightly purple next to the gray family:<br>• text `#1A1A1A`<br>• secondary `#6E6E8A`<br>• border `#E5E5E5`<br>• background `#F5F6FA` | D-DS2 (gray family) | `manager-portal.css:13-18` | New portal code uses `--tt-color-text` `#111827`, `--tt-color-text-secondary` `#6B7280`, `--tt-color-border` `#E5E7EB`, `--tt-color-bg` `#F6F7FB` (from `tt-tokens.css` once created). Legacy variable values stay unchanged (D-DS1) |
| 15 | LOW | portal · all | Radius | all | Search field and CTA use 10 px; row buttons and pagination use 6 px | design-system §4 | `manager-portal.css:30` (`--radius-sm: 10px`); CSS `:933`, `:1020` | `radius.md` (12) for inputs and buttons, `radius.sm` (8) for row actions |
| 16 | LOW | portal · all | Counts | both captures | The count appears twice: "Manage your sales team — 2 entries" (header) and "Showing 1–2 of 2" (footer); "entries" is table jargon | copy rules (§5 rule 10) | `Salespeople.jsx:219`; footer `:404-408` | Header: "2 Business Sales Agents". Show the footer range only when there is more than one page |

## Notes (not design defects, routed elsewhere)

- **Declared and rendered fonts disagree.** `.mgr-sp-title` declares Space Grotesk (`manager-portal-responsive.css:693-699`), but the page renders DIN 2014 Bold 28 px, so another rule overrides it. Future edits to that class won't do what they appear to do. Record this in the code change summary when the portal CSS is touched.
- **"Resend Invitation" is a GET navigation with a side effect** (an email), at `Salespeople.jsx:191-194`. That is a code-gate topic (CG-W18/W3), not design. It was not triggered in this audit.
- **No loading or error state** is needed on first render: rows arrive as server props (`Salespeople.jsx:108-114`). The remove request has a busy flag (`removingId`) but no visible error message when `result.ok` is false (`:175-177`). **A DG-A3 error state is missing.**

## Could this audit be run without asking anyone? (Phase 7 step 3)

**Yes.** Every finding names a measured value, a `file:line` and a token-level fix.

Where the design context was too thin (details in `brain/audits/07-validation.md` §3):
- No web component specs for data tables, pagination, avatars, confirmation modals, overflow menus or promotional banners.
- No approved mapping from portal CSS variables to `--tt-*` tokens.
- No approved web icon set.
- No product decision on the portal name ("TerriTool Cockpit") or on showing app promotions per role.
- No captures of this screen's empty and error states, or of Admin pages.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (24)

**Documents (9):** [[brain/context/glossary|Approved words (glossary)]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/gates/design-gate|Checklist – design]] · [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[_code/brain/tools/probe-styles.js|Tool – measure page styles]]

**Product features (2):** [[_id/F24|Business Sales Agent management]] · [[_id/F23|Manager portal]]

**Coding rules (3):** [[_id/W3|Check input first]] · [[_id/S4.4|Readable contrast]] · [[_id/S1.1|Use approved words]]

**Quality checks (6):** [[_id/DG-A3|All states enumerated per screen]] · [[_id/DG-B11|Colour meaning]] · [[_id/DG-B8|Contrast of new text pairs]] · [[_id/DG-B6|Screen shell rules]] · [[_id/DG-B12|Touch/click targets]] · [[_id/CG-W18|Web routes in the right group]]

**Owner decisions (4):** [[_id/D-DS3|DIN font everywhere]] · [[_id/D-DS5|Disabled = 40% faded]] · [[_id/D-DS2|Grey colour family]] · [[_id/D-DS1|Only add new design tokens]]

%% brain-links:end %%
