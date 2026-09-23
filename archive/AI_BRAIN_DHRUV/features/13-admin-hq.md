---
id: 13-admin-hq
parent: features
related:
  - 06-users-and-roles.md
  - 14-mcp.md
  - screens/web-how-it-works.md
  - 13-web-urls.md
---
# Feature: Admin HQ

Related: [06-users-and-roles](../06-users-and-roles.md) · [14-mcp](../14-mcp.md) · **flow:** [screens/web-how-it-works.md](../screens/web-how-it-works.md)

Prefix `/hq`, middleware `web`+`role`, namespace `Admin`. Admins are redirected here by `CheckUserRole` and do not use the field app. Custom CRUD lives in `routes/web.php` (no app `routes/backpack/custom.php`). Pixels **deferred**.

**HQ UI writes** (credits, activate/deactivate subs, promo, users, support, settings). **Admin MCP is `read_only`** — do not mutate TerriTool from MCP tools.

## Areas

| Area | Paths |
|------|--------|
| Dashboards | `/hq`, `/hq/dashboard`, `/hq/subscription/dashboard`, cancelled users / RevenueCat trials (+ `/data`) |
| Salespeople | `/hq/salesperson`, datatable, create/edit/convert/delete, credit GET/POST, aisearch, calculateroute |
| Business clients | `/hq/businessclient`, salesperson list, credits, resendinvitation, calculateroute |
| Subscriptions | active/deactive/lifetime/business, `extend-days` POST, yelp flags |
| Promo / special | `/hq/promocode`, `/hq/specialdiscount` |
| Support | `/hq/support` |
| Settings / activity | `/hq/settings`, `/hq/user-activity/{id}`, `user/{user}/edit`, `userdevices` CRUD |

## Admin MCP (read-only)

`/ai/mcp-admin`. Tools: `list_sales_agents`, `list_cancelled_subscribers`, `list_active_subscribers`, `list_active_trials`, `list_expired_trials`, `list_cancelled_trial_subscribers`, `list_user_credits`, `get_user_subscription_history`.

Paid packages `[2,5,6]`, trial `[1,4]`.
