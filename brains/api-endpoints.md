# API endpoints — v2 route table

Generated 2026-09-22 from `webterritool/routes/api.php` (the `$api->version('v2')` block) and `TerriTool/App/config/index.js`. Recounted 2026-11-02 from `routes/api.php` on `master` `d3f75449` and `beta_react` `929f0c7f` (the two files are identical) and `App/config/index.js` on `TT_80` `daf50eeb` ([review](../reviews/live-code-2026-11-02.md)). When this page and those files disagree, the files win. Rules and credit costs: [API](api.md). Mobile call shape: [mobile components](../code/mobile-components.md).

The committed `URL_BASE` is production, `https://app.territool.com/index.php/api/` (`App/config/index.js:12` on `TT_80` and `Production`). Tests use staging, `https://staging.territool.com/index.php/api/`. "jwt" means the route sits inside the `jwt.refresh` group and needs `Authorization: Bearer`. "public" means no token. "Mobile constant" is the export in `App/config/index.js` on `TT_80` that the app appends to `URL_BASE`; a blank cell means the app does not call it today (web, cron, or webhook only). Handlers are in `app/Api/V2/Controllers/` unless marked `Http`.

Totals on 2026-11-02: 150 routes on both `master` and `beta_react`, 125 behind JWT, 115 with a `TT_80` mobile constant. Against `Production`'s config the figure is 112, because it lacks the app-keys and calendar constants. The five routes added since 2026-09-29 are `appkeys-<suffix>`, `getBulkContactsCompanies`, `getClaudeContactCounts`, `google-calendar/connection` and `google-calendar/sync`.

## Auth, session, profile

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `appkeys-<suffix>` | GET | `AuthController@appKeys` | jwt | `URL_APP_KEYS` | Returns `status` 1 with `MAPBOX_ACCESS_TOKEN`, `DIRECTION_APIKEY`, `GEMINI_API_KEY` and `GOOGLE_KEY` from `config/appkeys.php`. The suffix is in `routes/api.php:111`. |
| `authenticate` | POST | `AuthController@authenticate` | public |  |  |
| `downloadpdf` | POST | `CompanyController@download` | public |  |  |
| `getUsers` | GET | `AuthController@getAllUser` | public |  |  |
| `getrestrictuser` | GET | `RouteController@getRestrictUser` | public | `USER_RESTRICT` |  |
| `getuserdata` | GET | `UserDataController@show` | jwt |  |  |
| `getuserdata` | POST | `UserDataController@show` | jwt |  |  |
| `getversiondetails` | POST | `RouteController@getVersionDetails` | jwt | `URL_GET_VERSION_DETAILS` |  |
| `invite-user` | POST | `InviteController@inviteUser` | jwt | `URL_INVITE_USER` | Review rewards sends FormData `type` `g2` or `ph`. Status `1` opens the review URL. |
| `leads_user` | POST | `AuthController@leadsUser` | public | `URL_USER_REGISTER_STORE` |  |
| `login` | POST | `AuthController@login` | public | `URL_USER_LOGIN` |  |
| `logout` | POST | `AuthController@logout` | public | `URL_USER_LOGIN_LOGOUT` |  |
| `mobileregistration` | POST | `AuthController@mobileRegister` | public | `URL_USER_REGISTER` |  |
| `newreleasenotify` | GET | `RouteController@newReleaseNotify` | jwt |  |  |
| `recovery` | POST | `AuthController@recovery` | public |  |  |
| `renewtoken` | POST | `AuthController@renewToken` | public |  |  |
| `reset` | POST | `AuthController@reset` | public |  |  |
| `scan-qr-code` | POST | `AuthController@scanQRCode` | jwt | `URL_SCAN_QR_CODE` |  |
| `signup` | POST | `AuthController@signup` | public |  |  |
| `updateName` | POST | `CompanyController@updateName` | jwt | `URL_EDIT_NAME` |  |
| `updateUserPreferences` | POST | `AuthController@updateUserPreferences` | jwt | `URI_UPDATE_USER_PREFERENCES` |  |
| `validate-phone` | POST | `AuthController@validatePhone` | public |  |  |

