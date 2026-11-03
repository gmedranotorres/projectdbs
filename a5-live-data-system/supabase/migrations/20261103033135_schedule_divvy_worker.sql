-- Run the worker every 10 seconds. The token is read from Vault at call time,
-- so it isn't stored in the job's text.
select cron.schedule(
  'divvy-worker-every-10-seconds',
  '10 seconds',
  $$
  select net.http_post(
    url := 'https://scmomjrdcdrrhzcfqahk.supabase.co/functions/v1/divvy-worker',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-worker-token', (select decrypted_secret from vault.decrypted_secrets where name = 'worker_token')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  );
  $$
);
