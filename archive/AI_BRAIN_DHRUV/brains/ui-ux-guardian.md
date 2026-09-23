---
id: ui-ux-guardian
parent: brains
sources:
  - TerriTool/App/styles/theme.js
  - TerriTool/App/components/customheader/index.js
  - TerriTool/App/styles/screenCurvedBody.js
  - TerriTool/App/components/common/AppButton.js
  - TerriTool/App/components/common/AppConfirmModal.js
  - webterritool/public/css/custom.css
  - webterritool/public/css/manager-portal.css
  - webterritool/resources/views/front/layout.blade.php
related:
  - brains/mobile-ui.md
  - brains/web-design.md
  - brains/mobile-code.md
  - brains/web-code.md
  - design/MINI-DESIGN-BRAIN.md
  - design-web/MINI-DESIGN-BRAIN.md
  - design/05-Design-System/Usage-Rules.md
  - design-web/Usage-Rules.md
  - 04-style-guide.md
---
# UI/UX Guardian

Agent policy for **building and modifying UI**. Pixels still live in the Mobile UI / Web Design brains. This file is **how** to behave: copy the shipped product, do not invent a new look, do not silently make major UX decisions.

**Goal:** the requested UI must feel like a natural part of the existing product. The goal is **not** to make the UI look “better” by preference.

**Priority:** existing UI > existing design system > existing similar screen > standard UX > assumption.

**When in doubt:** STOP → ASK → WAIT → IMPLEMENT.

## Read with this file

| Surface | Then read | Then inspect live |
|---------|-----------|-------------------|
| Mobile | [mobile-ui.md](mobile-ui.md) → [design/MINI-DESIGN-BRAIN.md](../design/MINI-DESIGN-BRAIN.md) | `TerriTool/App/styles/theme.js`, nearest screen under `App/components/` |
| Web classic | [web-design.md](web-design.md) → [design-web/MINI-DESIGN-BRAIN.md](../design-web/MINI-DESIGN-BRAIN.md) | Sibling Blade under `front.layout`, `public/css/custom.css` |
| Web manager | same Design Brain | Sibling island + `public/css/manager-portal.css` |
| Implementation | [mobile-code.md](mobile-code.md) or [web-code.md](web-code.md) | Class screens / Laravel pattern of the sibling file |

Code wins over this note. Do not invent leads, routes, credits, FormData keys, or MCP tools.

## 1. Existing UI always comes first

Before creating or changing any UI, inspect the existing codebase and identify:

- Global theme / design tokens
- Primary / secondary colors
- Typography and font sizes
- Spacing system
- Border radius
- Buttons
- Inputs / forms
- Cards
- Modals / dialogs
- Bottom sheets
- Navigation
- Icons
- Tables / lists
- Loading states
- Empty states
- Error states
- Responsive behavior
- Existing reusable components
- 2–3 screens that are visually or functionally similar

Reuse existing components and patterns whenever possible. Do **not** create a new design when an existing pattern already exists.

### Where to look (TerriTool)

| What | Mobile | Web |
|------|--------|-----|
| Tokens | `App/styles/theme.js`, `App/styles/common.js` | Classic `public/css/custom.css`; manager `--blue` / `--teal` / `--radius` in `manager-portal.css` |
| Header / chrome | `customheader` + `screenCurvedBody.js` (25pt `#F6F7FB`) | Classic `front.layout` + AdminLTE; manager `_portal_layout` |
| Buttons | `App/components/common/AppButton.js` | Sibling `.btn` / manager island buttons |
| Confirms | `AppConfirmModal` — not native `Alert` | Classic PNotify / existing modal; manager existing dialog |
| Footer / nav | `customfooter` (six tabs; Dashboard has none) | Classic `inc/sidebar.blade.php` (leave duplicates); manager `_mgr_sidebar.blade.php` |
| Type | DIN Condensed (`dinBold` / `dinLight`). Do not introduce Inter. | Classic Source Sans Pro + DIN 2014. Manager DM Sans / Space Grotesk. Do not mix. |
| Do not “fix” | Mixed teals; danger `#E94A5D` vs `#CF5B51` | Classic leftover `#16aa9d` vs `--tt-teal` / manager `--teal` |

## 2. Same theme is mandatory

The new UI must look like it belongs to the **same** application.

Do not introduce:

- New colors without justification
- New typography
- Random gradients
- Random shadows
- Different border-radius styles
- Different button styles
- Different spacing systems
- Different icon styles
- Different navigation patterns
- Unnecessary animations
- A completely new visual style

