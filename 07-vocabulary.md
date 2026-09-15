---
id: 07-vocabulary
parent: core
sources:
  - webterritool/config/activity_note_types.php
related:
  - 09-credits-billing.md
  - 15-voice-policy.md
---
# 7. Vocabulary

Related: [features/](features/) · [09-credits-billing](09-credits-billing.md) · [15-voice-policy](15-voice-policy.md)

| TerriTool term | Rep says | Meaning |
|---------------|----------|---------|
| Route / run | route, loop, day plan | Ordered stops; `draft` / `processing` / `failed` / `published`; one may be **active** (`is_active`) |
| Stop / waypoint | stop, next stop, this one | A company on a route |
| Lead | lead, prospect, find leads | Unsaved AI result until `save_ai_leads` |
| Company | company, account, place, Address Book | Saved `companies` row |
| Contact | contact, decision maker | Person at a company |
| List | list | Named group of saved companies; can become a route |
| Credits | credits, balance | Spend units |
| Activity | call, meeting, visit, reminder, appointment | CRM event (`activities`) |
| Note | note | Free-text on a company — not a person, not a status |
| Status | priority, hot, gold, reject | Pipeline label on the company |
| Territory | city, ZIP, area | AI Find Leads location (`territoryMode` `city` \| `zip`) |
| High Priority / Gold | gold, hot | `set_company_status` — not a note |
| HQ | admin | Backpack `/hq` |
| Manager portal | manager dashboard | `/manager/*` Business Agent |

## Enums

**Activity `note_type`** (`webterritool/config/activity_note_types.php` + mobile): `Meeting`, `Call`, `Visit`, `Message`, `Email`, `Reminder`, `Appointment`.  
MCP `add_activity` copy often lists Meeting, Call, Visit, Reminder, Appointment (Message/Email still valid in API).

**Company status labels (MCP):** `High Priority`, `Gold`, `Active`, `Idle`, `Potential`, `Reject`, `Unclassified`. Stored per-user in `user_status`; default often Unclassified.

**Route types:** `basic` (MCP default), `regularcluster`, `smartcluster`.

**API success:** many endpoints use `status == "1"` or `1` (string vs int varies).

**Timezone for activity compare (mobile):** `America/Los_Angeles`.
