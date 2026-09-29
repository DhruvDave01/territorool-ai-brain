# Mobile UI

Pixels and tokens as they ship in `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`. Open [the Guardian](ui-ux-guardian.md) first, then a still in [the screenshot review](../screenshots/REVIEW.md). Implementation files: [mobile code](mobile-code.md).

## Must follow

| Rule | Do this |
|---|---|
| New screen | Copy the nearest existing screen. `CustomHeader` plus curved body. |
| Header | `App/components/customheader/index.js`. Gradient stops in `theme.colors.linearGradient`, first stop `#124ac6`. |
| Body | `App/styles/screenCurvedBody.js`. Top radius 25. Fill `theme.colors.ccSurface` (`#F6F7FB`). The radius is not in `theme.js`. |
| Confirm | `App/components/common/AppConfirmModal.js`. Not `Alert`. |
| Buttons | `App/components/common/AppButton.js`. Danger background `#CF5B51`. |
| Type | Two DIN faces from `theme.font`: `dinBold` for titles, labels, and buttons; `dinLight` for body and values. Role table below. Inter is bundled but unused. |
| Dark mode | None app-wide. |
| Footer | Six icon tabs. Dashboard has no footer. Settings on Dashboard is a header control, `testID="footer.tab.settings"`. |
| Splash | Native `#124ac6`, then the splash image. Do not reuse the splash poster on a logged-in screen. |
| Onboarding | Light questionnaire and a 6-segment bar. Not `CustomHeader` and not the footer. |

## Type roles

Two faces. Both come from `theme.font` in `App/styles/theme.js`. The names in code are the left column. Do not import from `App/styles/fonts.js` in a screen; that file only exports the platform PostScript names.

| Code name | File | Real face | Use for |
|---|---|---|---|
| `theme.font.dinBold` | `DIN-Condensed-Bold.ttf` | DIN Condensed Bold | Screen titles, card titles, row labels, button labels, tags, tab names |
| `theme.font.dinLight` | `DIN-Condensed-Regular.ttf` | FF DIN Regular (the file is not condensed despite its name) | Body copy, values, email, dates, helper lines, list rows |

`App/styles/fonts.js` exports `dinCondensedBold` and `dinCondensedRegular`; `theme.font` aliases them as `dinBold` and `dinLight`. Live usage on the review date: `theme.font.dinLight` 443 times, `theme.font.dinBold` 329 times, and 18 legacy `"DIN2014-Light"` strings. Inter appears in zero style sheets. A prompt that says "body text is Inter" is wrong.

`theme.typography` is the size scale. Spread one entry into a `Text` style instead of setting `fontSize` by hand:

| Entry | Size / line | Face |
|---|---|---|
| `display` | 24 / 30 | dinBold |
| `title` | 22 / 28 | dinBold |
| `heading` | 20 / 25 | dinBold |
| `subheading` | 17 / 21 | dinBold |
| `body` | 16 / 20 | dinLight |
| `bodyBold` | 16 / 20 | dinBold |
| `caption` | 14 / 18 | dinLight |
| `captionBold` | 14 / 18 | dinBold |
| `micro` | 12 / 15 | dinLight |
| `microBold` | 12 / 15 | dinBold |
| `buttonLabel` | 17 / 19, centered | dinBold |
| `buttonLabelCompact` | 14 / 16, centered | dinBold |

On the Settings still: "Settings", "Credits Remaining", "Tags", and every button are dinBold. The email, "Pro Package", the renewal date, and "8392" are dinLight.

## Tokens in `App/styles/theme.js`

Keep every one of these. Do not average them into one teal or one red.

| Role | Token | Hex |
|---|---|---|
| Primary | `primary` | `#124ac6` |
| Surface | `ccSurface` | `#F6F7FB` |
| Danger text/modal | `danger` | `#E94A5D` |
| Danger button | `ttRed` | `#CF5B51` |
| Teal family, all live | `primaryDark` `#00A99D`, `ttGreen` `#12AA9D`, `ttTab` `#3E918B`, `lightGreen` `#40B793` | do not collapse |

A prompt that says the primary color is teal `#12A090` is stale. Primary is `#124ac6`.

## Dashboard

