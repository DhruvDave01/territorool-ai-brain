---
id: VAULT-20260817-831374
type: change
status: HISTORICAL
evidence: DOCUMENTED
source: git mobile@a0882df (commit message + file list)
origin: manual-commit
supersedes: []
superseded_by: []
features: [F02, F03, F06, F08, F09, F10, F11, F12, F13, F14, F15, F20]
flows: []
platforms: [mobile]
files: [repos/mobile/App/components/customCalendar/CalendarScreen.js, repos/mobile/App/components/customCalendar/CustomCalendarScreen.js, repos/mobile/App/components/customCalendar/components/AgendaView.js, repos/mobile/App/components/customCalendar/components/CalendarScreenHeader.js, repos/mobile/App/components/customCalendar/components/CapsuleBar.js, repos/mobile/App/components/customCalendar/components/DayView.js, repos/mobile/App/components/customCalendar/components/EventEditor.js, repos/mobile/App/components/customCalendar/components/EventRow.js, repos/mobile/App/components/customCalendar/components/MonthView.js, repos/mobile/App/components/customCalendar/components/RescheduleModal.js, repos/mobile/App/components/customCalendar/components/ViewSwitcher.js, repos/mobile/App/components/customCalendar/components/WeekView.js]
commits: [mobile@a0882df]
relations:
occurrences: 1
first_recorded: 2026-08-17
last_verified: 2026-08-17
verified_against: mobile@a0882df
labels: [git-seed, mobile]
area: memory
tags: [brain/memory, brain/kind/commit]
ref: "mobile a0882df — Change in flow and mcp related changes"
---

# mobile a0882df — Change in flow and mcp related changes

## What

Commit `a0882df` on 2026-08-17 by a team developer: "Change in flow and mcp related changes". 38 source file(s) changed (8 non-source file(s) ignored).

## Why it matters

Touches F02 Registration & onboarding, F03 Subscription / paywall / upgrade / cancel / credits top-up, F06 AI Find Leads → save leads, F08 Create route, F09 Route detail & navigation, F10 Mark visited & visit log, F11 Lists, F12 Companies (Address Book), F13 Contacts, F14 Activities / notes / log meetings, F15 Find & buy contacts (credits), F20 Settings / status tags / stages (criticality BLOCKER/HIGH/MEDIUM).

## Evidence

`git -C repos/mobile show --stat a0882df` — the commit message is the only statement of intent (DOCUMENTED, not VERIFIED).

## Implication for future work

When these files change again, re-verify F02, F03, F06, F08, F09, F10, F11, F12, F13, F14, F15, F20 (`node tools/memory.js impact <file>`).

## Related

- repos/mobile/App/components/customCalendar/CalendarScreen.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/CalendarScreen.js)
- repos/mobile/App/components/customCalendar/CustomCalendarScreen.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/CustomCalendarScreen.js)
- repos/mobile/App/components/customCalendar/components/AgendaView.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/AgendaView.js)
- repos/mobile/App/components/customCalendar/components/CalendarScreenHeader.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/CalendarScreenHeader.js)
- repos/mobile/App/components/customCalendar/components/CapsuleBar.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/CapsuleBar.js)
- repos/mobile/App/components/customCalendar/components/DayView.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/DayView.js)
- repos/mobile/App/components/customCalendar/components/EventEditor.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/EventEditor.js)
- repos/mobile/App/components/customCalendar/components/EventRow.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/EventRow.js)
- repos/mobile/App/components/customCalendar/components/MonthView.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/MonthView.js)
- repos/mobile/App/components/customCalendar/components/RescheduleModal.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/RescheduleModal.js)
- repos/mobile/App/components/customCalendar/components/ViewSwitcher.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/ViewSwitcher.js)
- repos/mobile/App/components/customCalendar/components/WeekView.js — historical path at mobile@a0882df; no longer at HEAD (trace: git -C repos/mobile log --follow --oneline -- App/components/customCalendar/components/WeekView.js)

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (13)

**Document (1):** [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]]

**Product features (12):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F10|Mark visited & visit log]] · [[_id/F02|Registration & onboarding]] · [[_id/F09|Route detail & navigation]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]]

%% brain-links:end %%
