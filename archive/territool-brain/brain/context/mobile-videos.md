---
area: context
tags: [brain/context]
ref: "Mobile screen recordings (owner, by module)"
---

# Mobile screen recordings (owner, by module)

24 recordings · 30:12 total · 871 MB · 1320×2868 (iPhone 17 Pro Max simulator, matching the 249 screenshots).
Captured 2026-09-16 on **staging**, app **42.32 (1) · iOS · Development (S)** (header strip visible in the evidence stills; simulator log shows bundle `com.picwa.appterritool`).

> [!warning] What this index does and does not know
> IDs, modules, durations, sizes and SHA-256 are **VERIFIED** (file system + `mdls` + the capture manifest).
> The **What was executed** column is `DOCUMENTED` — it is quoted from `brain/audits/data/video-capture/video-manifest.json`, written by the session that recorded these. The footage itself has not been watched: `ffmpeg` is not installed, so frames cannot be extracted here.
> The **flow mapping** is `INFERRED` from the module and file name.

Regenerate: `node tools/index-mobile-videos.js`. Library: `brain/assets/videos/mobile-owner/`.

## Recordings

| ID | Module | Recording | Length | Flows | What was executed (from the capture manifest) |
|---|---|---|---|---|---|
| MV-01 | 01 Dashboard | Dashboard Activity and Calendar | 0:43 | F05 · F14 | Recent and Upcoming tabs; calendar month/date navigation; full activity feed and scrolling. |
| MV-02 | 02 Companies | Company Activity and Visit | 0:58 | F12 · F14 · F10 | Activity validation; create Visit activity; edit its note; activity tabs. |
| MV-03 | 02 Companies | Company Details and Edit | 0:56 | F12 | Address Book search; company details and More Info; edit company name and industry; verify saved values. |
| MV-04 | 02 Companies | Contact Notes and Test Data Deletion | 1:33 | F13 · F12 | Verify saved contact note and role; cancel then confirm contact deletion; close lingering sheet; delete disposable scanned company and verify success. |
| MV-05 | 02 Companies | Create Company and Validation | 1:06 | F12 | Empty-name validation; manual company entry; address and industry; save. |
| MV-06 | 03 Contacts | Address Book Contacts and Purchase Verification | 1:01 | F13 · F15 | Search Connie Munson; verify purchased phone and enabled email; add contact company to Fresh Coffee route; verify stop. |
| MV-07 | 03 Contacts | Contact Create Edit and Notes | 1:26 | F13 | Required fields and invalid email validation; create contact; edit position and notes; verify. |
| MV-08 | 04 Lists | List Create Search and Edit | 1:38 | F11 | Create Fresh Demo List; one-company edit validation; add second company; save and verify. |
| MV-09 | 04 Lists | List Find Contacts Purchase | 1:54 | F11 · F15 | Dashboard > Lists > Test List Brain 0002 > Find Contacts; review/remove/reselect; buy phone and email for Connie Munson using 2 existing credits. Completion verified in the Contacts video. |
| MV-10 | 04 Lists | List Search Filters Sharing and Map | 1:25 | F11 · F17 | Find list; no-result company search; visited filter and reset; invalid sharing email; map and zoom. |
| MV-11 | 05 Routes | Route Creation | 1:02 | F08 | Name validation; select companies; review stops; choose endpoints; publish Fresh Demo Route; verify. |
| MV-12 | 05 Routes | Route Find Contacts Purchase | 1:55 | F08 · F15 | Dashboard > Routes > Fresh Coffee > Find Contacts; company contact preview; select/review/remove/reselect; buy email using 1 existing credit; verify saved contact. |
| MV-13 | 05 Routes | Route Search Filters Sharing and Map | 1:40 | F09 · F17 | Search route and stops; visited filter and reset; invalid sharing email; map zoom; pin details. |
| MV-14 | 05 Routes | Route Visits and Editing | 1:25 | F09 · F10 | Mark and remove visit; next/previous waypoint; edit route; save; endpoint reversal observed. |
| MV-15 | 06 Lead Discovery | AI Find Leads Map and List Import | 2:00 | F06 · F11 | Saved city results; map; start/end/clear area-selection controls; minimum-two validation; select two leads; import into Fresh Demo List; verify company rows. |
| MV-16 | 06 Lead Discovery | AI Find Leads Search to Route | 2:37 | F06 · F08 | Clear saved search; ZIP 94043 and Coffee; search; select and import two leads; create Fresh AI route; one imported stop triggers validation; add second stop; publish and verify. |
| MV-17 | 06 Lead Discovery | Find Leads Search and Import | 1:31 | F07 · F06 | Dashboard > Address Book > add menu > Find Leads; ZIP 94043 and Coffee; select 41 results; confirm import; verify White Tiger in Address Book. |
| MV-18 | 07 Scanners | Business Card Gallery OCR and Save | 1:01 | F18 | Choose existing public sample from Gallery; crop; OCR; review and rename company/contact; clear sample phone; save; verify company/contact. |
| MV-19 | 07 Scanners | QR and Camera Scanner Availability | 0:16 | F19 · F18 | Open QR scanner; return; try business-card camera; capture Simulator camera-unavailable message. |
| MV-20 | 08 Settings | Current Package Modal Open and Close | 0:22 | F03 · F20 | Pro Package Active; expand plan features; open cancellation form; close with X; reopen; Nevermind. No cancellation submitted. |
| MV-21 | 08 Settings | Settings Tags and App Update | 0:30 | F20 · F32 | Account information; status-tag color picker; update tags success; development app-update preview; Update Later. |
| MV-22 | 09 Authentication | Login Logout and Password Validation | 1:17 | F01 | Logout cancel and confirm; empty login; invalid credentials and wrong-password error; password recovery web form; return; successful ann_new login to Dashboard. |
| MV-23 | 09 Authentication | Registration Until Payment Setup | 1:30 | F02 · F03 | Dashboard > Settings > logout > Register; goals; field/B2B role; Google Maps tool; required-field validation; submit test registration; stop at payment setup. |
| MV-24 | 10 Referrals and App Lifecycle | Referral Forms and App Lifecycle | 0:26 | F28 · F32 | Referral empty/invalid email and invalid phone validation; close; background/resume; rotate and restore portrait. |

