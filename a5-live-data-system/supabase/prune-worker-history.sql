-- Run once in the Supabase SQL editor. Not a migration, and not applied by Claude:
-- Supabase's tool declined it, most likely because it contains DELETE statements.
--
-- At 8,640 runs a day, the history would keep growing. This keeps a week of runs
-- and a day of Cron's own records, checking once an hour.
select cron.schedule(
  'prune-worker-history',
  '7 * * * *',
  $$
  delete from public.worker_runs where ran_at < now() - interval '7 days';
  delete from cron.job_run_details where end_time < now() - interval '1 day';
  $$
);
