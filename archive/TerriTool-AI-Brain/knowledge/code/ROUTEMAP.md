---
title: "Route map"
---

# Route map

Generated 2026-09-16 by `tools/routemap.py` from `php artisan route:list` on the local checkout; each `Controller@method` body was scanned for `view('…')`, JSON, redirect and download responses. **Regenerate rather than hand-edit** — `python3 tools/routemap.py  (script still lives with the original pack generators; this copy of ROUTEMAP.md is the snapshot)`.

Use this to go from a URL in a bug report or a screen in a feature's `evidence.md` straight to the owning controller method and the Blade view it renders. Feature ownership at the controller level is in [CODEMAP.md](CODEMAP.md); required behavior is in the feature's `MODULE.md` under `features/`.

## Totals

- **725** routes · **77** controllers · **3** closures
- App (sales rep): 400
- Manager Portal: 35
- Admin HQ: 76
- API (token clients): 29
- MCP servers: 52
- Auth: 17
- Cron / Webhooks: 8
- Backpack admin (vendor): 95
- Vendor / dev tooling: 13

**Reading the Views column:** a backticked name is a Blade view under `resources/views/`; `json` means the method returns JSON (AJAX/API); `redirect` means it redirects with no view; `download` streams a file; `—` means none of those were found in the method body (usually a plain response, an abort, or logic that lives in a called helper).


## App (sales rep)


### `AILeadFinderController` (6 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `ai-lead-finder/complete/{searchId}` | — | `completeSearch` | json | auth,role |
| POST | `ai-lead-finder/stage1/{searchId}` | — | `runStage1` | json | auth,role |
| POST | `ai-lead-finder/stage2/{searchId}` | — | `runStage2Page` | json | auth,role |
| POST | `ai-lead-finder/stage3/{searchId}` | — | `runStage3` | json | auth,role |
| POST | `ai-lead-finder/start` | — | `startSearch` | json | auth,role |
| GET | `ai-lead-finder/status/{searchId}` | — | `searchStatus` | json | auth,role |

### `AdvancedRouteController` (18 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `advancedroute` | crud.advancedroute.store | `store` | — | auth,role,Closure,subscriber |
| GET | `advancedroute` | crud.advancedroute.index | `index` | — | auth,role,Closure,subscriber |
| GET | `advancedroute/create` | crud.advancedroute.create | `create` | — | auth,role,Closure,subscriber |
| GET | `advancedroute/reorder` | crud.advancedroute.reorder | `reorder` | — | auth,role,Closure,subscriber |
| POST | `advancedroute/reorder` | crud.advancedroute.save.reorder | `saveReorder` | — | auth,role,Closure,subscriber |
| POST | `advancedroute/search` | crud.advancedroute.search | `search` | — | auth,role,Closure,subscriber |
| GET | `advancedroute/step3/{id}` | — | `editstep3` | `front.advancedroute.step3` | auth,role,Closure,subscriber |
| POST | `advancedroute/step4/{id}` | — | `editstep4` | `front.advancedroute.step4`, json | auth,role,Closure,subscriber |
| GET | `advancedroute/step4/{id}` | — | `editstep4` | `front.advancedroute.step4`, json | auth,role,Closure,subscriber |
| GET | `advancedroute/step5/{id}` | — | `editstep5` | `front.advancedroute.step5` | auth,role,Closure,subscriber |
| PUT|PATCH | `advancedroute/{advancedroute}` | crud.advancedroute.update | `update` | — | auth,role,Closure,subscriber |
| DELETE | `advancedroute/{advancedroute}` | crud.advancedroute.destroy | `destroy` | — | auth,role,Closure,subscriber |
| GET | `advancedroute/{advancedroute}` | crud.advancedroute.show | `show` | — | auth,role,Closure,subscriber |
| GET | `advancedroute/{advancedroute}/edit` | crud.advancedroute.edit | `edit` | — | auth,role,Closure,subscriber |
| GET | `advancedroute/{id}/details` | crud.advancedroute.showDetailsRow | `showDetailsRow` | — | auth,role,Closure,subscriber |
| GET | `advancedroute/{id}/revisions` | crud.advancedroute.listRevisions | `listRevisions` | — | auth,role,Closure,subscriber |
| POST | `advancedroute/{id}/revisions/{revisionId}/restore` | crud.advancedroute.restoreRevision | `restoreRevision` | — | auth,role,Closure,subscriber |
| GET | `advancedroute/{id}/translate/{lang}` | crud.advancedroute.translateItem | `translateItem` | — | auth,role,Closure,subscriber |

### `App\McpClient\Http\Controllers\SalespersonMcpController` (11 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `salesforce/callback` | — | `oauthCallback` | json | — |
| POST | `salesperson/mcp/chat` | — | `chat` | json | auth,role |
| POST | `salesperson/mcp/connections` | — | `store` | json | auth,role |
| GET | `salesperson/mcp/connections` | — | `index` | json | auth,role |
| POST | `salesperson/mcp/connections/refresh-tools` | — | `refreshTools` | json | auth,role |
| POST | `salesperson/mcp/connections/{id}/delete` | — | `destroy` | json | auth,role |
| POST | `salesperson/mcp/hubspot-sync` | — | `hubspotSync` | json | auth,role |
| GET | `salesperson/mcp/hubspot-sync/status` | — | `hubspotSyncStatus` | json | auth,role |
| GET | `salesperson/mcp/oauth/callback` | — | `oauthCallback` | json | — |
| POST | `salesperson/mcp/sync` | — | `hubspotSync` | json | auth,role |
| GET | `salesperson/mcp/sync/status` | — | `hubspotSyncStatus` | json | auth,role |

### `BusinesssalespersonController` (15 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `businesssalesperson` | — | `index` | `front.businesssalesperson.list_view` | auth,role |
| POST | `businesssalesperson/activate/{userid}` | — | `activateStore` | — | — |
| GET | `businesssalesperson/activate/{userid}` | — | `activate` | `userauth.activate_set_password` | — |
| GET | `businesssalesperson/company-contacts/{id}` | — | `companyContactsList` | `front.businesssalesperson.bs_company_contacts_list` | auth,role |
| GET | `businesssalesperson/company-notes/{id}` | — | `companyNotes` | `front.businesssalesperson.bs_company_notes_list` | auth,role |
| GET | `businesssalesperson/create` | — | `create` | `front.businesssalesperson.create` | auth,role |
| POST | `businesssalesperson/create` | — | `store` | `front.businesssalesperson.convert_confirm` | auth,role |
| POST | `businesssalesperson/credit/{id}` | — | `creditupdate` | — | auth,role |
| GET | `businesssalesperson/credit/{id}` | — | `creditindex` | — | auth,role |
| GET | `businesssalesperson/details/{id}` | — | `salespersonDetails` | `front.businesssalesperson.salesperson_details` | auth,role |
| GET | `businesssalesperson/resendinvitation/{id}` | — | `resendinvitation` | — | auth,role |
| GET | `businesssalesperson/routes-list/{id}` | — | `routesList` | `front.businesssalesperson.bs_routes_list` | auth,role |
| GET | `businesssalesperson/{id}/edit` | — | `edit` | `front.businesssalesperson.edit` | auth,role |
| POST | `businesssalesperson/{id}/edit` | — | `update` | redirect | auth,role |
| GET | `businesssalesperson/{id}/remove` | — | `remove` | json | auth,role |

