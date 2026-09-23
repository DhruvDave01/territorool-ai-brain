---
area: design-library
tags: [brain/design-library]
ref: "Inline CSS / Style Audit Report"
---

# Inline CSS / Style Audit Report

**Project:** TerriTool (React Native)
**Date:** 2026-04-07
**Scope:** All `.js` / `.jsx` / `.ts` / `.tsx` files under `App/`
**Total Files Scanned:** ~135
**Files With Inline Styles:** 48
**Total Inline Style Occurrences:** ~2,295

> **Note:** No code changes were made. This is a read-only audit.

---

## Summary by Pattern Type

| Pattern | Occurrences | Files Affected |
|---------|-------------|----------------|
| `style={{ ... }}` (direct inline objects) | ~1,457 | 35 |
| `XxxStyle={{ ... }}` (named style props with inline objects) | ~168 | 26 |
| `style={[ ... ]}` (array styles containing inline objects) | ~665 | 48 |
| `XxxStyle={[ ... ]}` (named array style props) | ~5 | 2 |

---

## Top 10 Worst Offenders

| Rank | File | Inline Styles |
|------|------|:-------------:|
| 1 | `App/components/customcompany/index.js` | ~246 |
| 2 | `App/components/findLeads/aiFindLeads.js` | ~234 |
| 3 | `App/components/findLeads/index.js` | ~189 |
| 4 | `App/components/list/create.js` | ~141 |
| 5 | `App/components/route/create.js` | ~134 |
| 6 | `App/components/route/index.js` | ~108 |
| 7 | `App/components/contacts/view.js` | ~95 |
| 8 | `App/components/list/edit.js` | ~94 |
| 9 | `App/components/route/congContact/index.js` | ~93 |
| 10 | `App/components/route/edit.js` | ~87 |

---

## Detailed File-by-File Breakdown

### 1. `App/components/customcompany/index.js` — ~246 inline styles
- `style={{` : 190 | `Style={{` : 9 | `style={[` : 47
- Examples:
  - Line 1378: `style={{ paddingHorizontal: 5 }}`
  - Line 1537: `style={{ flex: 1, minWidth: 0, justifyContent: "center" }}`
  - Line 2205: `style={{ position: "relative" }}`
  - Line 2912: `style={{ marginTop: 3, marginRight: 6 }}`
  - Line 3196: `style={{ color: "red" }}`

### 2. `App/components/findLeads/aiFindLeads.js` — ~234 inline styles
- `style={{` : 157 | `Style={{` : 14 | `style={[` : 63
- Examples:
  - Line 2324: `style={{ paddingHorizontal: 20, marginTop: 20 }}`
  - Line 2345: `style={{ backgroundColor: RT_SURFACE_PAGE, paddingHorizontal: 12, paddingTop: 8 }}`
  - Line 3348: `style={{ fontFamily: theme.font.dinBold }}`
  - Line 5672: `style={{ color: theme.colors.white, width: "100%", height: "100%", fontSize: 18 }}`
  - Line 6680: `style={{ marginTop: 12, fontFamily: theme.font.dinLight, fontSize: 15, color: "#6B7280" }}`

### 3. `App/components/findLeads/index.js` — ~189 inline styles
- `style={{` : 127 | `Style={{` : 13 | `style={[` : 49
- Examples:
  - Line 2127: `style={{ flex: 1, minWidth: 0, paddingRight: 6 }}`
  - Line 4147: `style={{ marginLeft: 6 }}`
  - Line 4580: `style={{ flex: 1 }}`
  - Line 4757: `style={{ flex: 1, minWidth: 0, borderWidth: 1, borderColor: 'lightgray', ... }}`

### 4. `App/components/list/create.js` — ~141 inline styles
- `style={{` : 118 | `Style={{` : 12 | `style={[` : 11
- Examples:
  - Line 943: `style={{ marginHorizontal: 16, marginVertical: 4 }}`
  - Line 1180: `style={{ flex: 1, backgroundColor: RT_SURFACE }}`
  - Line 1273: `style={{ height: 22, marginRight: 8 }}`
  - Line 2623: `style={{ height: 30 }}`

