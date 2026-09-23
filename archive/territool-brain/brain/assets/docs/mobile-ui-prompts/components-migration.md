---
area: design-library
tags: [brain/design-library]
ref: "Components Migration Prompt"
---

# Components Migration Prompt

Apply the changes below to App/components/. Read each file before editing. Make only the described changes — no refactoring beyond what is listed.

---

## PRE-FLIGHT — Confirm these packages are installed

```bash
npm install react-native-toast-message react-native-autocomplete-input
```

`react-native-walkthrough-tooltip` and `react-native-copilot` are already in package.json — leave those imports alone.

---

## PHASE 1 — Global Find & Replace Rules (Apply to ALL files)

Run these replacements across the entire `App/components/` directory:

### 1A. Navigation imports

Search for files that contain:
```js
import { NavigationActions, StackActions } from "react-navigation";
```
Replace with:
```js
import { StackActions } from "@react-navigation/native";
```

Search for files that contain:
```js
import { withNavigation } from "react-navigation";
```
Replace with (function components only — see Phase 3 for specific handling):
```js
import { useNavigation } from "@react-navigation/native";
```

### 1B. navigation.getParam() → route.params

In every file, replace ALL occurrences of:
```js
this.props.navigation.getParam("KEY", DEFAULT)
// or
navigation.getParam("KEY", DEFAULT)
```
With (for class components):
```js
this.props.route.params?.KEY ?? DEFAULT
// or
(this.props.route.params?.KEY !== undefined ? this.props.route.params.KEY : DEFAULT)
```
And:
```js
this.props.navigation.state.params.X
```
With:
```js
this.props.route.params?.X
```

### 1C. willFocus → focus

```js
// OLD:
.addListener("willFocus", ...)
// NEW:
.addListener("focus", ...)
```

### 1D. prop-types — Remove

In all files:
- Remove: `import PropTypes from "prop-types";`
- Remove: the entire `static propTypes = { ... }` block
- Do NOT replace with TypeScript yet — just delete

### 1E. react-native-communications → Linking

In files: `company/create/index.js`, `company/list.js`

Remove:
```js
import Communications from "react-native-communications";
```
Add (if not already imported):
```js
import { Linking } from "react-native";
```
Replace usages:
```js
Communications.phonecall(number, true)  →  Linking.openURL(`tel:${number}`)
Communications.email([email], ...)      →  Linking.openURL(`mailto:${email}`)
Communications.text(number)             →  Linking.openURL(`sms:${number}`)
```

### 1F. react-native-easy-grid → View flex

In files: `company/edit.js`, `contacts/create.js`, `contacts/update.js`

Remove:
```js
import { Col, Row, Grid } from "react-native-easy-grid";
```
Replace in JSX:
```jsx
<Grid>...</Grid>  →  <View style={{ flexDirection: 'row', flex: 1 }}>...</View>
<Row>...</Row>    →  <View style={{ flexDirection: 'row' }}>...</View>
<Col size={N}>    →  <View style={{ flex: N }}>
```

---

## PHASE 2 — native-base Removal (File by File)

For each file below, remove all native-base imports and replace with the mappings listed in the audit.

### RULE: Standard native-base → RN replacements

Apply these in every file that imports from `"native-base"`:

```js
// REMOVE this import entirely:
import { Container, Header, Content, Text, Button, Icon, Left, Right,
  Body, StyleProvider, Toast, Spinner, ListItem, Input, Item, Form,
  Picker, Segment, Tab, Tabs, TabHeading, Footer, Thumbnail,
  Grid, Row, Col } from "native-base";

// ADD these (only the ones actually used in the file):
import { View, ScrollView, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Image, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import AppHeader from "../common/AppHeader";   // adjust relative path per file
import AppText from "../common/AppText";        // adjust relative path per file
import AppTabs from "../common/AppTabs";        // adjust relative path per file
```

**Then in JSX, apply these substitutions:**