### `CompanylController` (99 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `AILeadsContactFinder` | — | `AILeadsContactFinder` | json | auth,role,subscriber |
| POST | `aiLeadDataStore` | — | `aiLeadDataStore` | json | auth,role,subscriber |
| GET | `company` | — | `index` | `front.company.listnewl` | auth,role,subscriber |
| POST | `company/Modalcreate` | — | `modalStore` | — | auth,role,subscriber |
| POST | `company/buyContacts` | — | `buyContacts` | json | subscriber |
| POST | `company/buyContactsAsync` | — | `buyContactsAsync` | json | subscriber |
| GET | `company/buyContactsProgress/{jobId?}` | — | `buyContactsJobProgress` | json | subscriber |
| POST | `company/buyContactsV2` | — | `buyContactsV2` | json | subscriber |
| GET | `company/companiesRecentlist/{employee?}/{annual_revenue?}/{status?}/{order_by?}/{open_close?}/{industry?}` | — | `companiesRecentlist` | json | subscriber |
| GET | `company/companieslist/{employee?}/{annual_revenue?}/{status?}/{order_by?}/{open_close?}/{industry?}` | — | `companieslist` | json | subscriber |
| POST | `company/companyActivity` | — | `companyActivity` | json | subscriber |
| GET | `company/contact/delete/{id}` | — | `contactDelete` | json | auth,role,subscriber |
| GET | `company/contact/delete/{id}/{cid}` | — | `deleteContact` | — | auth,role,subscriber |
| POST | `company/contact/report` | — | `reportContact` | json | subscriber |
| GET | `company/contacts/{id}` | — | `companyContacts` | json | auth,role,subscriber |
| GET | `company/create` | — | `create` | `front.company.createl` | auth,role,subscriber |
| POST | `company/create` | — | `store` | redirect | auth,role,subscriber |
| POST | `company/details` | — | `companyDetails` | json | subscriber |
| POST | `company/edit/{id}` | — | `update` | — | auth,role,subscriber |
| POST | `company/getBulkContactsCompanies` | — | `getBulkContactsCompanies` | json | subscriber |
| POST | `company/getClaudeContactCount` | — | `getClaudeContactCount` | json | subscriber |
| GET | `company/getCompany` | — | `getCompany` | — | subscriber |
| GET | `company/getStartEndPoint` | — | `getStartEndPoint` | — | subscriber |
| GET | `company/log-meeting-list` | — | `logMeetingList` | json | auth,role,subscriber |
| GET | `company/log_meeting/{id}/delete` | — | `removeLogMeeting` | — | auth,role,subscriber |
| GET | `company/log_meeting/{id}/edit` | — | `logMeetingEdit` | `front.company.log_meeting_edit` | auth,role,subscriber |
| GET | `company/mark-as-visited/{id}` | — | `markAsVisitedList` | json | auth,role,subscriber |
| GET | `company/notelist` | — | `Notelist` | json | subscriber |
| GET | `company/notes/{id}/delete` | — | `removenotesIngle` | — | subscriber |
| GET | `company/notes/{id}/edit` | — | `notesEdit` | `front.company.noteedit` | auth,role,subscriber |
| GET | `company/paginate_user_companies` | — | `paginate_user_companies` | json | subscriber |
| GET | `company/redeemBulkProgress/{jobId}` | — | `redeemBulkProgress` | json | subscriber |
| GET | `company/remove_log_meeting` | — | `removeAllLogMeeting` | json | auth,role,subscriber |
| POST | `company/removecompanies` | — | `removecompanies` | json | subscriber |
| GET | `company/removenotes` | — | `removenotes` | json | subscriber |
| GET | `company/removevisits` | — | `removevisits` | json | auth,role,subscriber |
| POST | `company/report` | — | `reportCompany` | json | subscriber |
| POST | `company/updateCompany` | — | `updateCompany` | json | auth,role,subscriber |
| GET | `company/viewmap` | — | `viewmap` | `front.company.viewmap`, json | auth,role,subscriber |
| POST | `company/viewmap` | — | `viewmap` | `front.company.viewmap`, json | auth,role,subscriber |
| GET | `company/viewmapallcompany` | — | `viewmapWithAllCompany` | `front.company.viewmap` | auth,role,subscriber |
| GET | `company/visit/{cid}/{id}/delete` | — | `deleteMarkAsVisit` | — | auth,role,subscriber |
| GET | `company/{id}/edit` | — | `edit` | `front.company.editl` | auth,role,subscriber |
| GET | `company/{id}/log_meeting/create` | — | `logMeetingCreate` | `front.company.log_meeting_create` | auth,role,subscriber |
| POST | `company/{id}/log_meeting/store` | — | `logMeetingStore` | — | auth,role,subscriber |
| POST | `company/{id}/log_meeting/update` | — | `logMeetingUpdate` | — | auth,role,subscriber |
| POST | `company/{id}/note/store` | — | `notestore` | — | auth,role,subscriber |
| POST | `company/{id}/note/update` | — | `notesUpdate` | — | auth,role,subscriber |
| GET | `company/{id}/notes` | — | `notes` | `front.company.noteslist` | auth,role,subscriber |
| GET | `company/{id}/notes/create` | — | `notescreate` | `front.company.notecreatel` | auth,role,subscriber |
| GET | `company/{id}/view` | — | `view` | `front.company.companyview` | auth,role,subscriber |
| POST | `contact/contactUpdate/{id}` | — | `contactUpdate` | — | subscriber |
| POST | `contact/createContact` | — | `contactStore` | — | subscriber |
| GET | `findleads` | — | `findleads` | `front.route.findleads` | auth,role,subscriber |
| POST | `findleads/add-to-route/{id}` | — | `addLeadsToExistingRoute` | json, redirect | auth,role,subscriber |
| POST | `getAILeads` | — | `getAILeads` | json | auth,role,subscriber |
| GET | `getAiLeadData` | — | `getAiLeadData` | — | auth,role,subscriber |
| POST | `getYelpLeads` | — | `getYelpLeads` | json | auth,role,subscriber |
| POST | `list/route/step1` | — | `findleadsCreateRoute` | `front.list.step1`, `front.route.step1`, json | auth,role,subscriber |
| POST | `markasvisited/delete` | — | `markAsVisitedDelete` | — | auth,role,subscriber |
| POST | `note/delete` | — | `removenotesList` | — | auth,role,subscriber |
| POST | `note/store` | — | `companynotestore` | — | auth,role,subscriber |
| POST | `note/update` | — | `notesUpdateList` | — | auth,role,subscriber |
| GET | `recent-company` | — | `recentCompany` | `front.company.recentList` | auth,role,subscriber |
| GET | `recent-company/viewmaprecentcompany` | — | `viewmapWithRecentCompany` | `front.company.viewmap` | auth,role,subscriber |
| GET | `route/add-to-route` | — | `addToRoute` | `front.route.step1`, json | auth,role,subscriber |
| POST | `route/add-to-route` | — | `addToRoute` | `front.route.step1`, json | auth,role,subscriber |
| POST | `route/create/step1` | — | `uploadCompanyCreateRoute` | — | auth,role,subscriber |
| POST | `saveAILeads` | — | `saveAILeads` | json | auth,role,subscriber |
| POST | `saveYelpLeads` | — | `saveYelpLeads` | json | auth,role,subscriber |
| POST | `updateName` | — | `updateName` | — | auth,role,subscriber |
| GET | `uploadcompany/address-error/{id}` | — | `addresserror` | `front.company.sessionerroraddress`, json | auth,role,subscriber |
| POST | `uploadcompany/bulkdelete` | — | `bulkDelete` | — | auth,role,subscriber |
| GET | `uploadcompany/deletesession` | — | `deletesession` | redirect | auth,role,subscriber |
| POST | `uploadcompany/deletesessionrecord/{id}` | — | `deletesessionrecord` | redirect | auth,role,subscriber |
| GET | `uploadcompany/deletesessionrecord/{id}` | — | `deletesessionrecord` | redirect | auth,role,subscriber |
| GET | `uploadcompany/downloadOldSample` | — | `downloadOldSample` | download | auth,role,subscriber |
| GET | `uploadcompany/downloadSample` | — | `downloadSample` | download | auth,role,subscriber |
| POST | `uploadcompany/error` | — | `BulkCompanyError` | json, redirect | auth,role,subscriber |
| GET | `uploadcompany/error/{id}` | — | `error` | `front.company.sessionerror`, json | auth,role,subscriber |
| POST | `uploadcompany/errorfix` | — | `errorfix` | json | auth,role,subscriber |
| POST | `uploadcompany/step1` | — | `step1` | `front.company.step1` | auth,role,subscriber |
| GET | `uploadcompany/step1` | — | `step1` | `front.company.step1` | auth,role,subscriber |
| POST | `uploadcompany/step2` | — | `step2` | `front.company.step2`, json | auth,role,subscriber |
| GET | `uploadcompany/step2` | — | `step2` | `front.company.step2`, json | auth,role,subscriber |
| POST | `uploadcompany/step2-preview` | — | `step2Preview` | `front.company.step2preview` | auth,role,subscriber |
| GET | `uploadcompany/step2-preview` | — | `step2Preview` | `front.company.step2preview` | auth,role,subscriber |
| GET | `uploadcompany/step3` | — | `step3` | `front.company.step3` | auth,role,subscriber |
| POST | `uploadcompany/step3` | — | `step3` | `front.company.step3` | auth,role,subscriber |
| GET | `uploadcompany/step4` | — | `step4` | `front.company.step4` | auth,role,subscriber |
| GET | `uploadcompany/step4sfdc` | — | `step4sfdc` | `front.company.step4sfdc` | auth,role,subscriber |
| GET | `uploadcompany/success` | — | `success` | `front.company.sessionsuccess` | auth,role,subscriber |
| GET | `uploadcompany/uploadcompanieserrorlist` | — | `uploadcompanieserrorlist` | json | auth,role,subscriber |
| GET | `uploadcompany/uploaderrors` | — | `uploaderrors` | `front.company.uploaderror` | auth,role,subscriber |
| GET | `uploaderror/append-companies` | — | `appendCompanies` | — | auth,role,subscriber |
| GET | `uploaderror/autofill-address` | — | `autofillAddress` | — | auth,role,subscriber |
| GET | `uploaderror/autofill-company` | — | `autofillCompany` | — | auth,role,subscriber |
| GET | `uploaderror/delete-duplicate` | — | `deleteDuplicate` | — | auth,role,subscriber |
| GET | `uploaderror/merge-contacts` | — | `mergeContacts` | — | auth,role,subscriber |

### `ContactController` (33 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `company/contact/create` | — | `create` | `front.contact.create` | auth,role,subscriber |
| GET | `contact` | — | `index` | `front.contact.listl` | auth,role,subscriber |
| GET | `contact/contactlist` | — | `contactlist` | json | subscriber |
| GET | `contact/create` | — | `create` | `front.contact.create` | auth,role,subscriber |
| POST | `contact/create` | — | `store` | — | auth,role,subscriber |
| GET | `contact/createAppointment/{contactId}` | — | `sendAppointment` | `front.contact.createappointment` | auth,role,subscriber |
| POST | `contact/createAppointment/{contactId}` | — | `sendAppointment` | `front.contact.createappointment` | auth,role,subscriber |
| GET | `contact/delete/{id}` | — | `delete` | — | auth,role,subscriber |
| POST | `contact/edit/{id}` | — | `update` | — | auth,role,subscriber |
| POST | `contact/removecontact` | — | `removecontact` | json | subscriber |
| GET | `contact/userstatusmigration` | — | `userstatusmigration` | — | auth,role,subscriber |
| GET | `contact/{id}/edit` | — | `edit` | `front.contact.editl` | auth,role,subscriber |
| GET | `recent-contact` | — | `recentContact` | `front.contact.recentList` | auth,role,subscriber |
| GET | `recentContactList` | — | `contactRecentList` | json | auth,role,subscriber |
| POST | `uploadcontact/bulkdelete` | — | `bulkDelete` | — | auth,role,subscriber |
| GET | `uploadcontact/deletesession` | — | `deletesession` | redirect | auth,role,subscriber |
| GET | `uploadcontact/deletesessionrecord/{id}` | — | `deletesessionrecord` | redirect | auth,role,subscriber |
| POST | `uploadcontact/deletesessionrecord/{id}` | — | `deletesessionrecord` | redirect | auth,role,subscriber |
| GET | `uploadcontact/downloadSample` | — | `downloadSample` | — | auth,role,subscriber |
| GET | `uploadcontact/error/{id}` | — | `error` | `front.contact.sessionerror` | auth,role,subscriber |
| POST | `uploadcontact/errorfix` | — | `errorfix` | — | auth,role,subscriber |
| GET | `uploadcontact/step1` | — | `step1` | `front.contact.step1` | auth,role,subscriber |
| POST | `uploadcontact/step1` | — | `step1` | `front.contact.step1` | auth,role,subscriber |
| GET | `uploadcontact/step2` | — | `step2` | `front.contact.step2`, json | auth,role,subscriber |
| POST | `uploadcontact/step2` | — | `step2` | `front.contact.step2`, json | auth,role,subscriber |
| GET | `uploadcontact/step3` | — | `step3` | `front.contact.step3` | auth,role,subscriber |
| POST | `uploadcontact/step3` | — | `step3` | `front.contact.step3` | auth,role,subscriber |
| GET | `uploadcontact/step4` | — | `step4` | `front.contact.step4` | auth,role,subscriber |
| GET | `uploadcontact/step4sfdc` | — | `step4sfdc` | `front.contact.step4sfdc` | auth,role,subscriber |
| GET | `uploadcontact/success` | — | `success` | `front.contact.sessionsuccess` | auth,role,subscriber |
| GET | `uploadcontact/uploadcontactserrorlist` | — | `uploadcontactserrorlist` | json | auth,role,subscriber |
| GET | `uploadcontact/uploaderrors` | — | `uploaderrors` | `front.contact.uploaderror` | auth,role,subscriber |
| POST | `uploadsuccesscontact/sfdc` | — | `uploadsfdccontact` | json | auth,role,subscriber |

