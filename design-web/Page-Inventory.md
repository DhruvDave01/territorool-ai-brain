---
id: Page-Inventory
parent: design-web
sources:
  - webterritool/routes/web.php
  - resources/manager-portal/main.jsx
  - public/js/manager-portal.js
related:
  - 13-web-urls.md
  - code/web-code-details.md
---
# Web page inventory

Routes from `webterritool/routes/web.php` + `return view(` in controllers + manager mounts from `resources/manager-portal/main.jsx`. Not every POST/AJAX endpoint.

Related: [13-web-urls.md](../13-web-urls.md) · [code/web-code-details.md](../code/web-code-details.md).

---

## Classic app (`@extends('front.layout')` unless noted)

| URL | Controller | View | Table / chrome | Archive |
|-----|------------|------|----------------|---------|
| `/dashboard` | `HomeController@dashboard` | `front.dashboard` | Welcome tiles + Activity + Tutorial (SA/BSA). BA **redirects** to manager | `web/desktop/dashboard.png` |
| `/company` | `CompanylController@index` | `front.company.listnewl` | jqxGrid `#company_list` + `company-list.css` | `04-classic-company-list.png` |
| `/recent-company` | `CompanylController@recentCompany` | `front.company.recentList` | Same list tokens | |
| `/company/{id}/edit` | `CompanylController@edit` | `front.company.editl` | `front.company.layout_main` | |
| `/findleads` | `CompanylController@findleads` | `front.route.findleads` | jqxGrid `#company_list` (+ Yelp grid). SSE AI | `05-classic-findleads.png` |
| `/routes` | `RouteController@index` | `front.route.list` | DataTables + `route-list.css` | `06-classic-routes-list.png` |
| `/route/step1` | `RouteController` | `front.route.step1` | Wizard select companies | `07-classic-route-wizard-step1.png` |
| `/route/step2` | | `front.route.step2` | | |
| `/lists` | `ListController@index` | `front.list.list` | `list-list.css` | |
| `/list/step1` | | `front.list.step1` | | |
| `/contact` | `ContactController@index` | `front.contact.listl` | | |
| `/salesperson/edit` | | `front.salesperson.edit` | Settings | `web/desktop/settings.png` |
| `/support*` | `SupportController` | `front.support.*` | | extra stills `support.png` / `support-create.png` |
| `/subscription*` | `SubscriptionController` | `front.subscription.*` | History + Upgrade | `subscription.png`, `subscription-subscribe.png` |
| CSV wizards | `uploadcompany/step1–4`, `uploadcontact/step1–4` | `front.company.step*` / `front.contact.step*` | FormData + `contentType: false` | `upload-companies.png`, `upload-contacts.png` — open the still before copying a step |
| Maps | `/company/viewmap*`, `/route` viewmap | `front.company.viewmap`, `front.route.viewmap` | | |

`front.company.layout_main` / `front.hubspot.layout_main` are extra AdminLTE wrappers — still classic, not manager.

PDF layouts (`salesperson.layout`, `front.simpleroute.layout_pdf`) are print chrome, not app chrome.

---

## Manager islands

Shell: every page `@extends('front.manager._portal_layout')` → `@extends('front.layout')` + `id="mgr-portal-dashboard-wrapper"`. Controller: `Manager/ManagerDashboardController` via `respondView`.

| URL | Root id | React | JSON script id | Extra CSS |
|-----|---------|-------|----------------|-----------|
| `/manager/dashboard` | `#manager-dashboard-root` | `ManagerDashboard.jsx` | `manager-dashboard-initial` | `data-google-maps-key` |
| `/manager/ai-find-leads` | `#manager-ai-find-leads-root` | `AIFindLeadsPage.jsx` | `manager-ai-find-leads-initial` | `manager-ai-find-leads.css` |
| `/manager/activity` | `#manager-activity-root` | `ManagerActivity.jsx` | `manager-activity-initial` | |
| `/manager/salespeople` | `#manager-salespeople-root` | `Salespeople.jsx` | `manager-salespeople-initial` | |
| `/manager/salespeople/create` | `#manager-salesperson-form-root` | `SalespersonForm.jsx` | `manager-salesperson-form-initial` | |
| `/manager/salespeople/{id}/edit` | same form root | | | |
| convert confirm | `#manager-salesperson-convert-root` | `ConvertSalesperson.jsx` | `manager-salesperson-convert-initial` | |
| `/manager/salespeople/{id}/details` | `#manager-salesperson-detail-root` | `SalespersonDetail.jsx` | `manager-salesperson-detail-initial` | Maps key |
| `/manager/salespeople/{id}/routes` | `#manager-salesperson-routes-root` | `SalespersonRoutes.jsx` | `manager-salesperson-routes-initial` | |
| `/manager/settings` | `#manager-settings-root` | `ManagerSettings.jsx` | `manager-settings-initial` | |
| `/manager/support` | `#manager-support-root` | `SupportTickets.jsx` | `manager-support-initial` | |
| `/manager/support/create` | `#manager-support-create-root` | `SupportTicketForm.jsx` | `manager-support-create-initial` | |
| `/manager/support/{id}` | `#manager-support-detail-root` | `SupportTicketDetail.jsx` | `manager-support-detail-initial` | |
| `/manager/reports` | *(none)* | Blade stub “Coming soon” | — | Not an island |
| all manager pages | `#manager-toast-root` | `ToastHost` | `manager-flash-initial` | |

`main.jsx` only mounts a root if `document.getElementById` finds it. One built file: `public/js/manager-portal.js` (`vite.config.js`).

JSON APIs (`/manager/api/*`) are not pages.

Duplicate route line in `web.php`: `GET /manager/ai-find-leads` registered twice — live, do not “clean up” unless asked.

---

## Auth / HQ / other

| URL | View | Stack |
|-----|------|--------|
| `/login` | `auth.login` | Split-panel; still `login.png` |
| `/register` | `auth.register` | Inter; step 1 of 3 captured |
| `/trial` | `auth.freetrial` | `trial.png` |
| `/b2b` | `auth.b2b` | Same as register step 1 in this pack |
| `/onboarding` | `auth.post_registration_onboarding` | Classic sidebar skipped — **no dedicated still** (pack file `onboarding.png` is dashboard) |
| `/hq/*` | `vendor.backpack.base.*` | Backpack — deferred |
| `/android`, `/payments-in-app` | `front.android`, `front.payments_in_app` | Mobile-web helpers |

---

## How to add a page (inventory rule)

1. Pick the stack from the URL prefix (`/manager` vs everything else vs `/hq`).
2. Classic: new Blade under `resources/views/front/**` + `Route::get` in `web.php`.
3. Manager: new `#manager-*-root` + `createRoot` in `main.jsx` + `respondView('front.manager.*')`.
4. Update this table. Do not list POST AJAX as pages.
