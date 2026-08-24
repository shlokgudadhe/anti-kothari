create or replace function public.dashboard_totals() returns table(group_id uuid, group_name text, owed numeric, owing numeric) language sql stable security definer set search_path=public as $$
  select g.id, g.name,
    coalesce((select sum(e.amount) from expenses e where e.group_id=g.id and e.paid_by=auth.uid()),0)
      + coalesce((select sum(s.amount) from settlements s where s.group_id=g.id and s.paid_by=auth.uid()),0) as owed,
    coalesce((select sum(es.amount) from expense_splits es join expenses e on e.id=es.expense_id where e.group_id=g.id and es.user_id=auth.uid()),0)
      + coalesce((select sum(s.amount) from settlements s where s.group_id=g.id and s.paid_to=auth.uid()),0) as owing
  from groups g join group_members gm on gm.group_id=g.id where gm.user_id=auth.uid();
$$;
grant execute on function public.dashboard_totals() to authenticated;
