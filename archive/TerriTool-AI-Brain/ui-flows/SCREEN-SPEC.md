---
title: "Screen spec template"
---

# Screen spec template

Fill this **in the Brain** before coding a new screen or a redesign. Copy the block into the feature `flows.md` (or a new `flows/<name>-spec.md` beside it). Do not keep specs in chat.

Design procedure: [../skills/design-ui.md](../skills/design-ui.md). Tokens: [../knowledge/architecture/design-tokens-stopgap.md](../knowledge/architecture/design-tokens-stopgap.md). QA after build: [../loops/qa-loop.md](../loops/qa-loop.md).

Existing IDs stay canonical. A new path gets the next `UC-*` in that family — never `UC-001`.

```text
Screen spec
├── Goal
├── User / role
├── UC ID
├── FLOW ID
├── URL
├── Stack
├── Copy-from (evidence screenshot + existing Blade/JSX)
├── Chrome (sidebar, credits badge, upgrade — or MCP: none)
├── Layout / components
├── States (loading, empty, error, permission, success)
├── Actions
├── API / web methods
├── Credit impact
├── One-product (web / v2 / MCP)
└── QA: happy + empty + error
```

| Field | What to put |
|-------|-------------|
| Goal | One sentence the user can finish |
| User / role | Sales Agent / BSA / Business Agent / Admin / Guest |
| UC ID | Existing `UC-*` or the next ID in that family |
| FLOW ID | `FLOW-*` from [README.md](README.md) |
| URL | Path, e.g. `/findleads` or `/manager/dashboard` |
| Stack | `/manager` or `resources/manager-portal/` → **React + Vite**. Everything else → **Blade + jQuery**. Never mix. |
| Copy-from | **Embed the actual screenshot** (`![...](../evidence/<file>)`), not just a filename or timestamp reference — a citation without the image gets skipped and the redesign drifts from the real screen. Plus the nearest live view/JSX path. Match that screen’s gray/blue scale. |
| Chrome | Global authenticated chrome, or “none (MCP)”. New pages land in existing chrome. |
| Layout | Regions and controls. Reuse AdminLTE / jqxGrid / Manager components — do not invent a third UI kit. |
| States | Loading, empty, error, permission, success. Literal copy if `known-issues.md` has it. |
| Actions | Clicks, submits, row actions |
| API | Controller@method and/or v2 / MCP tool |
| Credit impact | **0 / 1 / 2 / none**. Search is 0; save AI lead 1; FullEnrich 2; Claude buy 1. Buy is never free. |
| One-product | If this writes companies, credits, or routes, the same rule must live in Helper / v2 — not Blade-only. |
| QA | Happy path + empty + error. After implement, run [qa-loop.md](../loops/qa-loop.md) against this spec. |

## Rules

- There is no Figma in this repo. Evidence screenshots in this Brain **are** the design source.
- Embed the Copy-from screenshot inline (`![]()`) and describe its current layout field by field before proposing anything new. A spec that only cites a filename/timestamp is not filled in — treat it the same as a missing spec.
- Do not add a fifth primary blue. Blade: `#124ac6`. Manager: Tailwind slate already in that tree.
- Do not hand-edit `public/js/manager-portal.js`.
- Stop if the spec would change credit costs or one-product rules without an explicit product decision.
