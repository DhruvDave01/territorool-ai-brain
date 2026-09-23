---
area: root
tags: [brain/root]
ref: "TASK_CONFIDENCE_LOOP — feature-level task confidence"
---

# TASK_CONFIDENCE_LOOP — feature-level task confidence

Loop to raise `node tools/brain-score.js` (feature task confidence) as far as **legitimate evidence** allows,
with **application code frozen**. Scoring model: `FEATURE_SCORE_MODEL.md`. Every gain below is a real artifact
(executed suite, runtime evidence, verified parity, accurate index mapping) — never a placeholder or a scorer edit.

> [!warning] SUPERSEDED 2026-09-17 — the QA dimension below overcounted
> The 2026-09-16 result counted a QA report as passing when 1–3 read-only cases passed. From 2026-09-17
> `tools/qa-report.js` gives `PARTIAL` unless every coverage type in `territool-test` §2 has an executed case and
> parity has no open "accidentally different" divergence. All 18 generated reports are now `PARTIAL`, so their
> features lose the +20 QA points: **overall 80.2 → 68.4** (`node tools/brain-score.js`, 2026-09-17), then
> **67.4** once the hand-written F01 report was brought under the generator (F01 is `PARTIAL`, 5 of 10 types). The table
> below is kept as the dated record of that run. Current numbers: run the scorer. Audit:
> `workspace/qa-reports/2026-09-17-knowledge-memory-audit.md`.

## Result

| | Score |
|---|---|
| Baseline | **54.8** |
| Final (this environment) | **80.2** |
| Improvement | **+25.4** |
| Reachable in this environment | **80.2** — every obtainable evidence source exhausted (coverage ≈ 100%) |
| Ceiling if external blockers were lifted | **93.6** (payment sandbox, staging MCP endpoint, device camera, Admin-captcha, mutation-safe staging, MCP modules in the code graph) |

**Features ≥ 90: 19/32 · 80–89: 0 · 60–79: 9 · 40–59: 3 · <40: 1.** The 13 below 90 are each capped by a
documented external blocker (below), not by unfinished brain work; every dimension the environment allows is maxed.

## Iterations

| # | Action | Evidence added | Score → |
|---|---|---|---|
| 0 | baseline | — | 54.8 |
| 1 | 16 per-feature QA reports from real suite runs (`tools/qa-report.js`) | executed API/web cases, honest verdicts | 65.9 |
| 2 | settle 7 verified parity rows (F05,F06,F17,F18,F19,F22,F28) | runtime + code | 69.4 |
| 3 | link web screenshots → features in the generator (real gap: `flows` tags were ignored) | F23/F24/F25 behaviour | 71.4 |
| 4 | settle F03/F09/F15 parity (platform-necessity / owner-confirmed-via-F10 / shared controller) | code + runtime | 74.1 |
| 5 | F16 + F28 validation-only tests (no mutation) + QA | executed cases | 75.6 |
| 6 | settle F07/F17/F21/F26/F27 parity (verified platform facts) | code + runtime | 77.0 |
| 7 | curated feature→code map for F23/F25/F32 (web-graph missed `/manager`,`/hq`) | accurate code mapping | 78.8 |
| 8 | tag CRM/MCP/upload screenshots → F21/F31/F22 | owner captures | 80.0 |
| 9 | tag support screenshots → F26 | owner captures | 80.2 |

## Feature matrix (final)

