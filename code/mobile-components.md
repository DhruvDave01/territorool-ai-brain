# Mobile components — props and call shapes

Read 2026-09-22 from `TerriTool/App/components/`. When this page and the file disagree, the file wins. Screen files: [mobile screens](mobile-screens.md). Pixels: [mobile UI](../brains/mobile-ui.md).

Every new logged-in screen is built from these five pieces in this order: `CustomHeader`, the curved body, content, `AppButton` for actions, `AppConfirmModal` for confirms, `CustomFooter` only if the screen is one of the six footer sections.

## Screen skeleton (from `dashboard/editstatus.js`)

```jsx
import CustomHeader from "../customheader";
import CustomFooter from "../customfooter";
import { screenCurvedBodyStyles } from "../../styles/screenCurvedBody";

<CustomHeader
  title="Settings"
  onBackPress={() => this.goBack()}
  showRight={true}
  rightContent={<HeaderIconButton name="log-out-outline" onPress={...} />}
/>
<View style={screenCurvedBodyStyles.primaryBleed}>
  <View style={screenCurvedBodyStyles.curvedBody}>
    <ScrollView>…cards…</ScrollView>
  </View>
</View>
<CustomFooter selectedIndex={6} {...this.props} />
```

`primaryBleed` paints `theme.colors.primary` under the header so the 25-radius sheet (`curvedBody`, fill `theme.colors.ccSurface`) curves over blue. `SCREEN_BODY_TOP_RADIUS` is exported from `App/styles/screenCurvedBody.js` and is not in `theme.js`.

## `CustomHeader` — `customheader/index.js`

Class `PureComponent`. Fetches credits itself on mount with `API.get(GET_CREDIT_INFO)`. Gradient from `theme.colors.linearGradient`, first stop `#124ac6`.

| Prop | Default | Meaning |
|---|---|---|
| `title` | `"Title"` | Centered DIN Bold title |
| `onBackPress` | no-op | Left arrow handler |
| `showBack` | `true` | Hide the arrow on a root screen |
| `showRight` | `false` | Render `rightContent` |
| `rightContent` | — | Node in the right slot. Use `HeaderIconButton` from the same folder (`name` is an Ionicons name). |
| `leftContent` | — | Replaces the arrow |
| `showCredit` | `false` | Credits pill (Dashboard style) |
| `subText` | — | Line under the title |
| `titleStyle` | — | Override for the title only |
| `topInset` | `0` | Extra top padding; safe-area is handled inside |
| `showBuildMetadataStrip` | `true` | The "App 42.32 (1) · iOS / Development (S)" strip under the gradient |

Sibling files: `HeaderIconButton.js`, `HeaderAddButton.js`, `HeaderAddMenu.js`, `customheader.styles.js`.

## `AppButton` — `common/AppButton.js`

Function component over `Pressable`. Label style comes from `AppButton.styles.js` (DIN Bold, centered).

| Prop | Default | Meaning |
|---|---|---|
| `title` | — | Label. Or pass `children` for a custom body. |
| `variant` | `"primary"` | `primary` `#124ac6`, `danger` `#CF5B51`, `neutral` `#374151`, `dark` `#1a1a1a`, `ghost` transparent |
| `onPress` | — | |
| `loading` | `false` | Shows `ActivityIndicator` in place of the label |
| `disabled` | `false` | |
| `fullWidth` / `flex` / `compact` | `false` | Layout switches. `compact` uses `buttonLabelCompact`. |
| `minWidth` / `minHeight` | — / `50` | |
| `style` / `textStyle` | — | Container / label overrides |
| `textColor` / `fontSize` | — | Label overrides |
| `backgroundColor` / `pressedBackgroundColor` | — | Override the variant fill; pressed defaults to 12 percent darker |
| `accessibilityLabel` / `testID` / `hitSlop` / `androidRippleBorderless` | — | |

On the Settings still: Cancel is `variant="danger"`, Upgrade is `variant="primary"`, Edit Status is the default `primary`.

## `AppConfirmModal` — `common/AppConfirmModal.js`

Centered `react-native-modal`. Replaces `Alert.alert`. Two-button row, single OK, or a third stacked action.

The home review offer is not this modal. It is the bottom sheet `dashboard/ReviewRewardsModal.js`.

| Prop | Default | Meaning |
|---|---|---|
| `visible` | — | |
| `title` / `message` | — | `message` may be a string or a node |
| `icon` / `iconContainerStyle` | `null` | Optional Ionicons node above the title |
| `primaryLabel` / `onPrimaryPress` | — | Right or only button |
| `secondaryLabel` / `onSecondaryPress` / `secondaryDisabled` | — | Left button |
| `middleLabel` / `onMiddlePress` | — | Third stacked action |
| `primaryTone` | `"danger"` | `"danger"` red primary or `"brand"` blue primary |
| `singleAction` | `false` | One centered button |
| `backdropDismissable` / `onBackdropDismiss` | `true` | Tap-outside and Android back |
| `onClosePress` | — | Shows a top-right close control |
| `backdropOpacity` | `0.45` | |
| `testID` and the three `*AccessibilityLabel` props | — | |

A delete confirm is `primaryTone="danger"` with `primaryLabel="Delete"`. A plain question is `primaryTone="brand"`.

## `CustomFooter` — `customfooter/index.js`

Six image tabs. Pass `selectedIndex` 1–6 and the screen's `props` so it can navigate. Index 2 pushes `MultipleAIWaypoint` with `{ fromDashboard: true, latitude, longitude }`. There is no index 0. Dashboard and Find Leads render no footer.

## Data and state

- `API.post(url, formdata, props, signal, options)` and `API.get(url, props)` from `App/utils/API.js`. FormData only. Copy `formdata.append` keys from the sibling screen; the endpoint list is [API endpoints](../brains/api-endpoints.md).
- Loader: `ActivityIndicator` with `testID="screen.<screenKey>.loading"`. Second loader on the same screen is `loadingB`.
- Error toast: `Toast.show({ type: "error", text1: "…", visibilityTime: 4000, position: "top" })`. The shared string is "Oops! Something went wrong. Please check your internet connection or try again."
- Empty copy per screen is on the feature page's Screens block, for example "No lists yet. Create one to get started." on Lists and "No Routes Found" on Routes.
- Styles live next to the screen in `<screen>.styles.js` and read `theme` from `App/styles/theme.js`. Fonts are `theme.font.dinBold` and `theme.font.dinLight`; sizes come from `theme.typography`.