## Credits and subscription

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `cancelSubscription` | GET | `RouteController@cancelSubscribe` | jwt | `CANCEL_SUBSCRIPTION` |  |
| `cancelSubscription` | POST | `RouteController@cancelSubscribe` | jwt | `CANCEL_SUBSCRIPTION` |  |
| `getusercredit` | GET | `RouteController@getUserCredit` | jwt | `GET_CREDIT_INFO` | 0. Also returns `has_used_ai_find_leads`, `google_calendar_connected` and `google_calendar_last_sync` (`RouteController.php:3719-3747`). |
| `request-package-upgrade` | POST | `RouteController@requestPackageUpgrad` | jwt | `CHANGE_SUBSCRIPTION` |  |
| `revenue-subscription-update` | POST | `WebhookController@revenueSubscriptio` | public |  |  |
| `revenuecate-success` | POST | `AuthController@revenuecateSuccess` | public | `URL_REVENUECAT_SUCCESS` |  |

## Companies (Address Book)

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `addcompany` | POST | `CompanyController@add` | jwt | `URL_ADD_COMPANY` |  |
| `bookmarkroutecompany` | POST | `RouteController@bookmarkRouteCompany` | jwt | `COMPANY_BOOKMARK` |  |
| `bulk-companies-create` | POST | `CompanyController@bulkCompaniesCreat` | jwt | `URL_BULK_COMPANIES_CREATE` |  |
| `companydetail` | POST | `RouteController@companyDetail` | jwt | `URL_COMPANY_DETAILS` |  |
| `companylist` | POST | `RouteController@companyList` | jwt | `URL_USER_COMPANY_LIST` |  |
| `companylistmap` | POST | `RouteController@companyListMap` | jwt | `URL_USER_COMPANY_LIST_MAP` |  |
| `companymarkedvisited` | POST | `RouteController@companyMarkedVisited` | jwt | `URL_COMPANY_MARKED_VISITED` |  |
| `companynamelist` | POST | `RouteController@companyNameList` | jwt | `URL_COMPANY_NAME_LIST` |  |
| `companynavigateme` | POST | `RouteController@companyNavigateMe` | jwt | `COMPANY_NAVIGATE_ME` |  |
| `getlastvisitedentry` | POST | `RouteController@getLastVisitedEntry` | jwt | `URL_GET_LAST_VISITED_ENTRY` |  |
| `removeCompanies` | POST | `CompanyController@removeCompanies` | jwt | `URL_REMOVE_COMPANIES` |  |
| `reportcompany` | POST | `CompanyController@reportCompany` | jwt | `URL_REPORT_COMPANY` |  |
| `selectallcompany` | POST | `RouteController@companySelectAll` | jwt | `URL_SELECT_ALL_COMPANY_LIST` |  |
| `updatecompany` | POST | `CompanyController@updateCompany` | jwt | `URL_UPDATE_COMPANY` |  |
| `updatecompanynotes` | POST | `RouteController@updateCompanyNotes` | jwt | `URL_UPDATE_COMPANY_NOTES` |  |
| `updatecompanystatus` | POST | `RouteController@updateCompanyStatus` | jwt | `URL_UPDATE_COMPANY_STATUS` |  |
| `uploaderror/append-companies` | GET | `CompanyController@appendCompanies` | jwt |  |  |
| `uploaderror/autofill-address` | GET | `CompanyController@autofillAddress` | jwt |  |  |
| `uploaderror/autofill-company` | GET | `CompanyController@autofillCompany` | jwt |  |  |
| `uploaderror/delete-duplicate` | GET | `CompanyController@deleteDuplicate` | jwt |  |  |
| `uploaderror/merge-contacts-with-company` | POST | `CompanyController@mergeContactsWithC` | jwt |  |  |

