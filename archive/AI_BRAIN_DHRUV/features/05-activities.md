---
id: 05-activities
parent: features
related:
  - features/03-companies.md
  - features/04-notes.md
  - 15-voice-policy.md
---
# Feature: Activities and meetings

Related: [03-companies](03-companies.md) · [04-notes](04-notes.md) · [15-voice-policy](../15-voice-policy.md)

## What it does

Log CRM events on a company: Meeting, Call, Visit, Message, Email, Reminder, Appointment.

## APIs

| Constant | Path |
|----------|------|
| `URL_GET_COMPANY_ACTIVITIES` | `getcompanyactivities` |
| `URL_ADD_COMPANY_ACTIVITY` | `addcompanyactivity` |
| `URL_UPDATE_COMPANY_ACTIVITY` | `updatecompanyactivity` |
| `URL_ADD_ACTIVITY` | `addactivity` |
| `URL_GET_LOG_MEET` | `getlogmeeting` |
| `URL_SAVE_LOG_MEET` | `addlogmeeting` |
| `URL_GET_USER_ACTIVITY` | `getUserActivity` (scope `Recent` \| `Week`) |

Legacy meetings table: `log_meetings`.

Timezone for activity compare on mobile: `America/Los_Angeles`.

## Screens

Dashboard card, `CalendarActivityScreen`, `RecentActivityScreen`, company sheet (`CustomCompany`).

## MCP

- `add_activity` → api `addcompanyactivity`
- `view_activities` / `edit_activity`

Voice “I just saw X”: resolve company → `add_activity` `note_type: Visit` → optional `mark_visited`. Do not use `add_note`.
