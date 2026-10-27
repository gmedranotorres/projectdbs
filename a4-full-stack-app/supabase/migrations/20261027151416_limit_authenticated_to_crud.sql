-- The project's default privileges also gave authenticated TRUNCATE, REFERENCES
-- and TRIGGER on new tables. TRUNCATE ignores row-level security, so keep
-- signed-in users to select, insert, update and delete.
revoke truncate, references, trigger on table public.applications from authenticated;
revoke truncate, references, trigger on table public.user_settings from authenticated;