### `DownloadController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `download/session/{sessiondate}/{file}` | — | `session` | download | — |

### `HomeController` (15 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `/` | — | `index` | — | auth |
| GET | `android` | — | `android` | `front.android` | — |
| GET | `dashboard` | — | `dashboard` | `front.dashboard` | auth,role |
| GET | `dashboard/activities` | — | `dashboardActivities` | json | auth,role |
| GET | `dashboard/activities/upcoming` | — | `dashboardUpcomingNotes` | json | auth,role |
| POST | `get_percentage` | — | `getProgressPercentage` | json | auth |
| GET | `getcompanydetails` | — | `getcompanydetails` | — | auth |
| GET | `getcompanyfind` | — | `getcompanyfind` | — | auth |
| GET | `lead-users` | — | `leadUsers` | `front.leadusers` | — |
| GET | `mongo_read` | — | `mongoReadTest` | — | auth |
| GET | `mongo_write` | — | `mongoWriteTest` | json | auth |
| GET | `payments-in-app` | — | `paymentsInApp` | `front.payments_in_app` | — |
| GET | `pdftutorial` | — | `pdftutorial` | `front.pdftutorial` | auth,role |
| GET | `success-revenuecat` | — | `successRevenueCat` | redirect | auth,role |
| GET | `tutorial` | — | `tutorial` | `front.tutorial` | auth,role |

### `HubSpotController` (7 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `disconnect-hubspot` | — | `disconnectHubspot` | — | auth,role |
| POST | `hubspot-fields-mapping` | — | `saveFieldsMapping` | json, redirect | auth,role |
| GET | `hubspot-fields-mapping` | — | `fieldsMapping` | `front.hubspot.mapping` | auth,role |
| POST | `save-hubspot-api-key` | — | `saveApiKey` | json | auth,role |
| GET | `sync-hubspot-both` | — | `syncBoth` | — | auth,role |
| GET | `sync-hubspot-companies` | — | `syncCompanies` | — | auth,role |
| GET | `sync-hubspot-contacts` | — | `syncContacts` | — | auth,role |

### `KarmaCrmController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `disconnect-karmacrm` | — | `disconnectKarmaCrm` | — | auth,role |
| POST | `save-karmacrm-api-key` | — | `saveApiKey` | json | auth,role |
| GET | `sync-karmacrm-companies` | — | `syncCompanies` | — | auth,role |
| GET | `sync-karmacrm-contacts` | — | `syncContacts` | — | auth,role |

### `ListController` (17 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `list/add-to-list/{id}` | — | `addToList` | json | auth,role,subscriber |
| POST | `list/deleteCompany/{id}/{cid}` | — | `deleteCompany` | json | auth,role,subscriber |
| POST | `list/deleteMultiCompany/{listId}` | — | `deleteMultiCompany` | json | auth,role,subscriber |
| GET | `list/downloadcsv/{id}` | — | `downloadcsv` | redirect | auth,role,subscriber |
| GET | `list/paginate_user_lists` | — | `paginate_user_lists` | json | auth,role,subscriber |
| POST | `list/removecontact` | — | `removecontact` | json | auth,role,subscriber |
| POST | `list/step1` | — | `step1` | `front.list.step1`, json | auth,role,subscriber |
| GET | `list/step1` | — | `step1` | `front.list.step1`, json | auth,role,subscriber |
| GET | `list/viewmap/{id}` | — | `viewmap` | `front.company.viewmap` | auth,role,subscriber |
| GET | `list/views/details/{id}` | — | `route_views_details` | json | auth,role,subscriber |
| GET | `list/views/details/{id}/{userId}` | — | `route_views_details` | json | auth,role,subscriber |
| GET | `list/{id}/delete` | — | `delete` | — | auth,role,subscriber |
| GET | `list/{id}/edit` | — | `editstep1` | `front.list.step1`, json | auth,role,subscriber |
| POST | `list/{id}/edit` | — | `editstep1` | `front.list.step1`, json | auth,role,subscriber |
| GET | `list/{id}/generateroute` | — | `generateroute` | redirect | auth,role,subscriber |
| GET | `list/{id}/view` | — | `view` | `front.list.view_list` | auth,role,subscriber |
| GET | `lists` | — | `index` | `front.list.list` | auth,role,subscriber |

### `RouteController` (36 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `findleads/route/step1` | — | `step1` | `front.route.step1`, json | auth,role,subscriber |
| POST | `getRouteList` | — | `getRouteList` | json | auth,role,subscriber |
| POST | `notification` | — | `notification` | `notification.create` | auth,role,subscriber |
| GET | `notification` | — | `notification` | `notification.create` | auth,role,subscriber |
| GET | `route/companieslist` | — | `companieslist` | json | auth,role,subscriber |
| POST | `route/deleteCompany/{routeId}` | — | `deleteCompany` | json | auth,role,subscriber |
| GET | `route/get/notification/all` | — | `routeGetStatusAll` | json | auth,role,subscriber |
| POST | `route/get_status/{id}` | — | `getStatus` | json | auth,role,subscriber |
| POST | `route/onboarding-conversion` | — | `storeRouteOnboardingConversion` | json | auth,role,subscriber |
| GET | `route/paginate_user_companies/{employee?}/{annual_revenue?}/{status?}/{order_by?}/{open_close?}/{industry?}` | — | `paginate_user_companies` | json | auth,role,subscriber |
| GET | `route/paginate_user_routes` | — | `paginate_user_routes` | json | auth,role,subscriber |
| GET | `route/removeroute/{id}` | — | `removeroute` | — | auth,role,subscriber |
| POST | `route/removeroute/{id}` | — | `removeroute` | — | auth,role,subscriber |
| GET | `route/select_type/{id}` | — | `selectRouteType` | `front.route.select_route`, json | auth,role,subscriber |
| POST | `route/select_type/{id}` | — | `selectRouteType` | `front.route.select_route`, json | auth,role,subscriber |
| GET | `route/step1` | — | `step1` | `front.route.step1`, json | auth,role,subscriber |
| POST | `route/step1` | — | `step1` | `front.route.step1`, json | auth,role,subscriber |
| GET | `route/step1/{id}` | — | `editstep1` | `front.route.step1`, json | auth,role,subscriber |
| POST | `route/step1/{id}` | — | `editstep1` | `front.route.step1`, json | auth,role,subscriber |
| GET | `route/step2/{id}` | — | `editstep2` | `front.route.step2`, json | auth,role,subscriber |
| POST | `route/step2/{id}` | — | `editstep2` | `front.route.step2`, json | auth,role,subscriber |
| GET | `route/uniqueroute` | — | `uniqueroute` | — | auth,role,subscriber |
| POST | `route/uniqueroute` | — | `uniqueroute` | — | auth,role,subscriber |
| GET | `route/view/{id}` | — | `view` | `front.route.view_advanced_route`, `front.route.view_basic_route` | auth,role,subscriber |
| GET | `route/view/{id}/{userId}` | — | `view` | `front.route.view_advanced_route`, `front.route.view_basic_route` | auth,role,subscriber |
| POST | `route/viewmap` | — | `viewmap` | `front.company.viewmap` | auth,role,subscriber |
| GET | `route/viewmap-data/{id}` | — | `viewMapData` | json | auth,role,subscriber |
| GET | `route/viewmap-data/{id}/{userId}` | — | `viewMapData` | json | auth,role,subscriber |
| GET | `route/viewmap/{id}` | — | `viewmap` | `front.company.viewmap` | auth,role,subscriber |
| GET | `route/viewmap/{id}/{userId}` | — | `viewmap` | `front.company.viewmap` | auth,role,subscriber |
| GET | `route/views/details/{id}` | — | `route_views_details` | json | auth,role,subscriber |
| GET | `route/views/details/{id}/{userId}` | — | `route_views_details` | json | auth,role,subscriber |
| GET | `routes` | — | `index` | `front.route.list` | auth,role,subscriber |
| GET | `routes/downloadcsv/{id}` | — | `downloadcsv` | redirect | auth,role,subscriber |
| GET | `routes/re_generate/{id}` | — | `reGenerateRoute` | redirect | auth,role,subscriber |
| POST | `shareRouteList` | — | `shareRouteList` | json | auth,role,subscriber |

