# User — Sales Agent and Business Sales Agent

Both land on the rep home. They share the classic web app and the mobile app.

| | Sales Agent | Business Sales Agent |
|---|---|---|
| Web home | `/dashboard` | `/dashboard` |
| Mobile | Yes | Yes |
| Wallet | Own subscription credits | Credits allocated by the Business Agent |
| Empty wallet | Upgrade or add-on | Tell them to contact the manager. Not Stripe. |
| Find Leads | Mobile V2 / classic `/findleads` | Same |
| Review rewards | Home banner “Want 50 more credits?” opens the sheet | `/reviews/credits` from the day-two email. Not a home card. |
| MCP | User MCP and Find MCP if status is Active | Same |

## Stack to copy

- Mobile chrome: [mobile UI](../brains/mobile-ui.md). Stills: [mobile-owner](../screenshots/REVIEW.md).
- Web chrome: classic column of [web design](../brains/web-design.md). Still: [company list](../screenshots/web-stills/04-classic-company-list.png).
- Calls: [API](../brains/api.md).

## Do not

- Send this user to `/manager/dashboard` or `/hq`.
- Use manager DM Sans, `--radius: 14px`, or `AIFindLeads.jsx` on a rep page.
- Charge for search, or save an AI lead with `addcompany`.
- Put the review offer on the web home cards, or on the manager cockpit. Mobile opens it from the home banner. Web opens it at `/reviews/credits`.
