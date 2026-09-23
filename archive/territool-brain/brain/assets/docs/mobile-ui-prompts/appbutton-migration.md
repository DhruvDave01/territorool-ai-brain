---
area: design-library
tags: [brain/design-library]
ref: "AppButton Migration Prompt"
---

# AppButton Migration Prompt

Replace all old button patterns (`TouchableOpacity`-as-button, `TouchableHighlight`, `NativeBaseCompat Button`, manual `ActivityIndicator` loading states) with the unified `AppButton` component from `App/components/common/AppButton.js`.

---

## AppButton API Reference

```jsx
import AppButton from "../common/AppButton";
// or adjust path: "../../components/common/AppButton" etc.

<AppButton
  title="Label"              // button text
  children={<Icon />}        // OR custom children (icon-only button)
  variant="primary"          // "primary" | "danger" | "neutral" | "dark" | "ghost"
  onPress={() => {}}
  loading={false}            // shows ActivityIndicator automatically
  disabled={false}
  fullWidth={false}          // width: "100%"
  flex={false}               // flex: 1
  compact={false}            // smaller padding & font
  minWidth={undefined}
  minHeight={50}
  style={{}}                 // container overrides (margin, border, extra padding)
  textStyle={{}}             // label-only overrides
  textColor="#fff"           // label color (default white)
  fontSize={18}              // label size
  backgroundColor="#custom"  // overrides variant bg
  pressedBackgroundColor=""  // overrides pressed bg (auto-darkened if omitted)
  accessibilityLabel=""
  hitSlop={8}
  androidRippleBorderless={false}
/>
```