### `RoutesController` (44 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `routes` | crud.routes.store | `store` | — | auth,role,Closure,subscriber |
| GET | `routes/create` | crud.routes.create | `create` | — | auth,role,Closure,subscriber |
| POST | `routes/createleads` | — | `routesCreateLeads` | json | auth,role,Closure,subscriber |
| GET | `routes/download/{encodedRouteId}` | — | `download` | download | auth,role,Closure,subscriber |
| POST | `routes/fetchAllContacts` | — | `routesfetchAllContacts` | json | auth,role,Closure,subscriber |
| POST | `routes/fetchClaudeCompany` | — | `routesfetchClaudeCompany` | — | auth,role,Closure,subscriber |
| POST | `routes/fetchClaudeContact` | — | `routesfetchClaudeContact` | — | auth,role,Closure,subscriber |
| POST | `routes/fetchContactSearch` | — | `routesfetchContactSearched` | json | auth,role,Closure,subscriber |
| POST | `routes/fetchContacts` | — | `routesfetchContacts` | json | auth,role,Closure,subscriber |
| POST | `routes/fetchOpencorporatesCompany` | — | `routesfetchOpencorporatesCompany` | json | auth,role,Closure,subscriber |
| POST | `routes/fetchOpencorporatesContact` | — | `routesfetchOpencorporatesContact` | json | auth,role,Closure,subscriber |
| GET | `routes/findleads` | — | `routesFindLeads` | — | auth,role,Closure,subscriber |
| GET | `routes/lasso` | — | `routesLasso` | — | auth,role,Closure,subscriber |
| GET | `routes/reorder` | crud.routes.reorder | `reorder` | — | auth,role,Closure,subscriber |
| POST | `routes/reorder` | crud.routes.save.reorder | `saveReorder` | — | auth,role,Closure,subscriber |
| POST | `routes/search` | crud.routes.search | `search` | — | auth,role,Closure,subscriber |
| GET | `routes/session/{encodedRouteId?}` | — | `session` | `front.routes.list_view` | auth,role,Closure,subscriber |
| GET | `routes/{id}/details` | crud.routes.showDetailsRow | `showDetailsRow` | — | auth,role,Closure,subscriber |
| GET | `routes/{id}/revisions` | crud.routes.listRevisions | `listRevisions` | — | auth,role,Closure,subscriber |
| POST | `routes/{id}/revisions/{revisionId}/restore` | crud.routes.restoreRevision | `restoreRevision` | — | auth,role,Closure,subscriber |
| GET | `routes/{id}/translate/{lang}` | crud.routes.translateItem | `translateItem` | — | auth,role,Closure,subscriber |
| PUT|PATCH | `routes/{route}` | crud.routes.update | `update` | — | auth,role,Closure,subscriber |
| GET | `routes/{route}` | crud.routes.show | `show` | — | auth,role,Closure,subscriber |
| DELETE | `routes/{route}` | crud.routes.destroy | `destroy` | — | auth,role,Closure,subscriber |
| GET | `routes/{route}/edit` | crud.routes.edit | `edit` | — | auth,role,Closure,subscriber |
| POST | `sessionroute/advanced` | — | `advanced` | json | auth,role,Closure,subscriber |
| POST | `sessionroute/basic` | — | `basic` | json | auth,role,Closure,subscriber |
| POST | `sessionroute/bulkdelete` | — | `bulkDelete` | — | auth,role,Closure,subscriber |
| GET | `sessionroute/deletesession` | — | `deletesession` | redirect | auth,role,Closure,subscriber |
| POST | `sessionroute/deletesessionrecord/{id}` | — | `deletesessionrecord` | redirect | auth,role,Closure,subscriber |
| GET | `sessionroute/downloadSample` | — | `downloadSample` | download | auth,role,Closure,subscriber |
| GET | `sessionroute/error/{perpage?}` | — | `error` | `front.routes.sessionerror` | auth,role,Closure,subscriber |
| POST | `sessionroute/errorfix` | — | `errorfix` | json | auth,role,Closure,subscriber |
| GET | `sessionroute/fix-city/{cityId}/{perpage?}` | — | `fixCity` | `front.routes.fixcitieserror` | auth,role,Closure,subscriber |
| GET | `sessionroute/step1` | — | `step1` | `front.routes.afterstep1`, `front.routes.step1` | auth,role,Closure,subscriber |
| POST | `sessionroute/step1` | — | `step1` | `front.routes.afterstep1`, `front.routes.step1` | auth,role,Closure,subscriber |
| GET | `sessionroute/step2` | — | `step2` | `front.routes.step2`, json | auth,role,Closure,subscriber |
| POST | `sessionroute/step2` | — | `step2` | `front.routes.step2`, json | auth,role,Closure,subscriber |
| POST | `sessionroute/step3` | — | `step3` | `front.routes.step3`, json | auth,role,Closure,subscriber |
| GET | `sessionroute/step3` | — | `step3` | `front.routes.step3`, json | auth,role,Closure,subscriber |
| POST | `sessionroute/step4` | — | `step4` | `front.routes.step4`, json | auth,role,Closure,subscriber |
| GET | `sessionroute/step4` | — | `step4` | `front.routes.step4`, json | auth,role,Closure,subscriber |
| GET | `sessionroute/step5` | — | `step5` | `front.routes.step5` | auth,role,Closure,subscriber |
| GET | `sessionroute/success` | — | `success` | `front.routes.sessionsuccess` | auth,role,Closure,subscriber |

### `SalespersonController` (18 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `salesperson` | crud.salesperson.index | `index` | `front.salesperson.list_view` | auth,role |
| POST | `salesperson` | crud.salesperson.store | `store` | redirect | auth,role |
| GET | `salesperson/create` | crud.salesperson.create | `create` | `front.salesperson.create` | auth,role |
| GET | `salesperson/edit` | — | `edit` | `front.salesperson.edit` | auth,role |
| POST | `salesperson/edit` | — | `update` | json, redirect | auth,role |
| POST | `salesperson/edit/{id}` | — | `update` | json, redirect | auth,role |
| POST | `salesperson/reorder` | crud.salesperson.save.reorder | `saveReorder` | — | auth,role |
| GET | `salesperson/reorder` | crud.salesperson.reorder | `reorder` | — | auth,role |
| POST | `salesperson/search` | crud.salesperson.search | `search` | — | auth,role |
| GET | `salesperson/updatepreference` | — | `updatePreference` | json, redirect | auth,role |
| GET | `salesperson/{id}/details` | crud.salesperson.showDetailsRow | `showDetailsRow` | — | auth,role |
| GET | `salesperson/{id}/revisions` | crud.salesperson.listRevisions | `listRevisions` | — | auth,role |
| POST | `salesperson/{id}/revisions/{revisionId}/restore` | crud.salesperson.restoreRevision | `restoreRevision` | — | auth,role |
| GET | `salesperson/{id}/translate/{lang}` | crud.salesperson.translateItem | `translateItem` | — | auth,role |
| GET | `salesperson/{salesperson}` | crud.salesperson.show | `show` | — | auth,role |
| PUT|PATCH | `salesperson/{salesperson}` | crud.salesperson.update | `update` | json, redirect | auth,role |
| DELETE | `salesperson/{salesperson}` | crud.salesperson.destroy | `destroy` | — | auth,role |
| GET | `salesperson/{salesperson}/edit` | crud.salesperson.edit | `edit` | `front.salesperson.edit` | auth,role |

### `SfdcController` (21 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `contactsync` | — | `forceSync` | — | auth,role |
| POST | `contactsync` | — | `forceSync` | — | auth,role |
| GET | `dataloaderCompanyImport` | — | `dataloaderCompanyImport` | — | auth,role |
| GET | `dataloaderContactImport` | — | `dataloaderContactImport` | — | auth,role |
| GET | `disconnect` | — | `disconSfdc` | — | auth,role |
| GET | `sfdc` | — | `save` | json | auth,role |
| POST | `sfdc` | — | `save` | json | auth,role |
| GET | `sfdc/create` | crud.sfdc.create | `create` | — | auth,role |
| GET | `sfdc/reorder` | crud.sfdc.reorder | `reorder` | — | auth,role |
| POST | `sfdc/reorder` | crud.sfdc.save.reorder | `saveReorder` | — | auth,role |
| POST | `sfdc/search` | crud.sfdc.search | `search` | — | auth,role |
| GET | `sfdc/{id}/details` | crud.sfdc.showDetailsRow | `showDetailsRow` | — | auth,role |
| GET | `sfdc/{id}/revisions` | crud.sfdc.listRevisions | `listRevisions` | — | auth,role |
| POST | `sfdc/{id}/revisions/{revisionId}/restore` | crud.sfdc.restoreRevision | `restoreRevision` | — | auth,role |
| GET | `sfdc/{id}/translate/{lang}` | crud.sfdc.translateItem | `translateItem` | — | auth,role |
| GET | `sfdc/{sfdc}` | crud.sfdc.show | `show` | — | auth,role |
| PUT|PATCH | `sfdc/{sfdc}` | crud.sfdc.update | `update` | — | auth,role |
| DELETE | `sfdc/{sfdc}` | crud.sfdc.destroy | `destroy` | — | auth,role |
| GET | `sfdc/{sfdc}/edit` | crud.sfdc.edit | `edit` | — | auth,role |
| POST | `sync` | — | `autoSync` | json | auth,role |
| GET | `sync` | — | `autoSync` | json | auth,role |

### `SimpleRouteController` (16 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `simpleroute` | crud.simpleroute.index | `index` | — | auth,role,Closure,subscriber |
| POST | `simpleroute` | crud.simpleroute.store | `store` | — | auth,role,Closure,subscriber |
| GET | `simpleroute/create` | crud.simpleroute.create | `create` | — | auth,role,Closure,subscriber |
| GET | `simpleroute/paginate_user_companies` | — | `paginate_user_companies` | json | auth,role,Closure,subscriber |
| POST | `simpleroute/reorder` | crud.simpleroute.save.reorder | `saveReorder` | — | auth,role,Closure,subscriber |
| GET | `simpleroute/reorder` | crud.simpleroute.reorder | `reorder` | — | auth,role,Closure,subscriber |
| POST | `simpleroute/search` | crud.simpleroute.search | `search` | — | auth,role,Closure,subscriber |
| GET | `simpleroute/step3/{id}` | — | `editstep3` | `front.simpleroute.step3` | auth,role,Closure,subscriber |
| GET | `simpleroute/{id}/details` | crud.simpleroute.showDetailsRow | `showDetailsRow` | — | auth,role,Closure,subscriber |
| GET | `simpleroute/{id}/revisions` | crud.simpleroute.listRevisions | `listRevisions` | — | auth,role,Closure,subscriber |
| POST | `simpleroute/{id}/revisions/{revisionId}/restore` | crud.simpleroute.restoreRevision | `restoreRevision` | — | auth,role,Closure,subscriber |
| GET | `simpleroute/{id}/translate/{lang}` | crud.simpleroute.translateItem | `translateItem` | — | auth,role,Closure,subscriber |
| DELETE | `simpleroute/{simpleroute}` | crud.simpleroute.destroy | `destroy` | — | auth,role,Closure,subscriber |
| PUT|PATCH | `simpleroute/{simpleroute}` | crud.simpleroute.update | `update` | — | auth,role,Closure,subscriber |
| GET | `simpleroute/{simpleroute}` | crud.simpleroute.show | `show` | — | auth,role,Closure,subscriber |
| GET | `simpleroute/{simpleroute}/edit` | crud.simpleroute.edit | `edit` | — | auth,role,Closure,subscriber |

