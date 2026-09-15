---
id: 13-admin-hq
parent: features
related:
  - 06-users-and-roles.md
  - 14-mcp.md
---
# Feature: Admin HQ

Related: [06-users-and-roles](../06-users-and-roles.md) · [14-mcp](../14-mcp.md)

Prefix `/hq`, middleware `web`+`role`, namespace `Admin`. Admins are redirected here by `CheckUserRole` and do not use the field app.

## Areas

| Area | Paths |
|------|--------|
| Dashboards | `/hq`, `/hq/dashboard`, `/hq/subscription/dashboard`, cancelled users / RevenueCat trials |
| Salespeople | `/hq/salesperson`, create/edit/convert/delete, credit, aisearch, calculateroute |
| Business clients | `/hq/businessclient`, salesperson list, credits, resendinvitation |
| Subscriptions | active/deactive/lifetime/business/extend-days, yelp flags |
| Promo / special | `/hq/promocode`, `/hq/specialdiscount` |
| Support | `/hq/support` |
| Settings / activity | `/hq/settings`, `/hq/user-activity/{id}` |

## Admin MCP (read-only)

`/ai/mcp-admin`. Tools: `list_sales_agents`, `list_cancelled_subscribers`, `list_active_subscribers`, `list_active_trials`, `list_expired_trials`, `list_cancelled_trial_subscribers`, `list_user_credits`, `get_user_subscription_history`.

Paid packages `[2,5,6]`, trial `[1,4]`.
