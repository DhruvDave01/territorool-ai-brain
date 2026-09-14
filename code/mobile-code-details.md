# Mobile code details

Related: [10-mobile-app](../10-mobile-app.md) · [04-style-guide](../04-style-guide.md) · [12-mobile-api](../12-mobile-api.md)

Root: `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`

This is a **file map** for coding. Product behavior lives in `features/`. Do not invent files that are not listed.

## Where to start

| Task | Open first |
|------|-----------|
| New screen | `App/App.js` (register) + feature folder under `App/components/` |
| API call | `App/config/index.js` then `App/utils/API.js` |
| Shared company sheet | `App/components/customcompany/index.js` |
| Cross-screen data | `App/utils/Global.js` |
| Local persist | `App/storage/realm.js` |
| Styles | `App/styles/theme.js` + co-located `*.styles.js` |

Almost every screen is a **class component**. NativeBase is gone — use `NativeBaseCompat.js`.

## Directory tree

```
TerriTool/
├── index.js, init.js, app.json, package.json
├── App/
│   ├── App.js                      # stack navigator (~47 screens)
│   ├── App.styles.js
│   ├── SplashVisibilityContext.js
│   ├── sessionExpiredEvent.js
│   ├── config/index.js            # ALL API paths + keys
│   ├── storage/                   # Realm
│   ├── utils/                     # API, Global, helpers
│   ├── styles/                    # theme + common
│   ├── components/                # feature screens
│   ├── customPackage/             # map clustering, select-dropdown
│   ├── assets/, images/, specs/
│   └── components/voiceAssistant.zip   # archived, not live
├── android/   applicationId com.picwa.territoolapp
├── ios/
├── docs/, MCPFLOW/, Prompts/, .maestro/, postman/, patches/
```

## Entry

| File | Role |
|------|------|
| `index.js` | `import './init'`; `AppRegistry.registerComponent('TerriTool', …)` |
| `init.js` | ATT, Sentry, PostHog, crash handlers, FCM background, Facebook App ID `1863947981221180` |
| `App/App.js` | `Sentry.wrap`, JWT restore, splash, session-expired modal, `createNativeStackNavigator` |

## `App/components/` by feature

### Login / register / paywall

| File | Role |
|------|------|
| `login/index.js` | Login class |
| `register/index_register_split.js` | Register |
| `register/subscribe.js` | Subscription paywall UI |
| `register/SubscriptionGate` | Trial/expired gate |
| `register/SettingsPlanPaywall.js` | Settings plan sheet |
| `register/postSignupPaywallFlow.js` | After signup |
| `register/costCalculatorTools.js` | Cost calculator |

### Dashboard / settings

| File | Role |
|------|------|
| `dashboard/index.js` | Home tiles |
| `dashboard/editstatus.js` | Settings (name, HubSpot, logout) |
| `dashboard/RecentActivityScreen.js` | Recent feed |
| `dashboard/CalendarActivityScreen.js` | Calendar |
| `dashboard/NotificationsScreen.js` | Alerts |
| `dashboard/QrCodeScannerScreen.js` | QR → route |
| `dashboard/ReferralInviteModal.js` | Referrals |
| `dashboard/ActivityRowBody.js` | Activity row |
| `dashboard/ScannerOverlay.js` | Camera overlay |
| `dashboard/AppCue/Archive/` | Old spotlight tours |

### Header / footer / splash / error

| File | Role |
|------|------|
| `customheader/index.js` | Header + `HeaderAddMenu`, `HeaderAddButton`, `HeaderIconButton` |
| `customfooter/index.js` | Fake tabs (index 1–6) |
| `splash/AnimatedSplashScreen.js` | Splash |
| `error/index.js`, `error/ErrorCompanyRow.js` | Error UI |

### Companies / custom sheet / business card

| File | Role |
|------|------|
| `company/list.js` | Address Book list + map |
| `company/view.js` | View (embeds CustomCompany) |
| `company/create/index.js` | Create |
| `company/edit.js` | Edit |
| `company/businessCard/index.js` | Card scan camera |
| `customcompany/index.js` | Shared sheet (~5k+ LOC): status, notes, activities, find contacts, report, navigate |
| `customcompany/FindContactsFetchModal.js` | Discovery modal |
| `customcompany/MapChooserPopup.js` | Nav app chooser |
| `customcompany/ActivityDateTimePickerField.js` | Activity datetime |

### Contacts

| File | Role |
|------|------|
| `contacts/create.js` | Add |
| `contacts/update.js` | Edit |
| `contacts/view.js` | Detail |

### Lists

| File | Role |
|------|------|
| `list/index.js` | Library |
| `list/create.js`, `list/edit.js` | CRUD |
| `list/basic/index.js` | Detail |
| `list/filter.js` | Filters |
| `list/create/select-start-end-points.js` | List → route |

### Routes / active map / find leads

