--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP PUBLICATION IF EXISTS supabase_realtime;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY public.user_resumes DROP CONSTRAINT IF EXISTS user_resumes_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS "settings_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.saved_jobs DROP CONSTRAINT IF EXISTS "saved_jobs_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.saved_jobs DROP CONSTRAINT IF EXISTS "saved_jobs_jobId_fkey";
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_granted_by_fkey;
ALTER TABLE IF EXISTS ONLY public.mfa_codes DROP CONSTRAINT IF EXISTS mfa_codes_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.jobs DROP CONSTRAINT IF EXISTS "jobs_createdBy_fkey";
ALTER TABLE IF EXISTS ONLY public.jobs DROP CONSTRAINT IF EXISTS "jobs_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public.job_alert_subscriptions DROP CONSTRAINT IF EXISTS job_alert_subscriptions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.interviews DROP CONSTRAINT IF EXISTS interviews_job_id_fkey;
ALTER TABLE IF EXISTS ONLY public.interviews DROP CONSTRAINT IF EXISTS interviews_interviewer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.interviews DROP CONSTRAINT IF EXISTS interviews_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.interviews DROP CONSTRAINT IF EXISTS interviews_application_id_fkey;
ALTER TABLE IF EXISTS ONLY public.weekly_digests DROP CONSTRAINT IF EXISTS fk_weekly_digests_sent_by;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS fk_user_roles_user_id;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS fk_user_roles_role_id;
ALTER TABLE IF EXISTS ONLY public.notification_logs DROP CONSTRAINT IF EXISTS fk_notification_logs_user_id;
ALTER TABLE IF EXISTS ONLY public.notification_logs DROP CONSTRAINT IF EXISTS fk_notification_logs_subscription_id;
ALTER TABLE IF EXISTS ONLY public.notification_logs DROP CONSTRAINT IF EXISTS fk_notification_logs_job_id;
ALTER TABLE IF EXISTS ONLY public.job_approval_requests DROP CONSTRAINT IF EXISTS fk_job_approval_reviewed_by;
ALTER TABLE IF EXISTS ONLY public.job_approval_requests DROP CONSTRAINT IF EXISTS fk_job_approval_requested_by;
ALTER TABLE IF EXISTS ONLY public.job_approval_requests DROP CONSTRAINT IF EXISTS fk_job_approval_job;
ALTER TABLE IF EXISTS ONLY public.interview_tokens DROP CONSTRAINT IF EXISTS fk_interview_tokens_application;
ALTER TABLE IF EXISTS ONLY public.interview_reschedule_requests DROP CONSTRAINT IF EXISTS fk_interview_reschedule_requests_token;
ALTER TABLE IF EXISTS ONLY public.interview_reschedule_requests DROP CONSTRAINT IF EXISTS fk_interview_reschedule_requests_reviewer;
ALTER TABLE IF EXISTS ONLY public.interview_reschedule_requests DROP CONSTRAINT IF EXISTS fk_interview_reschedule_requests_application;
ALTER TABLE IF EXISTS ONLY public.hire_approval_requests DROP CONSTRAINT IF EXISTS fk_hire_approval_reviewed_by;
ALTER TABLE IF EXISTS ONLY public.hire_approval_requests DROP CONSTRAINT IF EXISTS fk_hire_approval_requested_by;
ALTER TABLE IF EXISTS ONLY public.hire_approval_requests DROP CONSTRAINT IF EXISTS fk_hire_approval_application;
ALTER TABLE IF EXISTS ONLY public.email_templates DROP CONSTRAINT IF EXISTS fk_email_templates_created_by;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS fk_audit_logs_related_user;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS fk_audit_logs_related_job;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS fk_audit_logs_related_application;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS fk_audit_logs_actor;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS fk_applications_archived_by;
ALTER TABLE IF EXISTS ONLY public.emails DROP CONSTRAINT IF EXISTS emails_sent_by_fkey;
ALTER TABLE IF EXISTS ONLY public.emails DROP CONSTRAINT IF EXISTS emails_job_id_fkey;
ALTER TABLE IF EXISTS ONLY public.emails DROP CONSTRAINT IF EXISTS emails_campaign_id_fkey;
ALTER TABLE IF EXISTS ONLY public.emails DROP CONSTRAINT IF EXISTS emails_application_id_fkey;
ALTER TABLE IF EXISTS ONLY public.email_campaigns DROP CONSTRAINT IF EXISTS email_campaigns_job_id_fkey;
ALTER TABLE IF EXISTS ONLY public.email_campaigns DROP CONSTRAINT IF EXISTS email_campaigns_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.email_automation_rules DROP CONSTRAINT IF EXISTS email_automation_rules_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS "applications_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS "applications_jobId_fkey";
ALTER TABLE IF EXISTS ONLY public.application_stage_history DROP CONSTRAINT IF EXISTS application_stage_history_changed_by_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.application_stage_history DROP CONSTRAINT IF EXISTS application_stage_history_application_id_fkey;
ALTER TABLE IF EXISTS ONLY public.api_webhook_endpoints DROP CONSTRAINT IF EXISTS api_webhook_endpoints_api_key_id_fkey;
ALTER TABLE IF EXISTS ONLY public.api_usage_logs DROP CONSTRAINT IF EXISTS api_usage_logs_api_key_id_fkey;
ALTER TABLE IF EXISTS ONLY public.api_keys DROP CONSTRAINT IF EXISTS api_keys_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_flow_state_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_auth_factor_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_user_id_fkey;
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS tr_check_filters ON realtime.subscription;
DROP TRIGGER IF EXISTS update_job_alert_subscriptions_updated_at ON public.job_alert_subscriptions;
DROP TRIGGER IF EXISTS update_analytics_configurations_updated_at ON public.analytics_configurations;
DROP TRIGGER IF EXISTS trg_hire_approval_updated_at ON public.hire_approval_requests;
DROP INDEX IF EXISTS storage.name_prefix_search;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name;
DROP INDEX IF EXISTS storage.idx_multipart_uploads_list;
DROP INDEX IF EXISTS storage.bucketid_objname;
DROP INDEX IF EXISTS storage.bname;
DROP INDEX IF EXISTS realtime.subscription_subscription_id_entity_filters_key;
DROP INDEX IF EXISTS realtime.ix_realtime_subscription_entity;
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.unique_pending_job_request;
DROP INDEX IF EXISTS public."saved_jobs_userId_jobId_key";
DROP INDEX IF EXISTS public.jobs_slug_key;
DROP INDEX IF EXISTS public.idx_weekly_digests_week_start;
DROP INDEX IF EXISTS public.idx_weekly_digests_type;
DROP INDEX IF EXISTS public.idx_weekly_digests_status;
DROP INDEX IF EXISTS public.idx_weekly_digests_sent_by;
DROP INDEX IF EXISTS public.idx_weekly_digests_sent_at;
DROP INDEX IF EXISTS public.idx_users_mfa_methods;
DROP INDEX IF EXISTS public.idx_users_account_type;
DROP INDEX IF EXISTS public.idx_user_roles_user_id;
DROP INDEX IF EXISTS public.idx_user_roles_role_id;
DROP INDEX IF EXISTS public.idx_user_roles_active;
DROP INDEX IF EXISTS public.idx_user_resumes_user_id;
DROP INDEX IF EXISTS public.idx_user_resumes_default;
DROP INDEX IF EXISTS public.idx_roles_ldap;
DROP INDEX IF EXISTS public.idx_roles_active;
DROP INDEX IF EXISTS public.idx_role_permissions_role_id;
DROP INDEX IF EXISTS public.idx_role_permissions_permission_id;
DROP INDEX IF EXISTS public.idx_permissions_resource_action;
DROP INDEX IF EXISTS public.idx_notification_logs_user_id;
DROP INDEX IF EXISTS public.idx_notification_logs_type;
DROP INDEX IF EXISTS public.idx_notification_logs_sent_at;
DROP INDEX IF EXISTS public.idx_notification_logs_batch_id;
DROP INDEX IF EXISTS public.idx_jobs_auto_expires_at;
DROP INDEX IF EXISTS public.idx_job_approval_requests_status;
DROP INDEX IF EXISTS public.idx_job_approval_requests_reviewed_by;
DROP INDEX IF EXISTS public.idx_job_approval_requests_requested_by;
DROP INDEX IF EXISTS public.idx_job_approval_requests_requested_at;
DROP INDEX IF EXISTS public.idx_job_approval_requests_job_id;
DROP INDEX IF EXISTS public.idx_job_alerts_user_id;
DROP INDEX IF EXISTS public.idx_job_alerts_type;
DROP INDEX IF EXISTS public.idx_job_alerts_department;
DROP INDEX IF EXISTS public.idx_job_alerts_created;
DROP INDEX IF EXISTS public.idx_job_alerts_active;
DROP INDEX IF EXISTS public.idx_interviews_status;
DROP INDEX IF EXISTS public.idx_interviews_scheduled_at;
DROP INDEX IF EXISTS public.idx_interviews_job_id;
DROP INDEX IF EXISTS public.idx_interviews_interviewer_id;
DROP INDEX IF EXISTS public.idx_interviews_created_at;
DROP INDEX IF EXISTS public.idx_interviews_application_id;
DROP INDEX IF EXISTS public.idx_interview_tokens_status;
DROP INDEX IF EXISTS public.idx_interview_tokens_reschedule_token;
DROP INDEX IF EXISTS public.idx_interview_tokens_is_completed;
DROP INDEX IF EXISTS public.idx_interview_tokens_expires_at;
DROP INDEX IF EXISTS public.idx_interview_tokens_completed_at;
DROP INDEX IF EXISTS public.idx_interview_tokens_application_id;
DROP INDEX IF EXISTS public.idx_interview_tokens_acceptance_token;
DROP INDEX IF EXISTS public.idx_interview_reschedule_requests_token_id;
DROP INDEX IF EXISTS public.idx_interview_reschedule_requests_submitted_at;
DROP INDEX IF EXISTS public.idx_interview_reschedule_requests_status;
DROP INDEX IF EXISTS public.idx_interview_reschedule_requests_application_id;
DROP INDEX IF EXISTS public.idx_hire_approval_requests_status;
DROP INDEX IF EXISTS public.idx_hire_approval_requests_reviewed_by;
DROP INDEX IF EXISTS public.idx_hire_approval_requests_requested_by;
DROP INDEX IF EXISTS public.idx_hire_approval_requests_requested_at;
DROP INDEX IF EXISTS public.idx_hire_approval_requests_application_id;
DROP INDEX IF EXISTS public.idx_emails_template_id;
DROP INDEX IF EXISTS public.idx_emails_status;
DROP INDEX IF EXISTS public.idx_emails_sent_by;
DROP INDEX IF EXISTS public.idx_emails_sent_at;
DROP INDEX IF EXISTS public.idx_emails_job_id;
DROP INDEX IF EXISTS public.idx_emails_application_id;
DROP INDEX IF EXISTS public.idx_email_templates_type;
DROP INDEX IF EXISTS public.idx_email_templates_is_active;
DROP INDEX IF EXISTS public.idx_email_campaigns_job_id;
DROP INDEX IF EXISTS public.idx_email_campaigns_created_by;
DROP INDEX IF EXISTS public.idx_audit_logs_related_user;
DROP INDEX IF EXISTS public.idx_audit_logs_related_job;
DROP INDEX IF EXISTS public.idx_audit_logs_related_application;
DROP INDEX IF EXISTS public.idx_audit_logs_entity_timeline;
DROP INDEX IF EXISTS public.idx_audit_logs_entity;
DROP INDEX IF EXISTS public.idx_audit_logs_created_at;
DROP INDEX IF EXISTS public.idx_audit_logs_category_date;
DROP INDEX IF EXISTS public.idx_audit_logs_actor;
DROP INDEX IF EXISTS public.idx_applications_is_archived;
DROP INDEX IF EXISTS public.idx_applications_archived_status;
DROP INDEX IF EXISTS public.idx_application_stage_history_stage;
DROP INDEX IF EXISTS public.idx_application_stage_history_entered_at;
DROP INDEX IF EXISTS public.idx_application_stage_history_application_id;
DROP INDEX IF EXISTS public.idx_application_notes_metadata_interview_id;
DROP INDEX IF EXISTS public.idx_application_notes_interview_feedback;
DROP INDEX IF EXISTS public.idx_api_webhook_endpoints_api_key_id;
DROP INDEX IF EXISTS public.idx_api_webhook_endpoints_active;
DROP INDEX IF EXISTS public.idx_api_usage_logs_endpoint;
DROP INDEX IF EXISTS public.idx_api_usage_logs_created_at;
DROP INDEX IF EXISTS public.idx_api_usage_logs_api_key_id;
DROP INDEX IF EXISTS public.idx_api_keys_expires_at;
DROP INDEX IF EXISTS public.idx_api_keys_active;
DROP INDEX IF EXISTS public.idx_analytics_config_status;
DROP INDEX IF EXISTS public.categories_name_key;
DROP INDEX IF EXISTS public."applications_userId_jobId_key";
DROP INDEX IF EXISTS auth.users_is_anonymous_idx;
DROP INDEX IF EXISTS auth.users_instance_id_idx;
DROP INDEX IF EXISTS auth.users_instance_id_email_idx;
DROP INDEX IF EXISTS auth.users_email_partial_key;
DROP INDEX IF EXISTS auth.user_id_created_at_idx;
DROP INDEX IF EXISTS auth.unique_phone_factor_per_user;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_domain_idx;
DROP INDEX IF EXISTS auth.sessions_user_id_idx;
DROP INDEX IF EXISTS auth.sessions_not_after_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS auth.saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_updated_at_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_parent_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_idx;
DROP INDEX IF EXISTS auth.recovery_token_idx;
DROP INDEX IF EXISTS auth.reauthentication_token_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_user_id_token_type_key;
DROP INDEX IF EXISTS auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_friendly_name_unique;
DROP INDEX IF EXISTS auth.mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS auth.idx_user_id_auth_method;
DROP INDEX IF EXISTS auth.idx_auth_code;
DROP INDEX IF EXISTS auth.identities_user_id_idx;
DROP INDEX IF EXISTS auth.identities_email_idx;
DROP INDEX IF EXISTS auth.flow_state_created_at_idx;
DROP INDEX IF EXISTS auth.factor_id_created_at_idx;
DROP INDEX IF EXISTS auth.email_change_token_new_idx;
DROP INDEX IF EXISTS auth.email_change_token_current_idx;
DROP INDEX IF EXISTS auth.confirmation_token_idx;
DROP INDEX IF EXISTS auth.audit_logs_instance_id_idx;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_pkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS objects_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_name_key;
ALTER TABLE IF EXISTS ONLY storage.buckets DROP CONSTRAINT IF EXISTS buckets_pkey;
ALTER TABLE IF EXISTS ONLY realtime.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY realtime.subscription DROP CONSTRAINT IF EXISTS pk_subscription;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.weekly_digests DROP CONSTRAINT IF EXISTS weekly_digests_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.user_resumes DROP CONSTRAINT IF EXISTS user_resumes_pkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS unique_user_role;
ALTER TABLE IF EXISTS ONLY public.hire_approval_requests DROP CONSTRAINT IF EXISTS unique_pending_hire_request;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_pkey;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS "settings_key_userId_key";
ALTER TABLE IF EXISTS ONLY public.saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_name_key;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_permission_id_key;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_resource_action_key;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.notification_logs DROP CONSTRAINT IF EXISTS notification_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.mfa_codes DROP CONSTRAINT IF EXISTS mfa_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.jobs DROP CONSTRAINT IF EXISTS jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.job_approval_requests DROP CONSTRAINT IF EXISTS job_approval_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.job_alert_subscriptions DROP CONSTRAINT IF EXISTS job_alert_subscriptions_pkey;
ALTER TABLE IF EXISTS ONLY public.interviews DROP CONSTRAINT IF EXISTS interviews_pkey;
ALTER TABLE IF EXISTS ONLY public.interview_tokens DROP CONSTRAINT IF EXISTS interview_tokens_reschedule_token_key;
ALTER TABLE IF EXISTS ONLY public.interview_tokens DROP CONSTRAINT IF EXISTS interview_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.interview_tokens DROP CONSTRAINT IF EXISTS interview_tokens_acceptance_token_key;
ALTER TABLE IF EXISTS ONLY public.interview_reschedule_requests DROP CONSTRAINT IF EXISTS interview_reschedule_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.api_keys DROP CONSTRAINT IF EXISTS idx_api_keys_user_id;
ALTER TABLE IF EXISTS ONLY public.api_keys DROP CONSTRAINT IF EXISTS idx_api_keys_key_hash;
ALTER TABLE IF EXISTS ONLY public.hire_approval_requests DROP CONSTRAINT IF EXISTS hire_approval_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.emails DROP CONSTRAINT IF EXISTS emails_pkey;
ALTER TABLE IF EXISTS ONLY public.email_templates DROP CONSTRAINT IF EXISTS email_templates_pkey;
ALTER TABLE IF EXISTS ONLY public.email_campaigns DROP CONSTRAINT IF EXISTS email_campaigns_pkey;
ALTER TABLE IF EXISTS ONLY public.email_automation_rules DROP CONSTRAINT IF EXISTS email_automation_rules_pkey;
ALTER TABLE IF EXISTS ONLY public.communication_settings DROP CONSTRAINT IF EXISTS communication_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.communication_settings DROP CONSTRAINT IF EXISTS communication_settings_key_key;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS applications_pkey;
ALTER TABLE IF EXISTS ONLY public.application_stage_history DROP CONSTRAINT IF EXISTS application_stage_history_pkey;
ALTER TABLE IF EXISTS ONLY public.application_notes DROP CONSTRAINT IF EXISTS application_notes_pkey;
ALTER TABLE IF EXISTS ONLY public.api_webhook_endpoints DROP CONSTRAINT IF EXISTS api_webhook_endpoints_pkey;
ALTER TABLE IF EXISTS ONLY public.api_usage_logs DROP CONSTRAINT IF EXISTS api_usage_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.api_keys DROP CONSTRAINT IF EXISTS api_keys_pkey;
ALTER TABLE IF EXISTS ONLY public.analytics_configurations DROP CONSTRAINT IF EXISTS analytics_configurations_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY auth.sso_providers DROP CONSTRAINT IF EXISTS sso_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_pkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_entity_id_key;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_last_challenged_at_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE IF EXISTS ONLY auth.instances DROP CONSTRAINT IF EXISTS instances_pkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_provider_id_provider_unique;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_pkey;
ALTER TABLE IF EXISTS ONLY auth.flow_state DROP CONSTRAINT IF EXISTS flow_state_pkey;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS public.mfa_codes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.analytics_configurations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS storage.s3_multipart_uploads_parts;
DROP TABLE IF EXISTS storage.s3_multipart_uploads;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.migrations;
DROP TABLE IF EXISTS storage.buckets;
DROP TABLE IF EXISTS realtime.subscription;
DROP TABLE IF EXISTS realtime.schema_migrations;
DROP TABLE IF EXISTS realtime.messages;
DROP TABLE IF EXISTS public.weekly_digests;
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.user_resumes;
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.saved_jobs;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.permissions;
DROP TABLE IF EXISTS public.notification_logs;
DROP SEQUENCE IF EXISTS public.mfa_codes_id_seq;
DROP TABLE IF EXISTS public.mfa_codes;
DROP TABLE IF EXISTS public.job_approval_requests;
DROP TABLE IF EXISTS public.job_alert_subscriptions;
DROP TABLE IF EXISTS public.interviews;
DROP TABLE IF EXISTS public.interview_tokens;
DROP TABLE IF EXISTS public.interview_reschedule_requests;
DROP VIEW IF EXISTS public.hire_approval_summary;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.jobs;
DROP TABLE IF EXISTS public.hire_approval_requests;
DROP TABLE IF EXISTS public.emails;
DROP TABLE IF EXISTS public.email_templates;
DROP TABLE IF EXISTS public.email_campaigns;
DROP TABLE IF EXISTS public.email_automation_rules;
DROP TABLE IF EXISTS public.communication_settings;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.applications;
DROP TABLE IF EXISTS public.application_stage_history;
DROP TABLE IF EXISTS public.application_notes;
DROP TABLE IF EXISTS public.api_webhook_endpoints;
DROP TABLE IF EXISTS public.api_usage_logs;
DROP TABLE IF EXISTS public.api_keys;
DROP SEQUENCE IF EXISTS public.analytics_configurations_id_seq;
DROP TABLE IF EXISTS public.analytics_configurations;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.sso_providers;
DROP TABLE IF EXISTS auth.sso_domains;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.schema_migrations;
DROP TABLE IF EXISTS auth.saml_relay_states;
DROP TABLE IF EXISTS auth.saml_providers;
DROP SEQUENCE IF EXISTS auth.refresh_tokens_id_seq;
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.one_time_tokens;
DROP TABLE IF EXISTS auth.mfa_factors;
DROP TABLE IF EXISTS auth.mfa_challenges;
DROP TABLE IF EXISTS auth.mfa_amr_claims;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.identities;
DROP TABLE IF EXISTS auth.flow_state;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP FUNCTION IF EXISTS storage.update_updated_at_column();
DROP FUNCTION IF EXISTS storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.operation();
DROP FUNCTION IF EXISTS storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text);
DROP FUNCTION IF EXISTS storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION IF EXISTS storage.get_size_by_bucket();
DROP FUNCTION IF EXISTS storage.foldername(name text);
DROP FUNCTION IF EXISTS storage.filename(name text);
DROP FUNCTION IF EXISTS storage.extension(name text);
DROP FUNCTION IF EXISTS storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION IF EXISTS realtime.topic();
DROP FUNCTION IF EXISTS realtime.to_regrole(role_name text);
DROP FUNCTION IF EXISTS realtime.subscription_check_filters();
DROP FUNCTION IF EXISTS realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.quote_wal2json(entity regclass);
DROP FUNCTION IF EXISTS realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION IF EXISTS realtime."cast"(val text, type_ regtype);
DROP FUNCTION IF EXISTS realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION IF EXISTS realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION IF EXISTS realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_stage_history();
DROP FUNCTION IF EXISTS public.update_hire_approval_updated_at();
DROP FUNCTION IF EXISTS public.get_current_stage_duration(app_id uuid);
DROP FUNCTION IF EXISTS public.get_application_timeline(app_id uuid);
DROP FUNCTION IF EXISTS public.calculate_time_in_stage(entered_at_param timestamp without time zone, exited_at_param timestamp without time zone);
DROP FUNCTION IF EXISTS pgbouncer.get_auth(p_usename text);
DROP FUNCTION IF EXISTS extensions.set_graphql_placeholder();
DROP FUNCTION IF EXISTS extensions.pgrst_drop_watch();
DROP FUNCTION IF EXISTS extensions.pgrst_ddl_watch();
DROP FUNCTION IF EXISTS extensions.grant_pg_net_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_graphql_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_cron_access();
DROP FUNCTION IF EXISTS auth.uid();
DROP FUNCTION IF EXISTS auth.role();
DROP FUNCTION IF EXISTS auth.jwt();
DROP FUNCTION IF EXISTS auth.email();
DROP TYPE IF EXISTS realtime.wal_rls;
DROP TYPE IF EXISTS realtime.wal_column;
DROP TYPE IF EXISTS realtime.user_defined_filter;
DROP TYPE IF EXISTS realtime.equality_op;
DROP TYPE IF EXISTS realtime.action;
DROP TYPE IF EXISTS auth.one_time_token_type;
DROP TYPE IF EXISTS auth.factor_type;
DROP TYPE IF EXISTS auth.factor_status;
DROP TYPE IF EXISTS auth.code_challenge_method;
DROP TYPE IF EXISTS auth.aal_level;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS pgcrypto;
DROP SCHEMA IF EXISTS vault;
DROP SCHEMA IF EXISTS storage;
DROP SCHEMA IF EXISTS realtime;
-- *not* dropping schema, since initdb creates it
DROP SCHEMA IF EXISTS pgbouncer;
DROP SCHEMA IF EXISTS graphql_public;
DROP SCHEMA IF EXISTS graphql;
DROP SCHEMA IF EXISTS extensions;
DROP SCHEMA IF EXISTS auth;
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- Name: calculate_time_in_stage(timestamp without time zone, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_time_in_stage(entered_at_param timestamp without time zone, exited_at_param timestamp without time zone DEFAULT NULL::timestamp without time zone) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF exited_at_param IS NULL THEN
        -- Still in this stage, calculate time from entered_at to now
        RETURN EXTRACT(EPOCH FROM (NOW() - entered_at_param))::INTEGER;
    ELSE
        -- Exited this stage, calculate time from entered_at to exited_at
        RETURN EXTRACT(EPOCH FROM (exited_at_param - entered_at_param))::INTEGER;
    END IF;
END;
$$;


--
-- Name: get_application_timeline(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_application_timeline(app_id uuid) RETURNS TABLE(stage character varying, entered_at timestamp without time zone, exited_at timestamp without time zone, time_in_stage_seconds integer, duration_formatted text, changed_by_name character varying, is_current boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.stage,
        h.entered_at,
        h.exited_at,
        COALESCE(h.time_in_stage_seconds, calculate_time_in_stage(h.entered_at, h.exited_at)) as time_in_stage_seconds,
        CASE 
            WHEN COALESCE(h.time_in_stage_seconds, calculate_time_in_stage(h.entered_at, h.exited_at)) < 3600 THEN 
                (COALESCE(h.time_in_stage_seconds, calculate_time_in_stage(h.entered_at, h.exited_at)) / 60)::TEXT || ' min'
            WHEN COALESCE(h.time_in_stage_seconds, calculate_time_in_stage(h.entered_at, h.exited_at)) < 86400 THEN 
                (COALESCE(h.time_in_stage_seconds, calculate_time_in_stage(h.entered_at, h.exited_at)) / 3600)::TEXT || ' hrs'
            ELSE 
                (COALESCE(h.time_in_stage_seconds, calculate_time_in_stage(h.entered_at, h.exited_at)) / 86400)::TEXT || ' days'
        END as duration_formatted,
        h.changed_by_name,
        (h.exited_at IS NULL) as is_current
    FROM application_stage_history h
    WHERE h.application_id = app_id
    ORDER BY h.entered_at ASC;
END;
$$;


--
-- Name: get_current_stage_duration(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_current_stage_duration(app_id uuid) RETURNS TABLE(stage character varying, entered_at timestamp without time zone, duration_seconds integer, duration_formatted text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.stage,
        h.entered_at,
        calculate_time_in_stage(h.entered_at) as duration_seconds,
        CASE 
            WHEN calculate_time_in_stage(h.entered_at) < 3600 THEN 
                (calculate_time_in_stage(h.entered_at) / 60)::TEXT || ' min'
            WHEN calculate_time_in_stage(h.entered_at) < 86400 THEN 
                (calculate_time_in_stage(h.entered_at) / 3600)::TEXT || ' hrs'
            ELSE 
                (calculate_time_in_stage(h.entered_at) / 86400)::TEXT || ' days'
        END as duration_formatted
    FROM application_stage_history h
    WHERE h.application_id = app_id
    AND h.exited_at IS NULL
    ORDER BY h.entered_at DESC
    LIMIT 1;
END;
$$;


--
-- Name: update_hire_approval_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_hire_approval_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: update_stage_history(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_stage_history() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    track_time_enabled BOOLEAN;
    previous_stage_record RECORD;
BEGIN
    -- Check if time tracking is enabled
    SELECT CASE WHEN value = 'true' THEN true ELSE false END INTO track_time_enabled
    FROM settings WHERE key = 'track_time_in_stage';
    
    -- Only proceed if tracking is enabled and status actually changed
    IF NOT track_time_enabled OR (OLD.status = NEW.status) THEN
        RETURN NEW;
    END IF;
    
    -- Close out the previous stage if it exists
    UPDATE application_stage_history 
    SET 
        exited_at = NOW(),
        time_in_stage_seconds = calculate_time_in_stage(entered_at, NOW()),
        updated_at = NOW()
    WHERE application_id = NEW.id 
    AND stage = OLD.status 
    AND exited_at IS NULL;
    
    -- Create new stage history record
    INSERT INTO application_stage_history (
        application_id,
        stage,
        previous_stage,
        entered_at,
        changed_by_user_id,
        changed_by_name,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.status,
        OLD.status,
        NOW(),
        -- These will need to be set by the application layer
        NULL, -- changed_by_user_id (set by app)
        NULL, -- changed_by_name (set by app)
        NOW(),
        NOW()
    );
    
    -- Update current stage info on applications table
    UPDATE applications 
    SET 
        current_stage_entered_at = NOW(),
        time_in_current_stage_seconds = 0,
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: analytics_configurations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_configurations (
    id integer NOT NULL,
    property_id character varying(255) NOT NULL,
    measurement_id character varying(255) NOT NULL,
    service_account_email character varying(255) NOT NULL,
    service_account_private_key text NOT NULL,
    connection_status character varying(50) DEFAULT 'pending'::character varying,
    last_test_at timestamp without time zone,
    test_error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: analytics_configurations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analytics_configurations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analytics_configurations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analytics_configurations_id_seq OWNED BY public.analytics_configurations.id;


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_keys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid,
    user_id uuid,
    name character varying(255) NOT NULL,
    key_hash character varying(255) NOT NULL,
    key_prefix character varying(20) NOT NULL,
    permissions jsonb DEFAULT '[]'::jsonb NOT NULL,
    rate_limit integer DEFAULT 1000 NOT NULL,
    requests_this_month integer DEFAULT 0 NOT NULL,
    total_requests integer DEFAULT 0 NOT NULL,
    last_used_at timestamp(6) without time zone,
    is_active boolean DEFAULT true NOT NULL,
    expires_at timestamp(6) without time zone,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE api_keys; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.api_keys IS 'Stores API keys for external integrations';


--
-- Name: COLUMN api_keys.key_hash; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.api_keys.key_hash IS 'SHA-256 hash of the actual API key for security';


--
-- Name: COLUMN api_keys.key_prefix; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.api_keys.key_prefix IS 'First few characters for UI display (e.g., sk_live_abc...)';


--
-- Name: COLUMN api_keys.permissions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.api_keys.permissions IS 'JSON array of permissions like ["jobs:read", "applications:write"]';


--
-- Name: COLUMN api_keys.rate_limit; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.api_keys.rate_limit IS 'Maximum requests per hour';


--
-- Name: api_usage_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_usage_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    api_key_id uuid,
    endpoint character varying(255) NOT NULL,
    method character varying(10) NOT NULL,
    status_code integer NOT NULL,
    response_time_ms integer,
    user_agent text,
    ip_address character varying(45),
    request_size integer,
    response_size integer,
    error_message text,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE api_usage_logs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.api_usage_logs IS 'Logs all API requests for monitoring and billing';


--
-- Name: api_webhook_endpoints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_webhook_endpoints (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    api_key_id uuid,
    url character varying(500) NOT NULL,
    events jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    secret character varying(255),
    last_delivery_at timestamp(6) without time zone,
    last_delivery_status character varying(20),
    failure_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE api_webhook_endpoints; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.api_webhook_endpoints IS 'Webhook URLs for real-time event notifications';


--
-- Name: application_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.application_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    content text NOT NULL,
    type character varying(50) DEFAULT 'note'::character varying NOT NULL,
    author_id uuid,
    author_name character varying(255),
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    metadata jsonb,
    is_system_generated boolean DEFAULT false
);


--
-- Name: application_stage_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.application_stage_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    stage character varying(50) NOT NULL,
    previous_stage character varying(50),
    entered_at timestamp without time zone DEFAULT now() NOT NULL,
    exited_at timestamp without time zone,
    time_in_stage_seconds integer,
    changed_by_user_id uuid,
    changed_by_name character varying(255),
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    status text DEFAULT 'Applied'::text NOT NULL,
    "coverLetter" text,
    "resumeUrl" text,
    notes text,
    "appliedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" uuid,
    "jobId" uuid NOT NULL,
    name text,
    email text,
    phone text,
    is_archived boolean DEFAULT false,
    archived_at timestamp(6) without time zone,
    archived_by uuid,
    archive_reason character varying(100),
    current_stage_entered_at timestamp without time zone,
    time_in_current_stage_seconds integer DEFAULT 0,
    total_application_time_seconds integer DEFAULT 0
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_type character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    subcategory character varying(50),
    entity_type character varying(50),
    entity_id uuid,
    entity_name character varying(255),
    actor_id uuid,
    actor_type character varying(20) DEFAULT 'user'::character varying NOT NULL,
    actor_name character varying(255),
    action character varying(255) NOT NULL,
    description text,
    old_values jsonb,
    new_values jsonb,
    changes jsonb,
    ip_address character varying(45),
    user_agent character varying(500),
    session_id character varying(255),
    request_id character varying(255),
    related_user_id uuid,
    related_job_id uuid,
    related_application_id uuid,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    severity character varying(20) DEFAULT 'info'::character varying NOT NULL,
    status character varying(20) DEFAULT 'success'::character varying NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    metadata jsonb
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text
);


--
-- Name: communication_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communication_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(255) NOT NULL,
    value text NOT NULL,
    category character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: email_automation_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_automation_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    trigger character varying(100) NOT NULL,
    conditions text NOT NULL,
    template_id uuid NOT NULL,
    is_active boolean DEFAULT true,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    recipient_type character varying(50) DEFAULT 'applicant'::character varying
);


--
-- Name: email_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    job_id uuid,
    status character varying(50),
    filters text,
    total_recipients integer DEFAULT 0,
    successful_sends integer DEFAULT 0,
    failed_sends integer DEFAULT 0,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    sent_at timestamp without time zone
);


--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    type character varying(100) NOT NULL,
    is_default boolean DEFAULT false,
    is_active boolean DEFAULT true,
    variables text,
    description text,
    created_by uuid,
    created_at timestamp(6) without time zone DEFAULT now(),
    updated_at timestamp(6) without time zone DEFAULT now(),
    category character varying(50),
    tags text[],
    usage_count integer DEFAULT 0,
    last_used_at timestamp without time zone
);


--
-- Name: emails; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.emails (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    html_content text,
    recipient_email character varying(255) NOT NULL,
    recipient_name character varying(255),
    application_id uuid,
    job_id uuid,
    template_id uuid,
    email_provider character varying(100),
    message_id character varying(255),
    status character varying(50) DEFAULT 'pending'::character varying,
    failure_reason text,
    opened_at timestamp without time zone,
    clicked_at timestamp without time zone,
    replied_at timestamp without time zone,
    sent_by uuid NOT NULL,
    sent_at timestamp without time zone DEFAULT now(),
    campaign_id uuid
);


--
-- Name: hire_approval_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hire_approval_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    requested_by uuid NOT NULL,
    requested_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    reviewed_by uuid,
    reviewed_at timestamp(6) without time zone,
    previous_status character varying(50) NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_hire_approval_status CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('approved'::character varying)::text, ('rejected'::character varying)::text])))
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    summary text,
    department text NOT NULL,
    "employmentType" text NOT NULL,
    "experienceLevel" text NOT NULL,
    location text NOT NULL,
    "remotePolicy" text NOT NULL,
    "salaryMin" integer,
    "salaryMax" integer,
    "salaryCurrency" text DEFAULT 'USD'::text NOT NULL,
    "salaryType" text DEFAULT 'Annual'::text NOT NULL,
    benefits text,
    requirements text NOT NULL,
    "preferredQualifications" text,
    "educationRequired" text,
    "yearsExperienceRequired" integer,
    "applicationDeadline" timestamp(3) without time zone,
    "startDate" timestamp(3) without time zone,
    "applicationInstructions" text,
    status text DEFAULT 'Draft'::text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "postedAt" timestamp(3) without time zone,
    "categoryId" uuid NOT NULL,
    "createdBy" uuid,
    "autoExpiresAt" timestamp(3) without time zone,
    "lastExpiredCheck" timestamp(3) without time zone,
    "showSalary" boolean DEFAULT true NOT NULL,
    auto_expires_at timestamp without time zone,
    last_expired_check timestamp without time zone,
    "applicationCount" integer DEFAULT 0
);