**Built-in variants:**
| Variant   | Background  | Use for                        |
|-----------|-------------|--------------------------------|
| primary   | COLOR_PRIMARY (#1557c4) | Main CTA, submit, save  |
| danger    | #CF5B51     | Delete, remove, destructive    |
| neutral   | #374151     | Secondary actions              |
| dark      | #1a1a1a     | Dark-themed buttons            |
| ghost     | transparent | Text links, icon buttons, back |

---

## Files to Migrate (47 files)

Work through each file below. For every `TouchableOpacity`, `TouchableHighlight`, `TouchableWithoutFeedback`, or NativeBaseCompat `Button` that acts as a button (has `onPress` + text/icon), replace it with `AppButton`.

**Do NOT replace** TouchableOpacity used for:
- List item rows / card taps (entire row is pressable, not a "button")
- Custom tab bars (AppTabs already handles this)
- Map markers / clustering overlays
- Dropdown overlays (customPackage internals)

---

### Pattern 1: NativeBaseCompat `Button` → `AppButton`

**Files:** `login/index.js`, `register/index.js`, `route/create.js`, `list/index.js`

These import `Button` from `../../utils/NativeBaseCompat` which is just a `TouchableOpacity` wrapper. Replace with `AppButton`.

**BEFORE (login/index.js lines 377-403):**
```jsx
import { Button, Text } from "../../utils/NativeBaseCompat";

<Button
  block
  style={[
    styles.login_button,
    {
      width: Dimensions.get("window").width - (Dimensions.get("window").width * 25) / 100,
      justifyContent: "center",
      alignItems: "center",
    },
  ]}
  onPress={() => this.loginUser()}
>
  <Text uppercase={false} style={{
    fontSize: 24,
    fontFamily: "DINCondensed-Bold",
    textAlign: "center",
    lineHeight: Platform.OS === "ios" ? 38 : undefined,
  }}>
    Login
  </Text>
</Button>
```

**AFTER:**
```jsx
import AppButton from "../common/AppButton";

<AppButton
  title="Login"
  variant="primary"
  onPress={() => this.loginUser()}
  fontSize={24}
  style={{
    width: Dimensions.get("window").width - (Dimensions.get("window").width * 25) / 100,
  }}
/>
```

Remove `Button` from the NativeBaseCompat import once all Button usages in that file are replaced. Keep other NativeBaseCompat imports (Container, Content, Form, Item, etc.) that are still in use.

---

### Pattern 2: TouchableOpacity with manual ActivityIndicator → `AppButton` with `loading`

**Files:** `error/index.js`, `route/create.js`, `list/create.js`, `contacts/create.js`, `contacts/update.js`, `company/create/index.js`, `company/edit.js`, `register/index.js`, `register/subscribe.js`, `findLeads/index.js`, `findLeads/aiFindLeads.js`

**BEFORE (error/index.js lines 895-936):**
```jsx
<TouchableOpacity
  disabled={this.state.selectedcompanylist.length < 1}
  style={{
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12A090",
    borderRadius: 10,
    height: 45,
  }}
  onPress={() => Alert.alert("Fix Records", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    { text: "Fix it", onPress: () => this.Fix() },
  ])}
>
  {this.state.buttonLoaderFix ? (
    <ActivityIndicator size="small" color="#fff" style={{ width: 50 }} />
  ) : (
    <Text style={[{ textAlign: "center" }, styles.fontS18, styles.colorWhite]}>
      Fix Selected
    </Text>
  )}
</TouchableOpacity>
```

**AFTER:**
```jsx
<AppButton
  title="Fix Selected"
  loading={this.state.buttonLoaderFix}
  disabled={this.state.selectedcompanylist.length < 1}
  backgroundColor="#12A090"
  onPress={() => Alert.alert("Fix Records", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    { text: "Fix it", onPress: () => this.Fix() },
  ])}
  style={{ borderRadius: 10, minHeight: 45 }}
/>
```

**BEFORE (error/index.js lines 941-982 — Delete button):**
```jsx
<TouchableOpacity
  disabled={this.state.selectedcompanylist.length < 1}
  style={{
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF4013",
    borderRadius: 10,
    height: 45,
  }}
  onPress={() => Alert.alert(...)}
>
  {this.state.buttonLoaderDel ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={[...]}>Delete Selected</Text>
  )}
</TouchableOpacity>
```

**AFTER:**
```jsx
<AppButton
  title="Delete Selected"
  variant="danger"
  loading={this.state.buttonLoaderDel}
  disabled={this.state.selectedcompanylist.length < 1}
  backgroundColor="#FF4013"
  onPress={() => Alert.alert(...)}
  style={{ borderRadius: 10, minHeight: 45 }}
/>
```

---

### Pattern 3: TouchableOpacity text link → `AppButton variant="ghost"`

**Files:** `login/index.js`, `register/index.js`, `register/subscribe.js`, `dashboard/editstatus.js`

**BEFORE (login/index.js lines 350-371):**
```jsx
<TouchableOpacity
  onPress={() => this.forgotLink()}
  style={{
    width: "90%",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 15,
  }}
>
  <Text style={{
    fontSize: 16,
    color: COLOR_PRIMARY,
    fontWeight: "600",
    fontFamily: "DIN2014-Light",
  }}>
    Forgot Password?
  </Text>
</TouchableOpacity>
```

**AFTER:**
```jsx
<AppButton
  title="Forgot Password?"
  variant="ghost"
  onPress={() => this.forgotLink()}
  textColor={COLOR_PRIMARY}
  fontSize={16}
  textStyle={{ fontWeight: "600", fontFamily: "DIN2014-Light" }}
  style={{ width: "90%", alignItems: "flex-end", marginBottom: 15, minHeight: 0 }}
/>
```

---

### Pattern 4: TouchableOpacity icon buttons → `AppButton variant="ghost"` with children

**Files:** `dashboard/editstatus.js`, `common/AppHeader.js`, `error/index.js`, `customfooter/index.js`

**BEFORE (editstatus.js lines 446-462):**
```jsx
<TouchableOpacity onPress={() => this.deleteUser()} style={{ padding: 8 }}>
  <Text style={[styles.addListItemIconPlus, { width: 25, fontSize: 25, color: COLOR_WHITE }]}>
    🗑
  </Text>
</TouchableOpacity>
```

**AFTER:**
```jsx
<AppButton
  variant="ghost"
  onPress={() => this.deleteUser()}
  hitSlop={8}
>
  <Text style={[styles.addListItemIconPlus, { width: 25, fontSize: 25, color: COLOR_WHITE }]}>
    🗑
  </Text>
</AppButton>
```

---

### Pattern 5: Styled action buttons (Save, Submit, Create, Update, Apply)

**Files (most common pattern across the app):**
- `contacts/create.js` — "Create" / "Save" buttons
- `contacts/update.js` — "Update" button
- `company/create/index.js` — "Create" button
- `company/edit.js` — "Save" button
- `route/create.js` — "Create Route" button
- `route/edit.js` — "Save" button
- `list/create.js` — "Create List" button
- `list/edit.js` — "Save" button
- `filterModule/index.js` — "Apply" / "Reset" buttons
- `route/filter.js` — "Apply" filter button
- `list/filter.js` — "Apply" filter button

**General BEFORE pattern:**
```jsx
<TouchableOpacity
  style={{
    backgroundColor: COLOR_PRIMARY,  // or "#12A090", "#1557c4", etc.
    borderRadius: 10,
    height: 45,                      // or 50
    justifyContent: "center",
    alignItems: "center",
    width: "90%",                    // or flex: 1
  }}
  onPress={() => this.save()}
  disabled={this.state.isLoading}
>
  {this.state.isLoading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={[styles.fontS18, styles.colorWhite, { textAlign: "center" }]}>
      Save
    </Text>
  )}
</TouchableOpacity>
```

**General AFTER pattern:**
```jsx
<AppButton
  title="Save"
  variant="primary"
  onPress={() => this.save()}
  loading={this.state.isLoading}
  fullWidth          // or style={{ width: "90%" }}
  style={{ borderRadius: 10 }}
/>
```

---

### Pattern 6: Pair of buttons (Cancel + Confirm / Delete + Save)

**Files:** `route/edit.js`, `list/edit.js`, `company/edit.js`, `route/lassoMap.js`, `route/edit/edit-select-start-end-points.js`

**BEFORE:**
```jsx
<View style={{ flexDirection: "row" }}>
  <TouchableOpacity style={{ flex: 1, backgroundColor: "#374151", ... }} onPress={cancel}>
    <Text>Cancel</Text>
  </TouchableOpacity>
  <TouchableOpacity style={{ flex: 1, backgroundColor: COLOR_PRIMARY, ... }} onPress={save}>
    <Text>Save</Text>
  </TouchableOpacity>
</View>
```

**AFTER:**
```jsx
<View style={{ flexDirection: "row", gap: 10 }}>
  <AppButton title="Cancel" variant="neutral" onPress={cancel} flex />
  <AppButton title="Save"   variant="primary" onPress={save}   flex />
</View>
```

---

### Pattern 7: Back / close buttons (← or ✕ text)

**Files:** `error/index.js`, `company/view.js`, `contacts/view.js`, `route/basic/company-view.js`

**BEFORE:**
```jsx
<TouchableOpacity onPress={() => this.onBackPress()}>
  <Text style={{ color: "white", fontSize: 20 }}>←</Text>
</TouchableOpacity>
```

**AFTER:**
```jsx
<AppButton variant="ghost" onPress={() => this.onBackPress()} hitSlop={8}>
  <Text style={{ color: "white", fontSize: 20 }}>←</Text>
</AppButton>
```

---

## Complete File List (grouped by priority)

### Priority 1 — NativeBaseCompat Button (remove native-base dependency)
| # | File | What to replace |
|---|------|-----------------|
| 1 | `App/components/login/index.js` | `Button` (Login, Register), `TouchableOpacity` (Forgot Password), `TouchableHighlight` |
| 2 | `App/components/register/index.js` | `Button` (Register, Subscribe), `TouchableOpacity` |
| 3 | `App/components/route/create.js` | `Button` (Create Route), `TouchableOpacity` |
| 4 | `App/components/list/index.js` | `Button` (action buttons), `TouchableOpacity` |

### Priority 2 — Buttons with manual loading state
| # | File | What to replace |
|---|------|-----------------|
| 5 | `App/components/error/index.js` | Fix Selected, Delete Selected, back button, company selector |
| 6 | `App/components/contacts/create.js` | Create/Save with loader |
| 7 | `App/components/contacts/update.js` | Update with loader |
| 8 | `App/components/company/create/index.js` | Create with loader |
| 9 | `App/components/company/edit.js` | Save with loader |
| 10 | `App/components/route/edit.js` | Save/Cancel with loader |
| 11 | `App/components/list/create.js` | Create with loader |
| 12 | `App/components/list/edit.js` | Save with loader |
| 13 | `App/components/register/subscribe.js` | Subscribe buttons, `TouchableWithoutFeedback` |
| 14 | `App/components/findLeads/index.js` | Search/filter buttons |
| 15 | `App/components/findLeads/aiFindLeads.js` | AI search buttons |

### Priority 3 — Standard action buttons
| # | File | What to replace |
|---|------|-----------------|
| 16 | `App/components/dashboard/editstatus.js` | Icon buttons (🗑, ⎋), email copy — already uses AppButton elsewhere |
| 17 | `App/components/dashboard/index.js` | TouchableOpacity action buttons |
| 18 | `App/components/filterModule/index.js` | Apply/Reset filter buttons |
| 19 | `App/components/route/filter.js` | Apply filter |
| 20 | `App/components/list/filter.js` | Apply filter |
| 21 | `App/components/route/index.js` | Route action buttons |
| 22 | `App/components/route/lassoMap.js` | Confirm/Cancel lasso selection |
| 23 | `App/components/route/edit/edit-select-start-end-points.js` | Point selection buttons |
| 24 | `App/components/route/create/select-start-end-points.js` | Point selection buttons |
| 25 | `App/components/list/create/select-start-end-points.js` | Point selection buttons |
| 26 | `App/components/route/basic/index.js` | Route basic action buttons |
| 27 | `App/components/route/basic/company-view.js` | Company view actions |
| 28 | `App/components/route/bizContact/index.js` | Business contact buttons |
| 29 | `App/components/route/bizContact/bizCompanies.js` | Biz company buttons |
| 30 | `App/components/route/congContact/index.js` | Congress contact buttons |
| 31 | `App/components/list/basic/index.js` | List basic action buttons |
| 32 | `App/components/company/view.js` | Company view actions |
| 33 | `App/components/company/list.js` | Company list actions |
| 34 | `App/components/contacts/view.js` | Contact view actions |
| 35 | `App/components/customcompany/index.js` | Custom company buttons |
| 36 | `App/components/customcompany/index2.js` | Custom company buttons |
| 37 | `App/components/activeroutemap/index.js` | Active route map actions |

### Priority 4 — Header/footer icon buttons (optional)
| # | File | What to replace |
|---|------|-----------------|
| 38 | `App/components/common/AppHeader.js` | Back button |
| 39 | `App/components/customfooter/index.js` | 6 nav icon buttons (consider keeping as-is) |
| 40 | `App/components/common/AppTabs.js` | Tab buttons (consider keeping as-is) |

### Skip — Do not modify
| File | Reason |
|------|--------|
| `App/components/common/AppButton.js` | This IS AppButton |
| `App/utils/NativeBaseCompat.js` | Compat layer — remove `Button` export only after all consumers migrated |
| `App/components/toast/ToastContext.js` | Not a button pattern |
| `App/customPackage/*` | Third-party package internals |
| `App/components/register/index_register_split.js` | Appears to be a backup/split file |

---

## Migration Rules

1. **Add `import AppButton`** at the top of each file. Use the correct relative path:
   - From `App/components/xyz/` → `import AppButton from "../common/AppButton";`
   - From `App/components/xyz/sub/` → `import AppButton from "../../common/AppButton";`

2. **Remove unused imports** after replacing:
   - Remove `TouchableOpacity` from react-native import if no longer used
   - Remove `TouchableHighlight` from react-native import if no longer used
   - Remove `ActivityIndicator` from react-native import if AppButton handles all loading states
   - Remove `Button` from NativeBaseCompat import if all `Button` usages are replaced

3. **Map colors to variants:**
   - `COLOR_PRIMARY` / `#1557c4` → `variant="primary"`
   - `#CF5B51` / `#FF4013` / red tones → `variant="danger"` (override with `backgroundColor` if exact color differs)
   - `#374151` / gray → `variant="neutral"`
   - `#12A090` / teal → `variant="primary" backgroundColor="#12A090"`
   - transparent / no bg → `variant="ghost"`

4. **Map loading to `loading` prop:**
   - Any `{isLoading ? <ActivityIndicator /> : <Text>Label</Text>}` → `<AppButton loading={isLoading} title="Label" />`

5. **Map dimensions:**
   - `height: 45` → `minHeight={45}` or `style={{ minHeight: 45 }}`
   - `width: "100%"` → `fullWidth`
   - `flex: 1` → `flex`
   - `width: "90%"` → `style={{ width: "90%" }}`
   - `borderRadius: 10` → `style={{ borderRadius: 10 }}` (default is 12)

6. **Preserve onPress logic exactly.** Do not change Alert.alert calls, navigation, API calls, etc.

7. **Work one file at a time.** After each file, verify the import path is correct and no unused imports remain.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (42)

**Documents (3):** [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]]

