-- The insert policy counted rows in the table it protects, which Postgres refuses
-- as infinite recursion, so nobody could follow a station. The policy now only
-- checks whose row it is, and a trigger enforces the cap of 20.
alter policy "People add their own follows, up to 20" on public.followed_stations
  rename to "People add their own follows";

alter policy "People add their own follows" on public.followed_stations
  with check ((select auth.jwt()->>'sub') = user_id);

-- Runs as the person inserting, so row-level security limits the count to their
-- own rows. The cap keeps each person inside Realtime's limit on filter values.
create function public.limit_followed_stations()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.followed_stations where user_id = new.user_id) >= 20 then
    raise exception 'You can follow up to 20 stations.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger limit_followed_stations
  before insert on public.followed_stations
  for each row execute function public.limit_followed_stations();

revoke execute on function public.limit_followed_stations() from public, anon;
