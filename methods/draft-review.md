# Draft review

TerriTool's own card, from client feedback on 2026-10-06. It is not from agency-agents.

A generated diff or picture is a draft. The generator saw this folder and the prompt. It did not see the live repo, the customer, the roadmap, or the brand. Whoever ships the work adds that context, changes what the draft got wrong, and signs the result. Finished work reads as if a TerriTool engineer or designer made it. "It runs" and "it looks clean" are the floor, not the pass.

Run this before the [code gate](../gates/code-gate.md) or the [design gate](../gates/design-gate.md).

## Code: read before accepting

| Question | Where the answer lives |
|---|---|
| Architecture — does it sit where the sibling feature sits: same controller, same navigator, same Realm pattern, same `API.post` shape? | [Mobile review](../code/mobile-review.md), [web review](../code/web-review.md) |
| Logic — trace the happy path and one failure path by hand against the live file | The file the review names. A green run is not the trace |
| Edge cases — empty list, no network, expired JWT, 0 credits, a second tap, a long name. Name which were handled and which were not | The sibling screen shows which ones the product already handles |
| Maintainability — would the next person on this repo recognize the pattern? A new abstraction for one call site is a tell | [Minimal change](minimal-change.md) |
| Fit — it does the job the way the product does it (FormData, class components, Blade), not a tidier pattern from another codebase | [Code gate](../gates/code-gate.md) |
| Requirements — it answers the ticket, not only the prompt | The feature page and the [role card](../roles/user.md) |

## Design: read before accepting

| Question | Where the answer lives |
|---|---|
| Brand — fonts, primary, chrome come from the guardian table, not from the model's defaults | [UI/UX Guardian](../brains/ui-ux-guardian.md) |
| Sibling — the nearest shipped screen was opened and copied, not described from memory | [Screenshot review](../screenshots/REVIEW.md) |
| Strings — loading, empty, error, and labels are the shipped lines | The Screens block on the feature page |
| Generic — none of the tells below is present | This card |

### Tells of a generic screen

One tell is a HOLD, however clean the screen looks.

- Inter or the system face on a mobile screen that is not Dashboard
- An accent that is not `#124ac6` or a token already listed for that stack
- A gradient hero, or a rounded card with a drop shadow on every row
- Emoji in a label or a button
- A three-column feature grid or a marketing-style section on a product page
- An illustration, icon set, or image that no shipped screen uses
- A new bottom tab, a new navigation pattern, or a new modal style when the sibling has one
- Placeholder-shaped copy: "Lorem", "Get started today", "Your journey begins"
- A layout that would fit any SaaS product with the logo swapped

## Handoff

```markdown
## Draft review — [change]

**Generated:** [what the model produced, one line]
**Kept as generated:** [the parts that already matched the live file or still]
**Changed:** [what was changed, and which context the draft lacked: business, product, technical, or brand]
**Edge cases checked:** [list]
**Not checked:** [list, with the reason]
```

A handoff with an empty **Changed** line is suspicious, not clean. Say why nothing needed changing.
