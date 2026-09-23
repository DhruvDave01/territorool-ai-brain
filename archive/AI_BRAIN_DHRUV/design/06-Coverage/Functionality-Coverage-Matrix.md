---
id: Functionality-Coverage-Matrix
parent: design
---
# Functionality coverage matrix

Stills: [Mobile-Screenshot-Flow](Mobile-Screenshot-Flow.md) · [Screenshot-Video-Index](Screenshot-Video-Index.md) · [Deferred-Scope](Deferred-Scope.md)

Status: **Documented** = in Design Brain from code and/or capture. **Deferred** = skipped until assets. **Dead** = registered/referenced but not a live path. **Partial** = code documented, visual incomplete.

This is **not** 100% visual coverage.

| Feature | Screen found | Code found | UI documented | Flow documented | Screenshot/Video | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Login | Login | Yes | Yes | Yes | IMG_4604, `ios/01-auth/00`, Archive | Documented |
| Register | Register + PostSignup | Yes | Yes (steps 1–6) | Yes | `ios/01-auth/02`–`07`; Archive `19.27`–`19.29` | Documented |
| Paywall / gate | Subscription* | Yes | Partial | Partial | `ios/01-auth/09` + Settings cancel/web Upgrade | Partial (distinct Gate + store IAP missing) |
| Splash | overlay / native | Yes | Partial | Yes | `ios/00-splash/00-splash.png` native blue | Partial; Lottie NMV |
| Dashboard hub | Dashboard | Yes | Yes | Yes | IMG_4563, 4605, `ios/02-home/01`, Archive | Documented |
| Recent activity tab | Dashboard | Yes | Yes | Yes | IMG_4605 | Documented |
| RecentActivity screen | RecentActivity | Yes | Yes | Yes | `ios/02-home/03` | Documented |
| Calendar | CalendarActivity | Yes | Yes | Yes | IMG_4608, `ios/02-home/04` | Documented |
| QR | QrCodeScanner | Yes | Yes | Yes | IMG_4609, `ios/02-home/06` | Documented |
| Notifications | Notifications | Yes | Yes | Partial | `ios/02-home/05` empty + 405 | Reachable; no production bell |
| Settings | EditStatus | Yes | Yes | Yes | IMG_4564, `ios/09-settings/` | Documented (store IAP missing) |
| Referral | modal | Yes | Yes | Yes | IMG_4602, `ios/09-settings/09` | Documented |
| Logout | modal | Yes | Yes | Yes | IMG_4601, `ios/09-settings/06` | Documented |
| AI Find Leads | MultipleAIWaypoint | Yes | Yes | Yes | IMG_4565–71, `ios/03-find-leads/` | Documented |
| Places Find Leads | MultipleWaypoint | Yes | Yes | Yes | `ios/03-find-leads/08` | Documented |
| Create Route | CreateRoute | Yes | Yes | Yes | IMG_4572, `ios/07-routes/06` | Documented |
| Start/End | SelectStartEndPoints | Yes | Yes | Yes | IMG_4573, `ios/07-routes/09`–`10` | Documented |
| Publish loader | PublishRoute | Yes | Yes | Yes | Success IMG_4574; fail `ios/07-routes/11`–`12` | Documented |
| Route detail | BasicRouteDetail | Yes | Yes | Yes | IMG_4575, `ios/07-routes/13` | Documented |
| Edit Route | EditRoute | Yes | Yes | Yes | `ios/07-routes/08` | Documented |
| RouteSwipe | RouteSwipe | Yes | Stub | — | `ios/07-routes/14` stub | Dead |
| ClusterList | missing | navigate yes | — | — | — | Dead/broken |
| Lasso | LassoMap | Yes | Partial | Partial | `ios/08-maps/01` chrome | Partial / no draw |
| Active map | ActiveRouteMap | Yes | Yes | Yes | IMG_4577, `ios/07-routes/15` | Documented |
| WaypointDetail | WaypointDetail | Yes | Yes | Yes | `ios/08-maps/02` | Documented |
| Lists library | Lists | Yes | Yes | Yes | IMG_4591, `ios/06-lists/01` | Documented |
| Create List | CreateLists | Yes | Yes | Yes | IMG_4592–94, `ios/06-lists/04` | Documented |
| List detail | ListsDetail | Yes | Yes | Yes | IMG_4610, `ios/06-lists/07` | Documented |
| Edit List | EditLists | Yes | Yes | Yes | `ios/06-lists/06` | Documented |
| Address Book | ListCompany | Yes | Yes | Yes | IMG_4595–96, `ios/04-companies/` | Documented |
| View company book | ViewCompany | Yes | Yes | Yes | `ios/04-companies/08`–`16` | Documented |
| Company on route | CompanyView | Yes | Yes | Yes | IMG_4576, Navigate `ios/04-companies/10` | Documented |
| CustomCompany embed | CustomCompany | Yes | Yes | Yes | many | Documented |
| Add/Edit company | Create/EditCompany | Yes | Yes | Yes | IMG_4587–88, `ios/04-companies/05`–`06`/`19` | Documented |
| Scan card | BusinessCard | Yes | Yes | Yes | IMG_4586, `ios/10-other/01` | Documented |
| Contacts CRUD | Contacts* | Yes | Yes | Yes | IMG_4598–4600, `ios/05-contacts/` | Documented |
| Filter | FilterModule | Yes | Yes | Yes | IMG_4590, `ios/10-other/03` | Documented |
| FilterList/Route stack | yes | unused live | Yes | — | Legacy `06-lists/03` `07-routes/05` | Dead/legacy — do not copy |
| Find Contacts | Cong/biz + modal | Yes | Yes | Yes | IMG_4581–85 | Documented |
| Bulk Contact | Contact | Yes | Partial | Partial | Archive `20.08.59` | Partial |
| Share route/list | ShareEmailField | Yes | Yes | Yes | IMG_4611, `ios/07-routes/04` | Documented |
| Report company | ReportContactModal | Yes | Yes | Yes | IMG_4580 | Documented |
| Credits pill | header | Yes | Yes | Yes | headers | Documented |
| Footer tabs | CustomFooter | Yes | Yes | Yes | all module stills | Documented |
| Session/crash | overlays | Yes | Partial | Partial | Crash `ios/10-other/04`; session expired no still | Partial |
| HubSpot Error | Error | Yes | Yes | Partial | `ios/10-other/02` empty | Documented empty |
| FCM | helper | Yes | Partial | — | Login prompt `19.34.48`; Notifications 405 | Partial |
| Deep links | plist/config | Yes | Partial | — | — | NMV |
| Permissions | manifests | Yes | Yes | Yes | Archive location/camera/push | Documented prompts; denied UI NMV |
| Coaching/WhatsNew | modals | Yes | Partial | Partial | Coaching `17`; WhatsNew file is update sheet | Coaching documented; changelog deferred |
| Android | — | Yes | Platform-Differences | — | — | Deferred visual |

**Counts (Phase 3):**

- Stack screens listed: **46**
- Overlay UIs listed: **15+**
- Shared components documented: **25+**
- Flows in `04-User-Flows`: **18** files
- Stills indexed: **48** PNGs (Archives 2–4) **+ 249** Simulator flow PNGs **+ ~93** numbered iOS pack (`untitled folder/screenshots/ios/`, not copied)
- Videos indexed: **3**
