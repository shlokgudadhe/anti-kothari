drop policy if exists "group expense add" on public.expenses;
create policy "group expense add" on public.expenses
  for insert
  with check (
    approved()
    and in_group(group_id)
    and created_by = auth.uid()
    and exists (
      select 1 from public.group_members
      where group_id = expenses.group_id and user_id = expenses.paid_by
    )
  );
