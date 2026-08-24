-- Supports dashboard_totals() and the group screens without scanning tables.
create index if not exists group_members_user_group_idx on public.group_members(user_id, group_id);
create index if not exists expenses_group_payer_idx on public.expenses(group_id, paid_by);
create index if not exists settlements_group_payer_idx on public.settlements(group_id, paid_by);
create index if not exists settlements_group_payee_idx on public.settlements(group_id, paid_to);
create index if not exists expense_splits_user_idx on public.expense_splits(user_id, expense_id);
