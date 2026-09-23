---
title: "Example MCP / voice conversations"
---

# Example MCP / voice conversations

Multi-turn transcripts showing how the rules in [api-surfaces.md](api-surfaces.md), [example-utterances.md](example-utterances.md), and [glossary.md](../../product/glossary.md) play out turn by turn. Every tool name, credit cost, and error string below is taken from those files (and, for costs/limits, from [limits.md](limits.md)) — this file adds **sequencing and tone**, not new facts. Do not invent a tool name that isn't already in `api-surfaces.md`.

Conventions: `→ tool_name(args)` marks a tool call the agent makes; `←` marks what the tool returns.

---

## 1. Happy path: find, save, route (the core loop)

> **User:** Find me restaurants in Austin I don't already have.

> **Agent:** → `find_ai_leads(territory="Austin, TX", business_type="restaurant")`
> ← 42 results, 0 credits spent.
> **Agent:** Found 42 restaurants in Austin you don't have yet. Want to see them, or should I narrow it down first?

> **User:** Save the first five.

> **Agent:** → `save_ai_leads(search_id=..., ids=[first five])` *(preview call, no `confirm_all`)*
> ← Preview: 5 companies, cost 5 credits, `confirm_token=abc123`.
> **Agent:** That's 5 companies for 5 credits. Want me to go ahead?

> **User:** Yes.

> **Agent:** → `save_ai_leads(search_id=..., ids=[...], confirm_all=true, confirm_token="abc123")`
> ← Saved. Balance dropped by 5.
> **Agent:** Saved. Want these on a route, a list, or just in your Address Book?

**Why this shape:** `save_ai_leads` is *always* two calls — preview then confirm — even for one company (see [limits.md](limits.md)). Never skip the preview because the user sounds certain.

---

## 2. Insufficient credits — Sales Agent

> **User:** Save all 42.

> **Agent:** → `save_ai_leads(search_id=..., ids=[all 42])` *(preview)*
> ← Preview: 42 companies, cost 42 credits. Balance is 26.
> **Agent:** That's 42 credits and you've got 26 left — not enough to save all of them. Want me to save the 26 you can afford, or would you rather upgrade or grab a credits add-on first?

**Why:** the literal backend message is `Insufficient credits, please subscribe to add credits.` — translate it, don't quote raw JSON at the user. Never suggest Stripe checkout for a role that doesn't use it (see next example).

---

## 3. Insufficient credits — Business Sales Agent

> **User (BSA):** Buy contacts for these three companies.

> **Agent:** → `buy_contacts(...)`
> ← `Insufficient credits, please subscribe to add credits.`
> **Agent:** You're out of contact credits. Since your credits come from your manager's pool, I can't send you to a paid checkout for this — you'll need to ask your manager to allocate more.

**Never do:** send a BSA to Stripe/upgrade language. Their wallet is `BusinessclientSalesagentCredit`, not their own subscription (see [roles.md](../../product/roles.md)).

---

## 4. Collision: new lead vs. already-saved account

> **User:** Add Factory Kitchen to my routes for tomorrow.

> **Agent:** Is Factory Kitchen already in your Address Book, or is this a new place you want me to add?

> **User:** I think I already have it.

> **Agent:** → `search_companies(name="Factory Kitchen")`
> ← 1 match found.
> **Agent:** Found it. → `create_route(companies=[Factory Kitchen, ...])` *(after confirming the rest of the stop list)*

**Why:** this is exactly the collision in [api-surfaces.md](api-surfaces.md) §3 — "accounts already in TerriTool" uses `search_companies`, never `find_ai_leads` or `add_company`. When the user's intent is ambiguous, ask before picking a tool; don't guess and risk creating a duplicate company.

---

## 5. Buying contacts, small batch (under the confirm threshold)

> **User:** Who works at SORA Craft Kitchen?

> **Agent:** → `find_contacts(company="SORA Craft Kitchen")`
> ← 3 people found (preview, FullEnrich sourced). 0 credits so far.
> **Agent:** Found 3 people there. Unlocking them costs 2 credits each via our live provider — 6 credits total. Want me to go ahead?

> **User:** Yes, buy them.

> **Agent:** → `buy_contacts(company_id=..., contacts=[...])`
> ← Bought. Balance dropped by 6.
> **Agent:** Done — all 3 are saved to SORA Craft Kitchen's contact list.

---

## 6. Buying contacts, large batch (over the confirm threshold)

> **User:** Buy every contact on my Downtown route — that's about 30 companies.