| native-base JSX | Replacement JSX |
|---|---|
| `<Container>` | `<View style={{ flex: 1 }}>` |
| `<Content>` | `<ScrollView>` |
| `<Header>` | `<AppHeader .../>` |
| `<Footer>` | `<View style={{ flexDirection: 'row', paddingBottom: 8 }}>` |
| `<Body>` | `<View style={{ flex: 1 }}>` |
| `<Left>` | `<View>` |
| `<Right>` | `<View>` |
| `<StyleProvider>` | **Remove entirely** (no wrapper needed) |
| `<Text>` | `<Text>` (RN) or `<AppText>` |
| `<Button onPress={...}>` | `<TouchableOpacity onPress={...}>` |
| `<Icon name="arrow-back" />` | `<Text>{'<'}</Text>` or `<Text>←</Text>` |
| `<Icon name="arrow-forward" />` | `<Text>→</Text>` |
| `<Icon name="close" />` | `<Text>✕</Text>` |
| `<Icon name="menu" />` | `<Text>☰</Text>` |
| `<Icon name="search" />` | `<Text>🔍</Text>` |
| `<Icon name="add" />` | `<Text>+</Text>` |
| `<Icon name="..." />` | `<Text>{/* icon char */}</Text>` |
| `<Input value={x} onChangeText={y} />` | `<TextInput value={x} onChangeText={y} />` |
| `<Item>` (form row) | `<View>` |
| `<Form>` | `<View>` |
| `<ListItem>` | `<TouchableOpacity>` or `<View>` |
| `<Spinner />` | `<ActivityIndicator />` |
| `<Thumbnail source={x} />` | `<Image source={x} style={{ width: N, height: N, borderRadius: N/2 }} />` |
| `<Segment>` | `<View style={{ flexDirection: 'row' }}>` |
| `<Tab>` / `<Tabs>` | `<AppTabs>` |
| `<Grid>` | `<View style={{ flex: 1 }}>` |
| `<Row>` | `<View style={{ flexDirection: 'row' }}>` |
| `<Col size={N}>` | `<View style={{ flex: N }}>` |

**Toast replacement:**
```js
// OLD:
Toast.show({ text: "msg", type: "error", duration: 3000, position: "top" })
// NEW:
Toast.show({ type: "error", text1: "msg", visibilityTime: 3000, position: "top" })
// type map: danger → error, success → success, warning → info
```

### 2A. `activeroutemap/index.js`
- Remove all native-base imports
- Replace `Container`, `Header`, `Content`, `Text`, `Button`, `Icon`, `Toast`, `Spinner`, `Segment`, `Item`, `Input`, `Row`, `Col`, `Grid`, `ListItem` per table above
- Fix permissions: `request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)` → keep as-is, react-native-permissions v5 uses same import pattern
- Fix: `navigation.getParam("routeId", 0)` → `route.params?.routeId ?? 0`
- Fix: `navigation.getParam("from", "Route")` → `route.params?.from ?? "Route"`
- Fix: `navigation.getParam("aroundMeToolTip", false)` → `route.params?.aroundMeToolTip ?? false`

### 2B. `activeroutemap/waypointdetail.js`
- Remove all native-base imports
- Replace `Body`, `Button`, `Container`, `Header`, `Icon`, `Left`, `Right`, `StyleProvider`, `Text`, `Footer`
- Fix: `navigation.getParam("company_id", 0)` → `route.params?.company_id ?? 0`
- Fix: `navigation.getParam("route_id", 0)` → `route.params?.route_id ?? 0`
- Fix: `navigation.getParam("activeRouteData", "")` → `route.params?.activeRouteData ?? ""`
- Fix: `navigation.getParam("selectedCounter", 0)` → `route.params?.selectedCounter ?? 0`
- Fix: `navigation.getParam("from", "Route")` → `route.params?.from ?? "Route"`
- Fix: `this.props.navigation.state.params.showWaypointDetailUpdate()` → `this.props.route.params?.showWaypointDetailUpdate?.()`

### 2C. `company/create/index.js`
- Remove native-base imports
- Remove native-base-autocomplete: `import Autocomplete from "native-base-autocomplete"` → `import Autocomplete from "react-native-autocomplete-input"`
- Remove react-native-communications (replace with Linking per Phase 1E)
- Replace all native-base JSX components
- Fix all `navigation.getParam()` calls

