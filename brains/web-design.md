# Web design

Two products in one repo, plus HQ. Do not mix them. Open [the Guardian](ui-ux-guardian.md), then the still for the stack you are on in [the screenshot review](../screenshots/REVIEW.md). Code: [web code](web-code.md).

| Surface | Stack | Source of truth | Still |
|---|---|---|---|
| Classic `/dashboard`, `/company`, `/routes`, `/lists`, `/findleads` | Blade, jQuery 2.2.0, Bootstrap 3.3.5, AdminLTE | `resources/views/front/layout.blade.php`, `public/css/custom.css` | [company list](../screenshots/web-stills/04-classic-company-list.png) |
| Manager `/manager/*` | React 18 islands mounted in Blade | `resources/manager-portal/`, `public/css/manager-portal.css` | [manager dashboard](../screenshots/web-owner/Manager/Manager-Dashboard-TerriTool-09-15-2026_01_20_PM.png) |
| HQ `/hq/*` | Backpack on AdminLTE | `resources/views/vendor/backpack/` | [Admin folder](../screenshots/web-owner/Admin/) |

Manager pages still extend the front layout through `front.manager._portal_layout`. `body.manager-portal` hides the AdminLTE header and sidebar. Do not replace that parent with Bootstrap 5. `package.json` lists Bootstrap 5; manager JSX does not import it.

## Tokens — do not average

| | Classic | Manager |
|---|---|---|
| Primary | `#124ac6` in `custom.css` | `--blue: #124ac6` |
| Teal | `#16aa9d` in `custom.css`. List pages also use `--tt-teal: #00a99d` in `company-list.css`, `route-list.css`, `list-list.css`. | `--teal` / `--green` are `#00a99d` |
| Radius | AdminLTE boxes | `--radius: 14px`, `--radius-sm: 10px` |
| Type | Source Sans Pro + DIN 2014 (`/fonts/DinBold.ttf`, `/fonts/DinLight.ttf`) | DM Sans / Space Grotesk |

Do not put manager fonts on a new classic page. Do not convert a Blade list page into a React island to “clean up” the teal.

## New page

Classic: Blade sections `after_styles`, `header`, `content`, `after_scripts`. CSRF header `X-CSRF-TOKEN`. Loading overlay `#cover-spin`. Copy the sibling page’s grid (jqxGrid or DataTables).

Manager: mount a `#manager-*-root` the way `main.jsx` already mounts dashboard, find-leads, salespeople, activity, support, and settings. Toasts go to `#manager-toast-root`.

Sidebar: `resources/views/front/inc/sidebar.blade.php` has duplicate icon and text links. Leave the duplicates.

## Unlock credits

Classic page at `/reviews/credits`. It extends `front.layout`. It is not a card on `/dashboard` and not a manager island. Stills: [desktop](../screenshots/web/sales-agent/review-credits-desktop.png), [phone](../screenshots/web/sales-agent/review-credits-phone.png). The credits pill on those stills reads 60. That is the signed-in balance, not the reward.

Page title “Unlock 50 free credits”. Crumb “Unlock Credits”. Panel title “Share your TerriTool experience”. Lead: “Leave an honest review. We add credits after we verify it — usually within 1–2 business days.” G2 row: “Leave a review on our G2.com profile”, **30 credits**, filled button “Leave a G2 review”. Product Hunt row: “Leave a review on Product Hunt”, **20 credits**, “Leave a Product Hunt review”. Buttons are `#124ac6`, radius 8. Note: “Reviews are verified before credits are added to your account. We never ask for a positive rating — just an honest review.” Help link goes to `support/create`.

Phone width stacks each offer and makes the button full width. The store bar “Download the App to use TerriTool in the Field” is the existing layout footer.

After a click the button turns `#9aa7c2` and reads “Submitted”. The credit number is removed. Copy becomes “Thanks — we received your submission.” Pending is a pill “Pending verification”. Verified reads “Verified - 30 credits added” or “Verified - 20 credits added”. Both verified: title “Thanks for the feedback”, banner “You unlocked 50 credits. They are already in your balance.”, and a “Back to dashboard” button. Both submitted hides the honesty note and shows that dashboard link.

Map circle colors in `AIFindLeads.jsx` are a fixed six-color list. They are not `--blue`.

Fonts on disk for new art: [assets/fonts](../assets/fonts). Logos: [assets/logos](../assets/logos/README.md). Classic header uses the blue wordmark file. Do not redraw the cube.
