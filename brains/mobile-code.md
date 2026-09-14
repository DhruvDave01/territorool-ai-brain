# 1. Mobile Code Brain

Hub for the React Native app. Sibling: [Mobile UI Brain](mobile-ui.md) (how it looks) · [API Brain](api.md) (what it posts). Parent: [sub brains](README.md) · main vault [index.md](../index.md).

**Repo:** `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`  
**Do not cite the workspace folder as a source.**

## Read first

1. This file (rules).
2. [code/mobile-code-details.md](../code/mobile-code-details.md) — file map.
3. The screen you will edit under `App/components/`.
4. If the payload is new: [API Brain](api.md) then [data/formdata-dictionary.md](../data/formdata-dictionary.md).
5. If chrome/tokens: [Mobile UI Brain](mobile-ui.md), not this file.

Product behavior (credits, routes, AI save): [features/](../features/) and [09-credits-billing.md](../09-credits-billing.md). Lifecycle: [screens/how-it-works.md](../screens/how-it-works.md).

## Must follow

| Rule | Do this |
|------|---------|
| Screens | **Class** `Component` / `PureComponent` / `ValidationComponent`. Do not casually convert to hooks. |
| Nav | One flat stack in `App/App.js`. Register every screen. **No** nested navigators, bottom-tabs, or drawer. Footer is `CustomFooter`, not React Navigation tabs. |
| State | Class local + `App/utils/Global.js`. **No Redux.** |
| NativeBase | **Gone.** `App/utils/NativeBaseCompat.js` only. |
| API | `new FormData()` + `API.post(url, formdata, { navigation })`. JWT header. Keys from the dictionary — do not invent. |
| Config | **One file:** `App/config/index.js`. Prod vs staging = comment-swap `URL_BASE`. |
| Persist | Realm `App/storage/realm.js` (schemaVersion 18). JWT pk `"1"`. |
| Errors | `captureSentryError(screen, action)`. 401/403 → session logout. |
| Routes | `createroute` is not done until `simplerouteview` reports `route_status === "published"`. |

## Open first

| Task | File |
|------|--------|
| Register a screen | `App/App.js` |
| API constant | `App/config/index.js` then `App/utils/API.js` |
| Shared company sheet | `App/components/customcompany/index.js` |
| Cross-screen data | `App/utils/Global.js` |
| Theme tokens | `App/styles/theme.js` + co-located `*.styles.js` |
| Footer tabs | `CustomFooter` — index 1 Dashboard … 6 Settings ([appendix-c](../appendix-c-footer-tabs.md)) |

## Stack (live)

RN **0.84.1**, React **19.2.3**, Navigation 7.x, Realm **20.2.0**. Full table: [10-mobile-app.md](../10-mobile-app.md).

Entry: `index.js` → `init.js` → `App/App.js`. Dashboard is a **tile hub with no footer**.