--
-- Name: COLUMN jobs."autoExpiresAt"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.jobs."autoExpiresAt" IS 'When the job should automatically expire and be set to Closed status';


--
-- Name: COLUMN jobs."lastExpiredCheck"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.jobs."lastExpiredCheck" IS 'Last time the expiration check was run (for tracking purposes)';


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password text,
    "firstName" text,
    "lastName" text,
    phone text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role character varying DEFAULT 'user'::character varying,
    "privilegeLevel" integer DEFAULT 0,
    "isActive" boolean DEFAULT true,
    is_active boolean DEFAULT true,
    google_access_token text,
    google_refresh_token text,
    google_token_expires_at timestamp without time zone,
    google_calendar_id character varying(255) DEFAULT 'primary'::character varying,
    google_email character varying(255),
    calendar_integration_enabled boolean DEFAULT false,
    calendar_integration_connected_at timestamp without time zone,
    calendar_timezone character varying(100) DEFAULT 'America/Toronto'::character varying,
    zoom_access_token character varying(2000),
    zoom_refresh_token character varying(2000),
    zoom_token_expires_at timestamp without time zone,
    zoom_user_id character varying(255),
    zoom_email character varying(255),
    zoom_integration_enabled boolean DEFAULT false,
    zoom_integration_connected_at timestamp without time zone,
    microsoft_access_token text,
    microsoft_refresh_token text,
    microsoft_token_expires_at timestamp(6) without time zone,
    microsoft_user_id character varying(255),
    microsoft_email character varying(255),
    microsoft_tenant_id character varying(255),
    microsoft_integration_enabled boolean DEFAULT false,
    microsoft_integration_connected_at timestamp(6) without time zone,
    email_notifications_enabled boolean DEFAULT true,
    weekly_digest_enabled boolean DEFAULT false,
    instant_job_alerts_enabled boolean DEFAULT false,
    notification_email character varying(255),
    max_daily_notifications integer DEFAULT 5,
    notification_batch_minutes integer DEFAULT 30,
    last_notification_sent_at timestamp(6) without time zone,
    account_type character varying(20) DEFAULT 'local'::character varying,
    ldap_dn character varying(500),
    ldap_groups text[],
    ldap_synced_at timestamp with time zone,
    mfa_enabled boolean DEFAULT false,
    mfa_secret text,
    mfa_backup_codes text[],
    mfa_phone_number character varying(20),
    mfa_method character varying(20) DEFAULT 'disabled'::character varying,
    mfa_setup_at timestamp with time zone,
    mfa_last_used timestamp with time zone,
    mfa_methods_enabled text[] DEFAULT '{}'::text[],
    mfa_totp_secret text,
    mfa_email_enabled boolean DEFAULT false,
    CONSTRAINT chk_account_type CHECK (((account_type)::text = ANY (ARRAY[('local'::character varying)::text, ('ldap'::character varying)::text, ('saml'::character varying)::text, ('combined'::character varying)::text])))
);