If the existing application already has a solution, follow it. Consistency is more important than creating something visually “new.”

Do not mix mobile chrome with web, or classic AdminLTE with manager islands.

## 3. Never assume major UX decisions

Never silently invent product requirements or major UX decisions.

**Minor** (follow the existing project pattern and continue):

- Small spacing decision
- Existing font size
- Existing color
- Existing border radius
- Existing component behavior
- Existing responsive pattern

**Major** (STOP. Do not implement the assumption. ASK the user):

- New navigation
- New screen structure
- New user flow
- Modal vs page vs bottom sheet
- Tabs vs sidebar vs another navigation pattern
- Adding / removing major sections
- Changing primary CTA behavior
- Changing information architecture
- Authentication / onboarding flow
- Payment / subscription flow
- Permission flow
- Destructive action behavior
- Complex form behavior
- Major responsive behavior
- Any UX decision that can significantly change how users use the product

On this product, treat these as **major** as well: nested navigators, a new footer tab, CustomFooter on Dashboard / AI Find Leads V2, restyling Register/paywall/HQ, merging classic + manager stacks, changing Mark vs Add To by `parent_screen`, credit-spend confirm UX.

## 4. When requirements are ambiguous

If multiple reasonable UX solutions exist, do not choose one silently. Ask a concise, specific question:

```
I found an ambiguous UX decision:

A) [Option]
   - [short consequence]

B) [Option]
   - [short consequence]

This affects [user flow/UX/etc.], so I need your choice before implementing it.

Which approach should I use?
```

Do not ask vague questions such as “How should I design this?” Ask about the exact decision that is blocking implementation.

## 5. Do not over-question the user

Do **not** ask for decisions that can safely be determined from the existing codebase. If the existing application already establishes a pattern, use it.

Do not ask about:

- Button padding when existing buttons define it
- Colors when theme tokens exist
- Typography when existing typography exists
- Card styling when existing cards exist
- Input styling when existing inputs exist
- Responsive behavior when similar screens establish it

Only ask when the decision is genuinely ambiguous or materially affects UX / product behavior.

## 6. Before implementing a UI task

1. Understand the requested functionality.
2. Inspect the existing application (table above + nearest 2–3 screens).
3. Find the closest existing UI/UX patterns.
4. Identify reusable components.
5. Determine which decisions are clearly defined.
6. Identify any **major** ambiguous decisions.
7. If there are no major ambiguities → implement.
8. If there is a major ambiguity → STOP and ask before implementing that part.

Never design the entire feature from scratch without first checking the existing application.

## 7. Component reuse

Before creating a new component, search for an existing component that can be reused, configured, extended, or composed. Prefer extending existing components over duplicating them. Do not create visually similar duplicate components.

Mobile: class screens, no Redux, no NativeBase, no nested navigators. Web: copy the sibling Blade page or manager island — do not add a new AdminLTE page for `/manager/*`.

## 8. UI consistency check before finishing

Before declaring the task complete, verify:

- [ ] Same theme
- [ ] Same primary colors
- [ ] Same typography
- [ ] Same spacing
- [ ] Same border radius
- [ ] Same buttons
- [ ] Same inputs
- [ ] Same cards
- [ ] Same icons
- [ ] Same navigation patterns
- [ ] Same responsive behavior
- [ ] Same loading states
- [ ] Same empty states
- [ ] Same error states
- [ ] Existing components reused where possible
- [ ] No unnecessary new design patterns introduced
- [ ] No major UX assumption was made
- [ ] Mobile: nearest screen chrome (`CustomHeader` + curved `#F6F7FB` body) unless the sibling is onboarding/paywall
- [ ] Web: classic vs manager stack not mixed; HQ pixels not invented

If something differs from the existing design system, explain why.

## 9. Confidence rule

Classify decisions internally:

| Class | Meaning | Action |
|-------|---------|--------|
| CONFIDENT | Existing code / design system clearly defines the answer | Implement |
| INFERRED | Existing patterns strongly suggest the answer | Follow the closest existing pattern |
| AMBIGUOUS | Multiple reasonable solutions exist | Ask the user |
| MAJOR + AMBIGUOUS | Product / UX could change how people use the app | **Never** implement without user confirmation |

## 10. Most important rule

Do **not** assume what the user has not specified when it involves a major product or UX decision.

Use the existing application to resolve minor decisions. Ask the user to resolve major decisions.
