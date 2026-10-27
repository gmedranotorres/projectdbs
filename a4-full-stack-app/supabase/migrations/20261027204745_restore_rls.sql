-- Undoes break_rls: each person reads only their own applications again.
drop policy "Anyone signed in can read every application" on public.applications;

create policy "Users can read their own applications"
  on public.applications for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);