## Capture session

| | |
|---|---|
| Device | iPhone 17 Pro Max, iOS 26.5 · simulator `C73F304D-CF29-425B-8771-61279049E475` |
| Build | `com.picwa.appterritool` 42.32 (1), Debug, **development/staging** |
| Account | the staging Sales Agent (`.local` role) · final credits **8320**, existing test credits only |
| Money | **no real-money purchases**; the Pro package was opened and dismissed, never cancelled |
| Produced by | Codex (`~/.codex/visualizations/…`), 2026-09-16 · every video starts on Dashboard; idle pauses trimmed, API waits left in |
| Verified by the capture | first / midpoint / end frames decoded for all 24; SHA-256 re-checked after copying |

Raw session records: `brain/audits/data/video-capture/{video-index.txt,video-manifest.json,playback-verification.json,final-simulator-log.txt}`.

## What these recordings do NOT cover

Quoted from the capture session, because a coverage gap that is not written down gets mistaken for a pass:

- Real-money purchases, RevenueCat checkout and the final registration payment were **intentionally skipped** — matching S6.4 (stop before the pay step).
- Current-package cancellation was opened and dismissed only; nothing was submitted.
- **Live QR decoding and camera capture cannot run on the Simulator** — physical-device testing is still owed (F18, F19).
- Share and referral forms were exercised, but **no email/SMS was actually sent** and no password reset was sent: no destination address was agreed.
- AI map area-selection (lasso) controls were exercised, but **no valid lasso result was established**. Ordinary checkbox selection, import, map display and route/list destinations were verified.
- External navigation, calling, email delivery and third-party CRM connections need their own setup and are **not claimed as end-to-end passes**.
- No claim that every data combination or branch was covered; the executed path per recording is the table above.

## Defects these recordings captured

| Gap | What was seen | Recording |
|---|---|---|
| **KG-UI8** | Delete-contact sheet stays over Address Book after a successful delete. **Root cause verified in code** (`contacts/view.js:1207`) | MV-04 |
| **KG-COPY2** | Editing a one-company *list* is rejected with a *route*-specific minimum-two-waypoints message | MV-08 |
| **KG-RT2** | Editing a route reversed the default start/end points before saving | MV-14 |
| **KG-SEL2** | AI search selected two leads; Create Route received one. Cause unconfirmed | MV-16 |
| KG-UI1 | "Invalid Date PT" on Dashboard — listed for MV-01 in the recording index (DOCUMENTED, not watched). **Runtime-confirmed separately on 2026-09-16, build 42.32 (1): EV-M02** | MV-01; EV-M02 |
| KG-GLOSS1 | Retired term "Waypoint" in the Create Route error and the company search placeholder | MV-16 |

