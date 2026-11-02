# Web admin flow

Admin only. Lands on `/hq/dashboard`. Backpack. No mobile HQ. Other roles never see these screens.

Who can do what: [Admin](../roles/admin.md). Step shape: [web admin detail](web-admin-detail.md). Pixel rules: [screenshot review](../screenshots/REVIEW.md).

Most files in this set are named by clock time. These two were opened and match the labels below.

| Step | Screen | Still |
|---|---|---|
| 1 | HQ home — Logged In, Created Routes, Activity, New Users, leaderboard | [HQ home](<../screenshots/web-owner/Admin/TerriTool-HQ-09-15-2026_01_34_PM.png>) |
| 2 | Salespersons table | [Salespersons](<../screenshots/web-owner/Admin/TerriTool-Admin-09-15-2026_01_35_PM.png>) |

Later HQ captures are in [screenshots/web-owner/Admin](../screenshots/web-owner/Admin). Open each image. Do not treat the filename as the screen name.

Review credits are not an HQ screen. G2 and Product Hunt stay on the rep’s mobile sheet and on classic `/reviews/credits`.

`/hq/demo-data?email=…` is not a step either. It is a GET with no Backpack screen and no confirmation that rewrites one manager's whole team: account, note, contact, route and list dates, visited flags, and visit history. It is on master (production web); Mehul added it on 28 Oct 2026 in `0456a72a`. Never open it with a real customer's manager email on production; it cannot be undone. Detail: [17 — Admin HQ](../features/17-Admin-HQ.md#danger-hqdemo-data-read-2026-11-02), from [live code 2026-11-02](../reviews/live-code-2026-11-02.md).
