# Feature: Credits, subscription, referrals

Related: [09-credits-billing](../09-credits-billing.md) · [01-auth-and-account](01-auth-and-account.md)

## Credits

- API `getusercredit` / MCP `get_credits`.
- Always quote cost before `save_ai_leads` or `buy_contacts`.

## Subscription / IAP

| Piece | Detail |
|--------|--------|
| Gate | `subscriptionGate.js`, `SubscriptionGate`, footer `getversiondetails` expired flag |
| RevenueCat | `RevenueCatService.js` — iOS `appl_…`, Android `goog_…`; `identifyUser` id `{userId}_{email}` |
| Backend confirm | `revenuecate-success` |
| Webhook | `revenue-subscription-update` |
| Cancel / upgrade | `cancelSubscription`, `request-package-upgrade` |
| Paywall UI | `register/subscribe.js`, `SettingsPlanPaywall.js`, `postSignupPaywallFlow.js` |
| Web | Stripe, PayPal, credits-addon, promo codes, special discounts |
| Packages | Trial ids 1,4; paid 2,5,6 (Admin MCP) |
| Table | `user_packages` |

## Referrals

- `sendReferralInvite`, `invite-user`
- Dynamic Link `https://territoolapp.page.link/App`
- `ReferralInviteModal`, `DYNAMIC_REFERRAL_LOGIN`
- Calendly strategy-session URL in mobile config