Copy [the 1:45 home still](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-22 at 13.45.00.png>). Black bezel. The island is small and stays in the status bar. It does not cover the logo, the name, or the credits. The 19.36.33 still is the same chrome with activity rows. The 19.37.00 still shows the date bug “Invalid Date PT”. The live line on the 1:45 still is “Tue, Sep 22 · 8:15 AM PT”.

| Part | What the still shows |
|---|---|
| Status bar | Time on the left of the island, signal and battery on the right. The island stays in this bar, with a gap under it before the logo. Content is inset from the corner radius so Calendar, Address Book, and Settings are fully visible. |
| Header | White rounded square with the cube, first name, credits pill, QR, settings. Gradient from `#124ac6`. |
| Banner | Same `referralBanner` slot: `#E0E7FF`, gift icon, chevron. Title “Want 50 more credits?” at 12/16, weight 600, `#124ac6`. Subtitle “G2: 30 · Product Hunt: 20” is DIN Condensed Regular, 10/13, `#124ac6`. The 1:45 still still says “Want 20 more credits?”. The live string is the 50 line. |
| Tags | Corner tags sit under the label. A tile that also has a subtitle, such as Routes, keeps a gap between “New route ready” and “Powered by AI.” |
| Tiles | Six, two columns. Labels are dark, not blue. Corner tags are `#E0E7FF`. Unread tiles are `#F0F4FF` with a `#124ac6` border and a blue count badge. |
| Tile icons | The PNGs in `App/images`, tinted `#124ac6`: `ai_findleads`, `scan_card`, `recently_added`, `icon_routes`, `Supply3`, `icon_company`. |
| Activity | Title, the date line, outline Calendar button, Upcoming / Recent. Empty upcoming copy is “No upcoming activities yet.” |
| Build line | Amber dot, then `iOS` and the version. |
| Footer | None. |
| Review sheet | Bottom sheet from the banner. `ReviewRewardsModal.js`. Three stills: [ready](../screenshots/mobile-owner/Dashboard/review-rewards-ready.png), [both pending](../screenshots/mobile-owner/Dashboard/review-rewards-pending.png), [G2 verified](../screenshots/mobile-owner/Dashboard/review-rewards-g2-verified.png). |

The sheet title is “Unlock 50 credits”, DIN Condensed Bold 18/22. Body, copied from code: “Review Territool on G2 and Product Hunt to earn up to 50 credits.” Info block on `#F0F4FF`: “New review rewards. Share your experience with other sales teams.” Each offer is a hairline card with the logo in `App/images/review-rewards/`, “Review on G2” or “Review on Product Hunt”, “Share your honest experience”, and a green pill `+30 credits` or `+20 credits` (`#DCFCE7` / `#15803D`). Before either review is sent, there is no status pill and the outline button reads “Review on G2” or “Review on Product Hunt”. That is [the ready still](../screenshots/mobile-owner/Dashboard/review-rewards-ready.png). The name and credit count on that still (“dev test”, 92) are that account. Pending is a `#FEF3C7` pill “Pending verification” and a disabled button “Submitted”. Verified adds a green “Verified” pill and the button reads “G2 review done” or “PH review done”. The `+30 credits` and `+20 credits` pills stay on the card in all three states. Fine print: “Honest feedback is welcome, whatever your rating.”

Opening a review posts `invite-user` with FormData `type` `g2` or `ph`. Status `1` opens the review URL. `getusercredit` supplies `has_tried_g2_review`, `has_tried_ph_review`, `has_pending_g2_review`, `has_pending_ph_review`, `has_verified_g2_review`, `has_verified_ph_review`. A tap does not add the credits.

Tile labels on this screen use the system face at the weights in `dashboard.styles.js`. DIN stays for screens that actually set `dinBold`.

## Voice Mode

Shipped 2026-09-29 in staging and dev builds. Stills: [screenshots/mobile-owner/VoiceMode](../screenshots/mobile-owner/VoiceMode). Styles: `App/components/voice/voice.styles.js`. Behaviour and strings: [22 — Voice Mode](../features/22-Voice-Mode.md).