Full entries: `brain/context/known-fragile.md` §5.

## Flow coverage

These 20 flows now have moving evidence, where before there were only still screenshots:

| Flow | Recordings |
|---|---|
| **F01** Login & session | MV-22 |
| **F02** Register & onboarding | MV-23 |
| **F03** Subscription & paywall | MV-20, MV-23 |
| **F05** Dashboard & activity feed | MV-01 |
| **F06** AI Find Leads | MV-15, MV-16, MV-17 |
| **F07** Places / Yelp leads | MV-17 |
| **F08** Create route | MV-11, MV-12, MV-16 |
| **F09** Route detail & navigation | MV-13, MV-14 |
| **F10** Mark visited | MV-02, MV-14 |
| **F11** Lists | MV-08, MV-09, MV-10, MV-15 |
| **F12** Companies | MV-02, MV-03, MV-04, MV-05 |
| **F13** Contacts | MV-04, MV-06, MV-07 |
| **F14** Activities | MV-01, MV-02 |
| **F15** Find & buy contacts | MV-06, MV-09, MV-12 |
| **F17** Share route/list | MV-10, MV-13 |
| **F18** Scan business card | MV-18, MV-19 |
| **F19** QR route import | MV-19 |
| **F20** Settings / status tags / stages | MV-20, MV-21 |
| **F28** Referral invites | MV-24 |
| **F32** App launch, permissions, crash | MV-21, MV-24 |

## Modules

- **01 Dashboard** — 1 recording, 0:43 (MV-01)
- **02 Companies** — 4 recordings, 4:33 (MV-02, MV-03, MV-04, MV-05)
- **03 Contacts** — 2 recordings, 2:27 (MV-06, MV-07)
- **04 Lists** — 3 recordings, 4:57 (MV-08, MV-09, MV-10)
- **05 Routes** — 4 recordings, 6:02 (MV-11, MV-12, MV-13, MV-14)
- **06 Lead Discovery** — 3 recordings, 6:08 (MV-15, MV-16, MV-17)
- **07 Scanners** — 2 recordings, 1:17 (MV-18, MV-19)
- **08 Settings** — 2 recordings, 0:52 (MV-20, MV-21)
- **09 Authentication** — 2 recordings, 2:47 (MV-22, MV-23)
- **10 Referrals and App Lifecycle** — 1 recording, 0:26 (MV-24)

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (60)

**Documents (8):** [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-7df4d9-cr-28-mobile-flows-captured-videos-not-yet-provi|CR-28 — mobile-flows-captured: "Videos not yet provided" ↔ 24 recordings indexed in mobile-videos.md]] · [[brain/memory/entries/bug/20260917-b79e55-kg-ui1-invalid-date-pt-on-dashboard-still-presen|KG-UI1 — "Invalid Date PT" on dashboard (still present in 42.32)]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[log|Log]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[workspace/test-cases/F01-mobile-login-main-nav|Test cases — F01/F05 mobile login and main navigation (P0/P1)]]

**Product features (20):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F32|App launch, permissions, crash, offline]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F10|Mark visited & visit log]] · [[_id/F07|Places / Yelp leads]] · [[_id/F19|QR route import]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F09|Route detail & navigation]] · [[_id/F18|Scan business card]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F17|Share route/list]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]]

**Coding rule (1):** [[_id/S6.4|Staging test data rules]]

**Problem founds (6):** [[_id/KG-UI1|“Invalid Date” on home screen]] · [[_id/KG-SEL2|An AI Find Leads search selected two leads, but Create…]] · [[_id/KG-UI8|Delete-contact sheet survives navigation]] · [[_id/KG-COPY2|Editing a one-company list is rejected with a…]] · [[_id/KG-RT2|Editing a route]] · [[_id/KG-GLOSS1|Old word “Waypoint” shown]]

**Code file (1):** [[_code/mobile/App/components/contacts/view.js|view.js]]

%% brain-links:end %%