## Notes, activities, meetings

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `addcompanyactivity` | POST | `CompanyController@addCompanyActivity` | jwt | `URL_ADD_COMPANY_ACTIVITY` |  |
| `addcompanyvisittime` | POST | `RouteController@addcompanyVisit` | jwt | `URL_ADD_COMPANY_VISIT_TIME` |  |
| `addlogmeeting` | POST | `CompanyController@addCompanyLogMeeti` | jwt | `URL_SAVE_LOG_MEET` |  |
| `addnote` | POST | `CompanyController@addCompanyNote` | jwt | `URL_SAVE_NOTE` |  |
| `companyvisitremove` | POST | `RouteController@removeCompanyVisit` | jwt | `URL_DELETE_COMPANY_VISIT` |  |
| `deletenote` | POST | `CompanyController@deleteCompanyNote` | jwt | `URL_DELETE_NOTES` |  |
| `getUserActivity` | POST | `AuthController@getUserActivity` | jwt | `URL_GET_USER_ACTIVITY` |  |
| `getcompanyactivities` | POST | `CompanyController@getCompanyActiviti` | jwt | `URL_GET_COMPANY_ACTIVITIES` |  |
| `getlogmeeting` | POST | `CompanyController@getCompanyLogMeeti` | jwt | `URL_GET_LOG_MEET` |  |
| `getnotes` | POST | `CompanyController@getCompanyNotes` | jwt | `URL_GET_COMPANY_NOTE` |  |
| `google-calendar/connection` | POST | `GoogleCalendarController@store` | jwt | `URL_GOOGLE_CALENDAR_CONNECTION` | The app sends JSON `accessToken`, `refreshToken`, `expiresAt` (`asJson`); a `code` is also accepted |
| `google-calendar/sync` | POST | `GoogleCalendarController@sync` | jwt | `URL_GOOGLE_CALENDAR_SYNC` | Copies meetings and appointments to Google; `data` has `created`, `updated`, `removed`, `skipped`, `failed`, `needs_auth` |
| `updatecompanyactivity` | POST | `CompanyController@updateCompanyActiv` | jwt | `URL_UPDATE_COMPANY_ACTIVITY` |  |
| `updatenote` | POST | `CompanyController@updateCompanyNote` | jwt | `URL_UPDATE_NOTES` |  |