| Feature | Crit | Score | Code | Beh | Parity | Tests | QA | Blocker (why not higher) |
|---|---|---:|---:|---:|---:|---:|---:|---|
| F01 | BLOCKER | 90 | 20 | 20 | 10 | 20 | 20 | verified divergence (BT-1/2), 10 by design |
| F02 | BLOCKER | 90 | 20 | 20 | 10 | 20 | 20 | verified divergence (KG-P2), 10 by design |
| F03 | BLOCKER | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F04 | BLOCKER | 40 | 20 | 0 | 20 | 0 | 0 | crons mutate; headless (no UI, behaviour N/A) |
| F05 | HIGH | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F06 | HIGH | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F07 | MEDIUM | 60 | 20 | 20 | 20 | 0 | 0 | Yelp/Places are paid providers |
| F08 | HIGH | 90 | 20 | 20 | 10 | 20 | 20 | verified divergence (BT-5), 10 by design |
| F09 | HIGH | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F10 | HIGH | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F11 | HIGH | 90 | 20 | 20 | 10 | 20 | 20 | verified divergence, 10 by design |
| F12 | HIGH | 90 | 20 | 20 | 10 | 20 | 20 | verified divergence, 10 by design |
| F13 | HIGH | 90 | 20 | 20 | 10 | 20 | 20 | verified divergence (BT-3), 10 by design |
| F14 | HIGH | 90 | 20 | 20 | 10 | 20 | 20 | verified divergence (BT-6/7), 10 by design |
| F15 | BLOCKER | 60 | 20 | 20 | 20 | 0 | 0 | payment: `buyContacts` spends credits |
| F16 | MEDIUM | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F17 | MEDIUM | 60 | 20 | 20 | 20 | 0 | 0 | share sends an email |
| F18 | MEDIUM | 60 | 20 | 20 | 20 | 0 | 0 | card scan needs a device camera |
| F19 | MEDIUM | 60 | 20 | 20 | 20 | 0 | 0 | QR needs a device camera |
| F20 | MEDIUM | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F21 | MEDIUM | 60 | 20 | 20 | 20 | 0 | 0 | CRM sync mutates external systems |
| F22 | MEDIUM | 60 | 20 | 20 | 20 | 0 | 0 | CSV upload mutates data |
| F23 | HIGH | 100 | 20 | 20 | 20 | 20 | 20 | — (was the flagged weakest; now maxed) |
| F24 | HIGH | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F25 | MEDIUM | 60 | 20 | 20 | 20 | 0 | 0 | Admin HQ: reCAPTCHA + write-only actions |
| F26 | LOW | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F27 | LOW | 90 | 20 | 10 | 20 | 20 | 20 | no in-app inbox exists (behaviour capped) |
| F28 | LOW | 100 | 20 | 20 | 20 | 20 | 20 | — |
| F29 | MEDIUM | 40 | 20 | 0 | 20 | 0 | 0 | customer MCP endpoint may be production (unsafe) |
| F30 | LOW | 20 | 0 | 0 | 20 | 0 | 0 | AdminMCP module absent from the code graph |
| F31 | MEDIUM | 40 | 0 | 20 | 20 | 0 | 0 | McpClient module absent from the code graph; chat mutates |
| F32 | MEDIUM | 60 | 20 | 20 | 20 | 0 | 0 | launch/crash: no safe runtime test |

## Blockers, classified (§28)

| Class | Features | To unblock (owner / infra) |
|---|---|---|
| Payment sandbox | F15, F04 (renewal), F03 (pay step, already 100 on reads) | a staging store sandbox / test Stripe (Q-T5) |
| Data-mutation / external send | F17, F21, F22 | mutation-safe staging with `QA-AUTO-` cleanup approval |
| Paid third-party providers | F07 | a provider test budget |
| Device-only | F18, F19 | a physical device / camera-capable runner |
| Admin captcha + write actions | F25 | a captcha-free staging Admin path (read-only) |
| MCP not in the code graph / prod-endpoint risk | F29, F30, F31 | index `app/{UserMcp,FindMcp,AdminMcp,McpClient}` in `phpgraph.js`; a confirmed-staging MCP endpoint |
| Headless / no inbox | F04 (behaviour), F27 (behaviour) | inherent — no UI to capture |

## Not gamed (§23)

No placeholder files; no duplicated screenshots; no fabricated PASS; `tools/brain-score.js` unchanged; no
weights lowered; no feature removed. Every QA report is derived from an executed run (`tools/qa-report.js`),
every parity change cites verification, every code/behaviour link points at a real file/screenshot.

## Stopping condition

**Evidence ceiling reached (§28 case B):** actual **80.2 / 80.2 obtainable in this environment (≈100% coverage)**;
the 9.8-point gap to 90 is entirely the external blockers above. If they are lifted, the model reaches **~93.6**.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (76)

