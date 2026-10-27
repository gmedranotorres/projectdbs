-- "Interested": a job saved from Find jobs, not applied to yet. It's open,
-- so it has a follow-up date. applied_on holds the day it was saved until
-- the person applies.
alter table public.applications drop constraint applications_status_check;
alter table public.applications add constraint applications_status_check
  check (status in ('interested', 'applied', 'followed-up', 'interviewing', 'offer',
                    'rejected', 'withdrawn', 'no-response'));

alter table public.applications drop constraint applications_no_follow_up_when_closed;
alter table public.applications add constraint applications_no_follow_up_when_closed
  check (next_follow_up is null
         or status in ('interested', 'applied', 'followed-up', 'interviewing', 'offer'));
