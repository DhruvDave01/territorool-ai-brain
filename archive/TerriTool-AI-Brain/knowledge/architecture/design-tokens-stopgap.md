---
title: "Design tokens — stopgap (extracted, not designed)"
---

# Design tokens — stopgap (extracted, not designed)

**This is not a real design system.** There is no Figma file, brand guideline, or token source in this repo — `public/css/custom.css` (5,693 lines, not ~3,700 as some docs say — recount on 2026-09-15) has **zero CSS custom properties**. Everything below was extracted by frequency-counting the actual hex colors, font sizes, and radii already in the CSS, so an agent has *something* consistent to reuse instead of inventing a new value per screen. Treat this as "what's already there, ranked by how often it's used" — not as an approved palette. Replace this file wholesale the moment a real brand/token source exists.

## The most important finding: there isn't one blue, there are three

| Color | Uses | Likely origin |
|---|---|---|
| `#124ac6` | 30 | Most-used — closest thing to a "primary" blue in the app today |
| `#2563eb` | 15 | Tailwind's `blue-600` — appears in newer sections |
| `#007bff` | 14 | Bootstrap 3's default `.btn-primary` blue — legacy default, not a deliberate brand choice |
| `#337ab7` | 8 | Bootstrap 3's default link blue — same story |

Four different blues doing roughly the same job is a real inconsistency, not a rendering issue. **Do not add a fifth.** If a screen needs a primary action color, use `#124ac6` (most-used) until someone makes an actual brand decision — and flag it if you notice a screen using one of the other three, since that's a candidate for cleanup, not a pattern to copy.

## Grays: two different scales in use

- **Bootstrap defaults** (legacy stack): `#f8f9fa`, `#eee`, `#e0e0e0`, `#333`, `#666`
- **Tailwind's slate scale** (newer sections, incl. Manager Portal): `#f8fafc` (slate-50), `#f1f5f9` (slate-100), `#e2e8f0` (slate-200), `#94a3b8` (slate-400), `#64748b` (slate-500), `#1e293b` (slate-800)

This split roughly tracks the [stack-migration-map.md](stack-migration-map.md) boundary: legacy Blade/jQuery screens lean Bootstrap gray, the newer Manager Portal/React work leans Tailwind slate. When extending a screen, match whichever scale that screen already uses — don't introduce Tailwind slate into a legacy Blade view or vice versa.

## Other real, frequently-used values

| Token (informal name) | Value | Uses | Where it shows up |
|---|---|---|---|
| Accent teal/green | `#16aa9d` | 8 | Secondary accent color |
| White | `#fff` / `#ffffff` | 46 + 16 | Both spellings are used — prefer `#fff` (majority) in new code |

**Font sizes** (px, most to least common): 14, 13, 12, 16, 11, 15, 18, 24, 21, 17, 10, 28, 22, 20, 30. No modular scale — these look like ad hoc per-element choices, not a type ramp. If adding new UI, 14px is the de facto body-text default (most-used value).

**Border radius** (px, most to least common): 8, 999 (pill/full-round), 6, 5, 12, 10, 20, 4, 15, 50. 8px is the de facto default for cards/buttons; 999px is the established pattern for pill-shaped elements (badges, status chips) — reuse it rather than inventing e.g. `border-radius: 50%` for a similar shape.

**Fonts:**
- Body/UI: `"Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif`
- Brand/display: `"DIN 2014 Light"` and `"DIN 2014 Bold"` (custom `@font-face`, both flagged `!important` in the source — a sign they were fighting a specificity conflict, not a pattern to copy for new rules)
- One page-specific serif: `Georgia, "Times New Roman", serif` — appears to be a one-off, not a second brand font
- `'Glyphicons Halflings'` — Bootstrap 3's icon font, legacy-stack only

## How to use this until a real design system exists

1. New legacy-stack (Blade/jQuery) UI: reuse the Bootstrap-gray scale + `#124ac6` + 14px body text + 8px radius.
2. New Manager Portal (React) UI: reuse the Tailwind-slate scale already present in that codebase — check `resources/manager-portal/components/` for existing patterns before inventing a new one.
3. Never introduce a new blue. If existing screens visibly disagree (three blues doing the same job), that's worth a real design decision, not a fourth guess.
4. When real brand/design-token input arrives, add it **into this Brain** and replace this file wholesale — extracted-frequency values are a stopgap, not a foundation to build a real token system on top of. Do not keep a Figma export as a second pack.
