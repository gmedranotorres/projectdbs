-- Assignment 5: the live data system's tables. Seguimiento's tables aren't touched.

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- One row per Divvy station. Only the worker writes; any signed-in person reads.
create table public.divvy_stations (
  station_id text primary key,
  name text not null,
  lat double precision not null,
  lon double precision not null,
  capacity integer,
  bikes integer not null check (bikes >= 0),
  ebikes integer not null check (ebikes >= 0),
  docks integer not null check (docks >= 0),
  is_installed boolean not null,
  is_renting boolean not null,
  is_returning boolean not null,
  changed_at timestamptz not null default now()
);

-- One row per worker run, including runs that failed or changed nothing.
create table public.worker_runs (
  id bigint generated always as identity primary key,
  ran_at timestamptz not null default now(),
  ok boolean not null,
  source_changed boolean not null default false,
  rows_changed integer not null default 0,
  stations_seen integer,
  source_updated_at timestamptz,
  source_etag text,
  duration_ms integer,
  error text
);
create index worker_runs_ran_at_idx on public.worker_runs (ran_at desc);

-- Who follows which station. The browser never sends user_id: the database
-- fills it in from the Clerk token.
create table public.followed_stations (
  user_id text not null default auth.jwt()->>'sub',
  station_id text not null references public.divvy_stations (station_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, station_id)
);
create index followed_stations_station_id_idx on public.followed_stations (station_id);

alter table public.divvy_stations enable row level security;
alter table public.worker_runs enable row level security;
alter table public.followed_stations enable row level security;

create policy "Signed-in people can read stations"
  on public.divvy_stations for select to authenticated using (true);

create policy "Signed-in people can read worker runs"
  on public.worker_runs for select to authenticated using (true);

create policy "People read their own follows"
  on public.followed_stations for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

-- The cap keeps each person inside Realtime's limit on filter values.
create policy "People add their own follows, up to 20"
  on public.followed_stations for insert to authenticated
  with check (
    (select auth.jwt()->>'sub') = user_id
    and (select count(*) from public.followed_stations f
         where f.user_id = (select auth.jwt()->>'sub')) < 20
  );

create policy "People remove their own follows"
  on public.followed_stations for delete to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

-- The project's default privileges grant far too much, including TRUNCATE,
-- which ignores row-level security. Start from nothing and grant only what's needed.
revoke all on table public.divvy_stations, public.worker_runs, public.followed_stations
  from anon, authenticated;
grant select on table public.divvy_stations, public.worker_runs to authenticated;
grant select, insert, delete on table public.followed_stations to authenticated;
grant select, insert, update, delete on table public.divvy_stations, public.worker_runs to service_role;

-- Realtime pushes changes to these two. Follows aren't live: only the page that
-- changes them needs to know.
alter publication supabase_realtime add table public.divvy_stations, public.worker_runs;

-- The private token Cron sends. It's generated here and kept in Vault, so it
-- never appears in code, logs or this conversation.
select vault.create_secret(
  encode(extensions.gen_random_bytes(32), 'hex'),
  'worker_token',
  'Sent by Cron to the divvy-worker Edge Function'
);

create function public.worker_token_is_valid(candidate text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from vault.decrypted_secrets
    where name = 'worker_token' and decrypted_secret = candidate
  );
$$;
revoke execute on function public.worker_token_is_valid(text) from public, anon, authenticated;
grant execute on function public.worker_token_is_valid(text) to service_role;
