# Curated brain — read this first

You are generating TerriTool UI or TerriTool code. This folder is the working brain. Do not invent product behavior, colors, endpoints, or credit costs.

## What TerriTool is

A field-sales product from TerriTool LLC (Newport Beach). Sales agents find leads, build routes and lists of companies, visit them, log activities, and buy contacts with credits. Business Agents manage a team. Admin uses HQ only. Public name, plans, and wordmarks: [product/public-site.md](product/public-site.md).

One product. Browser, iOS, Android, and MCP read and write the same companies, contacts, routes, lists, and credits.

## Before you generate

| You are about to | Open first | Then |
|---|---|---|
| Any new or changed UI | [UI/UX Guardian](brains/ui-ux-guardian.md) | [Screenshot review](screenshots/REVIEW.md) and the matching UI brain |
| Mobile screen or navigation | [Mobile code](brains/mobile-code.md) | [Mobile code review](code/mobile-review.md) |
| Mobile chrome, type, color | [Mobile UI](brains/mobile-ui.md) | A still in [screenshots](screenshots/REVIEW.md) |
| Laravel, Blade, manager React | [Web code](brains/web-code.md) | [Web code review](code/web-review.md) |
| Web pixels | [Web design](brains/web-design.md) | The still for that stack |
| An endpoint or FormData key | [API](brains/api.md) | [API endpoints](brains/api-endpoints.md), then the live route file |
| A mobile screen's file or a component's props | [Mobile screens](code/mobile-screens.md) | [Mobile components](code/mobile-components.md) |
| A PNG of a screen | [Render a still](methods/render-still.md) | The still it crops |
| A role question | [User](roles/user.md), [Manager](roles/manager.md), or [Admin](roles/admin.md) | The feature page |

Map of the six brains: [brains/README.md](brains/README.md). Product rules: [product/overview.md](product/overview.md). Features: [features/README.md](features/README.md). How to check the work: [methods](methods/README.md).

## Working sequences

**UI/UX:** name the surface and the user → open the copy still and the sibling code → record the actual tokens, strings, and reusable components → write the consistency report ([Guardian](brains/ui-ux-guardian.md)) → draw or build → compare the rendered output and the interaction against the still ([design gate](gates/design-gate.md)).

**Code:** open the live file and its contract ([mobile screens](code/mobile-screens.md), [mobile components](code/mobile-components.md), [API endpoints](brains/api-endpoints.md)) → make the scoped change ([minimal change](methods/minimal-change.md)) → run the checks the [code gate](gates/code-gate.md) names → exercise the changed behavior once → report evidence and anything unverified.

## Hard rules

1. Staging is the only environment named for tests: `https://staging.territool.com`. The mobile app’s live `URL_BASE` is `https://staging.territool.com/index.php/api/`. Production `app.territool.com` is commented out in config. Do not point new work at production.
2. Copy the nearest shipped screen. Do not invent a new visual language.
3. Classic web, manager portal, and Admin HQ are three stacks. Do not mix fonts, CSS, or components across them.
4. `composer.lock` installs Laravel **5.3.31**. `composer.json` also mentions `^7.0`. Write PHP 7.2-compatible code. Do not use Laravel 8+ or PHP 8 syntax.
5. Mobile posts are multipart FormData through `API.post`. Do not invent a JSON client.
6. Search is free. Saving an AI lead costs 1 credit. Buying a contact costs 2 (name-only and email/phone) or 1 for the Claude/biz path. Manual add-contact is free.
7. If the still and the filename disagree, the still wins.
8. If this note and the live file disagree, the live file wins. The reviews name the files.
9. A UI request is answered with an image first. Write HTML only after the user asks for HTML.
10. `archive/` is not a source. Do not grep it, and do not cite it. Its `_code` notes are index stubs, not code. Everything current is at this root or in the live repos.
11. Loading, empty, and error copy comes from the Screens block on the feature page. Do not write a new string when one exists.

Live trees reviewed for the code pages:

- Mobile: `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`
- Web: `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`
