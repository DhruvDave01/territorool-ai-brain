---
id: Calendar-and-Activity
parent: design
---
# Calendar and activity

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/02-home/`).

```
Dashboard Calendar → CalendarActivity (IMG_4608, Archive `19.40.34`)
  → month pager
  → selected day blue circle; other events show dots
  → rows: title, date/time, type chip (Meeting / Visit)
  → Today label green when viewing today (VID3)
  → tap row → company/activity (Needs Manual Verification of destination)

Dashboard Activity
  → Upcoming empty vs Recent list (IMG_4605)
  → types: New Company Added, Created List, Contact Added, Marked visited, Activity Created
  → full **Activity** list (`19.40.14`): Contact Added, Received Route {name} from {user}
```

Add Activity from company (VID1 + Archive `20.11.59`): note, type picker **Meeting / Call / Visit / Message / Email / Reminder / Appointment**, date, time → appears under Today/Upcoming/Past.