### `SubscriptionController` (24 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `businessagent/subscription` | — | `businessindex` | `front.subscription.businesslist` | auth,role |
| GET | `businessagent/subscription/subscribe` | — | `businessagentsubscribe` | `front.subscription.businessagentsubscribe`, `front.subscription.subscribemobile`, json | auth,role |
| POST | `businessagent/subscription/subscribe` | — | `businessagentsubscribe` | `front.subscription.businessagentsubscribe`, `front.subscription.subscribemobile`, json | auth,role |
| GET | `businessagent/subscriptions/cancelsubscribe` | — | `cancelBusinessAgentSubscribe` | redirect | auth,role |
| GET | `extendTrial` | — | `extendTrial` | — | auth,role |
| GET | `special` | — | `special` | `auth.login` | — |
| GET | `subscription` | — | `index` | `front.subscription.list`, `front.subscription.listmobile` | auth,role |
| GET | `subscription/addon/invoice/{chargeId}` | — | `downloadPackageChargeInvoice` | `front.subscription.addoninvoice`, download | auth,role |
| GET | `subscription/credits-addon` | — | `creditsAddon` | `front.subscription.creditsaddonmobile` | auth,role |
| POST | `subscription/credits-addon` | — | `creditsAddon` | `front.subscription.creditsaddonmobile` | auth,role |
| GET | `subscription/index/{msg}` | — | `index` | `front.subscription.list`, `front.subscription.listmobile` | auth,role |
| GET | `subscription/invoice/{subscriptionId}` | — | `downloadInvoice` | `front.subscription.invoice`, download | auth,role |
| POST | `subscription/payment` | — | `payment` | `front.subscription.payment`, `front.subscription.paymentmobile`, json | auth,role |
| GET | `subscription/payment` | — | `payment` | `front.subscription.payment`, `front.subscription.paymentmobile`, json | auth,role |
| POST | `subscription/paypalTrnComplete` | — | `paypaltrncomplete` | json | auth,role |
| GET | `subscription/subscribe` | — | `subscribe` | redirect | auth,role |
| POST | `subscription/subscribe` | — | `subscribe` | redirect | auth,role |
| GET | `subscription/success` | — | `success` | redirect | auth,role |
| GET | `subscription/upgrade` | — | `upgrade` | json, redirect | auth,role |
| POST | `subscription/upgrade` | — | `upgrade` | json, redirect | auth,role |
| GET | `subscriptions/cancelrevenuecatsubscribe` | — | `cancelRevenuecatSubscribe` | — | auth,role |
| GET | `subscriptions/cancelsubscribe` | — | `cancelSubscribe` | redirect | auth,role |
| POST | `subscriptions/cancelsubscribereason` | — | `cancelSubscribeReason` | — | auth,role |
| GET | `subscriptions/cancelsubscribereason` | — | `cancelSubscribeReason` | — | auth,role |

### `SupportController` (6 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `support` | — | `index` | `front.support.list_view` | auth,role |
| POST | `support/create` | — | `create` | `front.support.create` | auth,role |
| GET | `support/create` | — | `create` | `front.support.create` | auth,role |
| POST | `support/update` | — | `update` | — | auth,role |
| GET | `support/view/{id}` | — | `view` | `front.support.view` | auth,role |
| POST | `support/view/{id}` | — | `view` | `front.support.view` | auth,role |

### `TourController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `add_tour` | — | `addTour` | json | — |
| POST | `end_tour` | — | `endTour` | json | — |

### `UserauthController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `accActivate/{userid}` | — | `accActivate` | `userauth.activate_set_password` | Closure |
| POST | `accActivate/{userid}` | — | `accActivateStore` | — | Closure |
| GET | `mobilelogin/credits/{token}` | — | `mobilelogin` | — | Closure |
| GET | `mobilelogin/{token}` | — | `mobilelogin` | — | Closure |

### `Closure` (3 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `salesperson/{id}/edit` | — | `closure` | — | auth,role |
| GET | `temp-script` | — | `closure` | — | auth,role |
| GET | `upadtedStage` | — | `closure` | — | auth,role |

## Manager Portal


### `Manager\ManagerDashboardController` (35 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `manager/activity` | — | `activity` | `front.manager.activity` | auth,manager.only |
| GET | `manager/ai-find-leads` | — | `aiFindLeads` | `front.manager.ai-find-leads` | auth,manager.only |
| POST | `manager/api/clear-assigned-leads` | — | `clearAssignedLeadsApi` | json | auth,manager.only |
| POST | `manager/api/clear-saved-search` | — | `clearSavedSearchApi` | json | auth,manager.only |
| POST | `manager/api/create-leads` | — | `createLeadsApi` | json | auth,manager.only |
| POST | `manager/api/create-leads-batch` | — | `createLeadsBatchApi` | json | auth,manager.only |
| GET | `manager/api/dashboard-data` | — | `dashboardData` | json | auth,manager.only |
| GET | `manager/api/feed` | — | `feed` | json | auth,manager.only |
| POST | `manager/api/find-leads` | — | `findLeadsApi` | json | auth,manager.only |
| POST | `manager/api/find-leads/init` | — | `findLeadsInitApi` | json | auth,manager.only |
| POST | `manager/api/find-leads/step` | — | `findLeadsStepApi` | json | auth,manager.only |
| GET | `manager/api/growth` | — | `growth` | json | auth,manager.only |
| GET | `manager/api/insights` | — | `insights` | json | auth,manager.only |
| GET | `manager/api/kpis` | — | `kpis` | json | auth,manager.only |
| GET | `manager/api/rep/{id}` | — | `repDetail` | json | auth,manager.only |
| GET | `manager/api/rep/{id}/territory` | — | `repTerritoryApi` | json | auth,manager.only |
| GET | `manager/api/salespeople/{id}/companies` | — | `salespersonCompanies` | json | auth,manager.only |
| GET | `manager/api/sidebar-stats` | — | `sidebarStats` | json | auth,manager.only |
| GET | `manager/api/team` | — | `team` | json | auth,manager.only |
| GET | `manager/api/territory` | — | `territory` | json | auth,manager.only |
| GET | `manager/dashboard` | — | `dashboard` | `front.manager.dashboard` | auth,manager.only |
| GET | `manager/reports` | — | `reports` | `front.manager.reports` | auth,manager.only |
| GET | `manager/salespeople` | — | `salespeople` | `front.manager.salespeople` | auth,manager.only |
| GET | `manager/salespeople/create` | — | `salespersonCreate` | — | auth,manager.only |
| POST | `manager/salespeople/create` | — | `salespersonStore` | — | auth,manager.only |
| GET | `manager/salespeople/{id}/details` | — | `salespersonDetail` | `front.manager.salesperson-detail` | auth,manager.only |
| GET | `manager/salespeople/{id}/edit` | — | `salespersonEdit` | — | auth,manager.only |
| POST | `manager/salespeople/{id}/edit` | — | `salespersonUpdate` | — | auth,manager.only |
| GET | `manager/salespeople/{id}/remove` | — | `salespersonRemove` | json | auth,manager.only |
| GET | `manager/salespeople/{id}/resend-invitation` | — | `salespersonResendInvitation` | — | auth,manager.only |
| GET | `manager/salespeople/{id}/routes` | — | `salespersonRoutes` | `front.manager.salesperson-routes` | auth,manager.only |
| GET | `manager/settings` | — | `settings` | `front.manager.settings` | auth,manager.only |
| GET | `manager/support` | — | `support` | `front.manager.support` | auth,manager.only |
| GET | `manager/support/create` | — | `supportCreate` | `front.manager.support-create` | auth,manager.only |
| GET | `manager/support/{id}` | — | `supportDetail` | `front.manager.support-detail` | auth,manager.only |

## Admin HQ


### `Admin\BusinessclientController` (11 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/businessclient` | — | `index` | `businessclient.list_view` | role |
| GET | `hq/businessclient/calculateroute/{salesPersonId}` | — | `calculateroute` | — | role |
| GET | `hq/businessclient/create` | — | `create` | `businessclient.create` | role |
| POST | `hq/businessclient/create` | — | `store` | — | role |
| GET | `hq/businessclient/delete/{id}` | — | `delete` | — | role |
| POST | `hq/businessclient/edit/{id}` | — | `update` | — | role |
| GET | `hq/businessclient/resendinvitation/{id}` | — | `resendinvitation` | — | role |
| POST | `hq/businessclient/salesperson-credit/{id}` | — | `salespersonCreditupdate` | — | role |
| GET | `hq/businessclient/salesperson-credit/{id}` | — | `salespersonCreditindex` | — | role |
| GET | `hq/businessclient/{id}/edit` | — | `edit` | `businessclient.edit`, `businessclient.list_view` | role |
| GET | `hq/businessclient/{id}/salesperson` | — | `salesperson` | `businessclient.salesperson_list_view` | role |

### `Admin\HomeController` (6 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq` | — | `index` | — | role |
| GET | `hq/dashboard` | — | `dashboard` | `vendor.backpack.base.dashboard` | role |
| GET | `hq/subscription/cancelled-revenuecat-trials` | — | `cancelledRevenueCatTrialUsers` | `front.cancelledRevenueCatTrialUsers` | role |
| GET | `hq/subscription/cancelled-revenuecat-trials/data` | — | `cancelledRevenueCatTrialUsersData` | json | role |
| GET | `hq/subscription/cancelled-users` | — | `cancelledSubscriptionUsers` | `front.cancelledSubscriptionUsers` | role |
| GET | `hq/subscription/dashboard` | — | `subscriptionDashboard` | `front.subscriptionDashboard` | role |

### `Admin\PromocodeController` (6 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/promocode` | — | `index` | `promocode.list_view` | role |
| POST | `hq/promocode/create` | — | `store` | — | role |
| GET | `hq/promocode/create` | — | `create` | `promocode.create` | role |
| GET | `hq/promocode/delete/{id}` | — | `delete` | — | role |
| POST | `hq/promocode/edit/{id}` | — | `update` | redirect | role |
| GET | `hq/promocode/{id}/edit` | — | `edit` | `promocode.edit` | role |

