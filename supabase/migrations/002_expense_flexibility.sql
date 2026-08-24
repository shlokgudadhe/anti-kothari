alter table public.expenses add column if not exists category text not null default 'Other';
alter table public.expenses add column if not exists notes text;
alter table public.expenses add column if not exists expense_date date not null default current_date;
alter table public.expenses add column if not exists updated_at timestamptz not null default now();
create index if not exists expenses_group_date_idx on public.expenses(group_id, expense_date desc);
create policy "group expense update" on public.expenses for update using(in_group(group_id) and created_by=auth.uid()) with check(in_group(group_id) and created_by=auth.uid());
create policy "group expense delete" on public.expenses for delete using(in_group(group_id) and created_by=auth.uid());
create policy "split update" on public.expense_splits for update using(exists(select 1 from expenses where id=expense_id and created_by=auth.uid()));
create policy "split delete" on public.expense_splits for delete using(exists(select 1 from expenses where id=expense_id and created_by=auth.uid()));
