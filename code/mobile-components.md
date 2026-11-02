# Mobile components — props and call shapes

Read 2026-09-22 from `TerriTool/App/components/`. Voice pieces read 2026-09-29. Read again on 2026-11-02 on `TT_80` `daf50eeb` and `Production` `6973a30d` ([review](../reviews/live-code-2026-11-02.md)); facts are for `TT_80` unless a line names `Production`. When this page and the file disagree, the file wins. Screen files: [mobile screens](mobile-screens.md). Pixels: [mobile UI](../brains/mobile-ui.md).

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
| `leftContent` | — | Replaces the arrow. `BasicRouteDetail` passes a back `HeaderIconButton` plus `VoiceHeaderButton` here, because share and edit fill the right slot. |
| `showCredit` | `false` | Credits pill (Dashboard style) |
| `creditBalance` | — | Shown in the credits pill instead of the fetched balance (`customheader/index.js:86-90`). The contact-buy screens pass it. Also on `Production`. |
| `subText` | — | Line under the title |
| `titleStyle` | — | Override for the title only |
| `titleAccessory` | — | Node in a row right after the title (`:165-175`). `VoiceScreen` passes one. |
| `sideSlotWidth` | — | Width of the right slot (`:106`). `CalendarActivity` passes 176. |
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

The home review offer is not this modal. It is the bottom sheet `dashboard/ReviewRewardsModal.js`. Only `Production` has the banner that opens it; `fe2e3254` removed it on `TT_80`.

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

Six image tabs. Pass `selectedIndex` 1–6 and the screen's `props` so it can navigate. Index 2 pushes `MultipleAIWaypoint` with `{ fromDashboard: true, latitude, longitude }` (`customfooter/index.js:283-287`). There is no index 0. Dashboard and both Find Leads screens render no footer.

`onVoiceScreen` (new 2026-09-29) is set only by `VoiceScreen` and `VoiceHistory` with `selectedIndex={4}`. Routes is lit, but tapping it still opens `Routes`, so voice keeps running. Without that prop, the footer renders `VoiceMiniBar` above the tabs while a voice session runs. It reports focus to `setFooterFocused` so the floating bar steps aside.

## Voice pieces — `voice/VoiceParts.js`

Function components. Each returns nothing when `VOICE_MODE_ENABLED` is false. They read the shared session through `useVoice()` (`App/voice/useVoice.js`). Behaviour and strings: [22 — Voice Mode](../features/22-Voice-Mode.md).

| Export | Props | Mounted in |
|---|---|---|
| `VoiceMiniBarHost` | `navigationRef`, `children` | `App/App.js`, around `NavigationContainer`. On a screen without a focused footer it shows the mini-bar below the navigator and gives screens a bottom inset of 0. |
| `VoiceMiniBar` | `navigation` | `CustomFooter`, and the host above |
| `VoiceHeaderButton` | `navigation`, `routeId` | `BasicRouteDetail` (left slot), `ActiveRouteMap` (right slot). Also runs the “Start when I open a route” auto-start for the active route. |
| `DriveWithVoiceRow` | `onPress` | `Dashboard`, first scroll row. Since `fa925407` it renders with or without an active route; the comment above it (`VoiceParts.js:332`) still says otherwise. |
| `FirstRunSheet` | `visible`, `onClose`, `onTurnedOn` | `Dashboard`, `VoiceScreen`. A `react-native-modal` bottom sheet. The mic permission is asked on “Turn on Voice Mode”. |
| `VoiceSettingsCard` | `navigation` | `EditStatus`, between the profile card and Tags |
| `ActionButton` | `icon`, `label`, `variant`, `onPress`, `disabled`, `loading`, `testID` | The voice action bar. `AppButton` with an Ionicons icon, `minHeight` 52, radius 12. |
| `Bubble` | `who` (`rep` / `agent`), `text`, `live` | Voice screen and history |
| `MicBadge` | `size` | Dashboard row, first-run sheet |
| `openVoice(navigation, { routeId })` | — | Async. With a `routeId`, makes that route active first (`VoiceParts.js:28-37`), then navigates to `VoiceScreen` with `{ start: true }` |
| `setFooterFocused(footer, focused)` | — | Called by `CustomFooter` on focus and blur |

## `CalendarSyncPopup` — `dashboard/CalendarSyncPopup.js`

Function component, `TT_80` only. A centered `react-native-modal` card mounted by `CalendarActivityScreen.js:837`. Strings: "Connect your calendar", a Google option, "Continue with Google", and "Meetings and appointments only." over "One-way sync from TerriTool." It closes itself before the sync and toasts "Google Calendar synced." on success. The Microsoft code in `App/utils/calendarSync.js` has no option in this card. Flow: [23 — Calendar Sync](../features/23-Calendar-Sync.md).

| Prop | Default | Meaning |
|---|---|---|
| `visible` | — | |
| `onClose` | — | Close control, backdrop and Android back; ignored while busy |
| `onConnected` | — | Called with the provider after the sync |
| `apiProps` | — | Props passed to `API.post` |
| `message` | "Sign in with Google to sync your calendar." | Subtitle |
| `onSyncingChange` | — | `true` while `google-calendar/sync` runs, then `false` |

## `BulkCartButton` — `route/contact/cartButton.js`

Function component over `Pressable`, also on `Production` (`c04e1fd7`). A white 32 pt `cart-outline` icon in a 44 pt hit area, with a white badge in primary blue that shows "99+" above 99. It is the `CustomHeader` `rightContent` on "Find Contacts" (`route/contact/index.js:629-635`) and `BulkContactPeople` (`people.js:285-291`), and both open `BulkContactReview`.

| Prop | Default | Meaning |
|---|---|---|
| `count` | — | Badge number; 0 or less disables the button |
| `onPress` | — | |
| `testID` | — | |

## Data and state

- `API.post(url, formdata, props, signal, options)` and `API.get(url, props)` from `App/utils/API.js`. FormData only. Copy `formdata.append` keys from the sibling screen; the endpoint list is [API endpoints](../brains/api-endpoints.md). Exceptions: Voice Mode's `App/voice/voiceApi.js` sends JSON with `fetch` to `voice/session` and `voice/tool`, and on `TT_80` `App/utils/calendarSync.js` posts JSON through `API.post(..., { asJson: true })` to `google-calendar/connection` and `google-calendar/sync`.
- Loader: `ActivityIndicator` with `testID="screen.<screenKey>.loading"`. Second loader on the same screen is `loadingB`.
- Error toast: `Toast.show({ type: "error", text1: "…", visibilityTime: 4000, position: "top" })`. The shared string is "Oops! Something went wrong. Please check your internet connection or try again."
- Empty copy per screen is on the feature page's Screens block, for example "No lists yet. Create one to get started." on Lists and "No Routes Found" on Routes.
- Styles live next to the screen in `<screen>.styles.js` and read `theme` from `App/styles/theme.js`. Fonts are `theme.font.dinBold` and `theme.font.dinLight`; sizes come from `theme.typography`.
