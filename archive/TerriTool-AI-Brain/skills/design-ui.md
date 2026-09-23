---
title: "Skill: Design UI"
name: territorool-design-ui
description: >-
  Design or redesign a TerriTool screen from this Brain only — evidence
  screenshots, stack map, and stopgap tokens. Use before coding a new or
  changed UI.
---

# Skill: Design UI

There is **no** second design pack and no Figma. Design from `TerriTool AI Brain/` plus the live screen.

## Output

A filled [../ui-flows/SCREEN-SPEC.md](../ui-flows/SCREEN-SPEC.md) in the owning feature folder. Do not start JSX/Blade until that spec exists.

## Procedure

1. **User + job** — `features/*/MODULE.md` and `use-cases.md`. New path → next `UC-*` in that family, never `UC-001`.
2. **Flow** — [../ui-flows/README.md](../ui-flows/README.md) and `features/*/flows.md`.
3. **Stack** — URL starts with `/manager` or file under `resources/manager-portal/` → React + Vite. Everything else → Blade + jQuery. Do not introduce React on a Blade screen.
4. **Copy-from** — nearest screenshot in `features/*/evidence/` (unassigned only if nothing is catalogued: [../evidence/README.md](../evidence/README.md)). **Embed the image directly in the spec** (`![]()`), not just its filename or a timestamp — then open the live Blade or JSX that screenshot matches and describe its current layout before proposing anything new.
5. **Tokens** — [../knowledge/architecture/design-tokens-stopgap.md](../knowledge/architecture/design-tokens-stopgap.md). Match **that** screen’s scale (Bootstrap gray vs Tailwind slate). Body 14px, radius 8px, pills 999px. Never a new primary blue.
6. **Chrome** — authenticated pages keep Upgrade, Credits badge, sidebar, Logout. MCP has no chrome.
7. **States** — loading, empty, error, permission, success. Pull error strings from `known-issues.md` when they exist.
8. **Credits / one-product** — name the cost or write `none`. Shared writes go in Helper / v2.
9. **Write the spec** into the feature `flows.md` (or `flows/<name>-spec.md`).
10. **Implement** only after the human accepts the spec — [implement.md](implement.md). Then [../loops/qa-loop.md](../loops/qa-loop.md).

## Do not

- Invent a layout that does not exist in evidence or in the copy-from screen.
- Restyle a Blade page with Manager Tailwind (or the reverse) as a drive-by.
- Treat `design-tokens-stopgap.md` as an approved brand file. It is frequency-counted CSS. Replace it only when a real brand source is added **into this Brain**.
