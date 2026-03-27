-- Add Subscription category to default categories
insert into public.categories (name, type, emoji, is_default)
select 'Subscription', 'expense', '🔄', true
where not exists (
  select 1
  from public.categories c
  where c.user_id is null
    and c.name = 'Subscription'
    and c.type = 'expense'
);