### 5. `App/components/route/create.js` — ~134 inline styles
- `style={{` : 116 | `Style={{` : 11 | `style={[` : 7
- Examples:
  - Line 1097: `style={{ flex: 1, minWidth: 0 }}`
  - Line 1144: `style={{ flex: 1, backgroundColor: RT_SURFACE }}`
  - Line 1277: `style={{ height: 22, marginRight: 8 }}`
  - Line 1896: `style={{ marginLeft: 5, marginRight: 10, marginTop:5, width: "15%" }}`
  - Line 2648: `style={{ height: 30 }}`

### 6. `App/components/route/index.js` — ~108 inline styles
- `style={{` : 88 | `Style={{` : 2 | `style={[` : 18
- Examples:
  - Lines 151-425: Multiple card/row layout inline styles
  - Line 1475: `style={{ flex: 1, backgroundColor: RT_SURFACE_PAGE }}`
  - Line 1682: `style={{ flex: 1, backgroundColor: theme.colors.primary }}`
  - Line 2586: `style={{ fontSize: 20 }}`

### 7. `App/components/contacts/view.js` — ~95 inline styles
- `style={{` : 57 | `style={[` : 38
- Examples:
  - Line 657: `style={{ flex: 1, minWidth: 0 }}`
  - Line 672: `style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 4 }}`
  - Line 872: `style={{ minHeight: 80, justifyContent: "center", alignItems: "center" }}`
  - Line 959: `style={{ color: "red", fontSize: 20 }}`

### 8. `App/components/list/edit.js` — ~94 inline styles
- `style={{` : 76 | `Style={{` : 5 | `style={[` : 13
- Examples:
  - Line 623: `style={{ marginHorizontal: 16, marginVertical: 4 }}`
  - Line 656: `style={{ fontSize: 17, fontFamily: theme.font.dinBold, color: "#111827", marginBottom: 4 }}`
  - Line 663: `style={{ width: 6, marginLeft: 4, borderRadius: 3, ... }}`
  - Line 1182: `style={{ padding: 6 }}`

### 9. `App/components/route/congContact/index.js` — ~93 inline styles
- `style={{` : 78 | `Style={{` : 4 | `style={[` : 11
- Examples:
  - Line 725: `style={{ height: 8 }}`
  - Line 857: `style={{ color: "black", fontSize: 18, width: 18 }}`
  - Line 1469: `style={{ paddingHorizontal: 10 }}`
  - Line 2069: `style={{ alignItems: "center", justifyContent: "center", minWidth: 110 }}`
  - Line 2138: `style={{ marginLeft: 6 }}`

### 10. `App/components/route/edit.js` — ~87 inline styles
- `style={{` : 71 | `Style={{` : 6 | `style={[` : 10
- Examples:
  - Line 766: `style={{ marginHorizontal: 16, marginVertical: 4 }}`
  - Line 807: `style={{ fontSize: 17, fontFamily: theme.font.dinBold, color: "#111827", marginBottom: 4 }}`
  - Line 1332: `style={{ padding: 6 }}`
  - Line 1755: `style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: "#F3F4F6", ... }}`

### 11. `App/components/company/create/index.js` — ~77 inline styles
- `style={{` : 29 | `Style={{` : 7 | `style={[` : 38 | `Style={[` : 3
- Examples:
  - Line 1255: `style={{ fontSize: 16, fontFamily: theme.font.dinLight, color: "#111" }}`
  - Line 1306: `style={{ flex: 1 }}`
  - Line 1436: `style={{ color: "black", fontSize: 18, width: 18 }}`
  - Line 1598: `style={{ flex: 1, minWidth: 0, zIndex: 3000 }}`

### 12. `App/components/company/list.js` — ~74 inline styles
- `style={{` : 39 | `Style={{` : 7 | `style={[` : 28
- Examples:
  - Line 842: `style={{ marginBottom: 0 }}`
  - Line 1020: `style={{ minWidth: 0, paddingRight: 4 }}`
  - Line 1602: `style={{ flex: 1, minHeight: 0, position: "relative" }}`
  - Line 2150: `style={{ fontSize: 20 }}`

