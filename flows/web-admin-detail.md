# Web admin flow — detail

Copy this shape when a new HQ requirement arrives. Map: [web-admin.md](web-admin.md). Role: [Admin](../roles/admin.md). Pixels: [screenshot review](../screenshots/REVIEW.md).

Admin only. `/hq`. Backpack. No mobile HQ.

## 1. HQ home

- **From** — admin login
- **Do** — read Logged In, Created Routes, Activity, New Users, and the leaderboard
- **Copy** — this HQ home, including its own sidebar
- **Next** — a sidebar item such as Sales Agents
- **Stop** — do not use the manager cockpit, the rep home, or the rep unlock-credits page

Stills:

- [HQ home](<../screenshots/web-owner/Admin/TerriTool-HQ-09-15-2026_01_34_PM.png>)
- [Same session, later frame](<../screenshots/web-owner/Admin/TerriTool-HQ-09-15-2026_01_35_PM.png>)
- [Same session, later frame](<../screenshots/web-owner/Admin/TerriTool-HQ-09-15-2026_01_36_PM.png>)

The later frames are clock times. Open the image before naming the screen.

## 2. Salespersons

- **From** — HQ sidebar
- **Do** — find a user in the salespersons table
- **Copy** — the wide Backpack table
- **Next** — that user’s row
- **Stop** — do not redraw this as a manager salespeople card

Stills:

- [Salespersons](<../screenshots/web-owner/Admin/TerriTool-Admin-09-15-2026_01_35_PM.png>)
- [Related admin capture](<../screenshots/web-owner/Admin/TerriTool-Admin-09-15-2026_01_36_PM.png>)
- [Related admin capture](<../screenshots/web-owner/Admin/TerriTool-Admin-09-15-2026_01_37_PM.png>)

## Not a step: `/hq/demo-data`

- **What** — `GET /hq/demo-data?email={manager email}` → `ManagerDemoDataController@run` (`routes/web.php:115` on master, added 28 Oct 2026 in `0456a72a`). It has no Backpack screen (it prints a bare HTML summary) and runs as soon as the link opens.
- **Copy** — nothing. Do not copy its shape for new HQ work: it writes data from a plain GET with no confirmation step and no environment check.
- **Stop** — never open it with a real customer's manager email on production. It rewrites that team's dates, visited flags and visit history, and it cannot be undone. Detail: [17 — Admin HQ](../features/17-Admin-HQ.md#danger-hqdemo-data-read-2026-11-02), from [live code 2026-11-02](../reviews/live-code-2026-11-02.md).

## New requirement

Write the new step in this same block. If the only stills are unnamed clock times, open them first. If none show the new screen, stop and ask. The rest of the set is in [screenshots/web-owner/Admin](../screenshots/web-owner/Admin).