### 2D. `company/edit.js`
- Remove native-base imports
- Remove native-base-autocomplete → `react-native-autocomplete-input`
- Remove react-native-easy-grid → View flex (per Phase 1F)
- Replace all native-base JSX components
- Fix all `navigation.getParam()` calls
- Remove prop-types

### 2E. `company/list.js`
- Remove native-base imports
- Remove native-base-autocomplete → `react-native-autocomplete-input`
- Remove react-native-communications → Linking (per Phase 1E)
- Replace all native-base JSX components
- Remove prop-types

### 2F. `company/view.js`
- Remove native-base imports
- Replace all native-base JSX components
- Fix all `navigation.getParam()` calls
- Remove prop-types

### 2G. `contacts/create.js`
- Remove native-base imports
- Remove native-base-autocomplete → `react-native-autocomplete-input`
- Remove react-native-easy-grid → View flex
- Replace all native-base JSX components
- Fix all `navigation.getParam()` calls

### 2H. `contacts/update.js`
- Remove native-base imports
- Remove native-base-autocomplete → `react-native-autocomplete-input`
- Remove react-native-easy-grid → View flex
- Replace all native-base JSX components

### 2I. `contacts/view.js`
- Remove native-base imports
- Replace all native-base JSX components
- Remove prop-types

### 2J. `customcompany/index.js` and `customcompany/index2.js`
- Remove native-base imports
- Replace all native-base JSX components
- Fix all `navigation.getParam()` calls
- Remove prop-types

### 2K. `customfooter/index.js`
- Remove: `import { Toast } from "native-base"`
- Add: `import Toast from "react-native-toast-message"`
- Replace all `Toast.show()` calls with new API
- Fix: `navigation.getParam()` calls → `route.params`

### 2L. `customheader/index.js`
- Remove: `import { Header, Left, Body, Right, Button, Icon, Text } from "native-base"`
- This component renders a custom header — rewrite it fully using `View`, `TouchableOpacity`, `Text` from react-native and `LinearGradient` (already imported)
- The entire component should produce the same visual output but using plain RN primitives

### 2M. `dashboard/editstatus.js`
- Remove all native-base imports
- Fix: `import { NavigationActions, StackActions } from "react-navigation"` → `import { StackActions } from "@react-navigation/native"`
- Replace all StackActions/NavigationActions usages
- Replace all native-base JSX components
- Fix all `navigation.getParam()` calls
- Fix: `navigation.addListener("willFocus", ...)` → `navigation.addListener("focus", ...)`

### 2N. `dashboard/index.js`
- Remove all native-base imports
- Fix: `import { NavigationActions, StackActions } from "react-navigation"` → `import { StackActions } from "@react-navigation/native"`
- Replace all StackActions/NavigationActions usages
- Replace all native-base JSX components
- Fix all `navigation.getParam()` calls

### 2O. `error/index.js`
- Remove: `import { Toast } from "native-base"` → `import Toast from "react-native-toast-message"`
- Remove native-base-autocomplete → `react-native-autocomplete-input`
- Replace all `Toast.show()` calls with new API

### 2P. `filterModule/index.js`
- Remove: `import { Container, StyleProvider } from "native-base"` → `View`
- Remove: `import { withNavigation } from "react-navigation"` → `import { useNavigation } from "@react-navigation/native"`
- Remove native-base-autocomplete → `react-native-autocomplete-input`
- Convert class component to function component if needed (to use `useNavigation`), OR pass `navigation` as prop from parent
- Fix: `this.props.navigation.addListener("focus", ...)` → use hook `useEffect` with navigation.addListener

### 2Q. `findLeads/aiFindLeads.js`
- Remove all native-base imports
- Fix: `import { NavigationActions, StackActions } from "react-navigation"` → `import { StackActions } from "@react-navigation/native"`
- Remove native-base-autocomplete → `react-native-autocomplete-input`
- Replace all native-base JSX components
- Fix all NavigationActions/StackActions usages

### 2R. `findLeads/index.js`
- Same as 2Q — remove native-base, navigation v4, native-base-autocomplete