### `Admin\SalespersonController` (14 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/salesperson` | — | `index` | `salesperson.list_view` | role |
| GET | `hq/salesperson/aisearch/{id}` | — | `aisearchindex` | `salesperson.aisearch` | role |
| GET | `hq/salesperson/calculateroute/{salesPersonId}` | — | `calculateroute` | — | role |
| POST | `hq/salesperson/create` | — | `store` | — | role |
| GET | `hq/salesperson/create` | — | `create` | `salesperson.create` | role |
| GET | `hq/salesperson/credit/{id}` | — | `creditindex` | `salesperson.credit_view` | role |
| POST | `hq/salesperson/credit/{id}` | — | `creditupdate` | — | role |
| GET | `hq/salesperson/datatable` | — | `datatableJson` | json | role |
| GET | `hq/salesperson/delete/{id}` | — | `delete` | — | role |
| POST | `hq/salesperson/edit/{id}` | — | `update` | json, redirect | role |
| POST | `hq/salesperson/{id}/convert` | — | `convertStore` | — | role |
| GET | `hq/salesperson/{id}/convert` | — | `convertView` | `salesperson.convert` | role |
| GET | `hq/salesperson/{id}/edit` | — | `edit` | `salesperson.edit` | role |
| GET | `hq/user-activity/{id}` | — | `userActivity` | `salesperson.user_activity` | role |

### `Admin\SettingController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `hq/setting/edit/{id}` | — | `update` | redirect | role |
| GET | `hq/settings` | — | `edit` | `front.setting.edit` | role |

### `Admin\SpecialdiscountController` (6 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/specialdiscount` | — | `index` | `specialdiscount.discount_view` | role |
| POST | `hq/specialdiscount/create` | — | `store` | — | role |
| GET | `hq/specialdiscount/create` | — | `create` | `specialdiscount.discount` | role |
| GET | `hq/specialdiscount/delete/{id}` | — | `delete` | — | role |
| POST | `hq/specialdiscount/edit/{id}` | — | `update` | redirect | role |
| GET | `hq/specialdiscount/{id}/edit` | — | `edit` | `specialdiscount.edit_discount` | role |

### `Admin\SubscriptionController` (9 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/subscription/active/{salesPersonId}` | — | `active` | redirect | role,Closure |
| GET | `hq/subscription/activebusiness/{salesPersonId}` | — | `activebusiness` | redirect | role,Closure |
| GET | `hq/subscription/activeyelp/{salesPersonId}` | — | `activeyelp` | redirect | role,Closure |
| GET | `hq/subscription/deactive/{salesPersonId}` | — | `deactive` | redirect | role,Closure |
| GET | `hq/subscription/deactiveyelp/{salesPersonId}` | — | `deactiveyelp` | redirect | role,Closure |
| POST | `hq/subscription/extend-days` | — | `extendDays` | redirect | role,Closure |
| GET | `hq/subscription/index/{salesPersonId}` | — | `index` | `subscription.list` | role,Closure |
| GET | `hq/subscription/lifetimeactive/{salesPersonId}` | — | `lifetimeactive` | redirect | role,Closure |
| GET | `hq/subscription/lifetimedeactive/{salesPersonId}` | — | `lifetimedeactive` | — | role,Closure |

### `Admin\SupportController` (6 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/support` | — | `index` | `support.list_view` | role |
| GET | `hq/support/create` | — | `create` | `support.create` | role |
| POST | `hq/support/create` | — | `create` | `support.create` | role |
| POST | `hq/support/update` | — | `update` | — | role |
| GET | `hq/support/view/{id}` | — | `view` | `support.view` | role |
| POST | `hq/support/view/{id}` | — | `view` | `support.view` | role |

### `Admin\UserController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `hq/user/edit/{user}` | — | `update` | redirect | role |
| GET | `hq/user/{user}/edit` | — | `edit` | `auth.edit` | role |

### `Admin\UserdevicesController` (14 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `hq/userdevices` | crud.userdevices.store | `store` | — | role,Closure |
| GET | `hq/userdevices` | crud.userdevices.index | `index` | — | role,Closure |
| GET | `hq/userdevices/create` | crud.userdevices.create | `create` | — | role,Closure |
| POST | `hq/userdevices/reorder` | crud.userdevices.save.reorder | `saveReorder` | — | role,Closure |
| GET | `hq/userdevices/reorder` | crud.userdevices.reorder | `reorder` | — | role,Closure |
| POST | `hq/userdevices/search` | crud.userdevices.search | `search` | — | role,Closure |
| GET | `hq/userdevices/{id}/details` | crud.userdevices.showDetailsRow | `showDetailsRow` | — | role,Closure |
| GET | `hq/userdevices/{id}/revisions` | crud.userdevices.listRevisions | `listRevisions` | — | role,Closure |
| POST | `hq/userdevices/{id}/revisions/{revisionId}/restore` | crud.userdevices.restoreRevision | `restoreRevision` | — | role,Closure |
| GET | `hq/userdevices/{id}/translate/{lang}` | crud.userdevices.translateItem | `translateItem` | — | role,Closure |
| DELETE | `hq/userdevices/{userdevice}` | crud.userdevices.destroy | `destroy` | — | role,Closure |
| PUT|PATCH | `hq/userdevices/{userdevice}` | crud.userdevices.update | `update` | — | role,Closure |
| GET | `hq/userdevices/{userdevice}` | crud.userdevices.show | `show` | — | role,Closure |
| GET | `hq/userdevices/{userdevice}/edit` | crud.userdevices.edit | `edit` | — | role,Closure |

## API (token clients)


### `App\AdminMcp\Http\Controllers\CancelledSubscriptionsController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `api/mcp/cancelled-subscribers` | — | `index` | json | bindings,mcp.api |

### `App\AdminMcp\Http\Controllers\McpToolsController` (6 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `api/mcp/active-subscribers` | — | `activeSubscribers` | json | bindings,mcp.api |
| GET | `api/mcp/active-trials` | — | `activeTrials` | json | bindings,mcp.api |
| GET | `api/mcp/cancelled-trial-subscribers` | — | `cancelledTrialSubscribers` | json | bindings,mcp.api |
| GET | `api/mcp/expired-trials` | — | `expiredTrials` | json | bindings,mcp.api |
| GET | `api/mcp/user-credits` | — | `userCredits` | json | bindings,mcp.api |
| GET | `api/mcp/user-subscription-history` | — | `userSubscriptionHistory` | json | bindings,mcp.api |

### `App\AdminMcp\Http\Controllers\SalesAgentsController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `api/mcp/sales-agents` | — | `index` | json | bindings,mcp.api |

### `App\AdminMcp\Http\Controllers\SalesDeskActivitiesController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| DELETE | `api/mcp/sales-desk/activities/{id}` | — | `destroy` | json | bindings,mcp.api |
| GET | `api/mcp/sales-desk/activities/{id}` | — | `show` | json | bindings,mcp.api |
| POST | `api/mcp/sales-desk/leads/{leadId}/activities` | — | `store` | json | bindings,mcp.api |
| GET | `api/mcp/sales-desk/leads/{leadId}/activities` | — | `index` | json | bindings,mcp.api |

### `App\AdminMcp\Http\Controllers\SalesDeskAppMetaController` (5 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `api/mcp/sales-desk/app-meta` | — | `index` | json | bindings,mcp.api |
| GET | `api/mcp/sales-desk/app-meta/{key}` | — | `show` | json | bindings,mcp.api |
| PUT | `api/mcp/sales-desk/app-meta/{key}` | — | `update` | json | bindings,mcp.api |
| DELETE | `api/mcp/sales-desk/app-meta/{key}` | — | `destroy` | json | bindings,mcp.api |
| PATCH | `api/mcp/sales-desk/app-meta/{key}` | — | `update` | json | bindings,mcp.api |

### `App\AdminMcp\Http\Controllers\SalesDeskLeadsController` (7 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `api/mcp/sales-desk/leads` | — | `index` | json | bindings,mcp.api |
| POST | `api/mcp/sales-desk/leads` | — | `store` | json | bindings,mcp.api |
| POST | `api/mcp/sales-desk/leads/upsert` | — | `upsert` | json | bindings,mcp.api |
| POST | `api/mcp/sales-desk/leads/upsert-batch` | — | `upsertBatch` | json | bindings,mcp.api |
| GET | `api/mcp/sales-desk/leads/{id}` | — | `show` | json | bindings,mcp.api |
| PUT | `api/mcp/sales-desk/leads/{id}` | — | `update` | json | bindings,mcp.api |
| PATCH | `api/mcp/sales-desk/leads/{id}` | — | `update` | json | bindings,mcp.api |

### `App\AdminMcp\Http\Controllers\SalesDeskUsersController` (5 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `api/mcp/sales-desk/login` | — | `login` | json | bindings,mcp.api |
| GET | `api/mcp/sales-desk/users` | — | `index` | json | bindings,mcp.api |
| DELETE | `api/mcp/sales-desk/users/{id}/mcp-oauth` | — | `destroyMcpOauth` | json | bindings,mcp.api |
| PUT | `api/mcp/sales-desk/users/{id}/mcp-oauth` | — | `updateMcpOauth` | json | bindings,mcp.api |
| GET | `api/mcp/sales-desk/users/{id}/mcp-oauth` | — | `showMcpOauth` | json | bindings,mcp.api |

## MCP servers


### `App\AdminMcp\Http\Controllers\McpHttpController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| DELETE | `ai/mcp-admin` | — | `destroy` | — | mcp.api |
| POST | `ai/mcp-admin` | — | `handle` | json | mcp.api |
| GET | `ai/mcp-admin` | — | `stream` | — | mcp.api |
| GET | `ai/mcp-admin/health` | — | `health` | json | — |

### `App\AdminMcp\Http\Controllers\OAuth\McpOAuthAuthorizeController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `oauth/authorize` | — | `show` | `mcp::oauth.authorize` | — |
| POST | `oauth/authorize` | — | `approve` | redirect | — |
| POST | `oauth/authorize/deny` | — | `deny` | `mcp::oauth.denied` | — |
| POST | `oauth/logout` | — | `logout` | — | — |

