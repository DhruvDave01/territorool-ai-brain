# 4. Style guide

Related: [05-constraints-and-drift](05-constraints-and-drift.md) · [10-mobile-app](10-mobile-app.md) · [11-web-backend](11-web-backend.md)

## 4.1 Mobile

| Rule | Do this |
|------|---------|
| Components | Almost all **class** `Component` / `PureComponent` / `ValidationComponent`. Do not casually convert screens to hooks. |
| NativeBase | **Removed.** Use `App/utils/NativeBaseCompat.js`. Do not add `native-base`. |
| API | `new FormData()` + `API.post(url, formdata, { navigation })`. Never skip JWT. |
| Shared state | `Global.js` static getters/setters. No Redux. |
| Persistence | Realm via `App/storage/realm.js` (+ `fcmrealm.js`). JWT pk `"1"`. |
| Files | Feature folder + `index.js`. Co-located `*.styles.js`. Tokens in `App/styles/theme.js`. Shared helpers in `App/styles/common.js` (`fontS26`, `flx1`, `padT20`, …). |
| Names | `URL_*` endpoints, `COLOR_*` colors, PascalCase screens, camelCase utils, `_prefix` private Global fields. |
| Errors | `captureSentryError(screen, action)`. 401/403 → session logout. |
| testIDs | `screen.*`, `footer.*`, `modal.*` |
| Lists | `keyExtractor`; `PureComponent` row; RecyclerListView for large lists. |
| Patches | `patch-package` postinstall. |
| Config | **One file:** `App/config/index.js`. Prod vs staging = comment-swap `URL_BASE`. No `.env` flavor matrix. |
| Nav | Register every screen in `App/App.js`. Do not introduce nested navigators. |
| Comments | Only when the why is non-obvious. |

**Color drift:** `Prompts/TerriTool_OverView.md` cites teal `#12A090`; live `App/styles/theme.js` primary is `#124ac6` (`boldActive` still `#12A090`). Prefer the live theme file.

**Visual tokens / chrome:** [design/MINI-DESIGN-BRAIN.md](design/MINI-DESIGN-BRAIN.md). Primary `#124ac6`, DIN Condensed, gradient header + 25pt `#F6F7FB` body, `AppConfirmModal` not native `Alert`. Do not normalize mixed teals or the two danger reds (`#E94A5D` vs `#CF5B51`).

## 4.2 Web

| Rule | Do this |
|------|---------|
| PHP | Laravel 7 style. Giant controllers are the norm (`CompanylController` is spelled with the extra **l**). New company/lead/contact work often lands there — be surgical. |
| Helpers | Autoloaded `app/Helpers/helpers.php` → `App\Helpers\Helper`. Do not confuse with `App\Globals\Helper`. |
| Requests | CompanylController aliases `Request AS INPUT_REQUEST`. |
| Front (classic) | Blade + **jQuery 2.2.0** + Bootstrap 3 AdminLTE. AJAX often `FormData` with `contentType: false`, `processData: false`. New pages `@extends('front.layout')`. |
| Front (manager) | Vite + React 18 **islands** + CSS vars (`--blue: #124ac6`, `--teal: #00a99d`, radius 14, DM Sans / Space Grotesk). Do not add a new AdminLTE page. Vite lists Bootstrap 5; islands do **not** import it. |
| Tables | Find Leads + Address Book use **jqxGrid**. Routes/lists index use DataTables. |
| Chrome / tokens | [design-web/MINI-DESIGN-BRAIN.md](design-web/MINI-DESIGN-BRAIN.md). Do not average classic leftover teal `#16aa9d` with manager `--teal`. Do not “modernize” AdminLTE. |
| MCP | Short tool names/descriptions (ChatGPT ~5000 token catalog). Dispatch API; do not fork credit math. |
| Roles | Spatie `HasRoles` on `User`. Manager scope = self + `parent_id`. |
| Migrations | Do not assume greenfield migrate is enough. |

## 4.3 Agents (Cursor / Claude / voice)

- Never invent leads, routes, credits, or company IDs.
- Prefer screen/session context over re-asking.
- Credit spend: `get_credits` → quote cost → wait for explicit yes. [09-credits-billing.md](09-credits-billing.md)
- Cap save/route at **100** companies per action (trial save cap **60** on package id 1).
- Voice: ≤ 2 spoken sentences, no markdown/lists. [15-voice-policy.md](15-voice-policy.md)
- Coding agents: match the file’s existing pattern; do not “modernize” class screens or Blade pages unless asked. Web chrome: [design-web/MINI-DESIGN-BRAIN.md](design-web/MINI-DESIGN-BRAIN.md).