### 13. `App/components/dashboard/editstatus.js` — ~64 inline styles
- `style={{` : 51 | `Style={{` : 3 | `style={[` : 10
- Examples:
  - Line 388: `style={{ flex: 1 }}`
  - Line 564: `style={{ marginRight: 6 }}`
  - Line 585: `style={{ height: ..., backgroundColor: "#E5E7EB", marginVertical: 8 }}`
  - Line 978: `style={{ width: 180, height: 180 }}`

### 14. `App/components/route/basic/index.js` — ~61 inline styles
- `style={{` : 27 | `Style={{` : 1 | `style={[` : 34
- Examples:
  - Line 822: `style={{ flex: 1, minWidth: 0, justifyContent: "center", paddingRight: 6 }}`
  - Line 965: `style={{ fontSize: 14, color: "#9CA3AF", marginRight: 6 }}`
  - Line 1243: `style={{ alignItems: "center", justifyContent: "center" }}`

### 15. `App/components/route/filter.js` — ~55 inline styles
- `style={{` : 31 | `Style={{` : 11 | `style={[` : 13
- Examples:
  - Line 761: `style={{ width: "100%" }}`
  - Line 776: `style={{ flex: 1 }}`
  - Line 837: `style={{ margin: 10 }}`
  - Line 1369: `style={{ justifyContent: "space-around" }}`

### 16. `App/components/list/filter.js` — ~53 inline styles
- `style={{` : 29 | `Style={{` : 11 | `style={[` : 13
- Examples:
  - Line 759: `style={{ width: "100%" }}`
  - Line 774: `style={{ flex: 1 }}`
  - Line 1351: `style={{ justifyContent: "space-around" }}`

### 17. `App/components/error/index.js` — ~41 inline styles
- `style={{` : 22 | `Style={{` : 2 | `style={[` : 17
- Examples:
  - Line 264: `style={{ flex: 1 }}`
  - Line 277: `style={{ width: 50 }}`
  - Line 834: `style={{ flex: 1 }}`
  - Line 863: `style={{ backgroundColor: "transparent", height: 15 }}`

### 18. `App/components/register/index_register_split.js` — ~40 inline styles
- `style={{` : 24 | `Style={{` : 2 | `style={[` : 14
- Examples:
  - Line 697: `style={{ flex: 1 }}`
  - Line 973: `style={{ color: "#D1D5DB", fontSize: 14 }}`
  - Line 1108: `style={{ flex: 1, backgroundColor: "#FFF" }}`
  - Line 1113: `style={{ marginTop: 20, fontFamily: theme.font.dinLight }}`

### 19. `App/components/list/create/select-start-end-points.js` — ~35 inline styles
- `style={{` : 16 | `Style={{` : 6 | `style={[` : 13
- Examples:
  - Line 654: `style={{ width: "100%" }}`
  - Line 668: `style={{ flex: 0.5 }}`
  - Line 703: `style={{ backgroundColor: theme.colors.primary, height: 20 }}`

### 20. `App/components/login/index.js` — ~34 inline styles
- `style={{` : 24 | `Style={{` : 2 | `style={[` : 8
- Examples:
  - Line 211: `style={{ flex: 1 }}`
  - Line 331: `style={{ alignItems: "center", paddingVertical: 24 }}`
  - Line 388: `style={{ color: "#D1D5DB", fontSize: 14 }}`
  - Line 458: `style={{ fontSize: 24, color: "#333" }}`

### 21. `App/components/route/lassoMap.js` — ~28 inline styles
- `style={{` : 8 | `style={[` : 20
- Examples:
  - Line 1098: `style={{ width: "100%" }}`
  - Line 1109: `style={{ flex: 1 }}`
  - Line 1214: `style={{ backgroundColor: theme.colors.primary, height: 5 }}`

### 22. `App/components/dashboard/index.js` — ~27 inline styles
- `style={{` : 20 | `style={[` : 7
- Examples:
  - Line 907: `style={{ width: "100%" }}`
  - Line 911: `style={{ backgroundColor: "transparent" }}`
  - Line 1063: `style={{ height: 6, backgroundColor: "transparent" }}`
  - Line 1249: `style={{ margin: 0, justifyContent: "center", alignItems: "center" }}`

