# Curated brain — read this first

You are generating TerriTool UI or TerriTool code. This folder is the working brain. Do not invent product behavior, colors, endpoints, or credit costs.

## What TerriTool is

A field-sales product from TerriTool LLC (Newport Beach). Sales agents find leads, build routes and lists of companies, visit them, log activities, and buy contacts with credits. Business Agents manage a team. Admin uses HQ only. Public name, plans, and wordmarks: [product/public-site.md](product/public-site.md).

One product. Browser, iOS, Android, and MCP read and write the same companies, contacts, routes, lists, and credits.

## Stance

Generated output is a draft. The generator saw this folder and the prompt; it did not see the live repo, the customer, the roadmap, or the brand. Whoever ships the work adds that context, corrects the draft, and signs the result. Finished work reads as if a TerriTool engineer or designer made it, not as if a model did. The check is [draft review](methods/draft-review.md).

- Code: syntax that runs is the floor. Architecture, logic, edge cases, maintainability, and fit with the live repo are the review.
- Design: pixels come from the shipped still and the guardian tokens. A screen that could belong to any SaaS product is a HOLD, however clean.

## Before you generate

| You are about to | Open first | Then |
|---|---|---|
| Any new or changed UI | [UI/UX Guardian](brains/ui-ux-guardian.md) | [Screenshot review](screenshots/REVIEW.md) and the matching UI brain |
| Mobile screen or navigation | [Mobile code](brains/mobile-code.md) | [Mobile code review](code/mobile-review.md) |
| Voice Mode screen, session, or card | [22 — Voice Mode](features/22-Voice-Mode.md) | [Mobile code](brains/mobile-code.md), then the [shipped stills](screenshots/mobile-owner/VoiceMode) |
| Mobile chrome, type, color | [Mobile UI](brains/mobile-ui.md) | A still in [screenshots](screenshots/REVIEW.md) |
| Laravel, Blade, manager React | [Web code](brains/web-code.md) | [Web code review](code/web-review.md) |
| Web pixels | [Web design](brains/web-design.md) | The still for that stack |
| An endpoint or FormData key | [API](brains/api.md) | [API endpoints](brains/api-endpoints.md), then the live route file |
| A mobile screen's file or a component's props | [Mobile screens](code/mobile-screens.md) | [Mobile components](code/mobile-components.md) |
| A PNG of a screen | [Render a still](methods/render-still.md) | The still it crops |
| A role question | [User](roles/user.md), [Manager](roles/manager.md), or [Admin](roles/admin.md) | The feature page |
| A production bug, Sentry issue, or customer report | [On-call](brains/on-call.md) | The feature page, then the code brain for that stack |

Map of the seven brains: [brains/README.md](brains/README.md). Product rules: [product/overview.md](product/overview.md). Features: [features/README.md](features/README.md). How to check the work: [methods](methods/README.md).

## Working sequences

**UI/UX:** name the surface and the user → open the copy still and the sibling code → record the actual tokens, strings, and reusable components → write the consistency report ([Guardian](brains/ui-ux-guardian.md)) → draw or build → compare the rendered output and the interaction against the still ([design gate](gates/design-gate.md)).

**Code:** open the live file and its contract ([mobile screens](code/mobile-screens.md), [mobile components](code/mobile-components.md), [API endpoints](brains/api-endpoints.md)) → make the scoped change ([minimal change](methods/minimal-change.md)) → run the checks the [code gate](gates/code-gate.md) names → exercise the changed behavior once → report evidence and anything unverified.

## Hard rules

1. Staging is the only environment named for tests: `https://staging.territool.com`. The mobile `URL_BASE` in `App/config/index.js` is switched by hand between the staging line (`:8`) and the production line (`:12`), so the committed value changes from commit to commit. On 3 November `Production` pointed at production (`https://app.territool.com/index.php/api/`) and `TT_80` at staging, since `4bfea8b0` (the 2 November TestFlight upload). Read it before any test run or build: tests use staging, and a store build must use production. Do not point new work or tests at production, and do not put a `URL_BASE` change in a fix.
2. Copy the nearest shipped screen. Do not invent a new visual language.
3. Classic web, manager portal, and Admin HQ are three stacks. Do not mix fonts, CSS, or components across them.
4. `composer.lock` installs Laravel **5.3.31**. `composer.json` also mentions `^7.0`. Write PHP 7.2-compatible code. Do not use Laravel 8+ or PHP 8 syntax.
5. Mobile posts are multipart FormData through `API.post`. Do not invent a JSON client. There are two exceptions. Voice Mode’s `App/voice/voiceApi.js` sends JSON to `voice/session` and `voice/tool`; keep voice calls in that file. On `TT_80`, the Google Calendar calls in `App/utils/calendarSync.js` pass `{ asJson: true }` to `API.post`; use that option only for an endpoint that reads a JSON body.
6. Search is free. Saving an AI lead costs 1 credit. Buying a contact costs 2 (name-only and email/phone) or 1 for the Claude/biz path. Manual add-contact is free.
7. If the still and the filename disagree, the still wins.
8. If this note and the live file disagree, the live file wins. The reviews name the files.
9. A UI request is answered with an image first. Write HTML only after the user asks for HTML.
10. `archive/` is not a source. Do not grep it, and do not cite it. Its `_code` notes are index stubs, not code. Everything current is at this root or in the live repos.
11. Loading, empty, and error copy comes from the Screens block on the feature page. Do not write a new string when one exists.
12. Generated code or pixels are not done until a person has read them against the live file or still and recorded the [draft review](methods/draft-review.md). Compiling, passing, or looking fine is not a pass.
13. A production fix follows [On-call](brains/on-call.md). Read the code on the production branch (mobile `Production`, web `master`), start a hotfix branch from it, and keep the diff small. Stop for a person on credits, billing, login, payments, or deleting data. An agent never merges, deploys, or pushes to a shared branch.

Live trees reviewed for the code pages (last read [2026-11-02](reviews/live-code-2026-11-02.md)):

- Mobile: `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`. `TT_80` is development; `Production` is the store build.
- Web: `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`. `beta_react` is development; `master` is production.
