-- Deliberately broken, to check that tests/isolation.spec.ts fails:
-- every signed-in user can read every application.
drop policy "Users can read their own applications" on public.applications;

create policy "Anyone signed in can read every application"
  on public.applications for select to authenticated
  using (true);
