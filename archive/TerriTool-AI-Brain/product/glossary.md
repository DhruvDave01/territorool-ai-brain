---
title: "TerriTool glossary"
---

# TerriTool glossary

Use these words the way the product uses them. Do not invent synonyms that change the action.

## People and roles

| Term | Meaning |
|------|---------|
| **Sales Agent** | Individual field rep. Own Address Book, own Stripe/PayPal/RevenueCat plan and credits. |
| **Business Agent** | Manager. Licenses, team, assign leads, KPIs. Lands on the manager cockpit. |
| **Business Sales Agent (BSA)** | Rep on a manager’s team. Credits come from the manager, not their own Stripe wallet. |
| **Admin** | TerriTool staff. HQ only. |
| **Guest** | Not signed in. Login / signup only. |

## Core objects

| Term | Meaning |
|------|---------|
| **Company** | Saved account / lead in the Address Book (address, pin, status, website). |
| **Contact** | Person at a company (or unassigned). |
| **Note** | Free-text on a company. Not a person, not a status. |
| **Activity** | Meeting, Call, Visit, Reminder, or Appointment. |
| **Visit / mark visited** | Check-in on a stop or company. History is kept. |
| **List** | Named **group** of companies. Not driving order. |
| **Route** | Optimized **driving order** of companies (stops). |
| **Credits** | Wallet for **saving AI leads** and **buying contacts**. |
| **Subscription / plan** | Access + credit window. Stripe, PayPal, RevenueCat, or admin. |
| **AI search** | One in-progress Find Leads run per user. Can be resumed. |

## Company labels

User-editable in Settings. Defaults include:

**Active**, **High Priority**, **Idle**, **Potential**, **Reject**, **Unclassified**, optional **Gold**.

Gold / High Priority is a **status**, not a note.

## Route lifecycle

| Status | Meaning |
|--------|---------|
| **Draft** | Wizard not finished. |
| **Processing** | Optimizer running. Do not edit. |
| **Published** | Ready for the field. MCP `create_route` always ends here. |
| **Active route** | The published route that is “today”. Next stop / Navigate Me use this. |

Web create-route can save Draft. **MCP create_route publishes.**

## Find Leads

| Term | Meaning |
|------|---------|
| **Search Multiple** | Territory + business types; many results. Search is free. |
| **Search One** | Narrower single-target search (same save rules). |
| **Yelp Find Leads** | Alternate source; admin can disable per user. Save still creates the same company object. |
| **Save leads** | Puts selected AI/Yelp hits in the Address Book. **1 credit each.** |
| **Add company** | Manual Address Book create. **Free.** Do not use this for AI search hits. |

## Find vs add vs buy contacts

| Term | Cost | Meaning |
|------|------|---------|
| **Find Contacts** | **0** | Preview people (FullEnrich, then Claude if empty). |
| **Add contact** | **0** | User already knows the name; Create Contact form. |
| **Buy / redeem / unlock contacts** | **2** FullEnrich / **1** Claude | Writes people into the Address Book. **Never free.** |
| **Bulk counts** | **0** | How many people are available. Not a buy. Max 10 companies per MCP call. |

Website is required to Find Contacts on a company. Missing website → add it, then retry.

## Credits and billing

| Term | Meaning |
|------|---------|
| **Total / used** | Remaining = total − used on the current billing window. |
| **Credits add-on** | Extra pack on the same wallet. |
| **Insufficient credits (Sales Agent)** | Upgrade or buy add-on (RevenueCat users: manage that plan). |
| **Insufficient credits (BSA)** | Contact the manager. |
| **Cancel survey** | Reasons + optional comment, then cancel with the same provider they paid with. |

## CRM vs MCP

| Term | Meaning |
|------|---------|
| **Native CRM** | Salesforce (user/pass/token), HubSpot (OAuth + **mapping first**), Karma CRM (API key). Settings header. Pipedrive is **not** implemented. |
| **Custom MCP connector** | HTTPS MCP the user adds in Settings (chat Fetch/Send/Update). Not the same as native Salesforce. |
| **Customer MCP** | Claude/Cursor driving **this user’s** TerriTool (tools in [api-surfaces.md](../features/20-MCP/api-surfaces.md)). |

## Other

| Term | Meaning |
|------|---------|
| **Address Book** | The company grid. Same records on web, mobile, voice, MCP. |
| **Recently Added** | Newest companies / contacts. |
| **Navigate Me** | Open directions to a stop; also counts for manager KPIs. |
| **Import session** | Unfinished CSV. Errors stay until fix or discard. |
| **HQ** | Admin panel (`/hq/*`). Other roles never see it. |
