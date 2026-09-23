---
title: "Example utterances → catalog actions"
---

# Example utterances → catalog actions

Voice and chat should map to **one** catalog id, then stop. Confirm writes and paid actions. Full surface/auth/error rules: [api-surfaces.md](api-surfaces.md).

Ask **one** missing slot at a time. Do not invent tools.

## Find vs saved vs save

| They say | Action | Credits |
|----------|--------|---------|
| Find new restaurants in Austin I don’t have yet | `find_ai_leads` | 0 until save |
| Continue that lead search | `resume_ai_lead_search` | 0 |
| Show me the last AI search | `get_ai_lead_search` | 0 |
| Save these / save the first five / save Marzano from that search | `save_ai_leads` | **1 each** (preview, then confirm) |
| Add a company Esther’s Place in Huntington Beach | `add_company` | 0 |
| Find my company SORA / companies in Costa Mesa | `search_companies` | 0 |

Never `add_company` for AI search hits. Never `find_ai_leads` for accounts already saved.

## Contacts

| They say | Action | Credits |
|----------|--------|---------|
| Who works at Factory Kitchen? | `find_contacts` | 0 |
| How many contacts on this route? | `find_contacts_bulk` | 0 |
| Add Jane Smith at SORA, she’s the GM | `add_contact` | 0 |
| Buy / unlock / redeem those contacts | `buy_contacts` | **2** FullEnrich / **1** Claude |
| How many credits do I have? | `get_credits` | 0 |

## Status, notes, activities

| They say | Action |
|----------|--------|
| Mark SORA Gold / High Priority | `set_company_status` |
| Add a note that they want a callback | `add_note` |
| Log a visit / call / meeting today | `add_activity` |
| What’s on my activity list? | `view_activities` |

## Routes and lists

| They say | Action | Notes |
|----------|--------|-------|
| Make a route for these companies | `create_route` | **Publishes.** Ask start, end, and name; if skipped, short tour + generated name |
| Route from list L123 | `create_route_from_list` | Publishes |
| Show my routes / show route R123 | `view_routes` / `view_route` | |
| What’s my active route? | `get_active_route` | |
| Where’s my next stop? | `next_waypoint` | Not mark visited |
| Mark Factory Kitchen visited | `mark_visited` | Needs company + route |
| Create a list called Downtown | `create_list` | Ask for the name if missing |
| Show my lists / show list Downtown | `view_lists` | Then pick the named list from the result |

## Session words (not actions)

| They say | Kind |
|----------|------|
| Yes / yeah / go ahead / do it | `confirm_yes` (only while waiting) |
| No / cancel / never mind | `confirm_no` or `cancel` |
| Help / repeat | Help or repeat last `ask` |

## Paid confirm (required)

Before `save_ai_leads` or `buy_contacts`: call `get_credits` if the balance is unknown, speak the count and cost, wait for **yes**.

`save_ai_leads`: first tool call is **preview only** (even for one company). After yes, second call with `confirm_all=true` and `confirm_token`.

## Unsupported on voice (do not fake an API)

Native HubSpot/Salesforce/Karma connect, CSV upload, Stripe checkout, HQ admin, MCP Chat connect. Point them to the app Settings / billing / HQ as appropriate.
