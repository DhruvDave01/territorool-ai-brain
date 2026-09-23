---
area: workspace
tags: [brain/workspace]
ref: "Test cases — F01/F05 mobile login and main navigation (P0/P1)"
---

# Test cases — F01/F05 mobile login and main navigation (P0/P1)

Format: `brain/audits/05-testing.md` §6. Platform **mobile** = iOS debug build 42.32 (1) against staging, on a
**second** simulator (never the owner's booted one), driven by Maestro 2.10.0.

**Exact command (from `territool-brain/`):**

```bash
# once per simulator: pre-grant permissions so no "Allow" text taps are needed
xcrun simctl privacy <UDID> grant location-always com.picwa.appterritool
node workspace/test-suites/mobile/run.js --device <UDID> --role "Sales Agent" workspace/test-suites/mobile/F01-login-main-nav.yaml --out workspace/qa-evidence/<date>/mobile/sales-agent-nav
node workspace/test-suites/mobile/run.js --device <UDID> --role "Business Sales Agent" workspace/test-suites/mobile/F01-login-main-nav.yaml --out workspace/qa-evidence/<date>/mobile/business-sales-agent-nav
```

**Safety:** the runner refuses the owner's simulator and any simulator that is not booted; credentials are
passed as Maestro env vars and redacted from all output; the flow only navigates (no save, buy, share or
delete taps).

## Cases

| ID | Flow | Title | Platform | Role | Priority | Type | Preconditions | Test data | Steps | Expected result | Rule / target refs | Known gap | Evidence | Automation | Status | Last run |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-M-F01-001 | F01 | Sales Agent signs in on iOS and reaches the Dashboard | mobile | Sales Agent | P0 | happy | clean app state (launched with clearState) | `.local` role "Sales Agent" (never raw) | 1. launch 2. (if the paywall preview shows) Back to Login 3. enter email + password 4. submit 5. dismiss "Save Password?" | `screen.dashboard` visible within 60 s | M3 | — | `qa-evidence/2026-09-16/mobile/sales-agent-nav` (EV-M01) | mobile: workspace/test-suites/mobile/F01-login-main-nav.yaml | Pass | 2026-09-16 · iOS 42.32 (1) staging |
| TC-M-F05-001 | F05 | Dashboard shows six tiles and no footer | mobile | Sales Agent | P1 | visual | signed in | — | 1. screenshot the Dashboard | header (name, credits, QR, settings), six tiles, Activity with Upcoming/Recent, version; **no footer**. KG-UI1 "Invalid Date PT" visible (known) | S4.3 | KG-UI1 | EV-M02 | mobile: F01-login-main-nav.yaml | Pass (with known gap) | 2026-09-16 · iOS 42.32 (1) staging |
| TC-M-F12-001 | F12 | Address Book opens from its tile | mobile | Sales Agent | P1 | happy | signed in | — | 1. tap "Address Book" | Companies/Contacts tabs, search, filter, company cards | — | KG-UI2 (raw industry values) | EV-M03 | mobile: F01-login-main-nav.yaml | Pass | 2026-09-16 · iOS 42.32 (1) staging |
| TC-M-F08-001 | F08 | Routes Library opens from the footer | mobile | Sales Agent | P1 | happy | on an inner screen | — | 1. tap footer Routes | "Routes Library" with search and route cards | — | KG-GLOSS1 ("Waypoints") | EV-M04 | mobile: F01-login-main-nav.yaml | Pass | 2026-09-16 · iOS 42.32 (1) staging |
| TC-M-F11-001 | F11 | Lists opens from the footer | mobile | Sales Agent | P1 | happy | on an inner screen | — | 1. tap footer Lists | "Lists" with search and numbered cards | — | — | EV-M05 | mobile: F01-login-main-nav.yaml | Pass | 2026-09-16 · iOS 42.32 (1) staging |
| TC-M-F06-001 | F06 | AI Find Leads restores the saved search | mobile | Sales Agent | P1 | happy | a saved AI search exists | — | 1. tap footer AI Find Leads | search form pre-filled from the saved search; Search Leads / Selected Leads tabs | — | — | EV-M06 | mobile: F01-login-main-nav.yaml | Pass | 2026-09-16 · iOS 42.32 (1) staging |
| TC-M-F20-001 | F20 | Sales Agent Settings shows plan, credits and 7 tags | mobile | Sales Agent | P2 | happy | signed in | — | 1. relaunch 2. tap the settings icon | profile, Credits Remaining, plan + renewal, Cancel/Upgrade, Buy extra credits, "7 status tags" | — | — | EV-M07 | mobile: F01-login-main-nav.yaml | Pass | 2026-09-16 · iOS 42.32 (1) staging |
| TC-M-F01-002 | F01 | Business Sales Agent signs in on iOS | mobile | Business Sales Agent | P0 | happy | clean app state | `.local` role "Business Sales Agent" (never raw) | same as TC-M-F01-001 | Dashboard with the empty state "No upcoming activities yet." | M3 | KG-UI1 | EV-M08 | mobile: F01-login-main-nav.yaml | Pass | 2026-09-16 · iOS 42.32 (1) staging |
| TC-M-F20-002 | F20 | Business Sales Agent Settings hides plan and purchase controls | mobile | Business Sales Agent | P2 | permission | signed in as a BSA | — | 1. open Settings | only profile, "6 status tags", version; **no** credits, plan, Cancel/Upgrade or Buy credits | S3.2 | — | EV-M09 | mobile: F01-login-main-nav.yaml | Pass | 2026-09-16 · iOS 42.32 (1) staging |
| TC-M-F11-002 | F11 | Business Sales Agent sees manager-assigned lists | mobile | Business Sales Agent | P1 | happy | the manager assigned leads | — | 1. open Lists | lists named "manager assigned leads – <date>" | — | — | EV-M10 | mobile: F01-login-main-nav.yaml | Pass | 2026-09-16 · iOS 42.32 (1) staging |

## Not covered here

Write flows (create route, add company, activity, buy contacts) are covered by the owner's captures and
recordings (`mobile-flows-captured.md`, `mobile-videos.md`), not by the brain's own runs (U-MOB-01).
Android is not covered (U-MOB-02).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (18)

**Documents (5):** [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[brain/context/mobile-videos|Mobile screen recordings (owner, by module)]] · [[workspace/design-proposals/2026-09-17-lists-library-filter/placement|Placement walk-through: "add a filter to the Lists library"]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]]

**Product features (7):** [[_id/F06|AI Find Leads → save leads]] · [[_id/F12|Companies (Address Book)]] · [[_id/F08|Create route]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F20|Settings / status tags / stages]]

**Coding rules (3):** [[_id/S4.3|Loading, empty & error states]] · [[_id/S3.2|Sales reps follow manager's plan]] · [[_id/M3|Success only when status is 1]]

**Problem founds (3):** [[_id/KG-UI1|“Invalid Date” on home screen]] · [[_id/KG-GLOSS1|Old word “Waypoint” shown]] · [[_id/KG-UI2|Raw industry codes shown]]

%% brain-links:end %%