--
-- Name: COLUMN users.account_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.account_type IS 'Type of user account: local (created in app) or ldap (synced from LDAP)';


--
-- Name: COLUMN users.ldap_dn; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.ldap_dn IS 'LDAP Distinguished Name for LDAP users';


--
-- Name: COLUMN users.ldap_groups; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.ldap_groups IS 'Array of LDAP group names user belongs to';


--
-- Name: COLUMN users.ldap_synced_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.ldap_synced_at IS 'Last time LDAP data was synchronized';


--
-- Name: hire_approval_summary; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.hire_approval_summary AS
 SELECT har.id,
    har.application_id,
    har.status,
    har.requested_at,
    har.reviewed_at,
    har.previous_status,
    a.name AS applicant_name,
    a.email AS applicant_email,
    j.title AS job_title,
    j.department AS job_department,
    u_req.email AS requested_by_email,
    ((u_req."firstName" || ' '::text) || u_req."lastName") AS requested_by_name,
    u_rev.email AS reviewed_by_email,
    ((u_rev."firstName" || ' '::text) || u_rev."lastName") AS reviewed_by_name
   FROM ((((public.hire_approval_requests har
     LEFT JOIN public.applications a ON ((har.application_id = a.id)))
     LEFT JOIN public.jobs j ON ((a."jobId" = j.id)))
     LEFT JOIN public.users u_req ON ((har.requested_by = u_req.id)))
     LEFT JOIN public.users u_rev ON ((har.reviewed_by = u_rev.id)));


--
-- Name: interview_reschedule_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interview_reschedule_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    interview_token_id uuid NOT NULL,
    application_id uuid NOT NULL,
    response_type character varying(50) NOT NULL,
    alternative_times json,
    written_response text,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    submitted_at timestamp(6) without time zone NOT NULL,
    reviewed_at timestamp(6) without time zone,
    reviewed_by uuid,
    review_notes text,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT now() NOT NULL
);


--
-- Name: interview_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interview_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    reschedule_token character varying(255) NOT NULL,
    acceptance_token character varying(255) NOT NULL,
    scheduled_at timestamp(6) without time zone NOT NULL,
    duration integer DEFAULT 45 NOT NULL,
    type character varying(50) NOT NULL,
    interviewers json,
    location text,
    agenda text,
    notes text,
    calendar_event_id character varying(255),
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    responded_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    meeting_link character varying(500),
    meeting_provider character varying(50) DEFAULT 'google'::character varying,
    is_completed boolean DEFAULT false,
    completed_at timestamp(6) without time zone,
    interview_notes text,
    interview_rating integer,
    last_reminder_sent_at timestamp(6) without time zone
);


--
-- Name: interviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    interviewer_id uuid NOT NULL,
    job_id uuid NOT NULL,
    type character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'scheduled'::character varying NOT NULL,
    duration_minutes integer DEFAULT 45 NOT NULL,
    proposed_time_slots jsonb,
    scheduled_at timestamp without time zone,
    confirmed_at timestamp without time zone,
    timezone character varying(100) DEFAULT 'America/Toronto'::character varying NOT NULL,
    meeting_link text,
    meeting_location text,
    agenda text,
    notes text,
    additional_interviewers jsonb,
    google_calendar_event_id character varying(255),
    calendar_event_created boolean DEFAULT false,
    invitation_sent_at timestamp without time zone,
    reminder_sent_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by uuid,
    CONSTRAINT interviews_status_check CHECK (((status)::text = ANY (ARRAY[('scheduled'::character varying)::text, ('confirmed'::character varying)::text, ('completed'::character varying)::text, ('cancelled'::character varying)::text, ('rescheduled'::character varying)::text]))),
    CONSTRAINT interviews_type_check CHECK (((type)::text = ANY (ARRAY[('phone'::character varying)::text, ('video'::character varying)::text, ('in-person'::character varying)::text])))
);


--
-- Name: job_alert_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_alert_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    alert_type character varying(20) DEFAULT 'weekly_digest'::character varying NOT NULL,
    department character varying(255),
    keywords text,
    is_active boolean DEFAULT true,
    frequency character varying(20) DEFAULT 'immediate'::character varying,
    created_at timestamp(6) without time zone DEFAULT now(),
    updated_at timestamp(6) without time zone DEFAULT now()
);


--
-- Name: job_approval_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_approval_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    job_id uuid NOT NULL,
    requested_by uuid NOT NULL,
    requested_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying,
    reviewed_by uuid,
    reviewed_at timestamp(6) without time zone,
    rejection_reason text,
    notes text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: mfa_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mfa_codes (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    code character varying(10) NOT NULL,
    method character varying(20) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text,
    is_active boolean DEFAULT true
);


--
-- Name: mfa_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mfa_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mfa_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mfa_codes_id_seq OWNED BY public.mfa_codes.id;


--
-- Name: notification_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    job_id uuid NOT NULL,
    subscription_id uuid NOT NULL,
    notification_type character varying(50) NOT NULL,
    email_address character varying(255) NOT NULL,
    sent_at timestamp(6) without time zone DEFAULT now(),
    batch_id uuid
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resource character varying(50) NOT NULL,
    action character varying(50) NOT NULL,
    description text NOT NULL,
    category character varying(50) NOT NULL,
    is_system_permission boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    granted_at timestamp with time zone DEFAULT now(),
    granted_by uuid
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    color character varying(7) DEFAULT '#6b7280'::character varying,
    is_system_role boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    is_ldap_role boolean DEFAULT false,
    ldap_group_name character varying(200),
    is_editable boolean DEFAULT true
);


--
-- Name: COLUMN roles.is_ldap_role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.is_ldap_role IS 'Role automatically created from LDAP group';


--
-- Name: COLUMN roles.ldap_group_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.ldap_group_name IS 'Original LDAP group name this role represents';


--
-- Name: COLUMN roles.is_editable; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.is_editable IS 'Whether role name can be edited (false for LDAP roles)';


--
-- Name: saved_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "savedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" uuid NOT NULL,
    "jobId" uuid NOT NULL
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    category text NOT NULL,
    "userId" uuid,
    "privilegeLevel" integer DEFAULT 0 NOT NULL,
    "dataType" text DEFAULT 'string'::text NOT NULL,
    description text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_resumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_resumes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    file_name character varying(255) NOT NULL,
    file_size integer NOT NULL,
    file_type character varying(50) NOT NULL,
    storage_path character varying(500) NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    uploaded_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    assigned_at timestamp with time zone DEFAULT now(),
    assigned_by uuid,
    is_active boolean DEFAULT true
);


--
-- Name: weekly_digests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.weekly_digests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    week_start timestamp(6) without time zone NOT NULL,
    week_end timestamp(6) without time zone NOT NULL,
    digest_type character varying(20) DEFAULT 'scheduled'::character varying NOT NULL,
    recipient_count integer NOT NULL,
    successful_sends integer NOT NULL,
    failed_sends integer NOT NULL,
    sent_at timestamp(6) without time zone NOT NULL,
    sent_by uuid NOT NULL,
    theme character varying(50),
    sections_included json,
    configuration json,
    date_range character varying(100),
    status character varying(20) DEFAULT 'completed'::character varying NOT NULL,
    error_message text,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT now() NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: analytics_configurations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_configurations ALTER COLUMN id SET DEFAULT nextval('public.analytics_configurations_id_seq'::regclass);


