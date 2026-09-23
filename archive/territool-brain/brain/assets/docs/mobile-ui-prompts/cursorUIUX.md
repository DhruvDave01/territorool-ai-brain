---
area: design-library
tags: [brain/design-library]
ref: "TerriTool — UI & UX audit (cursorUIUX)"
---

# TerriTool — UI & UX audit (`cursorUIUX`)

**Date:** April 2026  
**Scope:** Full-app review with emphasis on **interface design**, **usability**, **feedback**, **consistency**, and **accessibility**. Based on static analysis of the React Native codebase (`App/`), shared styles, navigation, and representative screens.  
**Constraint:** **No code was modified** for this document; it is guidance only.

---

## Executive summary

TerriTool is a **feature-rich** field-sales product with a **strong visual foundation**: centralized `theme` tokens, gradient headers, dashboard cards, and modern modal/sheet patterns in several flows. The main UX risks are **inconsistent patterns** across very large screens, **artificial delays** and **heavy loading** paths that feel slower than necessary, **mixed feedback channels** (native alerts vs toasts vs inline text), **limited accessibility coverage** relative to app size, and **copy/grammar** issues that reduce trust.

**Overall:** Usable for power users; **onboarding clarity**, **predictable feedback**, and **accessibility** are the highest-leverage improvements for “easy to use.”

---

## What works well (keep investing here)

### Design tokens and shared styles

- **`App/styles/theme.js`** is a clear single source of truth: brand blues, semantic surfaces (`surfaceMuted`, `border`, `textPrimary`), publish-sheet palette, etc.
- **`App/styles/common.js`** documents intent (`screenContainer`, `mapStyle`) and shares buttons/modal patterns (`route_footer_button2`, close affordances).

### Navigation structure

- **`App/App.js`**: Native stack, **~40 screens**, **lazy-loaded** route components behind `Suspense` — good for cold start and mental separation of features.
- **Gesture rules** on sensitive flows (`gestureEnabled: false` on publish, lasso, find-leads map) reduce accidental exits.

### Header and brand

- **`customheader`**: Gradient bar, optional credits, back affordance — consistent “TerriTool” chrome on inner screens.

### Dashboard information architecture

- **`dashboard/index.js`**: Clear **card grid** with icons, primary/secondary labels (`bottom` / `subBottom`), and ribbons — users can scan “AI Find Leads” vs “Find Leads” vs “Routes” quickly.
- **`dashboard.styles.js`**: Sensible touch targets (e.g. header pills `minHeight: 48`), readable type scale.

### Targeted accessibility (where present)

- Examples: **Find Leads** map zoom labels, **city/zip clear** labels, **company list** tabs and clear search, **contacts view** status and actions, **AI Find Leads** checkbox/button roles.
- These prove the team can ship **VoiceOver/TalkBack–friendly** controls when prioritized.

### Map and complex flows

- **Clustering**, **lasso**, **active route** — appropriate for the domain; **map zoom** controls in find-leads improve discoverability vs pinch-only.

---

## Findings (by theme)

### 1. Perceived performance and “wait” UX

- **`findLeads/index.js`** and related flows use **`sleep(2000)`** (and similar) around API work. Users experience **fixed delays** even when the network is fast — this reads as a **slow app** rather than “careful loading.”
- Multiple **loader flags** (`nextStepLoader`, `selectAllMapLoader`, `Loader`, etc.) across screens — without a **single pattern** (skeleton vs full-screen spinner vs inline), users may be unsure **what is blocking** or whether the app froze.

**Recommendation:** Replace artificial sleeps with **real progress** (spinner tied to in-flight requests, optional skeleton rows). If delays exist for API quotas (e.g. Google `next_page_token`), show **one explicit message** (“Fetching more results…”) instead of a blind wait.

### 2. Feedback: Toast vs Alert vs inline

- **Toast** (`react-native-toast-message`) is used widely for success/error.
- **Alert.alert** appears across **dashboard, routes, lists, companies, lasso, find leads, AI find leads**, etc.

**UX impact:** Alerts **block interaction** and feel “system” rather than “app”; they interrupt multi-step flows (e.g. editing a route). Toasts are **easy to miss** for critical confirmations.

**Recommendation:** Define a **feedback matrix**: e.g. **destructive / irreversible** → modal or alert; **success snack** → toast; **field validation** → inline. Apply consistently per flow.

### 3. Forms, keyboard, and long screens

- **`KeyboardAvoidingView`** appears mainly in **login**, **register**, and **error** — not broadly across **create/edit** company, route, or list screens (many rely on **`react-native-keyboard-aware-scroll-view`** in places, but coverage is uneven).

**Risk:** On smaller phones, **primary actions** or **last fields** can sit under the keyboard.

**Recommendation:** Audit **top 10** data-entry screens (company create, route create/edit, contact create, AI find leads filters) for **keyboard + scroll + sticky primary CTA** behavior on iOS and Android.

### 4. Accessibility (a11y)

- Repository-wide, **`accessibilityLabel` / `accessibilityRole`** usage is **sparse** compared to **thousands** of `TouchableOpacity` / `Pressable` / icon-only buttons.
- **Maps** and **custom clustering** are inherently hard for screen readers; without **semantic summaries** (“12 results near Los Angeles”), map-first flows exclude some users.

