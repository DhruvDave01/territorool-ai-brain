---
id: Feedback-and-Notifications
parent: design
sources:
  - App/App.js
  - App/utils/FCMHelper.js
---
# Feedback and notifications

Parent: [02 — User Interface](README.md). Stills: [Mobile-Screenshot-Flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/02-home/05`).

## Toast

- Library: `react-native-toast-message` mounted in `App/App.js`
- Position: **top**
- Types: `success`, `error`, `info`, custom `danger`
- Captured examples:
  - Partial add: “Some companies were not added as their dat…” (VID1)
  - Validation: “Please provide position.”
  - Create company success (VID2); Archive `19.52.11` “Company has been created and added succe…”
  - Mark visited success
  - Contact saved
  - Login/register: “Please enter password”; “The email has already been taken.”
  - Live copy quirks (do not normalize): “Please enter Enter Valid Password”; “Please enter Enter Valid Email Address”
  - Route library: “Route Updated Successfully” (green left bar)
- Footer: “Oops! You already on Current Screen.” / “No Internet Connection!!”

42.32 toasts use a **white card + orange (error) or green (success) left bar** at the top. Legacy NativeBase-style Toast calls still exist in some files.

## In-app notification screen

`Notifications` is registered. Still `ios/02-home/05`: empty **No notifications yet.** + toast **405 Method Not Allowed**. No Dashboard-bell still; FCM does not route here. Treat as reachable but not production-wired.

## Unread badges

Dashboard Routes/Lists tiles show numeric badges (15 / 7 in `IMG_4563`). Copy “New route ready” / “New list ready”.

## FCM / Notifee

`App/utils/FCMHelper.js` requests permission, stores token, logs opens. Does not route into `Notifications`. Native prompt captured on Login (`19.34.48`).

## Credits

Header pill “N Credits”. VID1: 2947 → 2943 after Find Contacts. Referral banner “Want 20 more credits?”.

## Rate the app

Settings card “How is TerriTool working for you?” visible for Testim. Code has test-account gating — **Needs Manual Verification** who sees it in production.
