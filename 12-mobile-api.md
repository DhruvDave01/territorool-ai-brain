---
id: 12-mobile-api
parent: core
sources:
  - TerriTool/App/config/index.js
  - webterritool/routes/api.php
related:
  - 10-mobile-app.md
---
# 12. Mobile API catalog

Related: [10-mobile-app](10-mobile-app.md) · [features/](features/)

All paths are appended to `URL_BASE` (`…/index.php/api/`). JWT unless noted public. Source of constants: `TerriTool/App/config/index.js`. Source of **all** v2 URIs: `webterritool/routes/api.php`.

**2026-09-17 live `URL_BASE`:** staging `https://staging.territool.com/index.php/api/` (comment `STAGING — temporary for screenshot login`). Prod is commented in the same file.

`APP_VERSION` string for checks: `'2.0'`. `IS_STAGING_OR_DEV_BUILD` if `URL_BASE` contains `"staging"`.

## Auth / account

| Constant | Path |
|----------|------|
| `URL_USER_LOGIN` | `login` |
| `URL_USER_LOGIN_LOGOUT` | `logout` |
| `URL_USER_FORGOT` | `forgotPassword` |
| `URL_USER_REGISTER` | `mobileregistration` |
| `URL_USER_REGISTER_STORE` | `leads_user` |
| `USER_RESTRICT` | `getrestrictuser` |
| `DYNAMIC_LOGIN` | `mobilelogin/` |
| `DYNAMIC_CREDIT_UPGRADE_LOGIN` | `mobilelogin/credits/` |
| `DYNAMIC_REFERRAL_LOGIN` | `mobilelogin/referral/` |
| `URL_EDIT_NAME` | `updateName` |
| `URI_UPDATE_USER_PREFERENCES` | `updateUserPreferences` |

## Credits / billing / referrals

| Constant | Path |
|----------|------|
| `GET_CREDIT_INFO` | `getusercredit` |
| `CANCEL_SUBSCRIPTION` | `cancelSubscription` |
| `CHANGE_SUBSCRIPTION` | `request-package-upgrade` |
| `URL_REVENUECAT_SUCCESS` | `revenuecate-success` |
| `URL_SEND_REFERRAL_INVITE` | `sendReferralInvite` |
| `URL_INVITE_USER` | `invite-user` |

## Lists

| Constant | Path |
|----------|------|
| `URL_CREATE_LIST` | `createList` |
| `URL_UPDATE_LIST` | `updateList` |
| `URL_DELETE_LIST` | `deleteList` |
| `URL_USER_LIST` | `getlist` |
| `URL_CREATE_LIST_ROUTE` | `generateroute` |

## Routes

| Constant | Path |
|----------|------|
| `URL_CREATE_BASIC_ROUTE` | `createroute` |
| `URL_USER_ROUTE_UPDATE` | `updateroute` |
| `URL_UPDATE_ROUTE_ACTIVE` | `updaterouteactive` |
| `URL_USER_ROUTE_LIST` | `routelist` |
| `URL_GET_BASIC_ROUTE` | `simplerouteview` |
| `URL_GET_ADVANCED_ROUTE` | `advancerouteview` |
| `URL_ROUTE_REMOVE` | `routeremove` |
| `URL_RE_ROUTE` | `routeRegenerate` |
| `URL_REROUTE` | `reroute` |
| `URL_CHECK_ROUTE_NAME` | `checkroutename` |
| `URL_ROUTE_ONBOARDING_CONVERSION` | `routeonboardingconversion` |
| `URL_GET_USER_ACTIVE_ROUTE` | `getuseractiveroute` |
| `URL_GET_USER_ACTIVE_ROUTE_V1` | `getuseractiveroutev1` |
| `URL_GET_ACTIVE_ROUTE_COMPANY` | `getactiveroutecompany` |
| `COMPANY_BOOKMARK` | `bookmarkroutecompany` |
| `COMPANY_NAVIGATE_ME` | `companynavigateme` |
| `SHARE_ROUTE_LIST` | `shareRouteList` |
| `GET_SHARED_EMAIL_LIST` | `getShareRouteListEmails` |
| `URL_SCAN_QR_CODE` | `scan-qr-code` |

## Companies / visits

| Constant | Path |
|----------|------|
| `URL_USER_COMPANY_LIST` | `companylist` |
| `URL_USER_COMPANY_LIST_MAP` | `companylistmap` |
| `URL_COMPANY_DETAILS` | `companydetail` |
| `URL_COMPANY_NAME_LIST` | `companynamelist` |
| `URL_ADD_COMPANY` | `addcompany` |
| `URL_UPDATE_COMPANY` | `updatecompany` |
| `URL_REMOVE_COMPANIES` | `removeCompanies` |
| `URL_BULK_COMPANIES_CREATE` | `bulk-companies-create` |
| `URL_SELECT_ALL_COMPANY_LIST` | `selectallcompany` |
| `URL_COMPANY_MARKED_VISITED` | `companymarkedvisited` |
| `URL_UPDATE_COMPANY_STATUS` | `updatecompanystatus` |
| `URL_UPDATE_COMPANY_NOTES` | `updatecompanynotes` |
| `URL_ADD_COMPANY_VISIT_TIME` | `addcompanyvisittime` |
| `URL_DELETE_COMPANY_VISIT` | `companyvisitremove` |
| `URL_GET_LAST_VISITED_ENTRY` | `getlastvisitedentry` |
| `URL_REPORT_COMPANY` | `reportcompany` |