--
-- Name: mfa_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mfa_codes ALTER COLUMN id SET DEFAULT nextval('public.mfa_codes_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.


--
-- Data for Name: analytics_configurations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics_configurations (id, property_id, measurement_id, service_account_email, service_account_private_key, connection_status, last_test_at, test_error_message, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.api_keys (id, company_id, user_id, name, key_hash, key_prefix, permissions, rate_limit, requests_this_month, total_requests, last_used_at, is_active, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: api_usage_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.api_usage_logs (id, api_key_id, endpoint, method, status_code, response_time_ms, user_agent, ip_address, request_size, response_size, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: api_webhook_endpoints; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.api_webhook_endpoints (id, api_key_id, url, events, is_active, secret, last_delivery_at, last_delivery_status, failure_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: application_notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.application_notes (id, application_id, content, type, author_id, author_name, created_at, updated_at, metadata, is_system_generated) FROM stdin;
\.


--
-- Data for Name: application_stage_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.application_stage_history (id, application_id, stage, previous_stage, entered_at, exited_at, time_in_stage_seconds, changed_by_user_id, changed_by_name, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.applications (id, status, "coverLetter", "resumeUrl", notes, "appliedAt", "updatedAt", "userId", "jobId", name, email, phone, is_archived, archived_at, archived_by, archive_reason, current_stage_entered_at, time_in_current_stage_seconds, total_application_time_seconds) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, event_type, category, subcategory, entity_type, entity_id, entity_name, actor_id, actor_type, actor_name, action, description, old_values, new_values, changes, ip_address, user_agent, session_id, request_id, related_user_id, related_job_id, related_application_id, created_at, severity, status, tags, metadata) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, description) FROM stdin;
\.


--
-- Data for Name: communication_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.communication_settings (id, key, value, category, description, created_at, updated_at) FROM stdin;
35a85c83-66c9-4b29-b322-5cd224a2f0f4	default_from_name	Hiring Team	email	Default sender name for emails	2025-07-13 04:33:42.19472	2025-07-13 04:33:42.19472
e2622a18-3cb1-4516-8682-f770133e7059	default_from_email	hiring@yourcompany.com	email	Default sender email address	2025-07-13 04:33:42.19472	2025-07-13 04:33:42.19472
3ff71fa4-3f17-45ce-9b64-fb37b4a49470	email_signature	Best regards,\\nThe Hiring Team	email	Default email signature	2025-07-13 04:33:42.19472	2025-07-13 04:33:42.19472
bee0e397-5cde-46bd-8da1-b466c93fd69b	auto_send_confirmation	true	automation	Automatically send confirmation emails	2025-07-13 04:33:42.19472	2025-07-13 04:33:42.19472
6a068168-ad00-40ee-941e-86bf92101362	max_bulk_recipients	50	email	Maximum recipients per bulk email	2025-07-13 04:33:42.19472	2025-07-13 04:33:42.19472
\.


--
-- Data for Name: email_automation_rules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_automation_rules (id, name, trigger, conditions, template_id, is_active, created_by, created_at, updated_at, recipient_type) FROM stdin;
\.


--
-- Data for Name: email_campaigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_campaigns (id, name, subject, content, job_id, status, filters, total_recipients, successful_sends, failed_sends, created_by, created_at, sent_at) FROM stdin;
\.


--
-- Data for Name: email_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_templates (id, name, subject, content, type, is_default, is_active, variables, description, created_by, created_at, updated_at, category, tags, usage_count, last_used_at) FROM stdin;
4ae53f9d-ce21-4dc6-8129-d88f59dcd6da	Request Additional Information	Additional Information Needed - {{jobTitle}} Application	Dear {{candidateName}},\n\n  Thank you for your application for the {{jobTitle}} position. We are interested in learning more about your\n  background.\n\n  Could you please provide the following additional information:\n  • {{requestedInfo}}\n\n  Please reply to this email with the requested information at your earliest convenience.\n\n  Best regards,\n  {{senderName}}\n  {{companyName}} Hiring Team	application_received	t	t	\N	Request additional information from candidate	\N	2025-07-19 08:23:59.656404	2025-07-21 04:19:30.724	application	\N	0	\N
e1151e7a-28c0-4f5a-91bc-4edc86307680	Application Received Confirmation	Application Received - {{jobTitle}} Position	Dear {{candidateName}},\n\n  Thank you for applying for the {{jobTitle}} position at {{companyName}}. We have received your application and \n  our team will review it carefully.\n\n  We will be in touch within {{reviewTimeframe}} to let you know about next steps.\n\n  If you have any questions, please don't hesitate to reach out.\n\n  Best regards,\n  {{senderName}}\n  {{companyName}} Hiring Team	application_received	f	t	\N	Confirmation email sent when application is received	\N	2025-07-19 08:23:59.656404	2025-07-21 04:16:29.861	application	\N	0	\N
b7213be4-6041-4fce-a0b2-dcde966cb6f3	Application Not Selected	Application Update - {{jobTitle}} Position	Dear {{candidateName}},\n\n  Thank you for your interest in the {{jobTitle}} position at {{companyName}} and for taking the time to apply.\n\n  After careful consideration, we have decided to move forward with other candidates whose experience more closely      \n  matches our current needs.\n\n  We were impressed with your qualifications and encourage you to apply for future positions that match your skills     \n   and experience. We will keep your information on file and may reach out if suitable opportunities arise.\n\n  Thank you again for your interest in {{companyName}}.\n\n  Best regards,\n  {{senderName}}\n  {{companyName}} Hiring Team	rejection_general	t	t	\N	Polite rejection email	\N	2025-07-19 08:23:59.656404	2025-07-21 04:27:33.404	rejection	\N	2	2025-07-20 19:53:13.999
2530dd70-7e96-48ac-b58e-5880449b350d	Interview Invitation	Interview Invitation - {{jobTitle}} Position	Dear {{candidateName}},\n\n  Congratulations! We were impressed with your application for the {{jobTitle}} position and would like to invite       \n  you for an interview.\n\n  Interview Details:\n  • Position: {{jobTitle}}\n  • Department: {{department}}\n  • Date: {{interviewDate}}\n  • Time: {{interviewTime}}\n  • Duration: {{duration}}\n  • Format: {{interviewFormat}}\n  • Location/Link: {{interviewLocation}}\n\n  Please confirm your availability by replying to this email. If you need to reschedule, please let us know as soon     \n   as possible.\n\n  We look forward to speaking with you!\n\n  Best regards,\n  {{senderName}}\n  {{companyName}} Hiring Team	interview_invitation	f	t	\N	Invitation to interview	\N	2025-07-19 08:23:59.656404	2025-07-21 04:14:55.787	interview	\N	0	\N
9443af95-cd51-4a25-af9a-3d445b66d34e	Application Under Review	Application Update - {{jobTitle}} Position	Dear {{candidateName}},\n\n  We wanted to update you on your application for the {{jobTitle}} position at {{companyName}}.\n\n  Your application is currently under review by our hiring team. We are carefully evaluating all candidates and\n  will be in touch with next steps within {{timeframe}}.\n\n  Thank you for your patience during this process.\n\n  Best regards,\n  {{senderName}}\n  {{companyName}} Hiring Team	application_under_review	f	t	\N	Update email during review process	\N	2025-07-19 08:23:59.656404	2025-07-21 03:29:52.689	general	\N	0	\N
c66efc99-c945-418e-81e0-cbab1bb5d186	Post-Interview Rejection	Interview Follow-up - {{jobTitle}} Position	Dear {{candidateName}},\n\n  Thank you for taking the time to interview for the {{jobTitle}} position at {{companyName}}. We enjoyed our\n  conversation and learning more about your background.\n\n  After careful consideration of all candidates, we have decided to move forward with another candidate whose\n  experience more closely aligns with our specific requirements.\n\n  We appreciate the time and effort you put into the interview process. Your skills and experience are impressive,      \n  and we encourage you to apply for future opportunities that may be a better fit.\n\n  Thank you again for your interest in {{companyName}}.\n\n  Best regards,\n  {{senderName}}\n  {{companyName}} Hiring Team	rejection_general	f	t	["candidateName", "jobTitle", "companyName", "senderName"]	Rejection email after interview	\N	2025-07-19 08:23:59.656404	2025-07-19 08:23:59.656404	rejection	\N	0	\N
a726ad42-e046-4c06-9908-a3789b6d4a31	Interview Confirmation	Interview Confirmed - {{jobTitle}} Position	Dear {{candidateName}},\n\n  This email confirms your upcoming interview for the {{jobTitle}} position.\n\n  Interview Details:\n  • Date: {{interviewDate}}\n  • Time: {{interviewTime}}\n  • Duration: {{duration}}\n  • Format: {{interviewFormat}}\n  • {{interviewDetails}}\n\n  What to expect:\n  • {{interviewExpectations}}\n\n  If you have any questions or need to make changes, please contact us immediately.\n\n  Best regards,\n  {{senderName}}\n  {{companyName}} Hiring Team	interview_invitation	t	t	\N	Interview confirmation email	\N	2025-07-19 08:23:59.656404	2025-07-21 04:16:16.665	interview	\N	0	\N
13e73e26-4865-4d95-a0f6-d1f91bb1bf0b	Application Withdrawn	Application Withdrawal Confirmation - {{jobTitle}}	Dear {{candidateName}},\n\nWe have received your request to withdraw your application for the {{jobTitle}} position at {{companyName}}.\n\nYour application has been removed from our system as requested. We appreciate your interest in our company and encourage you to apply for future opportunities that align with your career goals.\n\nThank you for considering {{companyName}} as a potential employer.\n\nBest regards,\n{{senderName}}\n{{companyName}} Recruitment Team	application_received	f	f	["candidateName","jobTitle","companyName","senderName"]	Confirmation when candidate withdraws application	\N	2025-07-20 04:55:05.49	2025-07-20 04:55:05.49	application	\N	0	\N
91ad7a98-5481-4985-bc3a-aaa95b6884ea	Interview Reschedule Request	Interview Rescheduling - {{jobTitle}} Position	Dear {{candidateName}},\n\nWe need to reschedule your upcoming interview for the {{jobTitle}} position originally scheduled for {{originalDate}} at {{originalTime}}.\n\nWe apologize for any inconvenience this may cause. Please let us know your availability for the following times:\n• {{option1}}\n• {{option2}}\n• {{option3}}\n\nPlease reply with your preferred option, or suggest alternative times that work better for you.\n\nThank you for your understanding.\n\nBest regards,\n{{senderName}}\n{{companyName}} Hiring Team	interview_reminder	f	t	["candidateName","jobTitle","originalDate","originalTime","option1","option2","option3","senderName","companyName"]	Request to reschedule interview	\N	2025-07-20 04:55:05.49	2025-07-20 04:55:05.49	interview	\N	0	\N
01c86406-aa8f-4a9b-af53-6aa9edfe78af	Interview No-Show Follow-up	Missed Interview - {{jobTitle}} Position	Dear {{candidateName}},\n\nWe noticed that you were unable to attend your scheduled interview for the {{jobTitle}} position today at {{interviewTime}}.\n\nWe understand that unexpected situations can arise. If you are still interested in this position and would like to reschedule, please contact us within the next 48 hours.\n\nPlease note that this will be our final attempt to reschedule the interview.\n\nBest regards,\n{{senderName}}\n{{companyName}} Hiring Team	interview_feedback	f	f	["candidateName","jobTitle","interviewTime","senderName","companyName"]	Follow-up for missed interview	\N	2025-07-20 04:55:05.49	2025-07-20 04:55:05.49	interview	\N	0	\N
3f399586-a4c1-43e3-8c17-4c65ea4c94f4	Document Submission Reminder	Action Required: Missing Documents - {{jobTitle}}	Dear {{candidateName}},\n\nWe're preparing for your start date of {{startDate}} and need the following documents to complete your onboarding:\n\n**Required Documents:**\n{{missingDocuments}}\n\n**Submission Options:**\n• Email: {{hrEmail}}\n• Upload Portal: {{portalLink}}\n• In-person: {{officeAddress}}\n\n**Deadline**: {{deadline}}\n\nPlease ensure all documents are submitted by the deadline to avoid any delays in your start date.\n\nIf you have any questions or need assistance, please contact our HR team.\n\nBest regards,\n{{senderName}}\n{{companyName}} HR Team	document_request	f	t	\N	Missing document reminder for new hires	\N	2025-07-20 04:55:05.49	2025-07-21 03:50:35.454	onboarding	\N	0	\N
3bedc5c5-9901-49fe-acc3-c3fe75404878	Position Filled Notification	Position Update - {{jobTitle}} at {{companyName}}	Dear {{candidateName}},\n\nThank you for your interest in the {{jobTitle}} position at {{companyName}}.\n\nWe wanted to inform you that this position has been filled. While your qualifications were impressive, we selected a candidate whose experience most closely matched our specific requirements.\n\nWe encourage you to:\n• Apply for other open positions on our careers page\n• Sign up for job alerts in your area of expertise\n• Connect with us on LinkedIn for future opportunities\n\nWe will keep your information on file for {{retentionPeriod}} and may reach out if suitable positions become available.\n\nThank you for considering {{companyName}} as your potential employer.\n\nBest regards,\n{{senderName}}\n{{companyName}} Talent Acquisition Team	rejection_general	f	t	["candidateName","jobTitle","companyName","retentionPeriod","senderName"]	Position filled notification	\N	2025-07-20 04:55:05.49	2025-07-20 04:55:05.49	rejection	\N	0	\N
6168a56f-cb41-4b57-b0ad-a997332034d7	Application Status Check-in	Quick Update on Your {{jobTitle}} Application	Dear {{candidateName}},\n\nWe wanted to provide you with a quick update on your application for the {{jobTitle}} position at {{companyName}}.\n\nYour application is progressing through our review process. We're currently in the {{currentStage}} phase and expect to complete this stage by {{expectedDate}}.\n\n**Next Steps:**\n{{nextSteps}}\n\n**Timeline:**\n{{timeline}}\n\nWe appreciate your patience during this process. If you have any questions, please feel free to reach out.\n\nBest regards,\n{{senderName}}\n{{companyName}} Hiring Team	follow_up	t	t	["candidateName","jobTitle","companyName","currentStage","expectedDate","nextSteps","timeline","senderName"]	Proactive application status update	\N	2025-07-20 04:55:05.49	2025-07-20 04:55:05.49	follow_up	\N	0	\N
abf4e2de-5421-4f07-8587-bd7f17b7a9f4	Welcome Package - First Day	Welcome to {{companyName}} - Your First Day Guide	Dear {{candidateName}},\n\nWelcome to {{companyName}}! We're excited to have you join our team as {{jobTitle}}.\n\nHere's what you need to know for your first day on {{startDate}}:\n\n📍 **Location**: {{officeAddress}}\n🕘 **Start Time**: {{startTime}}\n👤 **Report to**: {{supervisor}} ({{supervisorEmail}})\n🅿️ **Parking**: {{parkingInfo}}\n\n**What to Bring:**\n• Photo ID\n• Completed paperwork (if any remaining)\n• Banking details for payroll\n\n**What to Expect:**\n• Office tour and desk setup\n• IT equipment setup\n• Meeting your team\n• HR orientation session\n\nIf you have any questions before your start date, please don't hesitate to reach out.\n\nWe look forward to seeing you!\n\nBest regards,\n{{senderName}}\n{{companyName}} HR Team	onboarding_welcome	f	t	\N	First day welcome and logistics	\N	2025-07-20 04:55:05.49	2025-07-20 20:54:15.121	onboarding	\N	0	\N
849e2da5-5d69-4099-8959-7d039347764f	Reference Check Request	Reference Check - {{candidateName}} for {{jobTitle}}	Dear {{referenceName}},\n\nI hope this email finds you well. {{candidateName}} has applied for the {{jobTitle}} position at {{companyName}} and has listed you as a professional reference.\n\nWould you be available for a brief 10-15 minute phone call to discuss {{candidateName}}'s work performance and qualifications? We're particularly interested in:\n\n• {{candidateName}}'s key strengths\n• Areas for development\n• Work style and team collaboration\n• Overall recommendation\n\nPlease let me know your availability over the next few days. I'm flexible with timing and can accommodate your schedule.\n\nYou can reach me at:\n• Phone: {{phoneNumber}}\n• Email: {{email}}\n\nThank you for your time and assistance.\n\nBest regards,\n{{senderName}}\n{{companyName}} Hiring Manager	document_request	t	t	\N	Reference check request email	\N	2025-07-20 04:55:05.49	2025-07-21 03:34:28.895	general	\N	0	\N
38b401f1-4a44-4b5c-aa5d-218a3ec16a16	Job Offer	Congratulations! Job Offer - {{jobTitle}} Position	Dear {{candidateName}},\n\n  Congratulations! We are delighted to offer you the position of {{jobTitle}} at {{companyName}}.\n\n  Offer Details:\n  • Position: {{jobTitle}}\n  • Department: {{department}}\n  • Start Date: {{startDate}}\n  • Salary: {{salary}}\n  • Benefits: {{benefits}}\n\n  Please review the attached offer letter carefully. To accept this offer, please reply to this email and return        \n  the signed documents by {{deadline}}.\n\n  If you have any questions about the offer, please don't hesitate to reach out.\n\n  Welcome to the team!\n\n  Best regards,\n  {{senderName}}\n  {{companyName}} Hiring Team	offer_extended	t	t	\N	Job offer email	\N	2025-07-19 08:23:59.656404	2025-07-21 04:05:11.089	onboarding	\N	1	2025-07-28 04:14:57.633
\.


--
-- Data for Name: emails; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.emails (id, subject, content, html_content, recipient_email, recipient_name, application_id, job_id, template_id, email_provider, message_id, status, failure_reason, opened_at, clicked_at, replied_at, sent_by, sent_at, campaign_id) FROM stdin;
\.


--
-- Data for Name: hire_approval_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hire_approval_requests (id, application_id, requested_by, requested_at, status, reviewed_by, reviewed_at, previous_status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: interview_reschedule_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.interview_reschedule_requests (id, interview_token_id, application_id, response_type, alternative_times, written_response, status, submitted_at, reviewed_at, reviewed_by, review_notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: interview_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.interview_tokens (id, application_id, reschedule_token, acceptance_token, scheduled_at, duration, type, interviewers, location, agenda, notes, calendar_event_id, status, responded_at, expires_at, created_at, updated_at, meeting_link, meeting_provider, is_completed, completed_at, interview_notes, interview_rating, last_reminder_sent_at) FROM stdin;
\.


--
-- Data for Name: interviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.interviews (id, application_id, interviewer_id, job_id, type, status, duration_minutes, proposed_time_slots, scheduled_at, confirmed_at, timezone, meeting_link, meeting_location, agenda, notes, additional_interviewers, google_calendar_event_id, calendar_event_created, invitation_sent_at, reminder_sent_at, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: job_alert_subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_alert_subscriptions (id, user_id, alert_type, department, keywords, is_active, frequency, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: job_approval_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_approval_requests (id, job_id, requested_by, requested_at, status, reviewed_by, reviewed_at, rejection_reason, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, title, slug, description, summary, department, "employmentType", "experienceLevel", location, "remotePolicy", "salaryMin", "salaryMax", "salaryCurrency", "salaryType", benefits, requirements, "preferredQualifications", "educationRequired", "yearsExperienceRequired", "applicationDeadline", "startDate", "applicationInstructions", status, featured, priority, "viewCount", "createdAt", "updatedAt", "postedAt", "categoryId", "createdBy", "autoExpiresAt", "lastExpiredCheck", "showSalary", auto_expires_at, last_expired_check, "applicationCount") FROM stdin;
\.


--
-- Data for Name: mfa_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mfa_codes (id, user_id, code, method, expires_at, used_at, created_at, ip_address, user_agent, is_active) FROM stdin;
\.


--
-- Data for Name: notification_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification_logs (id, user_id, job_id, subscription_id, notification_type, email_address, sent_at, batch_id) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, resource, action, description, category, is_system_permission, created_at) FROM stdin;
61f5113d-1ec6-41c3-bdda-347710b4c286	jobs	view	View job listings and details	Jobs Management	t	2025-07-30 06:32:50.13069+01
39136903-45de-406f-9183-3754df62ea9a	jobs	create	Create new job postings	Jobs Management	t	2025-07-30 06:32:50.13069+01
79c124dd-371c-448d-a8d1-54a9a43b67d4	jobs	edit	Edit existing jobs	Jobs Management	t	2025-07-30 06:32:50.13069+01
927ea639-5f21-48f7-93bc-09929c9fc5f1	jobs	delete	Delete job postings	Jobs Management	t	2025-07-30 06:32:50.13069+01
23477590-0378-431e-9122-ebbd78bbde10	jobs	publish	Publish/unpublish jobs	Jobs Management	t	2025-07-30 06:32:50.13069+01
320990e9-146c-4406-966b-c85644835723	jobs	feature	Mark jobs as featured	Jobs Management	t	2025-07-30 06:32:50.13069+01
0fe8b316-d158-4ae8-b105-c915b89d316e	jobs	clone	Duplicate existing jobs	Jobs Management	t	2025-07-30 06:32:50.13069+01
6f05c0f4-522b-44e8-97b5-2c303888e990	jobs	export	Export job data	Jobs Management	t	2025-07-30 06:32:50.13069+01
e7ba654a-1ffe-4c29-b21c-80b5420ab8fe	applications	view	View job applications	Applications	t	2025-07-30 06:32:50.13069+01
ed009b99-f1c6-4c20-8833-20504f2752a2	applications	create	Create applications (for users)	Applications	t	2025-07-30 06:32:50.13069+01
9560537b-8c22-4ad4-ad3a-703293c91260	applications	edit	Edit application details	Applications	t	2025-07-30 06:32:50.13069+01
c8b5d1ae-197e-4e1e-a5e0-57f078e6c371	applications	delete	Delete applications	Applications	t	2025-07-30 06:32:50.13069+01
8da1ffd2-b839-4003-8b7e-77ccb9267de3	applications	status_change	Change application status	Applications	t	2025-07-30 06:32:50.13069+01
c42f8e7c-8b97-416a-94c0-6c44568eccb7	applications	assign	Assign applications to reviewers	Applications	t	2025-07-30 06:32:50.13069+01
51c06227-2a0c-4836-8aa9-1ca3d80436e3	applications	notes	Add/edit application notes	Applications	t	2025-07-30 06:32:50.13069+01
370fc43c-1cb1-4bbb-be77-9c106efef484	applications	export	Export application data	Applications	t	2025-07-30 06:32:50.13069+01
b97a66dd-6b21-49a2-b07a-469548bfc208	applications	bulk_actions	Perform bulk operations on applications	Applications	t	2025-07-30 06:32:50.13069+01
a6f598e1-f6da-4768-a2b6-1a6bb134c73d	users	view	View user profiles and lists	User Management	t	2025-07-30 06:32:50.13069+01
c45319a6-9379-487b-915f-5d69d8e3cd58	users	create	Create new user accounts	User Management	t	2025-07-30 06:32:50.13069+01
f48b18a0-4398-4dab-b315-1d5b9b315b5b	users	edit	Edit user information	User Management	t	2025-07-30 06:32:50.13069+01
c67c1dd9-6c9d-4719-bf39-214a47c8b3e3	users	delete	Delete user accounts	User Management	t	2025-07-30 06:32:50.13069+01
a24940d9-4979-443a-9a2a-e6b5ac029d82	users	impersonate	Login as another user	User Management	t	2025-07-30 06:32:50.13069+01
2e10a351-292f-4b8e-8a7d-cc77b0a9564c	users	export	Export user data	User Management	t	2025-07-30 06:32:50.13069+01
c28dcaaa-f2d2-4d49-aa9f-e72e2758e6ae	users	roles	Manage user roles and permissions	User Management	t	2025-07-30 06:32:50.13069+01
8fff3cde-31b0-4ab6-8940-e8443d87ecb8	interviews	view	View interview schedules	Interviews	t	2025-07-30 06:32:50.13069+01
8200be89-87a1-4b5c-b031-b865d56424cb	interviews	create	Schedule new interviews	Interviews	t	2025-07-30 06:32:50.13069+01
3a661a57-04be-42e6-81f5-f14bcb393f0c	interviews	edit	Modify interview details	Interviews	t	2025-07-30 06:32:50.13069+01
1a492cc2-b91a-49fa-aa38-81764a9cc948	interviews	delete	Cancel/delete interviews	Interviews	t	2025-07-30 06:32:50.13069+01
32fae31e-bfb8-428b-b4e2-ea8bed62a752	interviews	reschedule	Reschedule interviews	Interviews	t	2025-07-30 06:32:50.13069+01
cea1513a-a70b-46ce-9dcf-506e52e723ba	interviews	notes	Add interview feedback/notes	Interviews	t	2025-07-30 06:32:50.13069+01
98fd2fb7-e476-4fcb-8673-3d76ee0cb4f0	interviews	calendar	Manage interview calendar integration	Interviews	t	2025-07-30 06:32:50.13069+01
eaabbfb0-b80d-465e-bcdd-d8115b3f942a	analytics	view	View analytics dashboard	Analytics & Reports	t	2025-07-30 06:32:50.13069+01
621e2c26-67f3-4479-8f70-17d6bf468c26	analytics	export	Export analytics data	Analytics & Reports	t	2025-07-30 06:32:50.13069+01
9fb75690-63da-469b-8e1e-1ef29a84de94	analytics	advanced	Access advanced analytics features	Analytics & Reports	t	2025-07-30 06:32:50.13069+01
3a1c536a-6c57-4ad7-840c-760b97ae553f	settings	view	View system settings	Settings	t	2025-07-30 06:32:50.13069+01
7d2a07a8-1d3f-4fb3-8098-b41cd8e7f0dd	settings	edit_system	Edit system-wide settings	Settings	t	2025-07-30 06:32:50.13069+01
63768226-fc74-425c-9e11-2285e2a3d51d	settings	edit_branding	Edit branding and appearance	Settings	t	2025-07-30 06:32:50.13069+01
5a8977ad-87a9-4113-aed1-15957b6ec5b5	settings	edit_notifications	Edit notification settings	Settings	t	2025-07-30 06:32:50.13069+01
ed37e647-2977-4e47-88fb-0d19d5cdb393	settings	integrations	Manage third-party integrations	Settings	t	2025-07-30 06:32:50.13069+01
1d4f63e2-02ed-44d1-b307-4b4b621925d9	emails	view	View email campaigns and history	Email Management	t	2025-07-30 06:32:50.13069+01
77d38fb6-cb59-4df3-b7d5-65f741030330	emails	create	Create email campaigns	Email Management	t	2025-07-30 06:32:50.13069+01
be0c0179-c4c9-4e66-9a0d-675de83b3d1a	emails	send	Send emails to applicants	Email Management	t	2025-07-30 06:32:50.13069+01
e21b9376-03ba-4651-93b1-7a3a908b0d40	emails	templates	Manage email templates	Email Management	t	2025-07-30 06:32:50.13069+01
f38d983e-1ec1-4a4a-bfa3-220dd3b61d4a	emails	automation	Set up email automation rules	Email Management	t	2025-07-30 06:32:50.13069+01
b2b85b18-ab7f-485d-875d-3d02d1836c5f	weekly_digest	view	View weekly digest settings	Weekly Digest	t	2025-07-30 06:32:50.13069+01
c87d662b-5ab4-4dde-b1aa-af75c8e581fd	weekly_digest	edit	Configure weekly digest	Weekly Digest	t	2025-07-30 06:32:50.13069+01
98405ad3-ada8-4a2e-aa21-9416d05b5541	weekly_digest	send	Send test/manual weekly digests	Weekly Digest	t	2025-07-30 06:32:50.13069+01
3526b1b6-1046-4059-abde-e9188d3acb4c	audit_logs	view	View system audit logs	Security & Auditing	t	2025-07-30 06:32:50.13069+01
f68b27c2-2d5b-45f2-ae14-5d69a3a312a2	audit_logs	export	Export audit log data	Security & Auditing	t	2025-07-30 06:32:50.13069+01
870798b4-c693-4461-a060-8b6b164280da	roles	view	View roles and permissions	Role Management	t	2025-07-30 06:32:50.13069+01
6128d6cf-93c5-4547-9e0c-16879697d03f	roles	create	Create new roles	Role Management	t	2025-07-30 06:32:50.13069+01
f4322f20-02ce-4554-b61b-1c8b37f0e6e7	roles	edit	Edit existing roles	Role Management	t	2025-07-30 06:32:50.13069+01
2d972a7a-976d-4515-a0bc-2ad0f361d307	roles	delete	Delete roles	Role Management	t	2025-07-30 06:32:50.13069+01
3d21aaae-64b7-4313-a3d8-01b7f2744f77	roles	assign	Assign roles to users	Role Management	t	2025-07-30 06:32:50.13069+01
093e0609-be1d-4952-bf7d-94ebec1a2e4b	applications	approve_hire	Approve hiring decisions for applications	Hiring	t	2025-08-07 02:45:40.344863+01
81938305-7893-44ac-977a-961ddcba265a	google-analytics	view	View Google Analytics data and reports	analytics	t	2025-08-08 03:55:56.889598+01
65a4343d-8c1e-47d9-81a5-e23d2b35dd63	jobs	approve	Approve jobs for publishing	Jobs Management	t	2025-08-08 18:34:32.349302+01
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions (id, role_id, permission_id, granted_at, granted_by) FROM stdin;
fa9c34fc-078f-46ea-8f79-30aa337c4685	583bd455-db37-43e5-a626-a4305144e7b4	61f5113d-1ec6-41c3-bdda-347710b4c286	2025-08-02 18:16:34.932+01	\N
a2f59833-79a8-482d-8c92-a84e4bde16c5	583bd455-db37-43e5-a626-a4305144e7b4	39136903-45de-406f-9183-3754df62ea9a	2025-08-02 18:16:34.932+01	\N
f2f637a8-99e6-4747-a3f2-fed6e7571039	583bd455-db37-43e5-a626-a4305144e7b4	79c124dd-371c-448d-a8d1-54a9a43b67d4	2025-08-02 18:16:34.932+01	\N
e608b480-05ad-476e-ab48-7ba3ff3d3009	583bd455-db37-43e5-a626-a4305144e7b4	927ea639-5f21-48f7-93bc-09929c9fc5f1	2025-08-02 18:16:34.932+01	\N
f384c7af-6155-4685-9073-1df9e1f014cb	583bd455-db37-43e5-a626-a4305144e7b4	23477590-0378-431e-9122-ebbd78bbde10	2025-08-02 18:16:34.932+01	\N
e1159d71-1b20-4b6c-8ee9-3ffe03d800bc	583bd455-db37-43e5-a626-a4305144e7b4	320990e9-146c-4406-966b-c85644835723	2025-08-02 18:16:34.932+01	\N
f9792cbc-752d-4e7f-ae2f-be6c841cd0e4	583bd455-db37-43e5-a626-a4305144e7b4	0fe8b316-d158-4ae8-b105-c915b89d316e	2025-08-02 18:16:34.932+01	\N
bf3f3893-40fd-4876-8d02-846995b6ced1	583bd455-db37-43e5-a626-a4305144e7b4	6f05c0f4-522b-44e8-97b5-2c303888e990	2025-08-02 18:16:34.932+01	\N
7f09c95f-d9c3-4afa-acb9-9cbdaa4fc1d5	583bd455-db37-43e5-a626-a4305144e7b4	e7ba654a-1ffe-4c29-b21c-80b5420ab8fe	2025-08-02 18:16:34.932+01	\N
5c7cde5b-0f7c-4b27-a0dc-a20ccecdd593	583bd455-db37-43e5-a626-a4305144e7b4	ed009b99-f1c6-4c20-8833-20504f2752a2	2025-08-02 18:16:34.932+01	\N
30293531-0612-41ab-ba51-ecee38d4a2cb	583bd455-db37-43e5-a626-a4305144e7b4	9560537b-8c22-4ad4-ad3a-703293c91260	2025-08-02 18:16:34.932+01	\N
6613e36d-5c30-48b6-933d-dbfc669ad91a	583bd455-db37-43e5-a626-a4305144e7b4	c8b5d1ae-197e-4e1e-a5e0-57f078e6c371	2025-08-02 18:16:34.932+01	\N
afd535d6-99cc-4526-a316-1d1268ff3226	583bd455-db37-43e5-a626-a4305144e7b4	8da1ffd2-b839-4003-8b7e-77ccb9267de3	2025-08-02 18:16:34.932+01	\N
1a6292ae-5b77-4ace-a18f-c94a0c6428f3	583bd455-db37-43e5-a626-a4305144e7b4	c42f8e7c-8b97-416a-94c0-6c44568eccb7	2025-08-02 18:16:34.932+01	\N
da073e30-20eb-4b48-9b8b-47295262e001	583bd455-db37-43e5-a626-a4305144e7b4	51c06227-2a0c-4836-8aa9-1ca3d80436e3	2025-08-02 18:16:34.932+01	\N
abf19812-b907-4715-903f-aa6216406074	583bd455-db37-43e5-a626-a4305144e7b4	370fc43c-1cb1-4bbb-be77-9c106efef484	2025-08-02 18:16:34.932+01	\N
3ba2879d-ab72-47f8-a384-2e101afc377e	583bd455-db37-43e5-a626-a4305144e7b4	b97a66dd-6b21-49a2-b07a-469548bfc208	2025-08-02 18:16:34.932+01	\N
44ed8050-bc9e-413d-a889-f8f183d29de4	583bd455-db37-43e5-a626-a4305144e7b4	8fff3cde-31b0-4ab6-8940-e8443d87ecb8	2025-08-02 18:16:34.932+01	\N
999dc772-6691-4445-8dad-4b52d629886e	583bd455-db37-43e5-a626-a4305144e7b4	8200be89-87a1-4b5c-b031-b865d56424cb	2025-08-02 18:16:34.932+01	\N
73d80408-a7f1-4626-958f-934fae8f8ca4	583bd455-db37-43e5-a626-a4305144e7b4	3a661a57-04be-42e6-81f5-f14bcb393f0c	2025-08-02 18:16:34.932+01	\N
6995a7f3-df60-4dcd-87f6-177ae5fa73c4	583bd455-db37-43e5-a626-a4305144e7b4	1a492cc2-b91a-49fa-aa38-81764a9cc948	2025-08-02 18:16:34.932+01	\N
6110dac1-76fd-4436-adcc-bbf586ac4b59	583bd455-db37-43e5-a626-a4305144e7b4	32fae31e-bfb8-428b-b4e2-ea8bed62a752	2025-08-02 18:16:34.932+01	\N
6a3e2946-3fab-475a-a3eb-5ccb7966b21f	583bd455-db37-43e5-a626-a4305144e7b4	cea1513a-a70b-46ce-9dcf-506e52e723ba	2025-08-02 18:16:34.932+01	\N
48ec1d17-47e3-4df0-857e-cad76488f9f1	583bd455-db37-43e5-a626-a4305144e7b4	98fd2fb7-e476-4fcb-8673-3d76ee0cb4f0	2025-08-02 18:16:34.932+01	\N
2f17c8d3-053f-4442-9f48-cd2ed5d93633	583bd455-db37-43e5-a626-a4305144e7b4	eaabbfb0-b80d-465e-bcdd-d8115b3f942a	2025-08-02 18:16:34.932+01	\N
9c1d34dc-e3c4-4a46-a962-393ec1335773	583bd455-db37-43e5-a626-a4305144e7b4	621e2c26-67f3-4479-8f70-17d6bf468c26	2025-08-02 18:16:34.932+01	\N
00c42d0b-cfd3-42b1-b52d-9f544e2401b0	583bd455-db37-43e5-a626-a4305144e7b4	9fb75690-63da-469b-8e1e-1ef29a84de94	2025-08-02 18:16:34.932+01	\N
118a9834-2d30-4090-87e9-4e2a8a2287cf	583bd455-db37-43e5-a626-a4305144e7b4	3a1c536a-6c57-4ad7-840c-760b97ae553f	2025-08-02 18:16:34.932+01	\N
cad80103-2ec2-47f8-a4ea-30a9e9bc4dfa	583bd455-db37-43e5-a626-a4305144e7b4	63768226-fc74-425c-9e11-2285e2a3d51d	2025-08-02 18:16:34.932+01	\N
7c257cb0-4e7e-4345-9ee3-ebb3829592c7	583bd455-db37-43e5-a626-a4305144e7b4	5a8977ad-87a9-4113-aed1-15957b6ec5b5	2025-08-02 18:16:34.932+01	\N
6a5388b4-425c-4dda-8a5e-4e011d4b674b	583bd455-db37-43e5-a626-a4305144e7b4	ed37e647-2977-4e47-88fb-0d19d5cdb393	2025-08-02 18:16:34.932+01	\N
6d433953-0fbd-47a7-9de6-4877637940e4	583bd455-db37-43e5-a626-a4305144e7b4	1d4f63e2-02ed-44d1-b307-4b4b621925d9	2025-08-02 18:16:34.932+01	\N
6c0f10fd-efbc-42e2-a9d9-8f0b6df02212	583bd455-db37-43e5-a626-a4305144e7b4	77d38fb6-cb59-4df3-b7d5-65f741030330	2025-08-02 18:16:34.932+01	\N
faa2f241-96f7-4743-9bd3-9f9630745cf8	583bd455-db37-43e5-a626-a4305144e7b4	be0c0179-c4c9-4e66-9a0d-675de83b3d1a	2025-08-02 18:16:34.932+01	\N
b8f3cf80-b293-4efd-8029-278fb11d6f40	583bd455-db37-43e5-a626-a4305144e7b4	e21b9376-03ba-4651-93b1-7a3a908b0d40	2025-08-02 18:16:34.932+01	\N
2752d51c-1846-41ca-8b37-d6f173ee0608	583bd455-db37-43e5-a626-a4305144e7b4	f38d983e-1ec1-4a4a-bfa3-220dd3b61d4a	2025-08-02 18:16:34.932+01	\N
2119c6bf-23b4-40ac-a9bf-848cf6cd8203	583bd455-db37-43e5-a626-a4305144e7b4	b2b85b18-ab7f-485d-875d-3d02d1836c5f	2025-08-02 18:16:34.932+01	\N
760901da-b4e4-43e6-84b7-6946c82f8157	583bd455-db37-43e5-a626-a4305144e7b4	c87d662b-5ab4-4dde-b1aa-af75c8e581fd	2025-08-02 18:16:34.932+01	\N
d0fde876-7675-4b2f-b7f2-fc025699dd78	583bd455-db37-43e5-a626-a4305144e7b4	98405ad3-ada8-4a2e-aa21-9416d05b5541	2025-08-02 18:16:34.932+01	\N
559a10be-2605-4187-bb18-7e70c6a28906	583bd455-db37-43e5-a626-a4305144e7b4	6128d6cf-93c5-4547-9e0c-16879697d03f	2025-08-02 18:16:34.932+01	\N
b39dac6c-634c-4238-99a1-f63fe12006fd	26da9755-59bc-43d5-93c0-6d8a96878f09	61f5113d-1ec6-41c3-bdda-347710b4c286	2025-08-08 19:36:28.782+01	\N
9e617b72-5d11-4917-b2d3-2a82413560d6	26da9755-59bc-43d5-93c0-6d8a96878f09	39136903-45de-406f-9183-3754df62ea9a	2025-08-08 19:36:28.782+01	\N
cf867212-042a-4f5c-8996-f7bfe0495a7b	26da9755-59bc-43d5-93c0-6d8a96878f09	79c124dd-371c-448d-a8d1-54a9a43b67d4	2025-08-08 19:36:28.782+01	\N
c2379e1a-0ab3-4307-bb61-bf4c8b48d49e	26da9755-59bc-43d5-93c0-6d8a96878f09	927ea639-5f21-48f7-93bc-09929c9fc5f1	2025-08-08 19:36:28.782+01	\N
2b141359-f1ca-485b-98a4-37ee33bc8461	26da9755-59bc-43d5-93c0-6d8a96878f09	23477590-0378-431e-9122-ebbd78bbde10	2025-08-08 19:36:28.782+01	\N
4d6d1bc2-38fd-4ebe-aa66-01e119fbe703	26da9755-59bc-43d5-93c0-6d8a96878f09	320990e9-146c-4406-966b-c85644835723	2025-08-08 19:36:28.782+01	\N
eec4e72e-b6b5-4b40-8ada-92fe7c13fb7f	26da9755-59bc-43d5-93c0-6d8a96878f09	0fe8b316-d158-4ae8-b105-c915b89d316e	2025-08-08 19:36:28.782+01	\N
48376d39-fe8f-44f4-a23a-418a48cd3eae	26da9755-59bc-43d5-93c0-6d8a96878f09	6f05c0f4-522b-44e8-97b5-2c303888e990	2025-08-08 19:36:28.782+01	\N
f425eaed-4779-4175-bc05-52611bdfb90b	26da9755-59bc-43d5-93c0-6d8a96878f09	e7ba654a-1ffe-4c29-b21c-80b5420ab8fe	2025-08-08 19:36:28.782+01	\N
d0932569-6dff-42b8-8c0a-1267826584b9	26da9755-59bc-43d5-93c0-6d8a96878f09	ed009b99-f1c6-4c20-8833-20504f2752a2	2025-08-08 19:36:28.782+01	\N
bc301240-aa55-441d-b918-718a4084e556	26da9755-59bc-43d5-93c0-6d8a96878f09	9560537b-8c22-4ad4-ad3a-703293c91260	2025-08-08 19:36:28.782+01	\N
745d8fee-27cb-4701-a688-619d2cca9c8d	26da9755-59bc-43d5-93c0-6d8a96878f09	c8b5d1ae-197e-4e1e-a5e0-57f078e6c371	2025-08-08 19:36:28.782+01	\N
9b135b03-3052-4b5c-a291-7b2789b71adf	26da9755-59bc-43d5-93c0-6d8a96878f09	8da1ffd2-b839-4003-8b7e-77ccb9267de3	2025-08-08 19:36:28.782+01	\N
a023130e-b4de-44a1-bae6-c06722b27ce3	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	61f5113d-1ec6-41c3-bdda-347710b4c286	2025-07-31 06:13:50.68+01	\N
8401584b-caab-462c-b632-89d418068916	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	39136903-45de-406f-9183-3754df62ea9a	2025-07-31 06:13:50.68+01	\N
6ef74bb6-1b0e-4561-ab7d-b6b6a5353021	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	79c124dd-371c-448d-a8d1-54a9a43b67d4	2025-07-31 06:13:50.68+01	\N
0644e477-f24a-4fb1-897a-7235dd017b7f	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	23477590-0378-431e-9122-ebbd78bbde10	2025-07-31 06:13:50.68+01	\N
11187144-0a49-4b3d-bd76-24ca6956988d	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	e7ba654a-1ffe-4c29-b21c-80b5420ab8fe	2025-07-31 06:13:50.68+01	\N
b54b5c63-a0b7-484a-abdf-109fce49a91d	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	9560537b-8c22-4ad4-ad3a-703293c91260	2025-07-31 06:13:50.68+01	\N
87f3d06e-9bbe-46fb-b82d-692ce4c1b95e	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	8da1ffd2-b839-4003-8b7e-77ccb9267de3	2025-07-31 06:13:50.68+01	\N
b797f9c7-3987-4872-9f7c-51481c8c6b10	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	c42f8e7c-8b97-416a-94c0-6c44568eccb7	2025-07-31 06:13:50.68+01	\N
3e1a5d57-d2fc-47d0-addc-e7f0f9a442e1	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	51c06227-2a0c-4836-8aa9-1ca3d80436e3	2025-07-31 06:13:50.68+01	\N
0b78c64f-9120-4613-bb73-9c2af2c8c993	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	370fc43c-1cb1-4bbb-be77-9c106efef484	2025-07-31 06:13:50.68+01	\N
031687d9-1493-411c-b7e4-0cc810539056	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	a6f598e1-f6da-4768-a2b6-1a6bb134c73d	2025-07-31 06:13:50.68+01	\N
4994f956-64cd-4c56-8cc2-2e5b8628b760	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	8fff3cde-31b0-4ab6-8940-e8443d87ecb8	2025-07-31 06:13:50.68+01	\N
1997abd9-7878-4afa-9b25-09a7eae196ed	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	8200be89-87a1-4b5c-b031-b865d56424cb	2025-07-31 06:13:50.68+01	\N
da16ebcf-3860-4235-bf30-39dae89d2b5d	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	3a661a57-04be-42e6-81f5-f14bcb393f0c	2025-07-31 06:13:50.68+01	\N
518ed614-4762-463b-a228-d0b35f4a4f02	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	32fae31e-bfb8-428b-b4e2-ea8bed62a752	2025-07-31 06:13:50.68+01	\N
50f3b4d8-c5aa-41bb-8e47-8043a0cb0f9c	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	cea1513a-a70b-46ce-9dcf-506e52e723ba	2025-07-31 06:13:50.68+01	\N
77cfbb26-7e69-4343-9e6f-6fddca293e3e	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	eaabbfb0-b80d-465e-bcdd-d8115b3f942a	2025-07-31 06:13:50.68+01	\N
8254eaa0-db14-40b6-b1f3-7ac649624cf8	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	1d4f63e2-02ed-44d1-b307-4b4b621925d9	2025-07-31 06:13:50.68+01	\N
00e22cb3-a4a3-402b-b07b-6220c2d166a7	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	77d38fb6-cb59-4df3-b7d5-65f741030330	2025-07-31 06:13:50.68+01	\N
ada1ac37-d09c-4e59-8697-627af15d3ac0	9dc4b696-19fc-49e7-9d4d-d74432d2cf74	be0c0179-c4c9-4e66-9a0d-675de83b3d1a	2025-07-31 06:13:50.68+01	\N
2166dbe0-4354-4a43-bc3a-4d2c0340101c	26da9755-59bc-43d5-93c0-6d8a96878f09	c42f8e7c-8b97-416a-94c0-6c44568eccb7	2025-08-08 19:36:28.782+01	\N
10ecee2c-9622-4ac5-aa62-a2dec7d274e7	26da9755-59bc-43d5-93c0-6d8a96878f09	51c06227-2a0c-4836-8aa9-1ca3d80436e3	2025-08-08 19:36:28.782+01	\N
a0b686e9-2be2-48d3-a9f1-7bdf2746271b	26da9755-59bc-43d5-93c0-6d8a96878f09	370fc43c-1cb1-4bbb-be77-9c106efef484	2025-08-08 19:36:28.782+01	\N
b2248fbf-90d9-4a60-b1ec-a349e86c9c41	26da9755-59bc-43d5-93c0-6d8a96878f09	b97a66dd-6b21-49a2-b07a-469548bfc208	2025-08-08 19:36:28.782+01	\N
6152f248-190e-4102-b3e5-637eceed02cc	26da9755-59bc-43d5-93c0-6d8a96878f09	a6f598e1-f6da-4768-a2b6-1a6bb134c73d	2025-08-08 19:36:28.782+01	\N
b8bc14b0-3320-4e1d-b826-4230f4078bbd	26da9755-59bc-43d5-93c0-6d8a96878f09	c45319a6-9379-487b-915f-5d69d8e3cd58	2025-08-08 19:36:28.782+01	\N
a55a7678-9684-498f-8167-e25d8bb78ce6	26da9755-59bc-43d5-93c0-6d8a96878f09	f48b18a0-4398-4dab-b315-1d5b9b315b5b	2025-08-08 19:36:28.782+01	\N
2960bbc9-acc1-49eb-b133-e9b1f5f0987f	26da9755-59bc-43d5-93c0-6d8a96878f09	c67c1dd9-6c9d-4719-bf39-214a47c8b3e3	2025-08-08 19:36:28.782+01	\N
55b678bb-3bf4-4f15-9c01-10be97ff600f	26da9755-59bc-43d5-93c0-6d8a96878f09	a24940d9-4979-443a-9a2a-e6b5ac029d82	2025-08-08 19:36:28.782+01	\N
f0516e60-48b8-4fd7-88f5-6243562537e9	26da9755-59bc-43d5-93c0-6d8a96878f09	2e10a351-292f-4b8e-8a7d-cc77b0a9564c	2025-08-08 19:36:28.782+01	\N
b8e40610-acb9-4460-bdb3-a2e73e552fa8	26da9755-59bc-43d5-93c0-6d8a96878f09	c28dcaaa-f2d2-4d49-aa9f-e72e2758e6ae	2025-08-08 19:36:28.782+01	\N
e29cbdd1-08fd-42ca-b9dd-b7fc506e9179	26da9755-59bc-43d5-93c0-6d8a96878f09	8fff3cde-31b0-4ab6-8940-e8443d87ecb8	2025-08-08 19:36:28.782+01	\N
081f49ef-c615-4ec7-b386-04a9d3f5b8ca	26da9755-59bc-43d5-93c0-6d8a96878f09	8200be89-87a1-4b5c-b031-b865d56424cb	2025-08-08 19:36:28.782+01	\N
3fa788b2-e445-43bd-ad7f-06009af66562	26da9755-59bc-43d5-93c0-6d8a96878f09	3a661a57-04be-42e6-81f5-f14bcb393f0c	2025-08-08 19:36:28.782+01	\N
79427ce7-7634-464e-95aa-87ec2f246afe	26da9755-59bc-43d5-93c0-6d8a96878f09	1a492cc2-b91a-49fa-aa38-81764a9cc948	2025-08-08 19:36:28.782+01	\N
a7c9162a-874a-48b4-a723-3296d7599f32	26da9755-59bc-43d5-93c0-6d8a96878f09	32fae31e-bfb8-428b-b4e2-ea8bed62a752	2025-08-08 19:36:28.782+01	\N
6e5b1041-a4e5-4096-9c96-e5188956f6f2	26da9755-59bc-43d5-93c0-6d8a96878f09	cea1513a-a70b-46ce-9dcf-506e52e723ba	2025-08-08 19:36:28.782+01	\N
f9500d78-c4b3-45df-aecc-6915418a1cda	26da9755-59bc-43d5-93c0-6d8a96878f09	98fd2fb7-e476-4fcb-8673-3d76ee0cb4f0	2025-08-08 19:36:28.782+01	\N
267d12bc-a271-471e-b783-845310696a8e	26da9755-59bc-43d5-93c0-6d8a96878f09	eaabbfb0-b80d-465e-bcdd-d8115b3f942a	2025-08-08 19:36:28.782+01	\N
921649c7-1c28-47c5-a1d7-f015c17720bd	26da9755-59bc-43d5-93c0-6d8a96878f09	621e2c26-67f3-4479-8f70-17d6bf468c26	2025-08-08 19:36:28.782+01	\N
41d3abc8-8916-450d-af35-5f1f46222fdf	26da9755-59bc-43d5-93c0-6d8a96878f09	9fb75690-63da-469b-8e1e-1ef29a84de94	2025-08-08 19:36:28.782+01	\N
2aa69b9f-e23f-465b-a6c3-5c45e96c84f1	583bd455-db37-43e5-a626-a4305144e7b4	81938305-7893-44ac-977a-961ddcba265a	2025-08-08 03:56:24.057039+01	\N
597a7c9b-798a-46bd-9fbb-a9776d04ef8d	26da9755-59bc-43d5-93c0-6d8a96878f09	3a1c536a-6c57-4ad7-840c-760b97ae553f	2025-08-08 19:36:28.782+01	\N
40ab1cfe-eaa1-4e62-8bb2-ef337dddfedd	26da9755-59bc-43d5-93c0-6d8a96878f09	7d2a07a8-1d3f-4fb3-8098-b41cd8e7f0dd	2025-08-08 19:36:28.782+01	\N
5be1aaa8-e19b-407a-8087-2065c30af005	26da9755-59bc-43d5-93c0-6d8a96878f09	63768226-fc74-425c-9e11-2285e2a3d51d	2025-08-08 19:36:28.782+01	\N
1bdea2c6-0898-4f31-8829-3142092ee7f9	26da9755-59bc-43d5-93c0-6d8a96878f09	5a8977ad-87a9-4113-aed1-15957b6ec5b5	2025-08-08 19:36:28.782+01	\N
99c5a6b4-b8cc-46a7-a090-9734d5cec186	26da9755-59bc-43d5-93c0-6d8a96878f09	ed37e647-2977-4e47-88fb-0d19d5cdb393	2025-08-08 19:36:28.782+01	\N
d7bfa3af-50cc-41ab-876c-0469cfd0a9a2	26da9755-59bc-43d5-93c0-6d8a96878f09	1d4f63e2-02ed-44d1-b307-4b4b621925d9	2025-08-08 19:36:28.782+01	\N
8b498985-4865-44ac-9b10-d2d174f91203	26da9755-59bc-43d5-93c0-6d8a96878f09	77d38fb6-cb59-4df3-b7d5-65f741030330	2025-08-08 19:36:28.782+01	\N
d5cae326-871b-43e3-a70d-68f8671818b6	26da9755-59bc-43d5-93c0-6d8a96878f09	be0c0179-c4c9-4e66-9a0d-675de83b3d1a	2025-08-08 19:36:28.782+01	\N
6324d667-569c-45c7-8776-e01a53edee39	26da9755-59bc-43d5-93c0-6d8a96878f09	e21b9376-03ba-4651-93b1-7a3a908b0d40	2025-08-08 19:36:28.782+01	\N
d1307dc1-aff6-4f87-9058-49b86896030a	26da9755-59bc-43d5-93c0-6d8a96878f09	f38d983e-1ec1-4a4a-bfa3-220dd3b61d4a	2025-08-08 19:36:28.782+01	\N
ad441a82-0786-472b-9c5f-e34b25622e28	26da9755-59bc-43d5-93c0-6d8a96878f09	b2b85b18-ab7f-485d-875d-3d02d1836c5f	2025-08-08 19:36:28.782+01	\N
58bc1440-7f70-45d7-bb94-b44089c863f9	26da9755-59bc-43d5-93c0-6d8a96878f09	c87d662b-5ab4-4dde-b1aa-af75c8e581fd	2025-08-08 19:36:28.782+01	\N
4c75055d-b1de-4acd-ab33-e8a6ce76ae2c	26da9755-59bc-43d5-93c0-6d8a96878f09	98405ad3-ada8-4a2e-aa21-9416d05b5541	2025-08-08 19:36:28.782+01	\N
b2514ef1-2bfb-44ca-8375-dcb72af18bdf	26da9755-59bc-43d5-93c0-6d8a96878f09	3526b1b6-1046-4059-abde-e9188d3acb4c	2025-08-08 19:36:28.782+01	\N
20e1885a-7a98-46c0-95ec-caf9e2b862ec	26da9755-59bc-43d5-93c0-6d8a96878f09	f68b27c2-2d5b-45f2-ae14-5d69a3a312a2	2025-08-08 19:36:28.782+01	\N
4da41904-4f30-4a43-b2c5-852b3f0cd332	26da9755-59bc-43d5-93c0-6d8a96878f09	870798b4-c693-4461-a060-8b6b164280da	2025-08-08 19:36:28.782+01	\N
1f36524e-7f8b-4d97-a26a-2e2322c88509	26da9755-59bc-43d5-93c0-6d8a96878f09	6128d6cf-93c5-4547-9e0c-16879697d03f	2025-08-08 19:36:28.782+01	\N
ad54b315-8c91-438f-8abf-ed613f60730a	26da9755-59bc-43d5-93c0-6d8a96878f09	f4322f20-02ce-4554-b61b-1c8b37f0e6e7	2025-08-08 19:36:28.782+01	\N
8b64b437-7ac9-4f0c-9c73-ffa4c0cb9aaa	26da9755-59bc-43d5-93c0-6d8a96878f09	2d972a7a-976d-4515-a0bc-2ad0f361d307	2025-08-08 19:36:28.782+01	\N
e6a4cbc3-45d8-40a4-bef4-1a7f5dc92c70	26da9755-59bc-43d5-93c0-6d8a96878f09	3d21aaae-64b7-4313-a3d8-01b7f2744f77	2025-08-08 19:36:28.782+01	\N
64f1b772-b5ee-404e-a95c-aabff53b6e87	26da9755-59bc-43d5-93c0-6d8a96878f09	093e0609-be1d-4952-bf7d-94ebec1a2e4b	2025-08-08 19:36:28.782+01	\N
d10bbaab-48b0-4bac-b8ed-2e92271d55c5	26da9755-59bc-43d5-93c0-6d8a96878f09	81938305-7893-44ac-977a-961ddcba265a	2025-08-08 19:36:28.782+01	\N
2a84c848-392e-4605-8100-84ff87f35e52	26da9755-59bc-43d5-93c0-6d8a96878f09	65a4343d-8c1e-47d9-81a5-e23d2b35dd63	2025-08-08 19:36:28.782+01	\N
ba821cf5-fd09-4f68-b245-271c1194d729	7ca82e25-9ca2-46a8-8a2b-f68e71a17c28	eaabbfb0-b80d-465e-bcdd-d8115b3f942a	2025-08-11 16:15:51.594+01	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, description, color, is_system_role, is_active, created_at, updated_at, created_by, is_ldap_role, ldap_group_name, is_editable) FROM stdin;
9dc4b696-19fc-49e7-9d4d-d74432d2cf74	HR	HR personnel with recruitment access	green	t	t	2025-07-30 06:33:01.169622+01	2025-07-30 06:33:01.169622+01	\N	f	\N	t
583bd455-db37-43e5-a626-a4305144e7b4	Admin	System administrator with access to most things	blue	t	t	2025-07-30 06:33:01.169622+01	2025-07-30 06:33:01.169622+01	\N	f	\N	t
26da9755-59bc-43d5-93c0-6d8a96878f09	Super Admin	Full system access and control	yellow	t	t	2025-07-30 06:33:01.169622+01	2025-07-30 06:33:01.169622+01	\N	f	\N	t
7ca82e25-9ca2-46a8-8a2b-f68e71a17c28	User	Basic user with minimal access - can apply to jobs	purple	t	t	2025-07-30 06:33:01.169622+01	2025-07-30 06:33:01.169622+01	\N	f	\N	t
\.


--
-- Data for Name: saved_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.saved_jobs (id, "savedAt", "userId", "jobId") FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, key, value, category, "userId", "privilegeLevel", "dataType", description, "createdAt", "updatedAt") FROM stdin;
79bb2669-fc9c-4359-9afb-4490829fd700	allow_guest_applications	true	system	\N	2	boolean	Allow applications without registration	2025-07-07 04:25:01.873375+01	2025-07-08 01:40:19.201+01
2902b99d-f59b-44ba-98af-8882544328a6	application_deadline_required	false	jobs	\N	2	boolean	Require application deadlines for all job postings	2025-07-08 01:55:09.704+01	2025-07-08 06:50:34.457+01
6eb5d2cc-4d32-4712-a4b1-7ae86bafa027	max_resume_size_mb	5	system	\N	2	number	Maximum resume file size in MB	2025-07-07 04:25:01.873375+01	2025-07-08 01:54:31.996+01
2974d565-e9b3-4ac1-9bd5-de05f1a60909	auto_expire_jobs_days	30	jobs	\N	2	number	Number of days after which jobs auto-expire (0 = never)	2025-07-08 01:55:08.525+01	2025-07-08 01:55:08.525+01
48d85ffc-3189-4ed4-819e-ac1116a0eac4	max_featured_jobs	5	jobs	\N	2	number	Maximum number of jobs that can be featured at once	2025-07-08 01:55:09.302+01	2025-07-08 01:55:09.302+01
3e3b8556-592b-4350-ad87-5e2a9bf64753	auto_publish_jobs	false	jobs	\N	2	boolean	Automatically publish new jobs	2025-07-07 04:25:01.873375+01	2025-07-08 06:57:57.899+01
65a7b7ca-ae4f-4d26-b39b-1ddd221cdf75	show_salary_by_default	true	jobs	\N	2	boolean	Show salary information on job listings by default	2025-07-08 01:55:09.045+01	2025-07-08 07:18:52.786+01
d610fbd3-57b0-45b0-8ca8-91ddea1f2d56	require_salary_range	false	jobs	\N	2	boolean	Require salary range to be specified for all job postings	2025-07-08 01:55:08.787+01	2025-07-08 07:19:35.017+01
44e731c5-6f4d-48cc-84b8-42f97dfe57ca	default_currency	CAD	system	\N	3	string	Default currency for salary listings	2025-07-08 01:55:07.869+01	2025-07-08 03:17:37.778+01
546f7de5-1eea-4878-90b9-39a6d8a4f235	allowed_resume_types	["pdf","doc","docx"]	system	\N	3	json	Allowed resume file types	2025-07-08 01:55:08.257+01	2025-07-08 03:33:41.011+01
cd30509c-d11e-4975-8b4e-0c75bd21d0a4	application_confirmation_email	false	notifications	\N	1	boolean	Send confirmation emails to applicants after they apply	2025-07-08 01:55:10.743+01	2025-07-08 20:32:45.261+01
d7c4997e-3344-4e04-a15d-a492167fbb97	job_approval_required	false	jobs	\N	1	boolean	Require admin approval before jobs are published	2025-07-08 19:50:30.969361+01	2025-07-08 19:50:30.969361+01
c464c90e-27f5-41e3-a5df-77ef6793aded	email_new_applications	false	notifications	\N	1	boolean	Send email notifications when new job applications are received	2025-07-08 01:55:09.962+01	2025-07-08 20:57:24.029+01
7d2bff75-92c3-426a-81f2-90a840d96bf5	emergency_notifications_enabled	true	notifications	\N	1	boolean	Enable critical system notifications for urgent issues	2025-07-08 19:50:30.969361+01	2025-07-08 19:50:30.969361+01
45570eb5-2682-4911-b73b-e5484fc7e6ff	smtp_password	re_QaQ7Jg6K_QDskziZu344d8rbUjgztxu9u	notifications	\N	3	string	SMTP authentication password	2025-07-08 20:08:47.826251+01	2025-08-16 19:26:34.963+01
2e0e4d51-53d5-4db7-a17d-c6d5d6ebeea4	smtp_port	587	notifications	\N	3	number	SMTP server port (587 for TLS, 465 for SSL, 25 for non-secure)	2025-07-08 20:08:47.826251+01	2025-08-16 19:11:06.92+01
37fd9dff-03c5-4ed8-ae79-2cab196a01c7	weekly_digest_time	18:00	notifications	\N	1	string	Time of day to send the weekly digest (24-hour format, e.g., 09:00)	2025-07-10 01:25:54.536425+01	2025-08-02 20:00:19.014+01
fd05af10-5dfd-4308-9069-ec4124573837	smtp_enabled	true	notifications	\N	3	boolean	Enable custom SMTP server (overrides default email service)	2025-07-08 20:08:47.826251+01	2025-07-11 08:11:29.986+01
315ffd1e-e440-410c-8509-e0f12b93469c	emergency_notification_email	noreply@jacobpi.local	notifications	\N	1	string	Email address for critical system alerts and emergencies	2025-07-08 19:50:30.969361+01	2025-07-11 08:14:03.722+01
d181e185-6e2e-4aa3-b927-cd1a9812937c	notification_email	noreply@jacobpi.local	notifications	\N	1	string	Primary email address to receive system notifications	2025-07-08 01:55:10.481+01	2025-07-11 08:17:30.509+01
8b2f4274-d7a0-484a-a6d9-922831bb143a	smtp_secure	false	notifications	\N	3	boolean	Use TLS/SSL encryption	2025-07-08 20:08:47.826251+01	2025-08-16 10:17:55.182+01
2a4191e9-2344-4d71-8a5d-a336dd464016	require_notes_on_rejection	true	hiring_workflow	\N	1	boolean	Require notes when rejecting candidates	2025-07-13 05:31:35.74771+01	2025-08-06 05:41:42.298+01
2c69c538-3214-425f-99da-c08035503aeb	auto_progress_delay_days	7	hiring_workflow	\N	2	number	Days to wait before auto-progressing applications	2025-07-13 05:31:35.74771+01	2025-07-13 05:31:35.74771+01
b466d67d-f457-4ba0-a625-baa019bc786b	auto_reject_after_days	30	hiring_workflow	\N	2	number	Auto-reject applications after X days of inactivity (0 = never)	2025-07-13 05:31:35.74771+01	2025-07-13 05:31:35.74771+01
60911cd8-83bd-46ec-9f43-8c8c3b564766	auto_send_application_received	true	hiring_communication	\N	1	boolean	Automatically send confirmation emails to applicants	2025-07-13 05:31:35.74771+01	2025-07-13 05:31:35.74771+01
aa286321-0269-49a0-9b42-21de452072b1	site_description	Get a job with Jacob!	branding	\N	3	string	Site description for SEO and branding	2025-07-08 01:55:07.605+01	2025-07-08 03:41:05.024+01
cf901f70-b43e-4403-8687-5abb0f2dd0b5	weekly_digest_theme	minimalist	notifications	\N	1	string	Visual theme for digest emails	2025-07-10 04:42:49.948+01	2025-08-02 20:00:18.985+01
d9c3aa63-a922-4a67-a9d2-76bcec492fd5	weekly_digest_recipients	["06387341-3c22-4119-a68b-309fb1a2dd89"]	notifications	\N	1	json	Array of user IDs who should receive the weekly digest email	2025-07-10 01:25:54.536425+01	2025-08-02 20:00:18.99+01
677f8ad8-b4b9-497c-9b13-32b5f1f2b381	weekly_digest_sections	{"jobMetrics":false,"userMetrics":false,"applicationData":false,"systemHealth":true}	notifications	\N	1	json	Enabled sections for weekly digest	2025-07-10 04:18:27.293+01	2025-08-02 20:00:19+01
9d47011b-9d4c-49e7-947e-781156f24a14	smtp_from_name	Asari Platform	notifications	\N	3	string	Default "from" name for SMTP	2025-07-08 20:08:47.826251+01	2025-08-16 08:59:51.706+01
969b7791-9926-4c80-808a-49e4ec401052	weekly_digest_day	wednesday	notifications	\N	1	string	Day of the week to send the weekly digest (monday, tuesday, etc.)	2025-07-10 01:25:54.536425+01	2025-08-02 20:00:19.008+01
5d6322b6-853c-413d-bbb9-512c48898ba0	smtp_from_email	noreply@sciphr.ca	notifications	\N	3	string	Default "from" email address for SMTP	2025-07-08 20:08:47.826251+01	2025-08-16 08:59:51.71+01
4c93c138-a25d-416d-9149-2ba3b8640391	weekly_digest_enabled	true	notifications	\N	1	boolean	Send weekly summary of applications and job performance	2025-07-08 01:55:11.004+01	2025-08-02 20:00:18.977+01
89a030fd-0535-4732-874c-f35fdcb94e36	site_name	Asari	branding	\N	3	string	Website name displayed in header	2025-07-07 04:25:01.873375+01	2025-08-15 17:47:27.799+01
d3120856-522b-43d9-b029-85f68e0031ae	smtp_username	resend	notifications	\N	3	string	SMTP authentication username	2025-07-08 20:08:47.826251+01	2025-08-16 19:27:43.036+01
7836871e-c527-44ec-b267-7f010655aace	smtp_host	smtp.resend.com	notifications	\N	3	string	SMTP server hostname (e.g., smtp.gmail.com)	2025-07-08 20:08:47.826251+01	2025-08-16 19:26:34.882+01
7ca45203-d751-4649-8d60-83b1c594ff38	track_time_in_stage	true	hiring_pipeline	\N	1	boolean	Track how long candidates spend in each stage	2025-07-13 05:31:35.74771+01	2025-07-13 05:31:35.74771+01
1ce96676-600b-4bd5-b234-f32ca15e299b	ats_sync_enabled	false	hiring_integrations	\N	3	boolean	Sync with external ATS systems	2025-07-13 05:31:35.74771+01	2025-07-13 05:31:35.74771+01
4af9b97d-e9cd-40b9-aedc-349323633e5c	background_check_integration	none	hiring_integrations	\N	3	string	Background check service integration (none, checkr, sterling, goodhire)	2025-07-13 05:31:35.74771+01	2025-07-13 05:31:35.74771+01
b02114c7-b134-4971-bea2-5dc3b21b2c4b	auto_archive_rejected_days	90	hiring_workflow	\N	2	number	Auto-archive rejected applications after X days	2025-07-13 05:31:43.612617+01	2025-07-13 05:31:43.612617+01
482a8e61-c3f4-4270-8ba0-f6384766445d	require_interview_feedback	true	hiring_pipeline	\N	1	boolean	Require feedback notes after interviews	2025-07-13 05:31:43.612617+01	2025-07-13 05:31:43.612617+01
7c35fa42-e799-49ac-9a17-b9d0ff0606de	business_address	1595 Dyer Dr.	system	\N	2	string	Default business address used for in-person interviews. This will pre-fill the location field but can be edited per interview.	2025-07-26 02:43:18.513937+01	2025-07-26 02:48:04.613+01
ec101baf-a005-41ac-865f-97b13cb84b5d	alert_stale_applications_days	30	hiring_pipeline	\N	1	number	Alert when applications have not moved in X days	2025-07-13 05:31:35.74771+01	2025-08-07 02:47:11.211+01
7ba713d4-53cd-4a7b-8aca-7daf1fb5c566	weekly_digest_test_recipients	["06387341-3c22-4119-a68b-309fb1a2dd89"]	notifications	\N	1	json	List of user IDs to receive test digest emails	2025-07-29 20:27:28.187+01	2025-08-02 20:00:18.995+01
545c0ed4-1efa-41ae-b1ac-e09cf05f95eb	require_approval_for_hire	false	hiring_pipeline	\N	2	boolean	Require manager approval before marking as hired	2025-07-13 05:31:35.74771+01	2025-08-07 04:42:21.935+01
04fbccc6-4f48-45a7-8134-03151dd9a66c	enable_workflow_automation	false	hiring_workflow	\N	2	boolean	Enable all workflow automation features	2025-07-13 05:31:43.612617+01	2025-08-05 06:27:31.447+01
512b6c2c-f967-4a12-a5ba-13dbb02fc172	site_color_theme	ocean-blue	branding	\N	2	string	Site color theme palette for public pages	2025-07-28 20:46:35.589205+01	2025-08-10 21:18:21.394+01
ad95d2f3-7d75-4a17-b5fe-229edf1ef389	default_interview_duration	45	hiring_scheduling	\N	1	number	Default interview duration in minutes (30, 45, 60)	2025-07-13 05:31:35.74771+01	2025-08-07 05:15:19.318+01
f9ccaaa1-9e7e-44d0-935b-2eea560ccc13	default_interview_type	phone	hiring_scheduling	\N	1	string	Default interview format (phone, video, in-person)	2025-07-13 05:31:35.74771+01	2025-08-07 05:15:19.324+01
54b2fb77-06cb-42a8-b915-82e3b1e28c6e	candidate_data_retention_years	4	hiring_permissions	\N	3	number	Years to retain candidate data after application closure before deletion	2025-07-13 05:31:35.74771+01	2025-08-08 16:33:06.943+01
d319aced-176f-4584-8d6b-08cfbaaa0724	require_approval_for_job_posting	true	hiring_permissions	\N	3	boolean	Require admin approval before jobs go live	2025-07-13 05:31:35.74771+01	2025-08-08 18:34:49.768+01
68d95af2-34ca-460d-98b6-c8ba73501d9f	analytics_tracking	true	hiring_integrations	\N	2	boolean	Enable detailed hiring analytics and tracking	2025-07-13 05:31:35.74771+01	2025-08-08 21:48:35.502+01
390add09-1ba1-4c5a-b7e3-31113467dc91	saml_field_display_name	displayName	system	\N	2	string	SAML attribute for display      \n  name	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
f2db8f19-7b8d-4f94-94f4-df46431c6421	weekly_digest_customizations	{"jobMetrics":{"newJobs":true,"jobViews":true,"topJobs":true,"lowJobs":true,"jobsByDepartment":true,"featuredJobs":false},"userMetrics":{"newUsers":true,"activeUsers":false,"userGrowth":true,"usersByRole":true,"registrationTrends":true},"applicationData":{"totalApps":true,"applied":true,"reviewing":true,"interview":true,"hired":true,"rejected":false,"appTrends":true,"dailyBreakdown":true,"conversionRates":false,"avgTimeToHire":true},"systemHealth":{"systemStatus":true,"performance":false,"alerts":true,"uptime":false,"errorRates":false,"responseTime":false,"emailPerformance":true,"errorSummary":true}}	notifications	\N	1	json	Customization settings for digest sections	2025-07-10 04:18:27.562+01	2025-08-02 20:00:19.004+01
65dd60a7-40f2-42b8-a013-d20999d95df4	ldap_port	389	system	\N	2	string	\N	2025-08-11 07:10:45.038+01	2025-08-11 07:10:45.038+01
77b0d997-c16d-4322-8252-0e0fd5aea479	ldap_enabled	true	system	\N	2	string	\N	2025-08-11 07:10:45.038+01	2025-08-11 07:10:45.038+01
8ba21124-9b3c-4f09-a33d-b704e4f65a7b	ldap_user_search_base	dc=example,dc=com	system	\N	2	string	\N	2025-08-11 07:10:45.1+01	2025-08-11 07:10:45.1+01
c8a5e89e-b654-421e-9269-58bdd8dcfef3	ldap_server	ldap.forumsys.com	system	\N	2	string	\N	2025-08-11 07:10:45.105+01	2025-08-11 07:10:45.105+01
bc30be48-0bcf-492c-8b7c-cefe1ed48077	ldap_bind_dn	cn=read-only-admin,dc=example,dc=com	system	\N	2	string	\N	2025-08-11 07:10:45.11+01	2025-08-11 07:10:45.11+01
7afa8b9d-18b0-4442-bbcf-b4d0f64898fe	ldap_bind_password	password	system	\N	2	string	\N	2025-08-11 07:10:45.121+01	2025-08-11 07:10:45.121+01
4a3f393c-c563-4def-9ce9-56ca8b9da324	ldap_use_ssl	false	system	\N	2	string	\N	2025-08-11 07:10:45.124+01	2025-08-11 07:10:45.124+01
39e1dc1c-454f-43dd-aa23-790e37f12291	ldap_group_search_base	dc=example,dc=com	system	\N	2	string	\N	2025-08-11 07:10:45.127+01	2025-08-11 07:10:45.127+01
d5c7236f-7a02-4a9b-908c-6a3a7d29863b	ldap_base_dn	dc=example,dc=com	system	\N	2	string	\N	2025-08-11 07:10:45.126+01	2025-08-11 07:10:45.126+01
b326eb42-516b-4497-9643-c09234c3ba0c	saml_field_user_id	login	system	\N	2	string	SAML attribute for unique\n  user ID	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
b38dfac2-e445-40cd-8b65-33a018bad1ba	saml_use_default_fallbacks	true	system	\N	2	string	Try common attribute fallbacks when primary attributes are empty	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
05dac86e-1451-4f24-9dac-d44ca7bc8e73	saml_entity_id	http://www.okta.com/exku3mslqu78Lu2NY697	system	\N	2	string	SAML Entity ID (SP Identifier)	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
ef968c53-1fbc-4c5b-bae3-e7d4fa977fcd	saml_sso_url	https://integrator-5321519.okta.com/app/integrator-5321519_jobsitesamltest_1/exku3mslqu78Lu2NY697/sso/saml	system	\N	2	string	Identity Provider SSO URL	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
d14d59de-a612-4558-866e-a5317184072b	saml_sls_url	https://integrator-5321519.okta.com	system	\N	2	string	Identity Provider Single Logout URL (optional)	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
1328b251-6c77-418b-b720-b8348d68d35c	saml_private_key		system	\N	2	string	Private key for SAML SP (optional for encryption)	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
dad04b1a-8937-45c7-abbc-eff955c13c3b	saml_want_assertions_signed	true	system	\N	2	string	Require signed SAML assertions	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
e2d92a1c-748a-44f4-b2ae-99f1d5972843	saml_want_response_signed	true	system	\N	2	string	Require signed SAML responses	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
fea2c600-8b91-4597-9580-1574838949da	saml_enabled	true	system	\N	2	string	Enable SAML authentication	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
c91311aa-796f-4dda-900b-b2752da93983	saml_field_email	email	system	\N	2	string	SAML attribute for email\n  address	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
3c44c113-53ab-4033-be0c-9a5e2b8fa796	saml_field_phone	http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone	system	\N	2	string	SAML attribute for phone number	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
d3412dc9-a404-4c55-9a05-c77b75306f13	saml_field_last_name	lastName	system	\N	2	string	SAML attribute for last name	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
ad37d88e-af06-430e-bb4b-0bda14be9fd6	saml_field_first_name	firstName	system	\N	2	string	SAML attribute for first name	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
ba53aeab-470e-4f8a-8e19-8055c5932585	saml_certificate	-----BEGIN CERTIFICATE-----\nMIIDtDCCApygAwIBAgIGAZiamhsmMA0GCSqGSIb3DQEBCwUAMIGaMQswCQYDVQQGEwJVUzETMBEG\nA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU\nMBIGA1UECwwLU1NPUHJvdmlkZXIxGzAZBgNVBAMMEmludGVncmF0b3ItNTMyMTUxOTEcMBoGCSqG\nSIb3DQEJARYNaW5mb0Bva3RhLmNvbTAeFw0yNTA4MTExOTI2MjdaFw0zNTA4MTExOTI3MjdaMIGa\nMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNj\nbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxGzAZBgNVBAMMEmludGVncmF0\nb3ItNTMyMTUxOTEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEB\nBQADggEPADCCAQoCggEBALhX5n3ewvL5vt4C0n0U8L74FR9frSGMyj9cRXDolKzm7VzdQGIZZQKm\nrQ8bJEr8QdkOKzH/Tvvwz+f4SnxVHz8PsBqaf+BCNXt48/Xrj0Pr+/EjRnZ4yi2rSWNEKbJiLCe5\nDjyqhZFwssir/pT/SSMPDqIM7g3yQ32WY21atVX8/ouE4l8RgUl+QX6t1KOQq44Zypn+CGaJ+bcX\neW0tiGEhbtNiY1DWIdH/dWURbAoHjsr9EdsJZZQlnrjoo6MDIBuhyvK5zJV5Z4fKCyMLkMKVRKza\nzoTj+qxqAWtBy8FZSlwCziuY2Q4fIubC1+1n3COUQ/ZT4Yuc5/898YcrEzUCAwEAATANBgkqhkiG\n9w0BAQsFAAOCAQEAo0SQjikiv2nJgDwld9KGU06fFZVMIHX7NjCbJ+bdmF0VlDOvJXn1zHERksv5\nK3NiaWVU0mHpezVz3yVv1lukGNj8nu+rg9lVAmIdULxnMpybHai2knEoCaRIY92U0Sa9m+YJvfcP\n3s7if7wHekoLDVbdLWVGXXX5Q1dcjY0jvQlKLtZMhFi207jx8MDnUbzbp2oe80xZ2WLbMHSAybgV\nqqQ9t0xXRW/6ZTdZF9f1j1z1qkwrSZwX5225X1puhj0NtRbNMj67oDTG+ikJU7+SR6Eod2RL820V\nzUYGjbJno2nOgBlsN+E4U9G4LWMt17r9WHcDKdLuSvmV2s8Pyqhd6Q==\n-----END CERTIFICATE-----	system	\N	2	string	X.509 Certificate from Identity Provider	2025-08-11 20:02:39.309924+01	2025-08-11 20:02:39.309924+01
640c1d01-9f5e-4b61-a0c3-976db714dde3	ldap_auto_create_roles	true	authentication	\N	0	boolean	Automatically create roles from LDAP groups during JIT provisioning	2025-08-12 00:28:48.186275+01	2025-08-12 00:28:48.186275+01
ceec1713-729a-4387-a6af-6bb32747c6c4	local_auth_enabled	true	authentication	\N	0	boolean	Enable local username/password\n  authentication	2025-08-11 21:33:36.757348+01	2025-08-11 21:33:36.757348+01
76d8eba5-0ec9-4667-b2b1-cce851295e20	saml_auto_create_roles	true	authentication	\N	0	boolean	Automatically create roles from SAML groups during JIT provisioning	2025-08-12 00:28:48.186275+01	2025-08-12 00:28:48.186275+01
577a7644-2f81-47b0-88e6-84c561f76b14	ldap_default_roles	["User"]	authentication	\N	0	json	Default roles assigned to new LDAP users (JSON array)	2025-08-12 00:28:48.186275+01	2025-08-12 00:28:48.186275+01
19349f55-8d38-4567-9abb-88e31855c2c0	saml_default_roles	["User"]	authentication	\N	0	json	Default roles assigned to new SAML users (JSON array)	2025-08-12 00:28:48.186275+01	2025-08-12 00:28:48.186275+01
c3172f13-eb78-4b8a-83a0-02911ed6d20d	jit_provisioning_enabled	true	authentication	\N	0	boolean	Enable Just-in-Time user provisioning	2025-08-12 00:28:48.186275+01	2025-08-12 00:28:48.186275+01
2db63203-2df8-4cb1-ab39-90044a39992e	saml_metadata_refresh_interval_hours	24	authentication	\N	0	number	Hours between automatic SAML metadata refreshes	2025-08-12 00:29:20.436435+01	2025-08-12 00:29:20.436435+01
dfbc154e-cc21-43de-8077-a06705b3cad9	local_auth_enabled	true	authentication	\N	0	boolean	Enable local username/password authentication	2025-08-12 00:29:20.436435+01	2025-08-12 00:29:20.436435+01
145e7791-458a-419a-bdfb-e2687e1d4e00	ldap_auto_create_roles	true	authentication	\N	0	boolean	Automatically create roles from LDAP groups during JIT provisioning	2025-08-12 03:05:44.053948+01	2025-08-12 03:05:44.053948+01
26948f43-a47e-4223-a6bc-8446291131d4	saml_auto_create_roles	true	authentication	\N	0	boolean	Automatically create roles from SAML groups during JIT provisioning	2025-08-12 03:05:44.053948+01	2025-08-12 03:05:44.053948+01
79ea93db-11c9-4d53-908b-ca13c719d9b6	ldap_default_roles	["User"]	authentication	\N	0	json	Default roles assigned to new LDAP users (JSON array)	2025-08-12 03:05:44.053948+01	2025-08-12 03:05:44.053948+01
9d4651c0-8fe8-4d57-9555-619aed1de8e6	saml_default_roles	["User"]	authentication	\N	0	json	Default roles assigned to new SAML users (JSON array)	2025-08-12 03:05:44.053948+01	2025-08-12 03:05:44.053948+01
d0045e3b-f730-4a77-a902-f486bb6b876b	jit_provisioning_enabled	true	authentication	\N	0	boolean	Enable Just-in-Time user provisioning	2025-08-12 03:05:44.053948+01	2025-08-12 03:05:44.053948+01
cb19852f-d0f5-41f0-bf49-ea55edcddd02	saml_metadata_refresh_interval_hours	24	authentication	\N	0	number	Hours between automatic SAML metadata refreshes	2025-08-12 03:05:44.053948+01	2025-08-12 03:05:44.053948+01
69497c2f-a134-4d31-9cea-ed0cbf78f23c	site_favicon_url	settings/favicons/favicon-1755285294355.ico	branding	\N	2	string	Site favicon image path in storage	2025-08-15 20:15:20.211+01	2025-08-15 20:15:20.211+01
\.


--
-- Data for Name: user_resumes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_resumes (id, user_id, file_name, file_size, file_type, storage_path, is_default, uploaded_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (id, user_id, role_id, assigned_at, assigned_by, is_active) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, "firstName", "lastName", phone, "createdAt", "updatedAt", role, "privilegeLevel", "isActive", is_active, google_access_token, google_refresh_token, google_token_expires_at, google_calendar_id, google_email, calendar_integration_enabled, calendar_integration_connected_at, calendar_timezone, zoom_access_token, zoom_refresh_token, zoom_token_expires_at, zoom_user_id, zoom_email, zoom_integration_enabled, zoom_integration_connected_at, microsoft_access_token, microsoft_refresh_token, microsoft_token_expires_at, microsoft_user_id, microsoft_email, microsoft_tenant_id, microsoft_integration_enabled, microsoft_integration_connected_at, email_notifications_enabled, weekly_digest_enabled, instant_job_alerts_enabled, notification_email, max_daily_notifications, notification_batch_minutes, last_notification_sent_at, account_type, ldap_dn, ldap_groups, ldap_synced_at, mfa_enabled, mfa_secret, mfa_backup_codes, mfa_phone_number, mfa_method, mfa_setup_at, mfa_last_used, mfa_methods_enabled, mfa_totp_secret, mfa_email_enabled) FROM stdin;
\.


--
-- Data for Name: weekly_digests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.weekly_digests (id, week_start, week_end, digest_type, recipient_count, successful_sends, failed_sends, sent_at, sent_by, theme, sections_included, configuration, date_range, status, error_message, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: analytics_configurations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.analytics_configurations_id_seq', 3, true);


--
-- Name: mfa_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mfa_codes_id_seq', 6, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: analytics_configurations analytics_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_configurations
    ADD CONSTRAINT analytics_configurations_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: api_usage_logs api_usage_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_usage_logs
    ADD CONSTRAINT api_usage_logs_pkey PRIMARY KEY (id);


--
-- Name: api_webhook_endpoints api_webhook_endpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_webhook_endpoints
    ADD CONSTRAINT api_webhook_endpoints_pkey PRIMARY KEY (id);


--
-- Name: application_notes application_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_notes
    ADD CONSTRAINT application_notes_pkey PRIMARY KEY (id);


--
-- Name: application_stage_history application_stage_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_stage_history
    ADD CONSTRAINT application_stage_history_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: communication_settings communication_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_settings
    ADD CONSTRAINT communication_settings_key_key UNIQUE (key);


--
-- Name: communication_settings communication_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_settings
    ADD CONSTRAINT communication_settings_pkey PRIMARY KEY (id);


--
-- Name: email_automation_rules email_automation_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_automation_rules
    ADD CONSTRAINT email_automation_rules_pkey PRIMARY KEY (id);


--
-- Name: email_campaigns email_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaigns
    ADD CONSTRAINT email_campaigns_pkey PRIMARY KEY (id);


--
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- Name: emails emails_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT emails_pkey PRIMARY KEY (id);


--
-- Name: hire_approval_requests hire_approval_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hire_approval_requests
    ADD CONSTRAINT hire_approval_requests_pkey PRIMARY KEY (id);


--
-- Name: api_keys idx_api_keys_key_hash; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT idx_api_keys_key_hash UNIQUE (key_hash);


--
-- Name: api_keys idx_api_keys_user_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT idx_api_keys_user_id UNIQUE (user_id);


--
-- Name: interview_reschedule_requests interview_reschedule_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_reschedule_requests
    ADD CONSTRAINT interview_reschedule_requests_pkey PRIMARY KEY (id);


--
-- Name: interview_tokens interview_tokens_acceptance_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_tokens
    ADD CONSTRAINT interview_tokens_acceptance_token_key UNIQUE (acceptance_token);


--
-- Name: interview_tokens interview_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_tokens
    ADD CONSTRAINT interview_tokens_pkey PRIMARY KEY (id);


--
-- Name: interview_tokens interview_tokens_reschedule_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_tokens
    ADD CONSTRAINT interview_tokens_reschedule_token_key UNIQUE (reschedule_token);


--
-- Name: interviews interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_pkey PRIMARY KEY (id);


--
-- Name: job_alert_subscriptions job_alert_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_alert_subscriptions
    ADD CONSTRAINT job_alert_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: job_approval_requests job_approval_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_approval_requests
    ADD CONSTRAINT job_approval_requests_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: mfa_codes mfa_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mfa_codes
    ADD CONSTRAINT mfa_codes_pkey PRIMARY KEY (id);


--
-- Name: notification_logs notification_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_logs
    ADD CONSTRAINT notification_logs_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_resource_action_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_action_key UNIQUE (resource, action);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: saved_jobs saved_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_jobs
    ADD CONSTRAINT saved_jobs_pkey PRIMARY KEY (id);


--
-- Name: settings settings_key_userId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "settings_key_userId_key" UNIQUE (key, "userId");


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: hire_approval_requests unique_pending_hire_request; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hire_approval_requests
    ADD CONSTRAINT unique_pending_hire_request UNIQUE (application_id, status) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: user_roles unique_user_role; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT unique_user_role UNIQUE (user_id, role_id);


--
-- Name: user_resumes user_resumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_resumes
    ADD CONSTRAINT user_resumes_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weekly_digests weekly_digests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_digests
    ADD CONSTRAINT weekly_digests_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: applications_userId_jobId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "applications_userId_jobId_key" ON public.applications USING btree ("userId", "jobId");


--
-- Name: categories_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);


--
-- Name: idx_analytics_config_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_config_status ON public.analytics_configurations USING btree (connection_status);


--
-- Name: idx_api_keys_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_api_keys_active ON public.api_keys USING btree (is_active);


--
-- Name: idx_api_keys_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_api_keys_expires_at ON public.api_keys USING btree (expires_at);


--
-- Name: idx_api_usage_logs_api_key_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_api_usage_logs_api_key_id ON public.api_usage_logs USING btree (api_key_id);


--
-- Name: idx_api_usage_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_api_usage_logs_created_at ON public.api_usage_logs USING btree (created_at);


--
-- Name: idx_api_usage_logs_endpoint; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_api_usage_logs_endpoint ON public.api_usage_logs USING btree (endpoint);


--
-- Name: idx_api_webhook_endpoints_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_api_webhook_endpoints_active ON public.api_webhook_endpoints USING btree (is_active);


--
-- Name: idx_api_webhook_endpoints_api_key_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_api_webhook_endpoints_api_key_id ON public.api_webhook_endpoints USING btree (api_key_id);


--
-- Name: idx_application_notes_interview_feedback; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_application_notes_interview_feedback ON public.application_notes USING btree (application_id, type) WHERE ((type)::text = 'interview_feedback'::text);


--
-- Name: idx_application_notes_metadata_interview_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_application_notes_metadata_interview_id ON public.application_notes USING gin (metadata) WHERE ((type)::text = 'interview_feedback'::text);


--
-- Name: idx_application_stage_history_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_application_stage_history_application_id ON public.application_stage_history USING btree (application_id);


--
-- Name: idx_application_stage_history_entered_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_application_stage_history_entered_at ON public.application_stage_history USING btree (entered_at);


--
-- Name: idx_application_stage_history_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_application_stage_history_stage ON public.application_stage_history USING btree (stage);


--
-- Name: idx_applications_archived_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_applications_archived_status ON public.applications USING btree (is_archived, status);


--
-- Name: idx_applications_is_archived; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_applications_is_archived ON public.applications USING btree (is_archived);


--
-- Name: idx_audit_logs_actor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_actor ON public.audit_logs USING btree (actor_id);


--
-- Name: idx_audit_logs_category_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_category_date ON public.audit_logs USING btree (category, created_at);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: idx_audit_logs_entity_timeline; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_entity_timeline ON public.audit_logs USING btree (entity_type, entity_id, created_at);


--
-- Name: idx_audit_logs_related_application; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_related_application ON public.audit_logs USING btree (related_application_id);


--
-- Name: idx_audit_logs_related_job; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_related_job ON public.audit_logs USING btree (related_job_id);


--
-- Name: idx_audit_logs_related_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_related_user ON public.audit_logs USING btree (related_user_id);


--
-- Name: idx_email_campaigns_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaigns_created_by ON public.email_campaigns USING btree (created_by);


--
-- Name: idx_email_campaigns_job_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaigns_job_id ON public.email_campaigns USING btree (job_id);


--
-- Name: idx_email_templates_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_templates_is_active ON public.email_templates USING btree (is_active);


--
-- Name: idx_email_templates_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_templates_type ON public.email_templates USING btree (type);


--
-- Name: idx_emails_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_emails_application_id ON public.emails USING btree (application_id);


--
-- Name: idx_emails_job_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_emails_job_id ON public.emails USING btree (job_id);


--
-- Name: idx_emails_sent_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_emails_sent_at ON public.emails USING btree (sent_at);


--
-- Name: idx_emails_sent_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_emails_sent_by ON public.emails USING btree (sent_by);


--
-- Name: idx_emails_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_emails_status ON public.emails USING btree (status);


--
-- Name: idx_emails_template_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_emails_template_id ON public.emails USING btree (template_id);


--
-- Name: idx_hire_approval_requests_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hire_approval_requests_application_id ON public.hire_approval_requests USING btree (application_id);


--
-- Name: idx_hire_approval_requests_requested_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hire_approval_requests_requested_at ON public.hire_approval_requests USING btree (requested_at);


--
-- Name: idx_hire_approval_requests_requested_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hire_approval_requests_requested_by ON public.hire_approval_requests USING btree (requested_by);


--
-- Name: idx_hire_approval_requests_reviewed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hire_approval_requests_reviewed_by ON public.hire_approval_requests USING btree (reviewed_by);


--
-- Name: idx_hire_approval_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hire_approval_requests_status ON public.hire_approval_requests USING btree (status);


--
-- Name: idx_interview_reschedule_requests_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_reschedule_requests_application_id ON public.interview_reschedule_requests USING btree (application_id);


--
-- Name: idx_interview_reschedule_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_reschedule_requests_status ON public.interview_reschedule_requests USING btree (status);


--
-- Name: idx_interview_reschedule_requests_submitted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_reschedule_requests_submitted_at ON public.interview_reschedule_requests USING btree (submitted_at);


--
-- Name: idx_interview_reschedule_requests_token_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_reschedule_requests_token_id ON public.interview_reschedule_requests USING btree (interview_token_id);


--
-- Name: idx_interview_tokens_acceptance_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_tokens_acceptance_token ON public.interview_tokens USING btree (acceptance_token);


--
-- Name: idx_interview_tokens_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_tokens_application_id ON public.interview_tokens USING btree (application_id);


--
-- Name: idx_interview_tokens_completed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_tokens_completed_at ON public.interview_tokens USING btree (completed_at);


--
-- Name: idx_interview_tokens_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_tokens_expires_at ON public.interview_tokens USING btree (expires_at);


--
-- Name: idx_interview_tokens_is_completed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_tokens_is_completed ON public.interview_tokens USING btree (is_completed);


--
-- Name: idx_interview_tokens_reschedule_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_tokens_reschedule_token ON public.interview_tokens USING btree (reschedule_token);


--
-- Name: idx_interview_tokens_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interview_tokens_status ON public.interview_tokens USING btree (status);


--
-- Name: idx_interviews_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interviews_application_id ON public.interviews USING btree (application_id);


--
-- Name: idx_interviews_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interviews_created_at ON public.interviews USING btree (created_at);


--
-- Name: idx_interviews_interviewer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interviews_interviewer_id ON public.interviews USING btree (interviewer_id);


--
-- Name: idx_interviews_job_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interviews_job_id ON public.interviews USING btree (job_id);


--
-- Name: idx_interviews_scheduled_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interviews_scheduled_at ON public.interviews USING btree (scheduled_at);


--
-- Name: idx_interviews_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_interviews_status ON public.interviews USING btree (status);


--
-- Name: idx_job_alerts_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_alerts_active ON public.job_alert_subscriptions USING btree (is_active);


--
-- Name: idx_job_alerts_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_alerts_created ON public.job_alert_subscriptions USING btree (created_at);


--
-- Name: idx_job_alerts_department; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_alerts_department ON public.job_alert_subscriptions USING btree (department);


--
-- Name: idx_job_alerts_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_alerts_type ON public.job_alert_subscriptions USING btree (alert_type);


--
-- Name: idx_job_alerts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_alerts_user_id ON public.job_alert_subscriptions USING btree (user_id);


--
-- Name: idx_job_approval_requests_job_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_approval_requests_job_id ON public.job_approval_requests USING btree (job_id);


--
-- Name: idx_job_approval_requests_requested_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_approval_requests_requested_at ON public.job_approval_requests USING btree (requested_at);


--
-- Name: idx_job_approval_requests_requested_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_approval_requests_requested_by ON public.job_approval_requests USING btree (requested_by);


--
-- Name: idx_job_approval_requests_reviewed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_approval_requests_reviewed_by ON public.job_approval_requests USING btree (reviewed_by);


--
-- Name: idx_job_approval_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_approval_requests_status ON public.job_approval_requests USING btree (status);


--
-- Name: idx_jobs_auto_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_jobs_auto_expires_at ON public.jobs USING btree ("autoExpiresAt") WHERE (("autoExpiresAt" IS NOT NULL) AND (status = 'Active'::text));


--
-- Name: idx_notification_logs_batch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_logs_batch_id ON public.notification_logs USING btree (batch_id);


--
-- Name: idx_notification_logs_sent_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_logs_sent_at ON public.notification_logs USING btree (sent_at);


--
-- Name: idx_notification_logs_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_logs_type ON public.notification_logs USING btree (notification_type);


--
-- Name: idx_notification_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_logs_user_id ON public.notification_logs USING btree (user_id);


--
-- Name: idx_permissions_resource_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permissions_resource_action ON public.permissions USING btree (resource, action);


--
-- Name: idx_role_permissions_permission_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions USING btree (permission_id);


--
-- Name: idx_role_permissions_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_permissions_role_id ON public.role_permissions USING btree (role_id);


--
-- Name: idx_roles_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_roles_active ON public.roles USING btree (is_active);


--
-- Name: idx_roles_ldap; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_roles_ldap ON public.roles USING btree (is_ldap_role);


--
-- Name: idx_user_resumes_default; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_resumes_default ON public.user_resumes USING btree (user_id, is_default);


--
-- Name: idx_user_resumes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_resumes_user_id ON public.user_resumes USING btree (user_id);


--
-- Name: idx_user_roles_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_active ON public.user_roles USING btree (is_active);


--
-- Name: idx_user_roles_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_role_id ON public.user_roles USING btree (role_id);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: idx_users_account_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_account_type ON public.users USING btree (account_type);


--
-- Name: idx_users_mfa_methods; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_mfa_methods ON public.users USING gin (mfa_methods_enabled);


--
-- Name: idx_weekly_digests_sent_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weekly_digests_sent_at ON public.weekly_digests USING btree (sent_at);


--
-- Name: idx_weekly_digests_sent_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weekly_digests_sent_by ON public.weekly_digests USING btree (sent_by);


--
-- Name: idx_weekly_digests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weekly_digests_status ON public.weekly_digests USING btree (status);


--
-- Name: idx_weekly_digests_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weekly_digests_type ON public.weekly_digests USING btree (digest_type);


--
-- Name: idx_weekly_digests_week_start; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weekly_digests_week_start ON public.weekly_digests USING btree (week_start);


--
-- Name: jobs_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX jobs_slug_key ON public.jobs USING btree (slug);


--
-- Name: saved_jobs_userId_jobId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "saved_jobs_userId_jobId_key" ON public.saved_jobs USING btree ("userId", "jobId");


--
-- Name: unique_pending_job_request; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_pending_job_request ON public.job_approval_requests USING btree (job_id, status) WHERE ((status)::text = 'pending'::text);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: hire_approval_requests trg_hire_approval_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hire_approval_updated_at BEFORE UPDATE ON public.hire_approval_requests FOR EACH ROW EXECUTE FUNCTION public.update_hire_approval_updated_at();


--
-- Name: analytics_configurations update_analytics_configurations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_analytics_configurations_updated_at BEFORE UPDATE ON public.analytics_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: job_alert_subscriptions update_job_alert_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_job_alert_subscriptions_updated_at BEFORE UPDATE ON public.job_alert_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: api_keys api_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: api_usage_logs api_usage_logs_api_key_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_usage_logs
    ADD CONSTRAINT api_usage_logs_api_key_id_fkey FOREIGN KEY (api_key_id) REFERENCES public.api_keys(id) ON DELETE CASCADE;


--
-- Name: api_webhook_endpoints api_webhook_endpoints_api_key_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_webhook_endpoints
    ADD CONSTRAINT api_webhook_endpoints_api_key_id_fkey FOREIGN KEY (api_key_id) REFERENCES public.api_keys(id) ON DELETE CASCADE;


--
-- Name: application_stage_history application_stage_history_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_stage_history
    ADD CONSTRAINT application_stage_history_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- Name: application_stage_history application_stage_history_changed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_stage_history
    ADD CONSTRAINT application_stage_history_changed_by_user_id_fkey FOREIGN KEY (changed_by_user_id) REFERENCES public.users(id);


--
-- Name: applications applications_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: applications applications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: email_automation_rules email_automation_rules_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_automation_rules
    ADD CONSTRAINT email_automation_rules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: email_campaigns email_campaigns_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaigns
    ADD CONSTRAINT email_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: email_campaigns email_campaigns_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaigns
    ADD CONSTRAINT email_campaigns_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: emails emails_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT emails_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id);


--
-- Name: emails emails_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT emails_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.email_campaigns(id);


--
-- Name: emails emails_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT emails_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: emails emails_sent_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT emails_sent_by_fkey FOREIGN KEY (sent_by) REFERENCES public.users(id);


--
-- Name: applications fk_applications_archived_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT fk_applications_archived_by FOREIGN KEY (archived_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: audit_logs fk_audit_logs_actor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: audit_logs fk_audit_logs_related_application; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT fk_audit_logs_related_application FOREIGN KEY (related_application_id) REFERENCES public.applications(id) ON DELETE SET NULL;


--
-- Name: audit_logs fk_audit_logs_related_job; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT fk_audit_logs_related_job FOREIGN KEY (related_job_id) REFERENCES public.jobs(id) ON DELETE SET NULL;


--
-- Name: audit_logs fk_audit_logs_related_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT fk_audit_logs_related_user FOREIGN KEY (related_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: email_templates fk_email_templates_created_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT fk_email_templates_created_by FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: hire_approval_requests fk_hire_approval_application; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hire_approval_requests
    ADD CONSTRAINT fk_hire_approval_application FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- Name: hire_approval_requests fk_hire_approval_requested_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hire_approval_requests
    ADD CONSTRAINT fk_hire_approval_requested_by FOREIGN KEY (requested_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: hire_approval_requests fk_hire_approval_reviewed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hire_approval_requests
    ADD CONSTRAINT fk_hire_approval_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: interview_reschedule_requests fk_interview_reschedule_requests_application; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_reschedule_requests
    ADD CONSTRAINT fk_interview_reschedule_requests_application FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- Name: interview_reschedule_requests fk_interview_reschedule_requests_reviewer; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_reschedule_requests
    ADD CONSTRAINT fk_interview_reschedule_requests_reviewer FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: interview_reschedule_requests fk_interview_reschedule_requests_token; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_reschedule_requests
    ADD CONSTRAINT fk_interview_reschedule_requests_token FOREIGN KEY (interview_token_id) REFERENCES public.interview_tokens(id) ON DELETE CASCADE;


--
-- Name: interview_tokens fk_interview_tokens_application; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_tokens
    ADD CONSTRAINT fk_interview_tokens_application FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- Name: job_approval_requests fk_job_approval_job; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_approval_requests
    ADD CONSTRAINT fk_job_approval_job FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: job_approval_requests fk_job_approval_requested_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_approval_requests
    ADD CONSTRAINT fk_job_approval_requested_by FOREIGN KEY (requested_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: job_approval_requests fk_job_approval_reviewed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_approval_requests
    ADD CONSTRAINT fk_job_approval_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: notification_logs fk_notification_logs_job_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_logs
    ADD CONSTRAINT fk_notification_logs_job_id FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: notification_logs fk_notification_logs_subscription_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_logs
    ADD CONSTRAINT fk_notification_logs_subscription_id FOREIGN KEY (subscription_id) REFERENCES public.job_alert_subscriptions(id) ON DELETE CASCADE;


--
-- Name: notification_logs fk_notification_logs_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_logs
    ADD CONSTRAINT fk_notification_logs_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_roles fk_user_roles_role_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fk_user_roles_role_id FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles fk_user_roles_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fk_user_roles_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: weekly_digests fk_weekly_digests_sent_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_digests
    ADD CONSTRAINT fk_weekly_digests_sent_by FOREIGN KEY (sent_by) REFERENCES public.users(id);


--
-- Name: interviews interviews_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- Name: interviews interviews_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: interviews interviews_interviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_interviewer_id_fkey FOREIGN KEY (interviewer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: interviews interviews_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: job_alert_subscriptions job_alert_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_alert_subscriptions
    ADD CONSTRAINT job_alert_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: jobs jobs_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "jobs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: jobs jobs_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "jobs_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mfa_codes mfa_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mfa_codes
    ADD CONSTRAINT mfa_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_granted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: roles roles_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: saved_jobs saved_jobs_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_jobs
    ADD CONSTRAINT "saved_jobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: saved_jobs saved_jobs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_jobs
    ADD CONSTRAINT "saved_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: settings settings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_resumes user_resumes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_resumes
    ADD CONSTRAINT user_resumes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- PostgreSQL database dump complete
--