**Recommendation:**  
- Icon-only controls: **every** icon button gets `accessibilityLabel` + `accessibilityHint` where the action isn’t obvious.  
- Lists: **`accessibilityRole="list"` / `header`** where applicable.  
- Loading: announce **“Loading” / “Loaded”** for major transitions where reasonable.

### 5. Copy, tone, and trust

- **Dashboard** default sync strings: *“Oops, We are **enable** to find.”* — likely meant **“unable”**; hurts **credibility** on first paint.
- Mix of **casual** (“Oops”) and **technical** messages — fine if intentional, but **inconsistent tone** can confuse enterprise users.

**Recommendation:** Single **copy pass** for **empty/error/offline** states; fix obvious typos; prefer **actionable** text (“Check connection” vs “Oops”).

### 6. Visual and pattern consistency

- **Inline styles** are very common next to `StyleSheet` — predictable for RN, but **large files** (`findLeads/index.js` ~7k lines, `aiFindLeads.js` ~7k lines) make **drift** likely: slightly different **border radius**, **padding**, or **gray** hex values between adjacent features.
- **Primary actions** sometimes use **`nearBlack`** footer buttons, sometimes gradient headers — generally OK, but **secondary** actions (text links vs ghost buttons) are not obviously systematized everywhere.

**Recommendation:** Extract **recurring** modal rows, **filter chips**, and **list row** layouts into small presentational components — not for “clean code” alone, but so **spacing and hit areas** stay aligned.

### 7. Information density and cognitive load

- **AI Find Leads** and **Find Leads (map)** are **power-user** surfaces: many filters, tabs, and modals. New users may not understand **when to use AI vs map** (dashboard helps, but **in-flow** explanation is thin).

**Recommendation:** **One-line context** on each entry screen (“Best for: …”) and **progressive disclosure** (advanced filters collapsed by default).

### 8. Discoverability

- **Credits** in header — good for monetization clarity.  
- **Filter** entry points differ by screen (modal, inline, separate screen) — users must **relearn** per feature.

**Recommendation:** **Same icon + position** for “Filter” where possible; **badge** when filters active.

### 9. Testing surface vs UX

- **`__tests__/App.test.tsx`** only checks **render** of `App` — no UI regression or interaction tests. **UX bugs** (keyboard overlap, broken tap targets) will rely on manual QA.

**Recommendation:** Add a **short critical-path** checklist (login, dashboard tile, open route, add company, find leads search) for releases; optional Detox/Appium later.

### 10. Developer-facing noise (indirect UX)

- **`console.log`** is **very frequent** in production paths (e.g. **findLeads**, **dashboard**, **API**). In dev builds this is fine; ensure **release** builds strip or gate logs so **performance** and **log noise** don’t affect debugging real UX issues.

---

## Priority matrix (suggested order)

| Priority | Item | User impact |
|----------|------|-------------|
| **P0** | Remove or replace **artificial `sleep`** delays with honest loading UX | Feels faster, less “broken” |
| **P0** | Fix **incorrect user-facing copy** (e.g. dashboard sync “enable” → “unable”) | Trust |
| **P1** | **Feedback matrix** (Alert vs Toast vs modal) for destructive vs informational | Fewer interruptions, clearer outcomes |
| **P1** | **Keyboard / scroll** audit on main forms | Less frustration on phones |
| **P2** | **Accessibility** pass on icon buttons and main lists | Inclusion + App Store posture |
| **P2** | **IA hints** (AI vs map find leads) | Faster learning curve |
| **P3** | **Componentize** repeated modal/list rows | Long-term consistency |

---

## Screens / areas worth dedicated UX review sessions

1. **Dashboard** — first-run, sync states, subscription messaging.  
2. **Find Leads (map)** — tabs, city/ZIP modals, map + list parity, loading.  
3. **AI Find Leads** — filter density, credit consumption clarity, result scannability.  
4. **Route create / edit / publish** — long flows, back navigation, confirmation.  
5. **Company list / view** — selection mode, filters, call/email actions.  
6. **Active route / waypoint** — map + list while driving/walking.  
7. **Login / register / subscribe** — error states, keyboard, paywall clarity.

---

## Closing note

The app already shows **intentional UI craft** (theme, dashboard, headers, several polished modals). The biggest wins for **“easy to use”** are **honest loading**, **consistent feedback**, **clean copy**, and **systematic a11y** on tappable elements — without requiring a visual redesign.

---

*Generated for Cursor / internal use. Filename: `cursorUIUX.md`.*

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (10)

**Documents (4):** [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/assets/docs/mobile-ui-prompts/cursorUIUX.gu|TerriTool — UI અને UX ઑડિટ (cursorUIUX)]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]]

**Code files (6):** [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/styles/common.js|common.js]] · [[_code/mobile/App/components/dashboard/dashboard.styles.js|dashboard.styles.js]] · [[_code/mobile/App/components/dashboard/index.js|dashboard/index.js]] · [[_code/mobile/App/components/findLeads/index.js|findLeads/index.js]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