## Activities / notes

| Constant | Path |
|----------|------|
| `URL_GET_COMPANY_ACTIVITIES` | `getcompanyactivities` |
| `URL_ADD_COMPANY_ACTIVITY` | `addcompanyactivity` |
| `URL_UPDATE_COMPANY_ACTIVITY` | `updatecompanyactivity` |
| `URL_ADD_ACTIVITY` | `addactivity` |
| `URL_GET_COMPANY_NOTE` | `getnotes` |
| `URL_SAVE_NOTE` | `addnote` |
| `URL_UPDATE_NOTES` | `updatenote` |
| `URL_DELETE_NOTES` | `deletenote` |
| `URL_GET_LOG_MEET` | `getlogmeeting` |
| `URL_SAVE_LOG_MEET` | `addlogmeeting` |
| `URL_GET_USER_ACTIVITY` | `getUserActivity` |

## Contacts / enrich

| Constant | Path |
|----------|------|
| `URL_USER_CONTACT_LIST` | `contactlist` |
| `URL_USER_COMPANY_CONTACT_LIST` | `companycontactlist` |
| `URL_CONTACT_DETAILS` | `getContactDetail` |
| `URL_USER_ADD_CONTACT` | `addcontact` |
| `URL_USER_UPDATE_CONTACT` | `updatecontact` |
| `URL_DELETE_CONTACT` | `deletecontact` |
| `URL_UNASSIGN_CONTACT_LIST` | `unassigncontactlist` |
| `URL_UPDATE_CONTACT_NOTES` | `updatecontactnotes` |
| `URL_SAVE_COMPANY_CONTACT` | `buyContacts` |
| `URL_REPORT_CONTACT` | `reportcontact` |
| `URL_FETCH_FIRST_CONTACT` | `fetchAllContacts` |
| `URL_CONGNISUM_CONTACT` | `getCongnismContact` |
| `URL_SAVE_CONGNISUM_CONTACT` | `redeemCongnismContact` |
| `URL_APOLLO_CONTACT` | `getApolloContact` |
| `URL_SAVE_APOLLO_CONTACT` | `redeemApolloContact` |
| `URL_SAVE_FULL_ENRICH_CONTACT` | `redeemFullEnrichContact` |
| `URL_OPENCORPORATES_COMPANY` | `getOpencorporatesCompany` |
| `URL_OPENCORPORATES_CONTACT` | `getOpencorporatesContact` |
| `URL_FETCH_CLAUDE_CONTACT` | `fetchClaudeContact` |

## AI leads

| Constant | Path |
|----------|------|
| `URL_GET_AI_COMPANIES` | `getAILeads` |
| `URL_GET_AI_COMPANIES_LIST` | `aiLeadGoogleSearch` |
| `URL_GET_AI_COMPANIES_V2` | `getAILeadsV2` |
| `URL_GET_AI_COMPANIES_LIST_V2` | `resumeAILeadSearch` |
| `URL_GET_AI_LEAD_DATA` | `getAiLeadData` |
| `URL_GET_AI_COMPANIES_CONTACT_LIST` | `AILeadsContactFinder` |
| `URL_GET_TOP50_AI_COMPANIES` | `getTop50AILeads` |
| `URL_AI_BULK_COMPANIES_CREATE` | `saveAILeads` |

## Status / lookups / alerts / HubSpot / misc

| Constant | Path |
|----------|------|
| `URL_GET_USER_STATUS_DETAILS` | `getuserstatusdetails` |
| `GET_USER_STATUS_LIST` | `getuserstatus` |
| `UPDATE_USER_STATUS` | `updateuserstatus` |
| `URL_GET_USER_LIFE_STAGE_DETAILS` | `getusercontactstage` |
| `URL_GET_USER_CATEGORY_DETAILS` | `getcategories` |
| `URL_SEARCH_CITY` | `citysearch` |
| `GET_INDUSTRY_TYPES` | `getIndutriesType` |
| `URL_GET_VERSION_DETAILS` | `getversiondetails` |
| `URL_USER_ALERT_LIST` | `notificationlist` |
| `URL_ALERT_MARKED_READ` | `notificationmarkread` |
| `URL_UNREAD_TICKET_COUNT` | `unreadticketcount` |
| `URL_LAST_SYNC` | `hubspot-last-sync` |
| `URI_COMPANIES_SYNC` | `hubspot-companies-sync` |
| `URI_CONTACT_SYNC` | `hubspot-contacts-sync` |
| `URI_BOTH_SYNC` | `hubspot-both-sync` |
| `URL_HUBSPOT_ERROR_COMP` | `hubspot-sync-error-list` |
| `URL_HUBSPOT_ERROR_COMP_FIX` | `hubspotSessionCompanyErrorFix` |
| `URL_HUBSPOT_ERROR_COMP_DEL` | `hubspotSessionCompanyDelete` |

Dingo also exposes extra routes the mobile config may not name: support tickets, `getYelpLeads`, `getBizpediaContact`, `getuserdata`, uploaderror/*, `notificationremove`, `newreleasenotify`, `publishroute`, `getroutedata`, `addticket`, and others.