**Code files (39):** [[_code/mobile/App/components/activeroutemap/index.js|activeroutemap/index.js]] · [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/components/common/AppButton.js|AppButton.js]] · [[_code/mobile/App/components/route/basic/index.js|basic/index.js]] · [[_code/mobile/App/components/list/basic/index.js|basic/index.js]] · [[_code/mobile/App/components/route/bizContact/bizCompanies.js|bizCompanies.js]] · [[_code/mobile/App/components/route/bizContact/index.js|bizContact/index.js]] · [[_code/mobile/App/components/route/basic/company-view.js|company-view.js]] · [[_code/mobile/App/components/route/congContact/index.js|congContact/index.js]] · [[_code/mobile/App/components/route/create.js|create.js]] · [[_code/mobile/App/components/list/create.js|create.js]] · [[_code/mobile/App/components/contacts/create.js|create.js]] · [[_code/mobile/App/components/company/create/index.js|create/index.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/mobile/App/components/customfooter/index.js|customfooter/index.js]] · [[_code/mobile/App/components/dashboard/index.js|dashboard/index.js]] · [[_code/mobile/App/components/route/edit/edit-select-start-end-points.js|edit-select-start-end-points.js]] · [[_code/mobile/App/components/company/edit.js|edit.js]] · [[_code/mobile/App/components/route/edit.js|edit.js]] · [[_code/mobile/App/components/list/edit.js|edit.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/components/error/index.js|error/index.js]] · [[_code/mobile/App/components/route/filter.js|filter.js]] · [[_code/mobile/App/components/list/filter.js|filter.js]] · [[_code/mobile/App/components/filterModule/index.js|filterModule/index.js]] · [[_code/mobile/App/components/findLeads/index.js|findLeads/index.js]] · [[_code/mobile/App/components/register/index_register_split.js|index_register_split.js]] · [[_code/mobile/App/components/route/lassoMap.js|lassoMap.js]] · [[_code/mobile/App/components/company/list.js|list.js]] · [[_code/mobile/App/components/list/index.js|list/index.js]] · [[_code/mobile/App/components/login/index.js|login/index.js]] · [[_code/mobile/App/utils/NativeBaseCompat.js|NativeBaseCompat.js]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/mobile/App/components/route/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/components/list/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/components/register/subscribe.js|subscribe.js]] · [[_code/mobile/App/components/contacts/update.js|update.js]] · [[_code/mobile/App/components/company/view.js|view.js]] · [[_code/mobile/App/components/contacts/view.js|view.js]]

%% brain-links:end %%
