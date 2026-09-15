---
id: Components
parent: design
sources:
  - App/components/common/AppButton.js
  - App/components/customheader/
  - App/components/customheader/index.js
  - App/components/customfooter/index.js
  - common/SearchGlyph.js
  - common/ShareEmailField.js
  - common/ShareEmailError.js
  - common/AppConfirmModal.js
---
# Shared components

Sizes/colors from code. Screens listed are primary importers, not always exhaustive.

## Buttons

### AppButton — `App/components/common/AppButton.js`

| Prop | Default / values |
| --- | --- |
| `variant` | `primary` `#124ac6` pressed `#0d4bb8`; `danger` `#CF5B51`; `neutral` `#374151`; `dark` `#1a1a1a`; `ghost` transparent |
| `minHeight` | 50 (Login uses 54) |
| radius | 12 |
| `loading` | ActivityIndicator, disabled press |
| `disabled` | no press |

Used: Login, company/contact forms, enrichment, crash fallback, etc. Many screens still use custom `Pressable`/`TouchableOpacity` (Dashboard tiles, company action pills).

### HeaderIconButton / HeaderAddButton / HeaderAddMenu

`App/components/customheader/`. Add menu **only** Address Book Companies: “Add Company”, “Find Leads”. Menu white, radius 12, row 50, minWidth 196.

## Navigation chrome

### CustomHeader — `App/components/customheader/index.js`

LinearGradient `theme.colors.linearGradient`. Title white DIN Bold. Back chevron. Optional credits, custom `rightContent`. Toolbar 56 / 72 with subtitle.

### CustomFooter — `App/components/customfooter/index.js`

Six icon tabs. Offline toast. Subscription-expired intercept (**payment deferred**). Already-on-tab: “Oops! You already on Current Screen.”

## Inputs / search

| Component | Path | Notes |
| --- | --- | --- |
| SearchGlyph | `common/SearchGlyph.js` | Magnifier 17px `#8E8E93` |
| ShareEmailField | `common/ShareEmailField.js` | Share Route / Share List |
| ShareEmailError | `common/ShareEmailError.js` | Under field |
| FilterModule | `filterModule/` | Modal; dropdowns + tabs + checkboxes |
| ActivityDateTimePickerField | contacts/company activity | Date + time |
| react-native-dropdown-picker / SelectDropdown | Filter + forms | |

Login/create fields: bg `#FAFBFC`, radius 12, border `#E2E4E9`, minHeight ~48.

## Feedback

| Component | Path | Notes |
| --- | --- | --- |
| AppConfirmModal | `common/AppConfirmModal.js` | Centered; primaryTone `danger` or `brand`; backdrop 0.45 |
| Toast | App.js | top; types success/error/info/danger |
| ScrollHintArrow | `common/ScrollHintArrow.js` | Bobbing chevron |
| RoutePublishingLoader | `route/common/RoutePublishingLoader.js` | Progress, step chips, panic typewriter, fuel fact |
| FindContactsFetchModal | `customcompany/FindContactsFetchModal.js` | Apollo + secondary sources |
| AppCrashFallback | `common/AppCrashFallback.js` | Error boundary |

## Domain overlays

WhatsNewModal, SpotlightTourModal, CancelAccountConfirmModal, ReportContactModal, ReportContactInfoModal, ReferralInviteModal, MapChooserPopup, FindLeadsCompanyDetailModal, FirstRouteCoachingSheet, PatchQualifierSheet, ScannerOverlay, AuthLegalFooter.

## Lists / cards / maps

No generic `AppCard` — screens implement white cards locally. Map: `react-native-maps`, `RouteWaypointPinIcon`, clustering package, `MARKER_LEADS`.

## NativeBaseCompat

`App/utils/NativeBaseCompat.js` — leftover Container/Content/Icon/Toast shims. Prefer AppButton/Toast for new UI.