**Documents (38):** [[brain/context/confidence-score|Confidence score: how ready the brain is for a task]] · [[_code/brain/tools/brain-score.js|Confidence score: how well the brain equips an agent to take a task on each product feature.]] · [[workspace/qa-reports/2026-09-16-f01-login-api-contract|F01 QA report — Login & session]] · [[workspace/qa-reports/2026-09-16-f02-registration-onboarding|F02 QA report — Registration & onboarding]] · [[workspace/qa-reports/2026-09-16-f03-subscription-paywall-upgrade-cancel-cred|F03 QA report — Subscription / paywall / upgrade / cancel / credits top-up]] · [[workspace/qa-reports/2026-09-16-f05-dashboard-activity-feed-calendar|F05 QA report — Dashboard, activity feed, calendar]] · [[workspace/qa-reports/2026-09-16-f06-ai-find-leads-save-leads|F06 QA report — AI Find Leads → save leads]] · [[workspace/qa-reports/2026-09-16-f07-places-yelp-leads|F07 QA report — Places / Yelp leads]] · [[workspace/qa-reports/2026-09-16-f08-create-route|F08 QA report — Create route]] · [[workspace/qa-reports/2026-09-16-f09-route-detail-navigation|F09 QA report — Route detail & navigation]] · [[workspace/qa-reports/2026-09-16-f10-mark-visited-visit-log|F10 QA report — Mark visited & visit log]] · [[workspace/qa-reports/2026-09-16-f11-lists|F11 QA report — Lists]] · [[workspace/qa-reports/2026-09-16-f12-companies-address-book|F12 QA report — Companies (Address Book)]] · [[workspace/qa-reports/2026-09-16-f13-contacts|F13 QA report — Contacts]] · [[workspace/qa-reports/2026-09-16-f14-activities-notes-log-meetings|F14 QA report — Activities / notes / log meetings]] · [[workspace/qa-reports/2026-09-16-f15-find-buy-contacts-credits|F15 QA report — Find & buy contacts (credits)]] · [[workspace/qa-reports/2026-09-16-f16-report-company-contact|F16 QA report — Report company/contact]] · [[workspace/qa-reports/2026-09-16-f17-share-route-list|F17 QA report — Share route/list]] · [[workspace/qa-reports/2026-09-16-f18-scan-business-card|F18 QA report — Scan business card]] · [[workspace/qa-reports/2026-09-16-f19-qr-route-import|F19 QA report — QR route import]] · [[workspace/qa-reports/2026-09-16-f20-settings-status-tags-stages|F20 QA report — Settings / status tags / stages]] · [[workspace/qa-reports/2026-09-16-f21-crm-sync|F21 QA report — CRM sync]] · [[workspace/qa-reports/2026-09-16-f22-bulk-csv-upload|F22 QA report — Bulk CSV upload]] · [[workspace/qa-reports/2026-09-16-f23-manager-portal|F23 QA report — Manager portal]] · [[workspace/qa-reports/2026-09-16-f24-business-sales-agent-management|F24 QA report — Business Sales Agent management]] · [[workspace/qa-reports/2026-09-16-f25-admin-hq|F25 QA report — Admin HQ]] · [[workspace/qa-reports/2026-09-16-f26-support-tickets|F26 QA report — Support tickets]] · [[workspace/qa-reports/2026-09-16-f27-notifications-push|F27 QA report — Notifications & push]] · [[workspace/qa-reports/2026-09-16-f28-referral-invites|F28 QA report — Referral invites]] · [[workspace/qa-reports/2026-09-16-f29-customer-mcp-connectors|F29 QA report — Customer MCP connectors]] · [[workspace/qa-reports/2026-09-16-f30-admin-mcp|F30 QA report — Admin MCP]] · [[workspace/qa-reports/2026-09-16-f31-mcp-client-connections-chat|F31 QA report — MCP client connections & chat]] · [[FEATURE_SCORE_MODEL|FEATURE_SCORE_MODEL — how tools/brain-score.js computes feature task confidence]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[log|Log]] · [[workspace/qa-reports/QA-COVERAGE|QA coverage ranking — what to test next]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/skills/territool-test/SKILL|Skill – testing]]

**Product features (32):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F25|Admin HQ]] · [[_id/F30|Admin MCP]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F32|App launch, permissions, crash, offline]] · [[_id/F22|Bulk CSV upload]] · [[_id/F24|Business Sales Agent management]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F21|CRM sync]] · [[_id/F29|Customer MCP connectors]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F10|Mark visited & visit log]] · [[_id/F31|MCP client connections & chat]] · [[_id/F27|Notifications & push]] · [[_id/F07|Places / Yelp leads]] · [[_id/F19|QR route import]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F16|Report company/contact]] · [[_id/F09|Route detail & navigation]] · [[_id/F18|Scan business card]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F17|Share route/list]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F04|Subscription & credit renewal]] · [[_id/F26|Support tickets]]

**Owner decisions (5):** [[_id/BT-6|Activity needs type, date & note]] · [[_id/BT-1|Block Admin on the mobile app]] · [[_id/BT-3|Hand-added contacts are free]] · [[_id/Q-T5|Question: does staging have test payments?]] · [[_id/BT-5|Routes have 2–400 stops]]

**Problem found (1):** [[_id/KG-P2|Weaker sign-up checks on the server]]

%% brain-links:end %%