### `App\AdminMcp\Http\Controllers\OAuth\McpOAuthDiscoveryController` (5 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `.well-known/oauth-authorization-server` | — | `authorizationServer` | json | — |
| GET | `.well-known/oauth-protected-resource` | — | `protectedResourceRoot` | json | — |
| GET | `.well-known/oauth-protected-resource/ai/mcp-admin` | — | `protectedResourceMcp` | json | — |
| GET | `.well-known/openid-configuration` | — | `openIdConfiguration` | json | — |
| GET | `ai/mcp-admin/.well-known/oauth-protected-resource` | — | `protectedResourceMcp` | json | — |

### `App\AdminMcp\Http\Controllers\OAuth\McpOAuthRegisterController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `oauth/register` | — | `register` | json | — |

### `App\AdminMcp\Http\Controllers\OAuth\McpOAuthTokenController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `oauth/token` | — | `token` | json | — |

### `App\AdminMcp\Http\Controllers\OAuth\McpOAuthUserInfoController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `oauth/userinfo` | — | `show` | json | — |

### `App\FindMcp\Http\Controllers\FindMcpHttpController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `find-mcp/mcp` | — | `stream` | — | territool.find.api |
| DELETE | `find-mcp/mcp` | — | `destroy` | — | territool.find.api |
| POST | `find-mcp/mcp` | — | `handle` | json | territool.find.api |
| GET | `find-mcp/mcp/health` | — | `health` | json | — |

### `App\FindMcp\Http\Controllers\OAuth\FindOAuthAuthorizeController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `find-mcp/oauth/authorize` | — | `approve` | redirect | — |
| GET | `find-mcp/oauth/authorize` | — | `show` | `territool_find::oauth.authorize` | — |
| POST | `find-mcp/oauth/authorize/deny` | — | `deny` | `territool_find::oauth.denied` | — |
| POST | `find-mcp/oauth/logout` | — | `logout` | — | — |

### `App\FindMcp\Http\Controllers\OAuth\FindOAuthDiscoveryController` (8 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `.well-known/oauth-authorization-server/find-mcp` | — | `authorizationServer` | json | — |
| GET | `.well-known/oauth-protected-resource/find-mcp` | — | `protectedResource` | json | — |
| GET | `.well-known/oauth-protected-resource/find-mcp/mcp` | — | `protectedResource` | json | — |
| GET | `.well-known/openid-configuration/find-mcp` | — | `openIdConfiguration` | json | — |
| GET | `find-mcp/.well-known/oauth-authorization-server` | — | `authorizationServer` | json | — |
| GET | `find-mcp/.well-known/oauth-protected-resource` | — | `protectedResource` | json | — |
| GET | `find-mcp/.well-known/oauth-protected-resource/mcp` | — | `protectedResource` | json | — |
| GET | `find-mcp/.well-known/openid-configuration` | — | `openIdConfiguration` | json | — |

### `App\FindMcp\Http\Controllers\OAuth\FindOAuthRegisterController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `find-mcp/oauth/register` | — | `register` | json | — |

### `App\FindMcp\Http\Controllers\OAuth\FindOAuthTokenController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `find-mcp/oauth/token` | — | `token` | json | — |

### `App\UserMcp\Http\Controllers\AppMcpHttpController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `ai/mcp` | — | `handle` | json | territool.app.api |
| GET | `ai/mcp` | — | `stream` | — | territool.app.api |
| DELETE | `ai/mcp` | — | `destroy` | json | territool.app.api |
| GET | `ai/mcp/health` | — | `health` | json | — |

### `App\UserMcp\Http\Controllers\OAuth\AppOAuthAuthorizeController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `ai/oauth/authorize` | — | `approve` | redirect | — |
| GET | `ai/oauth/authorize` | — | `show` | `territool_app::oauth.authorize` | — |
| POST | `ai/oauth/authorize/deny` | — | `deny` | `territool_app::oauth.denied` | — |
| POST | `ai/oauth/logout` | — | `logout` | — | — |

### `App\UserMcp\Http\Controllers\OAuth\AppOAuthDiscoveryController` (8 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `.well-known/oauth-authorization-server/ai` | — | `authorizationServer` | json | — |
| GET | `.well-known/oauth-protected-resource/ai` | — | `protectedResource` | json | — |
| GET | `.well-known/oauth-protected-resource/ai/mcp` | — | `protectedResource` | json | — |
| GET | `.well-known/openid-configuration/ai` | — | `openIdConfiguration` | json | — |
| GET | `ai/.well-known/oauth-authorization-server` | — | `authorizationServer` | json | — |
| GET | `ai/.well-known/oauth-protected-resource` | — | `protectedResource` | json | — |
| GET | `ai/.well-known/oauth-protected-resource/mcp` | — | `protectedResource` | json | — |
| GET | `ai/.well-known/openid-configuration` | — | `openIdConfiguration` | json | — |

### `App\UserMcp\Http\Controllers\OAuth\AppOAuthRegisterController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `ai/oauth/register` | — | `register` | json | — |

### `App\UserMcp\Http\Controllers\OAuth\AppOAuthTokenController` (1 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `ai/oauth/token` | — | `token` | json | — |

## Auth


### `Auth\B2bSignupController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `b2b` | — | `show` | `auth.b2b` | guest |
| POST | `b2b` | — | `store` | — | guest |

### `Auth\ForgotPasswordController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `password/email` | — | `sendResetLinkEmail` | — | guest |
| GET | `password/reset` | — | `showLinkRequestForm` | — | guest |

### `Auth\LoginController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `login` | — | `login` | redirect | guest |
| GET | `login` | login | `showLoginForm` | — | guest |
| POST | `logout` | logout | `logout` | — | — |
| GET | `logout` | — | `logout` | — | — |

### `Auth\PostRegistrationOnboardingController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `onboarding` | — | `show` | `auth.post_registration_onboarding` | auth |
| POST | `onboarding/preferences` | — | `store` | json | auth |

### `Auth\RegisterController` (5 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `register` | — | `register` | — | guest |
| GET | `register` | register | `showRegistrationForm` | — | guest |
| POST | `register/checkemail` | — | `mailcheck` | json | guest |
| GET | `registertool/{name}/{email}/{phone}` | — | `registertool` | `auth.registertool` | guest |
| GET | `trial` | — | `freeTrial` | `auth.freetrial` | guest |

### `Auth\ResetPasswordController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `password/reset` | — | `reset` | — | guest |
| GET | `password/reset/{token}` | — | `showResetForm` | — | guest |

## Cron / Webhooks


### `CronController` (6 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `cron/opencorporatescreditupdate` | — | `opencorporatescreditupdate` | — | — |
| GET | `cron/syncHubspotCompaniesContacts` | — | `syncHubspotCompaniesContacts` | — | — |
| GET | `cron/synccompanies` | — | `syncCompanies` | — | — |
| GET | `cron/updatestripesubscriptionstatuscredit` | — | `encapsulationCron` | — | — |
| GET | `cron/updatesubscription` | — | `updateSubscription` | json | — |
| GET | `cron/usersubscriptionupdate` | — | `usersubscriptionupdate` | — | — |

### `UserauthController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `businessClientUpdateCron` | — | `businessClientUpdateCron` | — | Closure |
| GET | `routenotifycron` | — | `routeNotifyCron` | json | Closure |

## Backpack admin (vendor)


### `Admin\CitiesCrudController` (6 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `admin/cities/getall` | — | `getCities` | — | — |
| GET | `admin/cities/getfilter` | — | `getFilter` | — | — |
| GET | `admin/cities/getone/{id}` | — | `getOne` | — | — |
| GET | `admin/cities/getsome` | — | `getSome` | — | — |
| GET | `admin/cities/searchcity` | — | `searchCities` | — | — |
| GET | `admin/cities/updatecitylatlng` | — | `updateCityLatLng` | — | — |

### `Backpack\BackupManager\app\Http\Controllers\BackupController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/backup` | — | `index` | (vendor package) | admin |
| PUT | `hq/backup/create` | — | `create` | (vendor package) | admin |
| DELETE | `hq/backup/delete/{file_name?}` | — | `delete` | (vendor package) | admin |
| GET | `hq/backup/download/{file_name?}` | — | `download` | (vendor package) | admin |

### `Backpack\Base\app\Http\Controllers\Auth\ForgotPasswordController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `hq/password/email` | — | `sendResetLinkEmail` | (vendor package) | guest |
| GET | `hq/password/reset` | — | `showLinkRequestForm` | (vendor package) | guest |

### `Backpack\Base\app\Http\Controllers\Auth\LoginController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/login` | login | `showLoginForm` | (vendor package) | guest |
| POST | `hq/login` | — | `login` | (vendor package) | guest |
| GET | `hq/logout` | — | `logout` | (vendor package) | — |
| POST | `hq/logout` | logout | `logout` | (vendor package) | — |

### `Backpack\Base\app\Http\Controllers\Auth\RegisterController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/register` | register | `showRegistrationForm` | (vendor package) | guest |
| POST | `hq/register` | — | `register` | (vendor package) | guest |

### `Backpack\Base\app\Http\Controllers\Auth\ResetPasswordController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `hq/password/reset` | — | `reset` | (vendor package) | guest |
| GET | `hq/password/reset/{token}` | — | `showResetForm` | (vendor package) | guest |

### `Backpack\LogManager\app\Http\Controllers\LogController` (4 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/log` | — | `index` | (vendor package) | admin |
| DELETE | `hq/log/delete/{file_name}` | — | `delete` | (vendor package) | admin |
| GET | `hq/log/download/{file_name}` | — | `download` | (vendor package) | admin |
| GET | `hq/log/preview/{file_name}` | — | `preview` | (vendor package) | admin |

### `Backpack\PageManager\app\Http\Controllers\Admin\PageCrudController` (16 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/page` | page.index | `index` | (vendor package) | admin,Closure |
| POST | `hq/page` | page.store | `store` | (vendor package) | admin,Closure |
| GET | `hq/page/create` | page.create | `create` | (vendor package) | admin,Closure |
| GET | `hq/page/create/{template}` | — | `create` | (vendor package) | admin,Closure |
| GET | `hq/page/reorder` | — | `reorder` | (vendor package) | admin,Closure |
| POST | `hq/page/reorder` | — | `saveReorder` | (vendor package) | admin,Closure |
| GET | `hq/page/reorder/{lang}` | — | `reorder` | (vendor package) | admin,Closure |
| POST | `hq/page/reorder/{lang}` | — | `saveReorder` | (vendor package) | admin,Closure |
| POST | `hq/page/search` | crud.page.search | `search` | (vendor package) | admin,Closure |
| GET | `hq/page/{id}/details` | — | `showDetailsRow` | (vendor package) | admin,Closure |
| GET | `hq/page/{id}/edit/{template}` | — | `edit` | (vendor package) | admin,Closure |
| GET | `hq/page/{id}/translate/{lang}` | — | `translateItem` | (vendor package) | admin,Closure |
| DELETE | `hq/page/{page}` | page.destroy | `destroy` | (vendor package) | admin,Closure |
| PUT|PATCH | `hq/page/{page}` | page.update | `update` | (vendor package) | admin,Closure |
| GET | `hq/page/{page}` | page.show | `show` | (vendor package) | admin,Closure |
| GET | `hq/page/{page}/edit` | page.edit | `edit` | (vendor package) | admin,Closure |