### 23. `App/components/route/create/select-start-end-points.js` — ~26 inline styles
- `style={{` : 10 | `Style={{` : 4 | `style={[` : 12
- Examples:
  - Line 629: `style={{ alignSelf: "stretch" }}`
  - Line 838: `style={{ height: 100 }}`

### 24. `App/components/company/edit.js` — ~24 inline styles
- `style={{` : 0 | `Style={{` : 10 | `style={[` : 12 | `Style={[` : 2
- Note: Uses almost no direct `style={{}}` but many named style props.
- Examples:
  - Line 677: `contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}`
  - Line 773: `searchContainerStyle={{ paddingBottom: 8, borderBottomWidth: 0 }}`

### 25. `App/components/contacts/create.js` — ~22 inline styles
- `style={{` : 6 | `Style={{` : 10 | `style={[` : 6
- Examples:
  - Line 367: `style={[screenStyles.fieldBlock, { zIndex: 25 }]}`
  - Line 662: `containerStyle={{ borderWidth: 0 }}`

### 26. `App/components/contacts/update.js` — ~22 inline styles
- `style={{` : 6 | `Style={{` : 10 | `style={[` : 6
- Examples:
  - Line 470: `style={[screenStyles.fieldBlock, { zIndex: 25 }]}`
  - Line 798: `style={{}}` (empty style object)
  - Line 810: `containerStyle={{ borderWidth: 0 }}`

### 27. `App/components/route/edit/edit-select-start-end-points.js` — ~22 inline styles
- `style={{` : 6 | `Style={{` : 4 | `style={[` : 12
- Examples:
  - Line 572: `style={{ alignSelf: "stretch" }}`
  - Line 918: `style={{ width: "100%", minHeight: 50 }}`

### 28. `App/components/list/index.js` — ~22 inline styles
- `style={{` : 4 | `style={[` : 18

### 29. `App/components/list/basic/index.js` — ~20 inline styles
- `style={{` : 0 | `style={[` : 20
- All array-style with inline overrides.

### 30. `App/utils/NativeBaseCompat.js` — ~16 inline styles
- `style={{` : 0 | `style={[` : 16
- Note: This is a compatibility layer, so inline styles are expected.
- Examples:
  - Line 69: `style={[{ flex: 1 }, style]}`
  - Line 137: `style={[{ flex: 1, alignItems: 'center' }, style]}`
  - Line 269: `style={[{ width: size, height: size, borderRadius: square ? 0 : size / 2 }, style]}`

### 31. `App/components/route/edit/edit-publish-route.js` — ~15 inline styles
- `style={{` : 10 | `Style={{` : 1 | `style={[` : 4
- Examples:
  - Line 422: `style={{ fontSize: 42, color: "#E53935" }}`
  - Line 437: `style={{ width: "100%", marginTop: 28 }}`

### 32. `App/components/customfooter/index.js` — ~13 inline styles
- `style={{` : 0 | `style={[` : 13
- Array styles with inline overrides for active state backgrounds.

### 33. `App/components/register/subscribe.js` — ~11 inline styles
- `style={{` : 3 | `style={[` : 8
- Examples:
  - Line 389: large inline style object
  - Line 468: large inline style object

### 34. `App/components/filterModule/index.js` — ~10 inline styles
- `style={{` : 0 | `Style={{` : 1 | `style={[` : 9
- Examples:
  - Line 513: `listItemLabelStyle={{ ... }}`
  - Line 636: `style={[styles.squareCheckbox, { tintColor: ... }]}`

### 35. `App/components/route/common/RoutePublishingLoader.js` — ~10 inline styles
- `style={{` : 0 | `style={[` : 10
- All animation-related array styles with inline transform objects.

### 36. `App/components/route/bizContact/bizCompanies.js` — ~9 inline styles
- `style={{` : 5 | `style={[` : 4
- Examples:
  - Line 236: `style={{ width: "100%" }}`
  - Line 251: `style={{ flex: 1 }}`