> **Agent:** → `buy_contacts(...)` with the full selection
> ← `This would redeem 30 contacts. Confirm with the user, then call buy_contacts again with confirm_all=true (or pass fewer contacts).`
> **Agent:** That's 30 contacts — over our normal batch size, so the system wants an extra confirmation. At roughly 2 credits each that could run up to 60 credits depending on source. Still want to buy all 30?

> **User:** Yes, all of them.

> **Agent:** → `buy_contacts(..., confirm_all=true)`
> ← Bought.

**Why:** past 25 contacts in one call, the tool itself demands a second `confirm_all=true` regardless of the first confirm (see [limits.md](limits.md)). Don't treat the user's first "yes" as covering this — the threshold re-ask is a real second gate, not a bug.

---

## 7. Website missing for Find Contacts

> **User:** Find contacts at "Esther's Place."

> **Agent:** → `find_contacts(company="Esther's Place")`
> ← `Company address or website is required.`
> **Agent:** I can't look up people there yet — Esther's Place doesn't have a website on file. Do you know it? I can add it and try again.

> **User:** esthersplace.com

> **Agent:** → adds website, then → `find_contacts(company="Esther's Place")` again
> ← 2 people found.

**Why:** this is a hard precondition in the code, not a soft warning — don't retry the same call hoping it works.

---

## 8. Route with too few companies

> **User:** Make a route to Factory Kitchen.

> **Agent:** A route needs at least two stops. Want me to add another company, or would you rather I just give you directions to Factory Kitchen directly?

**Why:** `create_route` rejects single-company routes (see [limits.md](limits.md)). Don't call the tool and relay a raw error — catch this before calling.

---

## 9. "What's next" with no active route

> **User:** Where's my next stop?

> **Agent:** → `next_waypoint()`
> ← No active route.
> **Agent:** You don't have a route set as active right now. Want me to show your published routes so you can pick one?

> **User:** Yes, show them.

> **Agent:** → `view_routes()` → lists Published routes
> **Agent:** Here they are — which one is today's?

**Why:** `next_waypoint` requires a **Published** route marked active; it is not the same as `mark_visited` and won't auto-pick one for the user.

---

## 10. Resuming an interrupted search vs. starting over

> **User:** Did that Austin search finish?

> **Agent:** → `get_ai_lead_search()`
> ← In-progress snapshot, not complete.
> **Agent:** Still running — want me to pick up where it left off?

> **User:** Yeah, continue.

> **Agent:** → `resume_ai_lead_search()`
> ← Search failed and cannot be resumed.
> **Agent:** That one actually failed and can't be resumed — I'll need to start a fresh search for Austin restaurants. Same criteria as before?

**Why:** `resume_ai_lead_search` can return a terminal failure; the correct recovery is a new `find_ai_leads`, not repeated resume attempts (see [05-Find-Leads/known-issues.md](../05-Find-Leads/known-issues.md)).

---

## 11. Out-of-scope request: Admin/HQ via customer MCP

> **User (Sales Agent):** Can you grant me more credits directly?

> **Agent:** I can't grant credits myself — that's an admin-only action. You can upgrade your plan or buy a credits add-on from Settings/Billing, and if you think there's a billing issue, I can open a support ticket for you.

**Why:** the customer MCP catalog has no credit-grant tool; that only exists in Admin HQ (module 17), which is a separate server for internal staff. Never imply the agent can reach `/hq/*` — see [api-surfaces.md](api-surfaces.md) §5.

---

## 12. MCP Chat connector not connected (in-app custom MCP, not this agent)

> **User:** Sync my HubSpot contacts through the chat.

> **Agent:** That needs a connected MCP in Settings first — right now nothing's connected there. Want me to walk you through adding one, or would you rather use the native HubSpot sync in Settings instead (that one doesn't need MCP)?

**Why:** distinguishes **native HubSpot OAuth sync** (Settings, module 13) from the **custom MCP Chat connector** (Settings, module 14/UC-SET-04) — don't conflate the two when the user says "sync."

---

## Style notes for any new transcript added here

- Every credit number quoted to the user must match [README.md](../../README.md) credit rules exactly (save 1, FullEnrich buy 2, Claude buy 1, search/browse/counts 0).
- Preview-then-confirm is never collapsed into one turn for `save_ai_leads` or a >25 `buy_contacts` batch — show both calls.
- When a tool returns a literal backend string, the agent paraphrases it in plain language; it does not read the JSON aloud.
- Don't add a tool name here that isn't already listed in [api-surfaces.md](api-surfaces.md) §2.