| Part | What ships |
|---|---|
| Chrome | `CustomHeader` (“Voice Mode” / “Voice history”), the curved body, and footer index 4 with Routes lit. Same header and footer as route detail. |
| State card | White card, radius 16, 1 px `border`, faint shadow, padding 14, min height 112. Orb 58 on the left with one to three rings. Pill and hint on the right. |
| Pill | Round, a dot plus the state word, on the tone’s pill colour |
| Bubbles | Radius 14, max width 84%, text 18 dinLight. Rep: primary blue with white text, on the right. Assistant: white with a `border` hairline, on the left, with a `sparkles` avatar. A live line ends in a caret. |
| Section labels | 13 dinBold, grey `#6B7280`, letter spacing 0.6, uppercase: NEXT STOP, LOGGED, ACTIVITIES, CHECK BEFORE REPEATING. The right label reads, for example, “1 OF 2 LEFT”. |
| Stop row | `BASIC_ROUTE_COMPANY_ROW` from route detail, compact. The visited badge is a green check. |
| Tool chip | `#EEF0F3`, radius 8, the tool name, then a ✓ or ✗ and the seconds |
| Outline button | 1.5 px primary border, radius 10, min height 40, white fill (“Open”, “Clear”) |
| Action bar | `ActionButton` over `AppButton`. End is `danger` `#CF5B51`. Pause, Resume and Reconnect are `primary`. Min height 52, radius 12, icon before the label. |
| Mini-bar | Primary blue, radius 14. A 10 px state dot, “Voice on · {state}” in 17 dinBold white, “Next: …” in 14 dinLight at 85% white. A pause button on a 16% white square, then a chevron. Below the navigator it sits on a `#F6F7FB` strip. |
| Lost-write card | `#FFF6F5` fill, `#F3B4B0` border, radius 16, a `wifi-off` icon, and an outline button |

Tones (`TONES`), one set per state:

| Tone | Fill | Ring | Pill | Ink | States |
|---|---|---|---|---|---|
| blue | `#124ac6` | `#BFD0F5` | `#E0E8FA` | `#124ac6` | Connecting, Thinking, Speaking; the Listening orb fill |
| teal | `ttGreen` `#12AA9D` | `#9FDDD7` | `#DDF3F1` | `#0B7A71` | Listening ring and pill, Hearing you, the live mini-bar dot, the Settings “On” pill |
| amber | `#124ac6` | `#F5A623` | `#FDF0D5` | `#9A5B00` | Working |
| grey | `#6B7280` | `#D1D5DB` | `#EEF0F3` | `#4B5563` | Off, the Paused orb, the paused dot, the Settings “Off” pill |
| red | `danger` `#E94A5D` | `#F5B8BF` | `#FDE3E5` | `#B42331` | Connection lost, the Paused pill |

Do not recolor these to one teal. The teal here is `ttGreen`, which the tokens table above keeps separate from `primaryDark`.

## Copy from

| New thing | Copy |
|---|---|
| Logged-in list | Address Book `company/list.js` or Settings `dashboard/editstatus.js`. Every screen's file: [mobile screens](../code/mobile-screens.md). Props: [mobile components](../code/mobile-components.md). |
| Register / onboarding | The register questionnaire, not the Dashboard |
| Confirm | An existing `AppConfirmModal` caller |
| Button | The `AppButton` variant already on that screen |
| Map | `activeroutemap` or `findLeads`. Do not recolor map circles to one teal. |
| Voice UI (orb, bubbles, cards, mini-bar) | `App/components/voice/` and the [VoiceMode stills](../screenshots/mobile-owner/VoiceMode). Where the 2026-09-28 renders in `features/` differ, the stills win. |

Fonts, icons, images, and logos for new art are in [assets/fonts](../assets/fonts), [assets/icons](../assets/icons), [assets/images/mobile](../assets/images/mobile/README.md), and [assets/logos](../assets/logos/README.md). The login and header mark is `TerriTool_logo_NEW.jpg`. The same cube on black is `TT_NO_BG.png`. Font files in `App/assets/fonts` are `DIN-Condensed-Bold.ttf`, `DIN-Condensed-Regular.ttf`, `Inter-Regular.ttf`, `Inter-Medium.ttf`. Only the two DIN files are referenced from JS. Do not pull a Google Font or an icon CDN, and do not redraw the cube.
