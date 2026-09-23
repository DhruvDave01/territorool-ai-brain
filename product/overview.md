# Product overview

TerriTool is a field-sales territory platform from TerriTool LLC, based in Newport Beach, California. Public description, plans, and wordmarks: [public site](public-site.md), taken from [territool.com](https://www.territool.com/).

A company saved from Find Leads is the same company on the map, on a list, on a route, and in CRM sync.

## Roles

| Role | `role_id` | After login | Mobile | MCP |
|---|---|---|---|---|
| Sales Agent | 1 | `/dashboard` | Yes | Field catalog if Active |
| Business Sales Agent | 4 | `/dashboard` | Yes | Field catalog if Active. Credits come from the manager allocation, not Stripe. |
| Business Agent | 3 | `/manager/dashboard` | Yes | Field tools plus team tools. Find MCP is off. |
| Admin | HQ | `/hq/dashboard` | No | Admin MCP, read-oriented |

Signup assigns Sales Agent. A Business Sales Agent is created by invite (`/businesssalesperson/activate/{userid}`), not by the public register form.

## Credits

Same numbers on every client:

| Action | Cost |
|---|---|
| AI search | 0 |
| Save one AI lead company | 1 |
| Buy contact (name/position, or with email/phone) | 2 |
| Buy contact on the Claude/biz path | 1 |
| Add a contact by hand | 0 |

Live constants: `App/utils/contactBuyCredits.js` — `CONTACT_BUY_CREDITS_NAME_POSITION_ONLY = 2`, `CONTACT_BUY_CREDITS_WITH_EMAIL_OR_PHONE = 2`, `CONTACT_BUY_CREDITS_BIZ_CLAUDE = 1`.

A Business Sales Agent with an empty wallet is told to contact the manager. Do not send them to Stripe for lead or contact credits.

Review rewards are a grant, after someone checks the review. G2 is 30. Product Hunt is 20. Opening the review does not add them. Mobile: the home banner opens `ReviewRewardsModal`. Web: `/reviews/credits`, reached from the day-two email, not from a home card. Detail: [02 — Dashboard](../features/02-Dashboard.md).

## Words

Use these words in new UI: company (Address Book), contact, list (not a driving order), route (driving order of stops), credit, Sales Agent, Business Sales Agent, Business Agent. Do not rename a list into a route or a route into a list.

## Where behavior lives

Each module: [features/README.md](../features/README.md).
