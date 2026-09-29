# UI/UX Guardian

How to build or change UI. The pixels live in [mobile UI](mobile-ui.md) and [web design](web-design.md). This page is the behavior: copy the shipped product.

The requested UI must feel like the existing product. The goal is not a cleaner redesign.

**Priority:** existing UI, then the existing tokens, then the nearest similar screen, then a standard pattern. If those do not answer the question, stop and ask.

## Before creating UI

1. Name the surface: mobile, classic web, manager, or HQ.
2. Open the still for that surface in [the screenshot review](../screenshots/REVIEW.md).
3. Open the sibling screen in the repo. [Mobile screens](../code/mobile-screens.md) names the file for each of the 52 screens; [mobile components](../code/mobile-components.md) has the props.
4. Reuse header, button, modal, list, and empty state from that sibling.
5. Write the consistency report below before drawing or coding. It is short. It stops an inferred token or an unknown string from shipping as fact.
6. Check [the design gate](../gates/design-gate.md) before calling the screen done.

## Consistency report

Four labels, one line each per item that the screen depends on: a token, a font, a string, a component, an endpoint, a credit cost.

```markdown
# Consistency — [Screen]

- KNOWN — [item], from [file or still path]
- INFERRED — [item], from [the sibling it was copied from]; confirm before shipping
- UNKNOWN — [item]; ask, or leave it out of the screen
- CONFLICTING — [item]: [source A] says X, [source B] says Y; the live file wins, note the loser
```

A screen ships only when every INFERRED line was confirmed or removed, every UNKNOWN was asked or dropped, and every CONFLICTING line names which source won.

## Where to look

| | Mobile | Classic web | Manager |
|---|---|---|---|
| Tokens | `App/styles/theme.js` | `public/css/custom.css` | `public/css/manager-portal.css` |
| Chrome | `customheader` + curved body `#F6F7FB` | `front.layout` + AdminLTE | `_portal_layout`, AdminLTE chrome hidden |
| Buttons | `AppButton` | the sibling `.btn` | the sibling island button |
| Confirm | `AppConfirmModal` | the existing modal on that page | the existing manager dialog |
| Type | `theme.font.dinBold` (DIN Condensed Bold) for titles and buttons, `theme.font.dinLight` (FF DIN Regular) for body. Not Inter. | Source Sans Pro + DIN 2014 | DM Sans / Space Grotesk |

## Do not

- Mix manager fonts or Tailwind-style spacing onto a Blade page.
- Mix AdminLTE onto a new manager page.
- Put `CustomFooter` on Dashboard or on AI Find Leads.
- Invent a primary color. Primary is `#124ac6` on mobile and on both web stacks.
- Trust a screenshot filename when the pixels show a different screen. The review lists the known lies.
- Ship a data screen with no loading, empty, and error state. Copy the strings that already exist for that feature.

## Generating a picture of a screen

The first file you hand back is a **PNG** of that screen. Write HTML only after the user asks for HTML. The recipe is [render a still](../methods/render-still.md). Do not hand back a phone mock on a gray desk, or a diagram of the flow, in place of the PNG.

1. Open the still named in [the screenshot review](../screenshots/REVIEW.md). If a later still of the same screen exists, use the later one.
2. The PNG matches the live still, including a black bezel when the still shows one. The island is the small status-bar island from that still. It does not cover the header. The white frame sheet is not the device to copy.
3. Copy the strings, badges, empty line, colors, and icons from that still and from the sibling in code. A bug string in an older still stays a bug. Do not ship it as the live copy when a newer still shows the real line.
4. A new idea stays inside that chrome. Do not replace the screen with a new layout.
5. Before handing the PNG over, read it. The island stays in the status bar and does not touch the logo, the name, or the credits. Every label is complete, including the ones near a corner: Calendar, Address Book, Settings. A clipped word or an island on the header means the picture is not done.

## When to stop

Stop and ask before changing navigation, combining two roles onto one home, moving a credit spend, or replacing a stack (Blade to React, class screen to a new design system).
