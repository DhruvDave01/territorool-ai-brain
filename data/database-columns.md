---
id: database-columns
parent: data
related:
  - 16-data-models.md
---
# Database column lists

Related: [16-data-models](../16-data-models.md)

Mass-assignable columns from Eloquent `$fillable` / `$table`. Not a full schema dump (migrations are incomplete vs production). Hidden: `users.password`, `remember_token`.

## Core CRM

| Table | Model | Fillable / notes |
|-------|--------|------------------|
| `users` | `App\User` | `name`, `email`, `password`, `phone`, `amount_of_licenses`, `monthly_cost`, `cost_per_user`, `payment_period`, `billing_name`, `billing_email`, `subscribe_month`, `parent_id`, `status`, `promocode`, `country`, `total_credits`, `yelp_leads`, `cancel_feedback` (array), `conversion_rate` (array), `isupgrade` (bool), `register_from` |
| `companies` | `Company` | `user_id`, `sf_id`, `title`, `address`, `city_id`, `postal_code`, `website`, `company_email`, `phone_number`, `linkedin_url`, `instagram_url`, `facebook_url`, `employees`, `latitude`, `longitude`, `place_id`, `note`, `company_status`, `company_status_id`, `hs_object_id`, `karmacrm_object_id`, `annual_revenue`, `uc_category_id`, `is_temp_company`, `type`, `source`, `rating`, `review_count`, `report_flag`; SoftDeletes `deleted_at` |
| `contacts` | `Contacts` | `company_id`, `cognism_id`, `sfdc_id`, `contact_name`, `position`, `city_id`, `city`, `state`, `notes`, `company`, `user_id`, `status`, `email`, `phone_no`, `mobile_no`, `linkedin_url`, `contact_status_id`, `first_name`, `last_name`, `hs_object_id`, `karmacrm_object_id`, `hs_associated_company_id`, `uc_stage_id`, `source`, `report_flag` |
| `company_notes` | `Notes` | `user_id`, `company_id`, `note`, `note_type`, `date_time`, `hs_object_id`, `hs_associated_company_id`, `updated_at` |
| `activities` | `Activity` | `user_id`, `title`, `description`, `module` |
| `log_meetings` | `LogMeeting` | `user_id`, `company_id`, `meeting_datetime`, `meeting_duration`, `description`, timestamps, HubSpot ids |
| `company_time` | `CompanyTime` | `company_id`, `day`, `status`, `open_time`, `close_time` |
| `user_visited_companies` | `UserVisitedCompanies` | `company_id`, `route_id`, `visit_time` |
| `user_navigate_me` | `UserNavigateMe` | `company_id`, `user_id` |

## Routes / lists

| Table | Fillable |
|-------|--------|
| `user_routes` | `user_id`, `title`, `route_type`, `file_name`, `status`, `meta_data`, `total_distance`, `total_time`, `filter_with`, `resume_page`, `comp_add_change`, `is_active`, `uid`, `company_status_id`, `is_route_open` |
| `user_route_companies` | `company_id`, `user_id`, `company_status`, `route_id`, `cluster_id`, `company_status_id`, `is_visited`, `route_order`, `distance`, `time`, `bookmark` |
| `user_route_clusters` | `route_id`, `title`, `is_visited`, `cities` |
| `user_lists` | `user_id`, `title`, `is_list_open` |
| `user_list_companies` | `company_id`, `user_id`, `list_id` |
| `user_list_route` | `list_id`, `route_id` |
| `share_route_list` | `user_id`, `route_id`, `list_id`, `shared_by`, `new_route_id` |

## Credits / billing

| Table | Fillable |
|-------|--------|
| `user_credits` | `user_id`, `total_credit`, `used_credit`, `date`, `package_credits_applied` |
| `user_credit_charge` | `user_id`, `payment_info` |
| `user_credit_card` | `user_id`, `cc_no`, `cc_id` |
| `user_contacts_credits` | `user_id`, `total_credit`, `used_credit`, `date` |
| `user_contacts_credit_charge` | `user_id`, `payment_info` |
| `businessclient_salesagent_credits` | `user_id`, `total_credit`, `used_credit`, `date`, `alloted_credits` |
| `user_packages` | `user_id`, `package_id`, `start_date`, `end_date`, `amount`, `payment_info`, `promo_id` |
| `packages` | `title`, `amount`, `duration`, `status` |
| `packages_addons` | `amount`, `credit` |
| `user_package_addons` | `user_id`, `amount`, `payment_info`, `date` |
| `user_promocode` | `stripe_id`, `code`, `discount`, `validity`, `repeating_months`, `usagelimit`, `special_discount`, `type` |
| `special_discount` | `email`, `discount`, `expirydate`, `validity`, `type` |

## AI / CRM / session / other

| Table | Fillable |
|-------|--------|
| `user_ai_search` | `user_id`, `website`, `city`, `ideal_prospects`, `search_result`, `sell_description`, `ai_search_by`, `status`, `progress`, `progress_message`, `error_message`, `geo_lat`, `geo_lng`, `stage2_page_tokens`, `stage2_raw_places`, `stage2_geo_points` |
| `claude_contact_lookups` | (see model `$fillable`) |
| `user_status` / `user_contact_stage` | per-user labels (API `getuserstatus*`) |
| `hubspot_mappings` (HubspotMapping) | `user_id`, `company_mapping`, `contact_mapping` |
| `sfdc` | `username`, `password_sfdc`, `security_token` |
| `user_devices` | `user_id`, `device_id`, `device_type`, `status` |
| `user_invitee` | see model |
| `support_ticket` | `$fillable` empty in model — columns used in controller |
| `user_session` | `user_id`, `type`, `file_name`, `mapping_data`, `progress_percentage` |
| `companies_session` | CSV wizard company rows + `session_status`, `session_error` |
| `contacts_session` | CSV contact rows + `session_status` |
| `company_notes_session` | session notes |
| `user_companies_session` | `company_name`, `company_id`, `user_id`, `notes`, `company_status`, `distance`, `excel_file`, `session_status`, `session_error`, `user_session_id` |
| `user_mcp_request_logs` / `search_logs` / `tool_logs` | MCP audit |
| `user_mcp_connections` | outbound MCP OAuth |
| `google_sheet_sync_failures` | Google Sheets job failures |
| `cities` / `countries` / `user_cities` / `roles` / `role_users` | `$fillable` often empty — used via queries |

## Mongo

| Collection-ish | Fillable |
|----------------|--------|
| City | `title`, `city_code`, `longitude`, `latitude` |
| Country | `title`, `country_code` |
| Location | `title`, `street_number`, `route`, `postal_code`, `latitude`, `longitude`, `source_type`, `data` |

## Realm (mobile) — not MySQL

See [16-data-models.md](../16-data-models.md) JWTToken / offlineRoute / TourSchema / AIFindLeads / FCMNotication.
