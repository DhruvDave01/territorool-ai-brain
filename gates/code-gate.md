# Code gate

Run this before calling new code done. Reviews: [mobile](../code/mobile-review.md), [web](../code/web-review.md).

| Check | Pass when |
|---|---|
| Repo | Mobile edits are under `TerriTool/`. Web edits are under `webterritool/`. |
| Mobile screen | Class component, registered in `App/App.js`, calls `API.post` with FormData. Voice Mode is the one exception: its screens are function components on `useVoice()`, and its calls go through `App/voice/voiceApi.js` as JSON. |
| Realm | A table change raises `schemaVersion` in all three places in `App/storage/realm.js`. It is 19 on 2026-09-29. |
| Mobile URL | Uses a constant from `App/config/index.js`. Base stays staging unless the task says otherwise. |
| Web route | Added in the classic, `manager`, or `hq` group that matches the page |
| Web controller | Companies use `CompanylController`. Manager uses `App\Http\Controllers\Manager`. |
| Web stack | Blade page does not import manager-portal CSS. Manager page does not add an AdminLTE widget set. |
| PHP | Compatible with Laravel 5.3.31 and PHP 7.2 |
| API | New mobile path is inside `routes/api.php` v2, and JWT routes sit in the `jwt.refresh` group. Existing paths were looked up in [API endpoints](../brains/api-endpoints.md) |
| Fonts | Mobile text uses `theme.font.dinBold` or `theme.font.dinLight` (or a `theme.typography` entry). No `fontFamily` string literal, no Inter |
| States | Loading `testID="screen.<key>.loading"`, and empty and error copy from the feature page's Screens block |
| Credits | Search 0, save AI lead 1, buy contact 2 or 1 as in `contactBuyCredits.js` |
| Scope | No drive-by rewrite of an unrelated controller, and the commented v1 API block stays commented |
| Mobile checks ran | `yarn lint` passes on the touched files. `npx jest` ran if a test under `__tests__` covers the area. A Maestro flow from `.maestro/` ran on the simulator when login, register, or onboarding changed (`yarn maestro:login:staging:ios`, `yarn maestro:register:staging:ios`). When `App/voice/` or `App/components/voice/` changed: `./node_modules/.bin/jest __tests__/voiceSession.test.js qa/voiceSession.regression.test.js --runInBand` and `.maestro/voice-mode-ios.yaml` (or `voice-mode-android.yaml`). Only the `qa/` test is committed; `.gitignore` excludes `__tests__`, so the first file exists only on the machine that wrote it. Speech itself is checked by hand. |
| Web checks ran | `vendor/bin/phpunit` ran on the matching test in `tests/` (12 files, manager dashboard and Find Leads services among them). `npm run build` succeeded when any file under `resources/manager-portal/` changed |
| Behavior exercised | The changed screen or control was opened and used once, and the result was recorded with the [evidence collector](../methods/evidence-collector.md) |
| Unverified named | Anything that could not be run is listed by name in the handoff with the reason. A missing simulator or an old PHP is a reason, not a pass |