### 2S. `list/basic/index.js`
- Remove: `import { Container, StyleProvider } from "native-base"` → `View`
- Remove: `import { withNavigation } from "react-navigation"` → `import { useNavigation } from "@react-navigation/native"`
- Remove native-base-autocomplete → `react-native-autocomplete-input`
- Same withNavigation conversion as filterModule (2P)

### 2T. `list/create.js`, `list/edit.js`, `list/filter.js`
- Fix all `navigation.getParam()` → `route.params`
- Fix NavigationActions in edit.js: `import { NavigationActions } from "react-navigation"` → remove, use `navigation.navigate()` directly
- Remove any native-base imports

### 2U. `login/index.js`
- Remove all native-base imports
- Fix: `import { NavigationActions, StackActions } from "react-navigation"` → `import { StackActions } from "@react-navigation/native"`
- Fix: `this.props.navigation.addListener("willFocus", ...)` → `this.props.navigation.addListener("focus", ...)`
- Replace all native-base JSX components
- **Keep**: `react-native-walkthrough-tooltip` and `react-native-copilot` — these are still in package.json

### 2V. `register/index.js`
- Remove all native-base imports
- Replace all native-base JSX components
- **Keep**: `react-native-walkthrough-tooltip`

### 2W. `route/basic/index.js`, `route/basic/company-view.js`
- Fix all `navigation.getParam()` → `route.params`
- Fix NavigationActions if present
- Remove native-base if present
- **Keep**: `react-native-walkthrough-tooltip`

### 2X. `route/bizContact/bizCompanies.js`, `route/bizContact/index.js`
- Fix all `navigation.getParam()` → `route.params`
- Remove native-base if present
- **Keep**: `react-native-walkthrough-tooltip`

### 2Y. `route/congContact/index.js`
- Fix: NavigationActions → `import { StackActions } from "@react-navigation/native"`
- Fix all `navigation.getParam()` → `route.params`
- **Keep**: `react-native-walkthrough-tooltip`

### 2Z. `route/create.js`, `route/create/publish-route.js`, `route/create/select-start-end-points.js`
- Fix all `navigation.getParam()` → `route.params`
- Fix NavigationActions in publish-route.js
- Remove native-base if present
- **Keep**: `react-native-walkthrough-tooltip`

### 2AA. `route/edit.js`
- Remove all native-base imports
- Fix: NavigationActions → `import { StackActions } from "@react-navigation/native"`
- Remove native-base-autocomplete → `react-native-autocomplete-input`
- Replace all native-base JSX components
- Fix all `navigation.getParam()` → `route.params`
- **Keep**: `react-native-walkthrough-tooltip`

### 2AB. `route/edit/edit-publish-route.js`, `route/edit/edit-select-start-end-points.js`
- Fix NavigationActions in edit-publish-route.js
- Fix all `navigation.getParam()` → `route.params`
- **Keep**: `react-native-walkthrough-tooltip`

### 2AC. `route/index.js`
- Remove all native-base imports
- Fix: `import { NavigationActions, StackActions } from "react-navigation"` → `import { StackActions } from "@react-navigation/native"`
- Replace all native-base JSX components
- Fix NavigationActions/StackActions usages

### 2AD. `route/lassoMap.js`, `route/filter.js`
- Fix all `navigation.getParam()` → `route.params`
- Remove native-base if present

---

## PHASE 3 — withNavigation HOC Conversion

**Files:** `filterModule/index.js`, `list/basic/index.js`

These use `withNavigation` which does not exist in `@react-navigation/native` v7.

**Option A — Convert to function component (preferred):**
```js
// OLD:
import { withNavigation } from "react-navigation";
class MyComponent extends React.Component {
  componentDidMount() {
    this.props.navigation.addListener("focus", this.onFocus);
  }
}
export default withNavigation(MyComponent);

// NEW:
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
function MyComponent(props) {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", onFocus);
    return unsubscribe;
  }, [navigation]);
}
export default MyComponent;
```

**Option B — Pass navigation as prop from parent (if class component is complex to convert):**
```js
// In parent (App.js screen), the navigation prop is automatically passed:
<Stack.Screen name="FilterModule" component={FilterModule} />
// FilterModule already receives this.props.navigation from the stack

// Just remove withNavigation wrapper and use this.props.navigation directly
// Remove: export default withNavigation(FilterModule);
// Add: export default FilterModule;
```

