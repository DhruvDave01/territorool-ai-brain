---
area: design-library
tags: [brain/design-library]
ref: "App/components/ Migration Audit"
---

# App/components/ Migration Audit

> Audited against package.json (RN 0.84.1). Components already have modern replacements at App/components/common/.

---

## Quick Reference — File × Issue Matrix

| File | native-base | native-base-autocomplete | react-navigation v4 | react-native-easy-grid | react-native-communications | prop-types |
|---|---|---|---|---|---|---|
| activeroutemap/index.js | ✅ Many | ❌ | getParam + permissions | ❌ | ❌ | ✅ |
| activeroutemap/waypointdetail.js | ✅ Many | ❌ | getParam + state.params | ❌ | ❌ | ✅ |
| company/create/index.js | ✅ Many | ✅ | getParam | ❌ | ✅ | ❌ |
| company/edit.js | ✅ Many | ✅ | getParam | ✅ | ❌ | ✅ |
| company/list.js | ✅ Many | ✅ | getParam | ❌ | ✅ | ✅ |
| company/view.js | ✅ Many | ❌ | getParam | ❌ | ❌ | ✅ |
| contacts/create.js | ✅ Many | ✅ | getParam | ✅ | ❌ | ❌ |
| contacts/update.js | ✅ Many | ✅ | getParam | ✅ | ❌ | ❌ |
| contacts/view.js | ✅ Many | ❌ | ❌ | ❌ | ❌ | ✅ |
| customcompany/index.js | ✅ Many | ❌ | getParam | ❌ | ❌ | ✅ |
| customcompany/index2.js | ✅ Many | ❌ | getParam | ❌ | ❌ | ✅ |
| customfooter/index.js | ✅ Toast | ❌ | getParam | ❌ | ❌ | ❌ |
| customheader/index.js | ✅ Layout | ❌ | ❌ | ❌ | ❌ | ❌ |
| dashboard/editstatus.js | ✅ Many | ❌ | getParam + NavActions | ❌ | ❌ | ❌ |
| dashboard/index.js | ✅ Many | ❌ | getParam + NavActions | ❌ | ❌ | ❌ |
| error/index.js | ✅ Toast | ✅ | ❌ | ❌ | ❌ | ❌ |
| filterModule/index.js | ✅ Layout | ✅ | withNavigation HOC | ❌ | ❌ | ❌ |
| findLeads/aiFindLeads.js | ✅ Many | ✅ | NavActions | ❌ | ❌ | ❌ |
| findLeads/index.js | ✅ Many | ✅ | NavActions | ❌ | ❌ | ❌ |
| list/basic/index.js | ✅ Layout | ✅ | withNavigation HOC | ❌ | ❌ | ❌ |
| list/create.js | likely | ❌ | getParam | ❌ | ❌ | ❌ |
| list/edit.js | likely | ❌ | NavActions + getParam | ❌ | ❌ | ❌ |
| list/filter.js | likely | ❌ | ❌ | ❌ | ❌ | ❌ |
| login/index.js | ✅ Many | ❌ | NavActions + willFocus | ❌ | ❌ | ❌ |
| register/index.js | ✅ Many | ❌ | getParam | ❌ | ❌ | ❌ |
| route/basic/index.js | likely | ❌ | NavActions + getParam | ❌ | ❌ | ❌ |
| route/basic/company-view.js | likely | ❌ | getParam | ❌ | ❌ | ❌ |
| route/bizContact/bizCompanies.js | likely | ❌ | getParam | ❌ | ❌ | ❌ |
| route/bizContact/index.js | likely | ❌ | getParam | ❌ | ❌ | ❌ |
| route/congContact/index.js | likely | ❌ | NavActions + getParam | ❌ | ❌ | ❌ |
| route/create.js | likely | ❌ | getParam | ❌ | ❌ | ❌ |
| route/create/publish-route.js | likely | ❌ | NavActions | ❌ | ❌ | ❌ |
| route/create/select-start-end-points.js | likely | ❌ | getParam | ❌ | ❌ | ❌ |
| route/edit.js | ✅ Many | ✅ | NavActions + getParam | ❌ | ❌ | ❌ |
| route/edit/edit-publish-route.js | likely | ❌ | NavActions | ❌ | ❌ | ❌ |
| route/edit/edit-select-start-end-points.js | likely | ❌ | getParam | ❌ | ❌ | ❌ |
| route/filter.js | likely | ❌ | ❌ | ❌ | ❌ | ❌ |
| route/index.js | ✅ Many | ❌ | NavActions | ❌ | ❌ | ❌ |
| route/lassoMap.js | likely | ❌ | getParam | ❌ | ❌ | ❌ |

**✅ OK (no changes needed):**
- common/AppHeader.js
- common/AppTabs.js
- common/AppText.js
- toast/ToastContext.js

---

## Global Replacement Rules

### 1. native-base → React Native / Custom