## Contacts and enrichment

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `AILeadsContactFinder` | POST | `CompanyController@AILeadsContactFind` | jwt | `URL_GET_AI_COMPANIES_CONTACT_LIST` |  |
| `addcontact` | POST | `ContactSellController@addContact` | jwt | `URL_USER_ADD_CONTACT` | 0 |
| `buyContacts` | POST | `CompanyController@buyContacts` | jwt | `URL_SAVE_COMPANY_CONTACT` | 2 (1 on the Claude/biz path) |
| `companycontactlist` | POST | `RouteController@companyContactList` | jwt | `URL_USER_COMPANY_CONTACT_LIST` |  |
| `contactlist` | POST | `RouteController@contactList` | jwt | `URL_USER_CONTACT_LIST` |  |
| `deletecontact` | POST | `ContactSellController@deleteContact` | jwt | `URL_DELETE_CONTACT` |  |
| `fetchAllContacts` | POST | `CompanyController@fetchAllContacts` | jwt | `URL_FETCH_FIRST_CONTACT` |  |
| `fetchClaudeContact` | POST | `CompanyController@fetchClaudeContact` | jwt | `URL_FETCH_OPENCORPORATES_COMPANY`, `URL_FETCH_CLAUDE_CONTACT` | 1 (Claude/biz path) |
| `fetchOpencorporatesCompany` | POST | `CompanyController@fetchOpencorporate` | jwt | `URL_FETCH_OPENCORPORATES_COMPANY` |  |
| `getApolloContact` | POST | `CompanyController@getApolloContact` | jwt | `URL_APOLLO_CONTACT` |  |
| `getBizpediaContact` | POST | `CompanyController@getBizpediaContact` | jwt |  |  |
| `getBulkContactsCompanies` | POST | `CompanyController@getBulkContactsCompanies` | jwt | `URL_GET_BULK_CONTACTS_COMPANIES` | FormData `route_id` or `list_id`, `source`, `page`, `per_page` (default 10) |
| `getClaudeContactCounts` | POST | `CompanyController@getClaudeContactCounts` | jwt | `URL_GET_CLAUDE_CONTACT_COUNTS` | At most 10 `company_ids[]`; more returns 422 "Provide up to 10 company IDs." |
| `getCongnismContact` | POST | `CompanyController@getCongnismContact` | jwt | `URL_CONGNISUM_CONTACT` |  |
| `getContactDetail` | POST | `RouteController@getContactDetail` | jwt | `URL_CONTACT_DETAILS` |  |
| `getOpencorporatesCompany` | POST | `CompanyController@getOpencorporatesC` | jwt | `URL_OPENCORPORATES_COMPANY` |  |
| `getOpencorporatesContact` | POST | `CompanyController@getOpencorporatesC` | jwt | `URL_OPENCORPORATES_CONTACT` |  |
| `redeemApolloContact` | POST | `CompanyController@redeemApolloContac` | jwt | `URL_SAVE_APOLLO_CONTACT` | see contactBuyCredits.js |
| `redeemCongnismContact` | POST | `CompanyController@redeemCongnismCont` | jwt | `URL_SAVE_CONGNISUM_CONTACT` | see contactBuyCredits.js |
| `redeemFullEnrichContact` | POST | `CompanyController@redeemFullEnrichCo` | jwt | `URL_SAVE_FULL_ENRICH_CONTACT` | see contactBuyCredits.js |
| `reportcontact` | POST | `ContactSellController@reportContact` | jwt | `URL_REPORT_CONTACT` |  |
| `unassigncontactlist` | POST | `RouteController@unassignContactlist` | jwt | `URL_UNASSIGN_CONTACT_LIST` |  |
| `updatecontact` | POST | `ContactSellController@updateContact` | jwt | `URL_USER_UPDATE_CONTACT` |  |
| `updatecontactnotes` | POST | `ContactSellController@updateContactN` | jwt | `URL_UPDATE_CONTACT_NOTES` |  |

## Find Leads

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `aiLeadGoogleSearch` | POST | `CompanyController@AILeadGoogleSearch` | jwt | `URL_GET_AI_COMPANIES_LIST` |  |
| `getAILeads` | POST | `CompanyController@getAILeads` | jwt | `URL_GET_AI_COMPANIES` |  |
| `getAILeadsV2` | POST | `CompanyController@getAILeadsV2` | jwt | `URL_GET_AI_COMPANIES_V2` | 0. Since web commit `abe88426` (2026-09-29), a request with `radius_miles` returns 422. The app no longer sends it; the MCP `find_ai_leads` tool does for a field rep. See [API](api.md). |
| `getAiLeadData` | GET | `CompanyController@getAiLeadData` | jwt | `URL_GET_AI_LEAD_DATA` | 0 |
| `getTop50AILeads` | POST | `CompanyController@getTop50AILeads` | jwt | `URL_GET_TOP50_AI_COMPANIES` |  |
| `getYelpLeads` | POST | `CompanyController@getYelpLeads` | jwt |  |  |
| `resumeAILeadSearch` | POST | `CompanyController@resumeAILeadSearch` | jwt | `URL_GET_AI_COMPANIES_LIST_V2` | 0 |
| `saveAILeads` | POST | `CompanyController@saveAILeads` | jwt | `URL_AI_BULK_COMPANIES_CREATE` | 1 per company |