| File | Role |
|------|------|
| `route/index.js` | Route library |
| `route/create.js`, `route/edit.js` | Select companies |
| `route/create/select-start-end-points.js` | Start/end |
| `route/create/publish-route.js` | Poll until `published` |
| `route/edit/edit-select-start-end-points.js` | Edit start/end |
| `route/edit/edit-publish-route.js` | Edit publish |
| `route/basic/index.js` | Basic detail |
| `route/basic/company-view.js` | Company on route |
| `route/basic/goswipe.js` | `RouteSwipe` |
| `route/basic/firstRouteCoaching/FirstRouteCoachingSheet.js` | First-route coaching |
| `route/lassoMap.js` | Lasso territory |
| `route/filter.js` | Route filters |
| `route/congContact/index.js` | Cognism UI |
| `route/bizContact/index.js` | Bizpedia/Claude UI |
| `route/common/RoutePublishingLoader.js` | Publishing spinner |
| `activeroutemap/index.js` | Driving map |
| `activeroutemap/waypointdetail.js` | Stop detail |
| `findLeads/index.js` | Classic map Find Leads (very large) |
| `findLeads/aiFindLeads.js` | AI V2 |
| `findLeads/FindLeadsCompanyDetailModal.js` | Lead preview |
| `filterModule/index.js` | Shared filter UI |

### Common UI

`AppButton`, `AppConfirmModal`, `AppCrashFallback`, `WhatsNewModal`, `SpotlightTourModal`, `ReportContactModal`, `ReportContactInfoModal`, `CancelAccountConfirmModal`, `ShareEmailField`, `AuthLegalFooter`, `ScrollHintArrow`, `SearchGlyph`, `CrashTestThrower`.

## `App/utils/` catalog

| File | Role |
|------|------|
| `API.js` | `post` / `get` / `get_third_party` + 401 logout |
| `Global.js` | In-memory companies, contacts, routes, lasso |
| `Globalfunction.js` | Logout, nav resets |
| `ConnectivityHelper.js` | NetInfo retries |
| `NativeBaseCompat.js` | Container, Toast, Button, Grid |
| `AutocompleteCompat.js` | Autocomplete shim |
| `RevenueCatService.js` | IAP identify / purchase |
| `subscriptionGate.js` | Trial/expired gate |
| `contactBuyCredits.js` | 2 vs 1 credit |
| `fetchFirstContactApi.js` | `fetchAllContacts` |
| `findContactsFetchModalController.js` | Find-contacts modal flow |
| `findContactsFetchSources.js` | Provider order/logos |
| `geminiBusinessCard.js` | Gemini parse |
| `businessCardParse.js` | Card fields |
| `addCompanyFromBusinessCard.js` | Save company from card |
| `addContactFromBusinessCard.js` | Save contact from card |
| `googleDirections.js` | **Mapbox** polylines |
| `mapProvider.js` | Google vs MapKit |
| `mapAppChooser.js` | External nav |
| `googleMapsAerialUrl.js` | Aerial preview |
| `googlePlacesPlaceId.js` | Place id helper |
| `hubspotSyncFlight.js` | One HubSpot sync at a time |
| `reportCompany.js` / `reportContact.js` | Report flows |
| `parseQrRoutePayload.js` | QR parse |
| `navigateToRouteDetail.js` | QR → route screen |
| `navigateToViewCompanyById.js` | Deep link company |
| `FCMHelper.js` | Push + Notifee |
| `SentryHelper.js`, `sentrySanitize.js`, `sentryTags.js`, `sentryIntegrations.js` | Errors |
| `PostHogHelper.js`, `posthogClient.js` | Analytics |
| `crashRecovery.js` | Crash recovery |
| `companyActivityPayload.js` | Activity FormData |
| `locationAccess.js`, `mediaPermissionAccess.js`, `permissionPrompts.js`, `permissionSettingsAlert.js` | Permissions |
| `firstSignUpOnboarding.js` | First signup flags |
| `routeCompanyTapCue.js` | Route tap cue |
| `waypointDetailBridge.js` | Map ↔ waypoint |
| `unsubNavListener.js` | Focus listener cleanup |
| `dashboardItemUnread.js` | Unread badges |
| `fetchClaudeContactDevMock.js` | Dev mock |
| `annualRevenueInputFormat.js` | Input format |
| `buildMetadata.js` | Build metadata |
| `commonFunctions.ts` | Shared helpers (TS) |

## Storage / styles / config

| Path | Role |
|------|------|
| `App/storage/realm.js` | JWT, offlineRoute, TourSchema, AIFindLeads (schemaVersion 18) |
| `App/storage/fcmrealm.js` | FCMNotication |
| `App/storage/index.js` | Re-exports |
| `App/styles/theme.js` | Primary `#124ac6` |
| `App/styles/common.js` | `fontS*`, `flx1`, padding helpers |
| `App/config/index.js` | **Only** env/API/keys file — comment-swap staging vs prod |

## Native

| Path | Notes |
|------|--------|
| `android/app/build.gradle` | `applicationId` `com.picwa.territoolapp`; versionName can drift vs `package.json` |
| `ios/` | Deployment 15.5 |
| `patches/` | `patch-package` |
| `.maestro/` | E2E YAML |
| `postman/` | Generated from config |

## Coding rules (repeat)

- Class screens, FormData, no Redux, no nested navigators, no `native-base` package.
- Register every new screen in `App/App.js`.
- Co-locate `*.styles.js`. Use `testID`s `screen.*` / `footer.*` / `modal.*`.