### 37. `App/components/findLeads/FindLeadsCompanyDetailModal.js` — ~7 inline styles
- `style={{` : 0 | `style={[` : 7

### 38. `App/components/activeroutemap/index.js` — ~5 inline styles
- `style={{` : 0 | `style={[` : 5

### 39. `App/components/route/create/publish-route.js` — ~4 inline styles
- `style={{` : 0 | `style={[` : 4

### 40. `App/components/customheader/index.js` — ~3 inline styles
- `style={{` : 0 | `style={[` : 3

### 41. `App/components/common/SearchGlyph.js` — ~3 inline styles
- `style={{` : 3

### 42. `App/components/splash/AnimatedSplashScreen.js` — ~2 inline styles
- `style={{` : 0 | `style={[` : 2

### 43. `App/components/company/view.js` — ~2 inline styles
- `style={{` : 0 | `style={[` : 2

### 44. `App/components/route/bizContact/index.js` — ~2 inline styles
- `style={{` : 0 | `style={[` : 2

### 45. `App/components/common/AppButton.js` — ~1 inline style
- `style={[` : 1

### 46. `App/components/common/ScrollHintArrow.js` — ~1 inline style
- `style={[` : 1

### 47. `App/components/route/basic/company-view.js` — ~1 inline style
- `style={[` : 1

---

## Custom Packages (lower priority)

| File | Inline Styles |
|------|:-------------:|
| `App/customPackage/react-native-map-clustering/lib/ClusteredMarker.js` | ~5 |
| `App/customPackage/react-native-select-dropdown/src/components/Input.js` | ~3 |
| `App/customPackage/react-native-select-dropdown/src/components/DropdownOverlay.js` | ~1 |
| `App/customPackage/react-native-select-dropdown/src/components/DropdownWindow.js` | ~1 |

---

## Common Anti-Patterns Found

### 1. Hardcoded Colors
Colors like `"red"`, `"black"`, `"#E5E7EB"`, `"#6B7280"`, `"#111827"` are used directly instead of referencing `theme.colors.*`.

### 2. Repeated Typography Blocks
The same font/size/color combos appear across many files:
```js
{ fontSize: 17, fontFamily: theme.font.dinBold, color: "#111827", marginBottom: 4 }
```
Found verbatim in: `list/edit.js`, `route/edit.js`, and others.

### 3. Spacer Views
Empty `<View>` elements with only height/width used as layout spacers:
```js
<View style={{ height: 8 }} />
<View style={{ height: 100 }} />
```

### 4. Empty Style Objects
```js
style={{}}
```
Found in `contacts/update.js` (line 798) and `findLeads/aiFindLeads.js` (line 5519).

### 5. Duplicate Inline Overrides
Identical `style={[stylesheet.x, { someOverride }]}` patterns repeated instead of creating a named variant style.

### 6. Flex Shortcuts
`{ flex: 1 }` and `{ flex: 1, minWidth: 0 }` appear hundreds of times as inline styles instead of being in a shared stylesheet.

---

## Existing Style Extraction Progress

Three new `.styles.js` files exist as untracked in git (on branch `TT_80`):
- `App/components/findLeads/FindLeadsCompanyDetailModal.styles.js`
- `App/components/findLeads/aiFindLeads.styles.js`
- `App/components/findLeads/findLeadsIndex.styles.js`

This suggests style extraction has begun for the `findLeads/` module but the rest of the codebase has not yet been addressed.

---

## Recommendations (for future cleanup)

1. **Priority 1** — Extract styles from the top 10 files (customcompany, findLeads, list/create, route/create, etc.)
2. **Priority 2** — Create shared utility styles for `{ flex: 1 }`, spacers, and common typography
3. **Priority 3** — Replace hardcoded hex colors with `theme.colors.*` references
4. **Priority 4** — Remove empty `style={{}}` occurrences
5. **Priority 5** — Address custom packages if they are maintained in-house

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (58)

**Documents (5):** [[brain/audits/00-inventory|Audit 0 – what exists]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]]