## Routes

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `advancerouteview` | POST | `RouteController@advanceRouteView` | jwt | `URL_GET_ADVANCED_ROUTE` |  |
| `checkroutename` | POST | `RouteController@checkRouteName` | jwt | `URL_CHECK_ROUTE_NAME` |  |
| `createroute` | POST | `RouteController@createRoute` | jwt | `URL_CREATE_BASIC_ROUTE` |  |
| `generateroute` | POST | `ListController@generateroute` | jwt | `URL_CREATE_LIST_ROUTE` |  |
| `getShareRouteListEmails` | POST | `RouteController@getShareRouteListEma` | jwt | `GET_SHARED_EMAIL_LIST` |  |
| `getactiveroutecompany` | POST | `RouteController@getActiveRouteCompan` | jwt | `URL_GET_ACTIVE_ROUTE_COMPANY` |  |
| `getroutedata` | POST | `RouteController@offlineRouteData` | jwt |  |  |
| `getuseractiveroute` | GET | `RouteController@getUserActiveRoute` | jwt | `URL_GET_USER_ACTIVE_ROUTE` |  |
| `getuseractiveroute` | POST | `RouteController@getUserActiveRoute` | jwt | `URL_GET_USER_ACTIVE_ROUTE` |  |
| `getuseractiveroutev1` | POST | `RouteController@getUserActiveRouteCo` | jwt | `URL_GET_USER_ACTIVE_ROUTE_V1` |  |
| `publishroute` | POST | `RouteController@publishRoute` | jwt |  |  |
| `reroute` | POST | `RouteController@reRoute` | jwt | `URL_REROUTE` |  |
| `routeRegenerate/{id}` | GET | `RouteController@routeRegenerate` | jwt |  |  |
| `routecompanyremove` | POST | `RouteController@routeCompanyRemove` | jwt |  |  |
| `routelist` | GET | `RouteController@routeList` | jwt | `URL_USER_ROUTE_LIST` |  |
| `routeonboardingconversion` | POST | `RouteController@storeRouteOnboarding` | jwt | `URL_ROUTE_ONBOARDING_CONVERSION` |  |
| `routeremove` | POST | `RouteController@routeRemove` | jwt | `URL_ROUTE_REMOVE` |  |
| `shareRouteList` | POST | `RouteController@shareRouteList` | jwt | `SHARE_ROUTE_LIST` |  |
| `simplerouteview` | POST | `RouteController@simpleRouteView` | jwt | `URL_GET_BASIC_ROUTE` | `total_contacts` skips soft-deleted contacts since `4a1856f4` |
| `updateroute` | POST | `RouteController@updateRoute` | jwt | `URL_USER_ROUTE_UPDATE` |  |
| `updaterouteactive` | POST | `RouteController@updateRouteActive` | jwt | `URL_UPDATE_ROUTE_ACTIVE` |  |

## Lists

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `createList` | POST | `ListController@createList` | jwt | `URL_CREATE_LIST` |  |
| `deleteList` | POST | `ListController@deleteList` | jwt | `URL_DELETE_LIST` |  |
| `getlist` | GET | `ListController@getLists` | jwt | `URL_USER_LIST` |  |
| `updateList` | POST | `ListController@updateList` | jwt | `URL_UPDATE_LIST` |  |

## Statuses, categories, stages

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `getIndutriesType` | GET | `CompanyController@getIndutriesType` | jwt | `GET_INDUSTRY_TYPES` |  |
| `getcategories` | GET | `RouteController@getUserCategories` | public | `URL_GET_USER_CATEGORY_DETAILS` |  |
| `getusercontactstage` | GET | `RouteController@getUserContactStage` | public | `URL_GET_USER_LIFE_STAGE_DETAILS` |  |
| `getuserstatus` | GET | `RouteController@getUserStatus` | jwt | `GET_USER_STATUS_LIST` |  |
| `getuserstatusdetails` | GET | `RouteController@getUserStatusDetails` | jwt | `URL_GET_USER_STATUS_DETAILS` |  |
| `updateuserstatus` | POST | `RouteController@updateUserStatus` | jwt | `UPDATE_USER_STATUS` |  |

## Notifications and support

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `addticket` | POST | `SupportController@addTicket` | jwt |  |  |
| `getticket` | POST | `SupportController@getTicket` | jwt |  |  |
| `getticketdetail` | POST | `SupportController@getTicketDetail` | jwt |  |  |
| `notificationlist` | GET | `RouteController@notificationListing` | jwt | `URL_USER_ALERT_LIST` |  |
| `notificationmarkread` | POST | `RouteController@notificationMarkRead` | jwt | `URL_ALERT_MARKED_READ` |  |
| `notificationremove` | POST | `RouteController@notificationRemove` | jwt |  |  |
| `notifications` | POST | `RouteController@notifications` | jwt |  |  |
| `unreadticketcount` | POST | `SupportController@unreadTicketCount` | jwt | `URL_UNREAD_TICKET_COUNT` |  |
| `updateticket` | POST | `SupportController@updateTicket` | jwt |  |  |