| native-base | Replace With | Notes |
|---|---|---|
| `Container` | `View` | Add `style={{ flex: 1 }}` |
| `Content` | `ScrollView` | Import from `react-native` |
| `Header` | `<AppHeader />` | Already at `App/components/common/AppHeader.js` |
| `Footer` | `View` | Add `style={{ flexDirection: 'row' }}` |
| `Body` | `View` | Add `style={{ flex: 1 }}` |
| `Left` | `View` | |
| `Right` | `View` | |
| `Text` | `<AppText />` | Already at `App/components/common/AppText.js` — or `Text` from RN |
| `Button` | `TouchableOpacity` | |
| `Icon` | Text emoji or `react-native-vector-icons` | See icon mapping below |
| `Input` | `TextInput` | Import from `react-native` |
| `Item` (form row) | `View` | |
| `Form` | `View` | |
| `ListItem` | `TouchableOpacity` or `View` | |
| `Spinner` | `ActivityIndicator` | Import from `react-native` |
| `Toast` | `react-native-toast-message` | See toast API below |
| `Picker` | `Picker` from `@react-native-picker/picker` | |
| `Tab`, `Tabs`, `TabHeading` | `<AppTabs />` | Already at `App/components/common/AppTabs.js` |
| `Segment` | Custom `View` with row buttons | |
| `Thumbnail` | `Image` | Import from `react-native` |
| `Grid` | `View` with `flexDirection: 'row'` | |
| `Row` | `View` with `flexDirection: 'row'` | |
| `Col` | `View` with `flex: N` | |
| `StyleProvider` | **Remove entirely** | Not needed |

### Toast API Change
```js
// OLD native-base:
Toast.show({ text: "...", type: "error", buttonText: "OK", duration: 3000, position: "top" })
// NEW react-native-toast-message:
Toast.show({ type: "error", text1: "...", visibilityTime: 3000, position: "top" })
// type mapping: "danger" → "error", "success" → "success", "warning" → "info"
```

### 2. native-base-autocomplete → react-native-autocomplete-input

```js
// OLD:
import Autocomplete from "native-base-autocomplete";
// NEW:
import Autocomplete from "react-native-autocomplete-input";
// API is similar but check prop names — data, onChangeText, renderItem, etc.
```

### 3. react-native-easy-grid → View flex

```js
// OLD:
import { Grid, Row, Col } from "react-native-easy-grid";
<Grid><Row><Col size={2}>...</Col><Col size={1}>...</Col></Row></Grid>
// NEW:
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 2 }}>...</View>
  <View style={{ flex: 1 }}>...</View>
</View>
```

### 4. react-native-communications → Linking

```js
// OLD:
import Communications from "react-native-communications";
Communications.phonecall("1234567890", true);
Communications.email(["to@example.com"], null, null, "subject", "body");
Communications.text("1234567890");
// NEW:
import { Linking } from "react-native";
Linking.openURL("tel:1234567890");
Linking.openURL("mailto:to@example.com?subject=subject&body=body");
Linking.openURL("sms:1234567890");
```

### 5. Navigation — getParam → route.params

```js
// OLD (class component):
const routeId = this.props.navigation.getParam("routeId", 0);
// NEW (class component):
const routeId = this.props.route.params?.routeId ?? 0;
// NEW (function component):
const { routeId = 0 } = route.params ?? {};
```

### 6. Navigation — NavigationActions / StackActions

```js
// OLD:
import { NavigationActions, StackActions } from "react-navigation";
const resetAction = StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: "Login" })] });
this.props.navigation.dispatch(resetAction);
// NEW:
import { StackActions } from "@react-navigation/native";
this.props.navigation.reset({ index: 0, routes: [{ name: "Login" }] });
```

### 7. Navigation — addListener("willFocus") → addListener("focus")

```js
// OLD:
this.props.navigation.addListener("willFocus", callback);
// NEW:
this.props.navigation.addListener("focus", callback);
```

### 8. withNavigation HOC → useNavigation hook

```js
// OLD:
import { withNavigation } from "react-navigation";
export default withNavigation(MyComponent);
// NEW — option A: convert to function component and use hook:
import { useNavigation } from "@react-navigation/native";
function MyComponent() {
  const navigation = useNavigation();
  ...
}
// NEW — option B: if staying as class component, pass navigation as prop from parent
```

### 9. prop-types → Remove

Since project is TypeScript, replace `PropTypes` with TypeScript interface/type props.
```js
// OLD:
import PropTypes from "prop-types";
static propTypes = { routeId: PropTypes.number.isRequired }
// NEW: just remove — TypeScript handles this at compile time
```

---

## Scope Summary

- **30+ files** need native-base removed
- **35+ files** need `getParam` → `route.params`
- **13 files** need NavigationActions/StackActions replaced
- **6 files** need native-base-autocomplete replaced
- **3 files** need react-native-easy-grid replaced
- **2 files** need react-native-communications replaced
- **2 files** need withNavigation HOC replaced
- **8 files** need prop-types removed
- **1 file** needs willFocus → focus (login)

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (3)

**Documents (3):** [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]]

%% brain-links:end %%