> Use Option B if the component is large and has many lifecycle methods.

---

## PHASE 4 — Verification

After all changes, run these grep checks. Each should return NO output:

```bash
# No native-base remaining
grep -r "from \"native-base\"" App/components/ --include="*.js"
grep -r "from 'native-base'" App/components/ --include="*.js"

# No native-base-autocomplete remaining
grep -r "native-base-autocomplete" App/components/ --include="*.js"

# No old navigation imports remaining
grep -r "from \"react-navigation\"" App/components/ --include="*.js"

# No getParam remaining
grep -r "\.getParam(" App/components/ --include="*.js"

# No react-native-easy-grid remaining
grep -r "react-native-easy-grid" App/components/ --include="*.js"

# No react-native-communications remaining
grep -r "react-native-communications" App/components/ --include="*.js"

# No withNavigation remaining
grep -r "withNavigation" App/components/ --include="*.js"

# No willFocus remaining
grep -r "willFocus" App/components/ --include="*.js"
```

Then run:
```bash
npx react-native start --reset-cache
npx react-native run-ios
```

---

## Files Left Untouched

These are already correct — do NOT modify:
- `App/components/common/AppHeader.js`
- `App/components/common/AppTabs.js`
- `App/components/common/AppText.js`
- `App/components/toast/ToastContext.js`

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (41)

**Documents (4):** [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[brain/assets/docs/mobile-ui-prompts/fix-native-base-theme|Fix: Unable to resolve module native-base-theme]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]]

**Code files (37):** [[_code/mobile/App/components/activeroutemap/index.js|activeroutemap/index.js]] · [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/components/list/basic/index.js|basic/index.js]] · [[_code/mobile/App/components/route/basic/index.js|basic/index.js]] · [[_code/mobile/App/components/route/bizContact/bizCompanies.js|bizCompanies.js]] · [[_code/mobile/App/components/route/bizContact/index.js|bizContact/index.js]] · [[_code/mobile/App/components/route/basic/company-view.js|company-view.js]] · [[_code/mobile/App/components/route/congContact/index.js|congContact/index.js]] · [[_code/mobile/App/components/contacts/create.js|create.js]] · [[_code/mobile/App/components/list/create.js|create.js]] · [[_code/mobile/App/components/route/create.js|create.js]] · [[_code/mobile/App/components/company/create/index.js|create/index.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/mobile/App/components/customfooter/index.js|customfooter/index.js]] · [[_code/mobile/App/components/customheader/index.js|customheader/index.js]] · [[_code/mobile/App/components/dashboard/index.js|dashboard/index.js]] · [[_code/mobile/App/components/route/edit/edit-publish-route.js|edit-publish-route.js]] · [[_code/mobile/App/components/route/edit/edit-select-start-end-points.js|edit-select-start-end-points.js]] · [[_code/mobile/App/components/company/edit.js|edit.js]] · [[_code/mobile/App/components/list/edit.js|edit.js]] · [[_code/mobile/App/components/route/edit.js|edit.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/components/error/index.js|error/index.js]] · [[_code/mobile/App/components/list/filter.js|filter.js]] · [[_code/mobile/App/components/route/filter.js|filter.js]] · [[_code/mobile/App/components/filterModule/index.js|filterModule/index.js]] · [[_code/mobile/App/components/findLeads/index.js|findLeads/index.js]] · [[_code/mobile/App/components/route/lassoMap.js|lassoMap.js]] · [[_code/mobile/App/components/company/list.js|list.js]] · [[_code/mobile/App/components/login/index.js|login/index.js]] · [[_code/mobile/App/components/route/create/publish-route.js|publish-route.js]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/mobile/App/components/route/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/components/contacts/update.js|update.js]] · [[_code/mobile/App/components/company/view.js|view.js]] · [[_code/mobile/App/components/contacts/view.js|view.js]] · [[_code/mobile/App/components/activeroutemap/waypointdetail.js|waypointdetail.js]]

%% brain-links:end %%
