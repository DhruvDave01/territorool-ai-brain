# Feature: Notifications and analytics

Related: [02-dashboard](02-dashboard.md) · [17-integrations](../17-integrations.md)

## Push

- FCM + Notifee channel `default_channel` (`FCMHelper.js`)
- Login FormData sends `device_token`, `device_type`
- `NotificationsScreen` → `notificationlist` / `notificationmarkread`
- API also: `notifications`, `notificationremove`, `newreleasenotify`
- Realm `FCMNotication` (`notification_title`, `notification_desc`) in `fcm.realm`

## Telemetry

| Service | Where |
|--------|--------|
| Sentry | Mobile DSN `o202426` / project `5867661`; wrap in `App.js`; web `sentry/sentry-laravel` |
| PostHog | Mobile `posthogClient.js` + PHP `posthog/posthog-php` |
| Facebook SDK | App ID `1863947981221180` (`init.js`) |
| Crashlytics | `@react-native-firebase/crashlytics` |

Bugsnag is mentioned in older web overview; live `composer.json` shows Sentry + PostHog.
