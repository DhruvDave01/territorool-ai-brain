# Design gate

Run this before calling a new or changed screen done. Rules: [UI/UX Guardian](../brains/ui-ux-guardian.md). Stills: [screenshot review](../screenshots/REVIEW.md).

| Check | Pass when |
|---|---|
| Surface named | Mobile, classic web, manager, or HQ — one of them |
| Still opened | The image for that flow is in `screenshots/` and was used as the copy source |
| Picture, when the ask is a picture | The first handoff is a PNG of the screen, made with [render a still](../methods/render-still.md). HTML is written only after the user asks for HTML. The PNG was read before handoff: the island does not cover the header, and no corner clips a label |
| Capture, when the ask is code | The proof is a simulator or browser capture of the built screen, recorded with the [evidence collector](../methods/evidence-collector.md), compared against the copy still. A composited render is not evidence that code works |
| Filename | Any mismatch in the review was followed (pixels, not the name) |
| Primary | `#124ac6` unless the sibling screen uses a token that is already listed |
| Type | Mobile: `theme.font.dinBold` for titles and buttons, `theme.font.dinLight` for body, from the [type roles](../brains/mobile-ui.md). Classic: Source Sans Pro + DIN 2014. Manager: DM Sans / Space Grotesk. Not mixed. |
| Chrome | Mobile uses CustomHeader and curved `#F6F7FB` body, except the screens [mobile UI](../brains/mobile-ui.md) exempts: Dashboard (system face on tile labels, no footer), the Register questionnaire (no CustomHeader, 6-segment bar), and splash. Check against the named sibling, including its exceptions. Classic extends `front.layout`. Manager uses the portal shell. |
| Footer | Mobile footer is absent on Dashboard and Find Leads |
| States | Loading, empty, and error exist. The strings come from the Screens block on the feature page, not from memory |
| Credits | Visible cost matches [product overview](../product/overview.md) or the control does not spend credits |
| Reads as TerriTool | None of the generic tells in the [draft review](../methods/draft-review.md) is present. Someone who knows the product would not call the screen generic |
| Assets | Fonts, icons, and images come from [fonts](../assets/fonts), [icons](../assets/icons), and [mobile images](../assets/images/mobile/README.md), not a CDN |
| Usability | Mobile: every tappable has `accessibilityLabel` and `accessibilityRole`, a minimum height of 48 (44 with `hitSlop`), and text comes from `theme.typography` so it scales. Web: the changed control works from the keyboard, shows focus, and the page still does the job at 390 wide. Every failure has a way back: the error copy from the Screens block plus a retry or a back control |
