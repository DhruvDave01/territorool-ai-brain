---
title: "Contact Enrichment Credits — known issues and error messages"
---

# Contact Enrichment Credits — known issues and error messages

Part of [09-Contact-Enrichment-Credits](MODULE.md). Verbatim from the former `07-Operational-Reference/known-issues-and-error-messages.md` (literal strings from the controllers, verified 2026-09-15; split 2026-09-16). Use these when you need the exact string the backend returns. Cross-feature and system-level entries: [engineering/operational-notes.md](../../learnings/operational-notes.md).

## Credits and spending

| Literal message | When it fires | What to tell the user |
|---|---|---|
| `Insufficient credits, please subscribe to add credits.` | Save-leads or buy-contacts attempted with balance below the cost | Sales Agent → Upgrade or credits add-on (RevenueCat users manage that plan, not Stripe). BSA → contact their manager. See [api-surfaces.md](../20-MCP/api-surfaces.md) §4. |
| `Please select at least one contact to purchase.` | `buy_contacts` / bulk buy called with an empty selection | Ask which contacts to buy; don't retry with the same empty payload. |
| `Free contacts added.` | A Find Contacts result had free rows queued/added without a paid buy step | This is a real, distinct success path — do not describe it as a "buy." |
| `Contact purchase started.` / `Queued...` | Bulk contact purchase job accepted and running asynchronously | Tell the user it's processing, not instant; don't imply failure if a result isn't immediate. |
