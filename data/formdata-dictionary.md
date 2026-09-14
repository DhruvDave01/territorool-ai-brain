# FormData field dictionary

Related: [12-mobile-api](../12-mobile-api.md) · [screens/how-it-works.md](../screens/how-it-works.md)

Mobile posts **multipart FormData** via `API.post`. Keys below are from live `formdata.append` / `buildAiFormData`. JWT is a header, not a field.

`buildAiFormData` (`aiFindLeads.js`): skips null/undefined; booleans → `"true"` / `"false"` strings.

## Auth

| Endpoint | Fields |
|----------|--------|
| `login` | `email`, `password`, `device_token`, `device_type` |
| `forgotPassword` | `email` |
| `mobileregistration` / `leads_user` | `name`, `email`, `phone`, `country`, `password`, `device_token`, `device_type`, `new_flow` |
| `logout` | `device_token`, `device_type` (settings) |
| `updateUserPreferences` | `desire`, `role`, `sell_to`, `ai_find_leads_preview`, plus more preference keys from post-signup flow |
| `cancelSubscription` | `cancel_primary_reason`, `cancel_tell_more`, `cancel_anything_else` |
| `getversiondetails` | `platform` (`DEVICE_OS`), `app_version` (`APP_VERSION` = `'2.0'`) |
| `sendReferralInvite` | `email`, `phone` |
| `updateuserstatus` | `stausdetails` (JSON string — typo in key) |

## Companies

| Endpoint | Fields |
|----------|--------|
| `addcompany` | `title`, `address`, `city_id`, `postal_code`, `website`, `annual_revenue`, `phone_number`, `linkedin_url`, `rating`, `latitude`, `longitude`, `place_id`, `number` (often `""`), `company_status_id`, `uc_category_id`, `user_latitude`, `user_longitude`, `note`, `contact_list`, `opening_hours` (JSON), `type`; optional `city_title`, `city_code`, `city_country` |
| `updatecompany` | `company_id`, `title`, `website`, `company_status_id` (sheet save) |
| `companydetail` | `company_id` |
| `companylist` / filters | `scrtext`, `page`, `sort_order`, `limit`, `employees`, `revenue`, `type`, `company_status_id[]`, `city_id_filter`, `is_visited`, `filterby_open_close`, `route_id`, `listView` |
| `reportcompany` | `company_id`, `reason`, `details` |
| `updatecompanystatus` | `company_id`, `company_status_id` |
| `bookmarkroutecompany` | `user_company_id`, `add`, `route_id` or `list_id` |
| `companymarkedvisited` / visit time | `company_id`, `visit_time`, `route_id`, `flag` |
| `companyvisitremove` | `id` (visit id), `company_id`, `route_id` or `list_id` |

## Contacts

| Endpoint | Fields |
|----------|--------|
| `addcontact` | `contact_name`, `last_name`, `phone_no`, `mobile_no`, `linkedin_url`, `company_id`, `company`, `position`, `city_id`, `email`, `contact_status_id`, `city`, `state`, `notes` |
| `contactlist` | `offset`, `allcontactlist` |
| `fetchAllContacts` | `company_id`, `domain`, `address`, `name`, `position`, `location`, `fullenrich_page`, `dataaxle_page`, `display_company_name` |
| Apollo-style page | `domain`, `lastReturnedKey`, `contact_count` |
| `AILeadsContactFinder` | `place_id`, `website` |
| `buyContacts` / redeem | company + selected contact payloads (provider-specific ids) |
| `reportcontact` | `company_id`, `reason`/`reason_id`, `details`/`feedback`, `contact_id` or `contact_ids[i]`, optional `cognism_id`, `source`, `contact_name`, `contact_position`, `company_name` |

## Notes / activities

| Endpoint | Fields |
|----------|--------|
| `addnote` / `updatenote` | `note`, `id`, `type`, `note_type`, `date` (`YYYY-MM-DD`), `time` (`h:mm A` or `""`) |
| `addcompanyactivity` | `note`, `note_type`, `company_id`, `date`, `time`, optional `route_id`, `type` |
| `updatecompanyactivity` | `date` + `time` via `appendActivityDateTimeToFormData` |

Timezone for compare: `America/Los_Angeles`.

## Routes / lists

| Endpoint | Fields |
|----------|--------|
| `createroute` | `route_name`, `company_id_csv`, `resume_page`, `routetype`, `filter_with`, optional `latitude`/`longitude` |
| `simplerouteview` | `page`, `route_id`, `latitude`, `longitude` (often `""`) |
| `updaterouteactive` | `route_id` |
| `scan-qr-code` | `route_id` (from QR `id`) |
| `createList` | `list_title`, `selected_companies` |
| `updateList` | `list_id`, `selected_companies`; or `id`, `name`, `type=list` |
| `deleteList` | `id` |
| `generateroute` | `list_id`, `start_point`, `end_point`, optional GPS |
| `shareRouteList` | `list_id` or `route_id`, `email`, `duplicate` |

## AI leads

| Endpoint | Fields |
|----------|--------|
| `getAILeadsV2` | `ai_search_by` (`city`\|`zip`), `territories`, `sell_description`, optional `top50` |
| `resumeAILeadSearch` | `search_id` |
| `saveAILeads` | `companies_data[]` (JSON per lead, repeated) |

## HubSpot / credits

| Endpoint | Fields |
|----------|--------|
| `getusercredit` | (often empty body / GET) |
| HubSpot sync | keys from settings (`formdata.append(key, String(value))` loop) plus `url` for some calls |

If an endpoint is missing here, grep `formdata.append` next to the `URL_*` constant — do not invent keys.
