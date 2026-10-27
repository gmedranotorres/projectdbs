-- One row of settings per signed-in Clerk user.

create table public.user_settings (
  user_id text primary key default auth.jwt()->>'sub',
  weekly_goal integer not null default 3
    check (weekly_goal > 0),
  goal_chosen boolean not null default false,
  last_check_in_on date,
  -- 0 is Sunday, 6 Saturday; Monday by default.
  check_in_day smallint not null default 1
    check (check_in_day between 0 and 6),
  dismissed_hints text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

-- Not exposed automatically: only signed-in users get access, never anon.
revoke all on table public.user_settings from anon, public;
grant select, insert, update, delete on table public.user_settings to authenticated;

create policy "Users can read their own settings"
  on public.user_settings for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

create policy "Users can add their own settings"
  on public.user_settings for insert to authenticated
  with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users can change their own settings"
  on public.user_settings for update to authenticated
  using ((select auth.jwt()->>'sub') = user_id)
  with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users can delete their own settings"
  on public.user_settings for delete to authenticated
  using ((select auth.jwt()->>'sub') = user_id);
