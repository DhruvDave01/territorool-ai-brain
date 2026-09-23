---
title: "Core concepts"
---

# Core concepts

Copied from the product glossary and overview. Implementation pointers stay inside this Brain.

## What the objects are

| Object | Meaning |
|--------|---------|
| Company | Saved account / lead in the Address Book (address, pin, status, website). `source` enum: `manual` / `findleads` / `aileads` / `yelpleads`. Table `companies`. |
| Contact | Person at a company (or unassigned). Manual add is free. Enrichment buy is paid. Table `contacts`. |
| Note | Free-text on a company. Not a person, not a status. Table `company_notes`. |
| Activity | Meeting, Call, Visit, Reminder, or Appointment. Tables `activities` and `log_meetings`. |
| Visit / mark visited | Check-in on a stop or company. History is kept. Table `user_visited_companies`. Distinct from Activity type “Visit”. |
| List | Named **group** of companies. Not driving order. `user_lists` / `user_list_companies`. |
| Route | Optimized **driving order**. Web can stay Draft. MCP `create_route` always publishes. Table `user_routes` also has `failed`, `publish_pending`, `continue_edit`. |
| Credits | Wallet for **saving AI leads** (1) and **buying contacts** (FullEnrich 2 / Claude 1). Search/browse/counts are free. SA: `user_credits`. BSA: `businessclient_salesagent_credits`. Remaining = total − used. |
| Subscription / plan | Access + credit window. Stripe, PayPal, RevenueCat, or admin. Model table is `user_packages`. |
| AI search | One in-progress Find Leads run per user. Can be resumed. Table `user_ai_search`. |

Full schema: [../code/data-model-reference.md](../knowledge/code/data-model-reference.md).  
Full glossary: [glossary.md](glossary.md).  
Roles: [roles.md](roles.md).

## Route lifecycle (product)

| Status | Meaning |
|--------|---------|
| Draft | Wizard not finished. |
| Processing | Optimizer running. Do not edit. |
| Published | Ready for the field. |
| Active route | The published route that is “today”. |

## Find Leads vs add company

| Term | Meaning |
|------|---------|
| Search Multiple / Search One | Territory + what you sell. Search is **free**. |
| Yelp Find Leads | Alternate source; save still creates the same company object. |
| Save leads | Puts selected hits in the Address Book. **1 credit each.** |
| Add company | Manual Address Book create. **Free.** Do not use this for AI search hits. |

## Find vs add vs buy contacts

| Term | Cost | Meaning |
|------|------|---------|
| Find Contacts | 0 | Preview people (FullEnrich, then Claude if empty). |
| Add contact | 0 | User already knows the name. |
| Buy / redeem / unlock | 2 FullEnrich / 1 Claude | Writes people into the Address Book. **Never free.** |
| Bulk counts | 0 | How many people are available. Max 10 companies per MCP call. |

## Labels

User-editable in Settings. Defaults: Active, High Priority, Idle, Potential, Reject, Unclassified, optional Gold.

Gold / High Priority is a **status** (`set_company_status`), not a note.

## Four different writes (do not mix)

| User intent | Concept | Do not use |
|-------------|---------|------------|
| “I was there” | Visit | Note |
| “Log a meeting/call” | Activity | Note |
| “Remember this” | Note | Status |
| “This is Gold / High Priority” | Status | Note |
