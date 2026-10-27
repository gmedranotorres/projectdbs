-- One row per job application, owned by the signed-in Clerk user.
-- Clerk is Supabase's third-party auth provider, so auth.jwt()->>'sub' is the Clerk user id.

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default auth.jwt()->>'sub',
  company text not null,
  role text not null default '',
  job_url text not null default '',
  source text not null default 'manual'
    check (source in ('manual', 'muse')),
  muse_job_id bigint,
  status text not null
    check (status in ('applied', 'followed-up', 'interviewing', 'offer',
                      'rejected', 'withdrawn', 'no-response')),
  sponsorship text not null default 'unknown'
    check (sponsorship in ('sponsors', 'doesnt_sponsor', 'unknown')),
  applied_on date not null,
  interview_on date,
  next_follow_up date,
  contact text not null default '',
  notes text not null default '',
  last_touched_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- muse_job_id is set only for jobs found through The Muse.
  constraint applications_muse_job_id_only_for_muse
    check (muse_job_id is null or source = 'muse'),
  -- An interview date only while interviewing.
  constraint applications_interview_on_only_while_interviewing
    check (interview_on is null or status = 'interviewing'),
  -- No follow-up date once the application is closed.
  constraint applications_no_follow_up_when_closed
    check (next_follow_up is null or status in ('applied', 'followed-up', 'interviewing', 'offer')),
  -- The same Muse job can be saved only once per person. Also serves as the
  -- user_id index the row-level security policies filter on.
  constraint applications_user_muse_job_unique unique (user_id, muse_job_id)
);

alter table public.applications enable row level security;

-- Not exposed automatically: only signed-in users get access, never anon.
revoke all on table public.applications from anon, public;
grant select, insert, update, delete on table public.applications to authenticated;

create policy "Users can read their own applications"
  on public.applications for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

create policy "Users can add their own applications"
  on public.applications for insert to authenticated
  with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users can change their own applications"
  on public.applications for update to authenticated
  using ((select auth.jwt()->>'sub') = user_id)
  with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users can delete their own applications"
  on public.applications for delete to authenticated
  using ((select auth.jwt()->>'sub') = user_id);
