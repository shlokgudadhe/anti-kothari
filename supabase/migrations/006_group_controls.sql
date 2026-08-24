-- Adds controls only. Existing rows and financial data are unchanged.
create policy "member leaves group" on public.group_members
  for delete using (user_id = auth.uid());

create policy "creator deletes group" on public.groups
  for delete using (created_by = auth.uid());

create or replace function public.update_my_name(new_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if char_length(trim(new_name)) < 1 or char_length(trim(new_name)) > 80 then
    raise exception 'Name must be between 1 and 80 characters';
  end if;
  update public.profiles set full_name = trim(new_name) where id = auth.uid();
end;
$$;
grant execute on function public.update_my_name(text) to authenticated;