## CRM sync

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `citysearch` | GET | `CityController@search` | public | `URL_SEARCH_CITY` |  |
| `citysearch` | POST | `CityController@search` | public | `URL_SEARCH_CITY` |  |
| `hubspot-both-sync` | POST | Http `HubSpotController@syncBothAPI` | jwt | `URI_BOTH_SYNC` |  |
| `hubspot-companies-sync` | POST | Http `HubSpotController@syncCompaniesAPI` | jwt | `URI_COMPANIES_SYNC` |  |
| `hubspot-contacts-sync` | POST | Http `HubSpotController@syncContactsAPI` | jwt | `URI_CONTACT_SYNC` |  |
| `hubspot-last-sync` | GET | Http `HubSpotController@getLastSyncDetailsBySyncType` | jwt | `URL_LAST_SYNC` |  |
| `hubspot-sync-error-list` | GET | Http `HubSpotController@companySessionErrorList` | jwt | `URL_HUBSPOT_ERROR_COMP` |  |
| `hubspotSessionCompanyDelete` | POST | Http `HubSpotController@sessionCompanyDelete` | jwt | `URL_HUBSPOT_ERROR_COMP_DEL` |  |
| `hubspotSessionCompanyErrorFix` | POST | Http `HubSpotController@sessionCompanyErrorFix` | jwt | `URL_HUBSPOT_ERROR_COMP_FIX` |  |

## Webhooks and integrations (server to server)

| Path | Method | Handler | Auth | Mobile constant | Credits |
|---|---|---|---|---|---|
| `apollo-webhook` | POST | `WebhookController@handle` | public |  |  |
| `fullenrich-webhook/bulk/{jobId}` | POST | `WebhookController@fullEnrichBulkWebh` | public |  |  |
| `fullenrich-webhook/bulk/{jobId}/contact` | POST | `WebhookController@fullEnrichBulkCont` | public |  |  |
| `fullenrich-webhook/{company_id}` | POST | `WebhookController@fullEnrichWebhook` | public |  |  |
| `zapierCompanyCreate` | GET | Http `SfdcController@zapierCompanyCreate` | public |  |  |
| `zapierContactCreate` | GET | Http `SfdcController@zapierContactCreate` | public |  |  |

## Mobile constants with no v2 route

These exports exist in `App/config/index.js` but no v2 route matches. Do not call them from a new screen without checking the server first.

| Constant | Path |
|---|---|
| `URL_ADD_ACTIVITY` | `addactivity` |
| `URL_RE_ROUTE` | `routeRegenerate` — prefix of `routeRegenerate/{id}`, so the app appends the id |
| `URL_SEND_REFERRAL_INVITE` | `sendReferralInvite` |
| `URL_USER_FORGOT` | `forgotPassword` |
| `URL_VOICE_SESSION` | `voice/session` — GET, Voice Mode key |
| `URL_VOICE_TOOL` | `voice/tool` — POST JSON, one tool call |

The two voice constants are not Laravel routes on `master` or `beta_react`. `App/voice/voiceApi.js` sends them to the voice server at `VOICE_DEMO_URL`, which follows the build (`App/config/index.js:43-45`), with JSON over `fetch`, not `API.post`. Shapes: [API](api.md#voice-mode-mobile).

Web-link constants that are not API calls: `DYNAMIC_LOGIN` (`mobilelogin/`), `DYNAMIC_CREDIT_UPGRADE_LOGIN` (`mobilelogin/credits/`), `DYNAMIC_REFERRAL_LOGIN` (`mobilelogin/referral/`). They open the web app in Safari with the JWT, for plan and credit pages.