### `Backpack\PermissionManager\app\Http\Controllers\PermissionCrudController` (14 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/permission` | crud.permission.index | `index` | (vendor package) | admin,Closure |
| POST | `hq/permission` | crud.permission.store | `store` | (vendor package) | admin,Closure |
| GET | `hq/permission/create` | crud.permission.create | `create` | (vendor package) | admin,Closure |
| GET | `hq/permission/reorder` | crud.permission.reorder | `reorder` | (vendor package) | admin,Closure |
| POST | `hq/permission/reorder` | crud.permission.save.reorder | `saveReorder` | (vendor package) | admin,Closure |
| POST | `hq/permission/search` | crud.permission.search | `search` | (vendor package) | admin,Closure |
| GET | `hq/permission/{id}/details` | crud.permission.showDetailsRow | `showDetailsRow` | (vendor package) | admin,Closure |
| GET | `hq/permission/{id}/revisions` | crud.permission.listRevisions | `listRevisions` | (vendor package) | admin,Closure |
| POST | `hq/permission/{id}/revisions/{revisionId}/restore` | crud.permission.restoreRevision | `restoreRevision` | (vendor package) | admin,Closure |
| GET | `hq/permission/{id}/translate/{lang}` | crud.permission.translateItem | `translateItem` | (vendor package) | admin,Closure |
| PUT|PATCH | `hq/permission/{permission}` | crud.permission.update | `update` | (vendor package) | admin,Closure |
| GET | `hq/permission/{permission}` | crud.permission.show | `show` | (vendor package) | admin,Closure |
| DELETE | `hq/permission/{permission}` | crud.permission.destroy | `destroy` | (vendor package) | admin,Closure |
| GET | `hq/permission/{permission}/edit` | crud.permission.edit | `edit` | (vendor package) | admin,Closure |

### `Backpack\PermissionManager\app\Http\Controllers\RoleCrudController` (14 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| POST | `hq/role` | crud.role.store | `store` | (vendor package) | admin,Closure |
| GET | `hq/role` | crud.role.index | `index` | (vendor package) | admin,Closure |
| GET | `hq/role/create` | crud.role.create | `create` | (vendor package) | admin,Closure |
| GET | `hq/role/reorder` | crud.role.reorder | `reorder` | (vendor package) | admin,Closure |
| POST | `hq/role/reorder` | crud.role.save.reorder | `saveReorder` | (vendor package) | admin,Closure |
| POST | `hq/role/search` | crud.role.search | `search` | (vendor package) | admin,Closure |
| GET | `hq/role/{id}/details` | crud.role.showDetailsRow | `showDetailsRow` | (vendor package) | admin,Closure |
| GET | `hq/role/{id}/revisions` | crud.role.listRevisions | `listRevisions` | (vendor package) | admin,Closure |
| POST | `hq/role/{id}/revisions/{revisionId}/restore` | crud.role.restoreRevision | `restoreRevision` | (vendor package) | admin,Closure |
| GET | `hq/role/{id}/translate/{lang}` | crud.role.translateItem | `translateItem` | (vendor package) | admin,Closure |
| GET | `hq/role/{role}` | crud.role.show | `show` | (vendor package) | admin,Closure |
| PUT|PATCH | `hq/role/{role}` | crud.role.update | `update` | (vendor package) | admin,Closure |
| DELETE | `hq/role/{role}` | crud.role.destroy | `destroy` | (vendor package) | admin,Closure |
| GET | `hq/role/{role}/edit` | crud.role.edit | `edit` | (vendor package) | admin,Closure |

### `Backpack\PermissionManager\app\Http\Controllers\UserCrudController` (13 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/user` | crud.user.index | `index` | (vendor package) | admin,Closure |
| POST | `hq/user` | crud.user.store | `store` | (vendor package) | admin,Closure |
| GET | `hq/user/create` | crud.user.create | `create` | (vendor package) | admin,Closure |
| GET | `hq/user/reorder` | crud.user.reorder | `reorder` | (vendor package) | admin,Closure |
| POST | `hq/user/reorder` | crud.user.save.reorder | `saveReorder` | (vendor package) | admin,Closure |
| POST | `hq/user/search` | crud.user.search | `search` | (vendor package) | admin,Closure |
| GET | `hq/user/{id}/details` | crud.user.showDetailsRow | `showDetailsRow` | (vendor package) | admin,Closure |
| GET | `hq/user/{id}/revisions` | crud.user.listRevisions | `listRevisions` | (vendor package) | admin,Closure |
| POST | `hq/user/{id}/revisions/{revisionId}/restore` | crud.user.restoreRevision | `restoreRevision` | (vendor package) | admin,Closure |
| GET | `hq/user/{id}/translate/{lang}` | crud.user.translateItem | `translateItem` | (vendor package) | admin,Closure |
| DELETE | `hq/user/{user}` | crud.user.destroy | `destroy` | (vendor package) | admin,Closure |
| GET | `hq/user/{user}` | crud.user.show | `show` | (vendor package) | admin,Closure |
| PUT|PATCH | `hq/user/{user}` | crud.user.update | `update` | (vendor package) | admin,Closure |

### `Backpack\Settings\app\Http\Controllers\SettingCrudController` (14 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `hq/setting` | crud.setting.index | `index` | (vendor package) | admin,Closure |
| POST | `hq/setting` | crud.setting.store | `store` | (vendor package) | admin,Closure |
| GET | `hq/setting/create` | crud.setting.create | `create` | (vendor package) | admin,Closure |
| POST | `hq/setting/reorder` | crud.setting.save.reorder | `saveReorder` | (vendor package) | admin,Closure |
| GET | `hq/setting/reorder` | crud.setting.reorder | `reorder` | (vendor package) | admin,Closure |
| POST | `hq/setting/search` | crud.setting.search | `search` | (vendor package) | admin,Closure |
| GET | `hq/setting/{id}/details` | crud.setting.showDetailsRow | `showDetailsRow` | (vendor package) | admin,Closure |
| GET | `hq/setting/{id}/revisions` | crud.setting.listRevisions | `listRevisions` | (vendor package) | admin,Closure |
| POST | `hq/setting/{id}/revisions/{revisionId}/restore` | crud.setting.restoreRevision | `restoreRevision` | (vendor package) | admin,Closure |
| GET | `hq/setting/{id}/translate/{lang}` | crud.setting.translateItem | `translateItem` | (vendor package) | admin,Closure |
| DELETE | `hq/setting/{setting}` | crud.setting.destroy | `destroy` | (vendor package) | admin,Closure |
| PUT|PATCH | `hq/setting/{setting}` | crud.setting.update | `update` | (vendor package) | admin,Closure |
| GET | `hq/setting/{setting}` | crud.setting.show | `show` | (vendor package) | admin,Closure |
| GET | `hq/setting/{setting}/edit` | crud.setting.edit | `edit` | (vendor package) | admin,Closure |

## Vendor / dev tooling


### `Barryvdh\Debugbar\Controllers\AssetController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `_debugbar/assets/javascript` | debugbar.assets.js | `js` | (vendor package) | — |
| GET | `_debugbar/assets/stylesheets` | debugbar.assets.css | `css` | (vendor package) | — |

### `Barryvdh\Debugbar\Controllers\OpenHandlerController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `_debugbar/clockwork/{id}` | debugbar.clockwork | `clockwork` | (vendor package) | — |
| GET | `_debugbar/open` | debugbar.openhandler | `handle` | (vendor package) | — |

### `Barryvdh\Elfinder\ElfinderController` (7 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `elfinder` | elfinder.index | `showIndex` | (vendor package) | auth |
| GET | `elfinder/ckeditor` | elfinder.ckeditor | `showCKeditor4` | (vendor package) | auth |
| GET|POST|PUT|PATCH|DELETE | `elfinder/connector` | elfinder.connector | `showConnector` | (vendor package) | auth |
| GET | `elfinder/filepicker/{input_id}` | elfinder.filepicker | `showFilePicker` | (vendor package) | auth |
| GET | `elfinder/popup/{input_id}` | elfinder.popup | `showPopup` | (vendor package) | auth |
| GET | `elfinder/tinymce` | elfinder.tinymce | `showTinyMCE` | (vendor package) | auth |
| GET | `elfinder/tinymce4` | elfinder.tinymce4 | `showTinyMCE4` | (vendor package) | auth |

### `\Mews\Captcha\CaptchaController` (2 routes)

| Method | URI | Name | Action | Views / response | Middleware |
|---|---|---|---|---|---|
| GET | `captcha/api/{config?}` | — | `getCaptchaApi` | (vendor package) | — |
| GET | `captcha/{config?}` | — | `getCaptcha` | (vendor package) | — |

## Known limits of this map

- View detection is a text scan of the method body. A method that delegates rendering to a helper, a trait, or a parent class shows `—` even though a view is rendered.
- Views included from within a Blade template (`@include`, layouts, modals) are not listed — only the top-level `view()` call.
- Middleware is shown minus the implicit `web` group.
- Routes registered by MCP packages appear under **MCP servers** by namespace; their tool-level contract is in `../features/20-MCP/api-surfaces.md`, not here.
- **Backpack admin (vendor)** and **Vendor / dev tooling** routes come from Composer packages (Backpack CRUD/PageManager/PermissionManager/Settings/LogManager/BackupManager, Debugbar, Elfinder, Captcha). Their controllers live in `vendor/`, so no view scan is attempted — they show `(vendor package)`. The TerriTool-authored admin is the `hq/*` group under **Admin HQ**.
