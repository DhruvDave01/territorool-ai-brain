---
id: Settings
parent: design
---
# Settings

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/09-settings/`).

`EditStatus` titled **Settings**. Captures `IMG_4564`, VID3 `v3_009_72s`, Archive `Setting/` (42.32), `ios/09-settings/`.

```
Settings
  → profile (avatar, name, copy-email)
  → Credits Remaining
  → Subscription Renewal (package + date + Active chip)
  → Cancel / Upgrade / Buy extra credits  → [Subscription.md](Subscription.md)
  → Your plan & credits accordion (`02`)
  → Tags · Edit Status (`01`)
  → Preview App Update (dev) → **New Update Available** (`08` — filename `whats-new` is wrong)
  → header share/logout (`06`) → Authentication.md
  → delete-account leave sheet (`07`) CTA **Cancel Account**
  → referral (`09`)
```

`04-settings-buy-credits.png` is Safari **Buy Credit Add-Ons**, not IAP. `03` is web-billed **Manage your plan on the web**.

Archive `19.37.36`: tag chips Active (lime), High Priority (cyan), Idle (orange), Potential (blue), Reject (red), Unclassified (white), Gold (yellow).

Archive `19.38.01`: **Log out?** — pink share-arrow icon, “You will be signed out of TerriTool on this device.” Outline Cancel + filled danger **Log out**.

Android hiding of subscription buttons is currently **off** in code.

`Preview App Update (dev)` and Development (S) chip are **dev** — do not copy into product UI.
