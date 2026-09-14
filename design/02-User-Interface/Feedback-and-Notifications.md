# Feedback and notifications

## Toast

- Library: `react-native-toast-message` mounted in `App/App.js`
- Position: **top**
- Types: `success`, `error`, `info`, custom `danger`
- Captured examples:
  - Partial add: “Some companies were not added as their dat…” (VID1)
  - Validation: “Please provide position.”
  - Create company success (VID2)
  - Mark visited success
  - Contact saved
- Footer: “Oops! You already on Current Screen.” / “No Internet Connection!!”

Legacy NativeBase-style Toast calls still exist in some files.

## In-app notification screen

`Notifications` is registered. **No navigation** from Dashboard bell, FCM, or footer. Treat as dead UI unless a later capture proves otherwise.

## Unread badges

Dashboard Routes/Lists tiles show numeric badges (15 / 7 in `IMG_4563`). Copy “New route ready” / “New list ready”.

## FCM / Notifee

`App/utils/FCMHelper.js` requests permission, stores token, logs opens. Does not route into `Notifications`.

## Credits

Header pill “N Credits”. VID1: 2947 → 2943 after Find Contacts. Referral banner “Want 20 more credits?”.

## Rate the app

Settings card “How is TerriTool working for you?” visible for Testim. Code has test-account gating — **Needs Manual Verification** who sees it in production.
