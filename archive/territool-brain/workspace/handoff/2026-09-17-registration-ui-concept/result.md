# Registration UI concept — web and mobile

User requested a modern registration UI mockup for both platforms, with no code changes.

Design direction: approved blue palette, DIN typography, compact existing brand mark, clearer progress, selected goal cards with checkmarks, permanent form labels, and generous spacing. Desktop goal selection and mobile goal/account screens are the concept scope, not the entire onboarding flow.

References:
- `brain/assets/screenshots/web/public/web_auth_02_register_w1440.png`: web goals, five choices, step 1 of 3.
- `brain/assets/screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.00.png`: mobile goals, five choices, step 1 of 6.
- `brain/assets/screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.28.18.png`: mobile account fields, step 4 of 6.
- `brain/assets/brand/logos/mobile/TT_NO_BG.png`: approved logo reference.
- `brain/context/design-system.md`, `brain/assets/tokens/tt-tokens.css`, `brain/assets/tokens/tokens.js`, `brain/assets/tokens/fonts.css`: palette and typography specifications.

Generation uses built-in imagegen. Raster typography and color matching are illustrative, not implementation-verified. Proposed marketing copy is design copy, not an owner-approved product requirement. Existing goal choices, field set and separate platform step counts are specified in the generation prompt. No new authentication methods are proposed. Developer-only crash and subscription-preview buttons are excluded from the customer-facing concept.

F02 evidence score: `node tools/brain-score.js --feature F02`, exit 0, 70/100, three linked problems. Read known-fragile F02 entries; no fixes attempted.

Application code unchanged. No app launched, credentials used or registration submitted. Runtime QA: NOT RUN; design concept only, no QA PASS claimed.

Output: `registration-concept.png` alongside this report. Visually reviewed: all five goals are present on each goals screen; account fields, login/legal links, and platform step counts are present. The generated browser address is illustrative, not a verified route or accessed endpoint. Exact token color/font fidelity requires an eventual code implementation.

Prompt summary (built-in imagegen): Create a wide high-fidelity TerriTool registration board with a desktop goals view and two mobile views (goals and account creation); use the four listed screenshot/logo references, approved blue/neutral tokens and DIN families; preserve five goals, web step 1/3, mobile step 1/6 and account step 4/6, existing account fields and legal links; modernize hierarchy, spacing, selected cards and labels; no external assets, invented social login, testimonials, trial promises or developer-only controls.
