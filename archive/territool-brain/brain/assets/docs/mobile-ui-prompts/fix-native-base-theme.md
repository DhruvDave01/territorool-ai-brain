---
area: design-library
tags: [brain/design-library]
ref: "Fix: Unable to resolve module native-base-theme"
---

# Fix: Unable to resolve module native-base-theme

## Root Cause

`native-base` v2 shipped a CLI command (`react-native-theme-eject`) that copied theme files into your project at `<root>/native-base-theme/`. These files were **never committed** to this repo but **32 component files** still import from them:

```js
import getTheme from "../../../native-base-theme/components";
import styles  from "../../../native-base-theme/components/common";
import platform from "../../../native-base-theme/variables/platform";
import material from "../../../native-base-theme/variables/material";
```

Since `native-base` is no longer installed and the theme folder is missing, Metro cannot bundle the app at all.

---

## All 32 Affected Files

```
App/components/activeroutemap/waypointdetail.js
App/components/company/create/index.js
App/components/company/view.js
App/components/contacts/view.js
App/components/dashboard/editstatus.js
App/components/dashboard/index.js
App/components/error/index.js
App/components/findLeads/aiFindLeads.js
App/components/findLeads/index.js
App/components/list/basic/index.js
App/components/list/create.js
App/components/list/create/select-start-end-points.js
App/components/list/edit.js
App/components/list/filter.js
App/components/list/index.js
App/components/login/index.js
App/components/register/index.js
App/components/register/index_register_split.js
App/components/route/basic/company-view.js
App/components/route/basic/index.js
App/components/route/bizContact/bizCompanies.js
App/components/route/bizContact/index.js
App/components/route/congContact/index.js
App/components/route/create.js
App/components/route/create/publish-route.js
App/components/route/create/select-start-end-points.js
App/components/route/edit.js
App/components/route/edit/edit-publish-route.js
App/components/route/edit/edit-select-start-end-points.js
App/components/route/filter.js
App/components/route/index.js
App/components/route/lassoMap.js
```

---

## OPTION A — Immediate Fix (Unblocks Metro in 2 minutes)

Create 4 stub files at the project root. Metro will resolve the imports and the app will boot. Styles from these stubs will be empty objects (RN ignores undefined style values gracefully).

Create these 4 files:

**File 1: `/native-base-theme/variables/platform.js`**
```js
export default {};
```

**File 2: `/native-base-theme/variables/material.js`**
```js
export default {};
```

**File 3: `/native-base-theme/components/index.js`**
```js
// getTheme() was used as: <StyleProvider style={getTheme(platform)}>
// StyleProvider will be removed — returning empty object is safe
const getTheme = () => ({});
export default getTheme;
```

**File 4: `/native-base-theme/components/common.js`**
```js
// styles from common were layout/typography helpers
// Returning empty object — RN ignores undefined style values
export default {};
```

Then restart Metro:
```bash
npx react-native start --reset-cache
```

> The app will boot. Components using `styles.X` from common will lose those specific styles (they'll be unstyled) until you apply Option B below.

---

## OPTION B — Proper Fix (Remove All native-base-theme Imports)

Do this for EVERY file in the list above. For each file:

### Step 1 — Remove these 3 import lines (whichever exist in that file):
```js
import getTheme from "X/native-base-theme/components";
import styles  from "X/native-base-theme/components/common";
import platform from "X/native-base-theme/variables/platform";
import material from "X/native-base-theme/variables/material";
```
where `X` is `../../../` or `../../../../` depending on the file depth.

### Step 2 — Remove `StyleProvider` wrapper

Find the render/return method. Remove the `<StyleProvider>` opening and closing tags, keeping all children:

```jsx
// REMOVE:
<StyleProvider style={getTheme(platform)}>
  {/* children */}
</StyleProvider>

// KEEP (just the children, unwrapped):
{/* children */}
```

Also remove `StyleProvider` from the native-base import list at the top of the file.

### Step 3 — Handle `styles` from common

After removing the common import, check if the file has its own `const styles = StyleSheet.create({...})` block at the bottom:

- **If yes**: The local StyleSheet is already named `styles` — it was shadowing the import. The component-specific styles are defined there and are correct. No further action needed.
- **If no** (file only had styles from common): The component will be unstyled. You need to create a local `StyleSheet.create({})` with the styles used in that file, or copy the common styles you need inline.

---

## Per-File Instructions

### Files that import `platform` only (no getTheme, no styles from common)

Just remove the import line. No other changes needed.

```
App/components/dashboard/editstatus.js     → remove: import platform from ...
App/components/dashboard/index.js          → remove: import platform from ...
App/components/findLeads/aiFindLeads.js    → remove: import platform from ...
App/components/findLeads/index.js          → remove: import platform from ...
App/components/list/basic/index.js         → remove: import platform from ...
```

### Files that import `getTheme` + `platform` + use `StyleProvider`

Remove all 3 imports AND remove `<StyleProvider>` wrapper:

```
App/components/activeroutemap/waypointdetail.js
App/components/company/view.js
App/components/contacts/view.js
App/components/error/index.js
App/components/list/edit.js
App/components/list/filter.js
App/components/list/index.js
App/components/list/create.js
App/components/login/index.js
App/components/register/index.js
App/components/register/index_register_split.js
App/components/route/basic/index.js
App/components/route/bizContact/bizCompanies.js
App/components/route/bizContact/index.js
App/components/route/congContact/index.js
App/components/route/create.js
App/components/route/edit.js
App/components/route/edit/edit-select-start-end-points.js
App/components/route/filter.js
App/components/route/index.js
App/components/route/lassoMap.js
```

### Files that import `getTheme` + `material` (not platform) + use `StyleProvider`

Same removal, but the variable is `material` instead of `platform`:

```
App/components/list/create/select-start-end-points.js
App/components/route/basic/company-view.js
App/components/route/create/publish-route.js
App/components/route/create/select-start-end-points.js
App/components/route/edit/edit-publish-route.js
```

### Files that import both `styles from common` + `getTheme` + `platform`

These additionally had shared styles from common. After removal, verify the file has its own `const styles = StyleSheet.create(...)`:

```
App/components/company/create/index.js
App/components/company/view.js
App/components/contacts/view.js
App/components/error/index.js
App/components/list/filter.js
App/components/activeroutemap/waypointdetail.js
```

---

## Verification

After applying Option B, run:

```bash
# Should return NO output
grep -r "native-base-theme" App/ --include="*.js"

# Should return NO output
grep -r "StyleProvider" App/ --include="*.js"

# Should return NO output
grep -r "getTheme" App/ --include="*.js"
```

Then:
```bash
npx react-native start --reset-cache
npx react-native run-ios
```

---

## Recommended Order

1. Apply **Option A** right now → app boots, you can see it running
2. Apply **Option B** file by file alongside the full components migration in `components-migration.md`
3. Once Option B is complete, delete the `/native-base-theme/` stub folder

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (5)

**Documents (4):** [[brain/assets/docs/mobile-ui-prompts/components-migration|Components Migration Prompt]] · [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]]

**Code file (1):** [[_code/mobile/App/styles/common.js|common.js]]

%% brain-links:end %%