**Code files (53):** [[_code/mobile/App/components/activeroutemap/index.js|activeroutemap/index.js]] · [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/components/findLeads/aiFindLeads.styles.js|aiFindLeads.styles.js]] · [[_code/mobile/App/components/common/AppButton.js|AppButton.js]] · [[_code/mobile/App/components/route/basic/index.js|basic/index.js]] · [[_code/mobile/App/components/list/basic/index.js|basic/index.js]] · [[_code/mobile/App/components/route/bizContact/bizCompanies.js|bizCompanies.js]] · [[_code/mobile/App/components/route/bizContact/index.js|bizContact/index.js]] · [[_code/mobile/App/customPackage/react-native-map-clustering/lib/ClusteredMarker.js|ClusteredMarker.js]] · [[_code/mobile/App/components/route/basic/company-view.js|company-view.js]] · [[_code/mobile/App/components/route/congContact/index.js|congContact/index.js]] · [[_code/mobile/App/components/list/create.js|create.js]] · [[_code/mobile/App/components/route/create.js|create.js]] · [[_code/mobile/App/components/contacts/create.js|create.js]] · [[_code/mobile/App/components/company/create/index.js|create/index.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/mobile/App/components/customfooter/index.js|customfooter/index.js]] · [[_code/mobile/App/components/customheader/index.js|customheader/index.js]] · [[_code/mobile/App/components/dashboard/index.js|dashboard/index.js]] · [[_code/mobile/App/customPackage/react-native-select-dropdown/src/components/DropdownOverlay.js|DropdownOverlay.js]] · [[_code/mobile/App/customPackage/react-native-select-dropdown/src/components/DropdownWindow.js|DropdownWindow.js]] · [[_code/mobile/App/components/route/edit/edit-publish-route.js|edit-publish-route.js]] · [[_code/mobile/App/components/route/edit/edit-select-start-end-points.js|edit-select-start-end-points.js]] · [[_code/mobile/App/components/list/edit.js|edit.js]] · [[_code/mobile/App/components/route/edit.js|edit.js]] · [[_code/mobile/App/components/company/edit.js|edit.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/components/error/index.js|error/index.js]] · [[_code/mobile/App/components/route/filter.js|filter.js]] · [[_code/mobile/App/components/list/filter.js|filter.js]] · [[_code/mobile/App/components/filterModule/index.js|filterModule/index.js]] · [[_code/mobile/App/components/findLeads/index.js|findLeads/index.js]] · [[_code/mobile/App/components/findLeads/FindLeadsCompanyDetailModal.js|FindLeadsCompanyDetailModal.js]] · [[_code/mobile/App/components/findLeads/FindLeadsCompanyDetailModal.styles.js|FindLeadsCompanyDetailModal.styles.js]] · [[_code/mobile/App/components/findLeads/findLeadsIndex.styles.js|findLeadsIndex.styles.js]] · [[_code/mobile/App/components/register/index_register_split.js|index_register_split.js]] · [[_code/mobile/App/customPackage/react-native-select-dropdown/src/components/Input.js|Input.js]] · [[_code/mobile/App/components/route/lassoMap.js|lassoMap.js]] · [[_code/mobile/App/components/company/list.js|list.js]] · [[_code/mobile/App/components/list/index.js|list/index.js]] · [[_code/mobile/App/components/login/index.js|login/index.js]] · [[_code/mobile/App/utils/NativeBaseCompat.js|NativeBaseCompat.js]] · [[_code/mobile/App/components/route/create/publish-route.js|publish-route.js]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/mobile/App/components/route/common/RoutePublishingLoader.js|RoutePublishingLoader.js]] · [[_code/mobile/App/components/common/ScrollHintArrow.js|ScrollHintArrow.js]] · [[_code/mobile/App/components/common/SearchGlyph.js|SearchGlyph.js]] · [[_code/mobile/App/components/list/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/components/route/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/components/register/subscribe.js|subscribe.js]] · [[_code/mobile/App/components/contacts/update.js|update.js]] · [[_code/mobile/App/components/contacts/view.js|view.js]] · [[_code/mobile/App/components/company/view.js|view.js]]

%% brain-links:end %%
