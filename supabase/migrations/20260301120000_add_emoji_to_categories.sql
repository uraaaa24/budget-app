alter table public.categories
  add column if not exists emoji text not null default '🏷️';

update public.categories
set emoji = case
  when type = 'expense' and name = 'Food' then '🍔'
  when type = 'expense' and name = 'Housing' then '🏠'
  when type = 'expense' and name = 'Transportation' then '🚆'
  when type = 'expense' and name = 'Utilities' then '💡'
  when type = 'expense' and name = 'Healthcare' then '🏥'
  when type = 'expense' and name = 'Entertainment' then '🎬'
  when type = 'expense' and name = 'Shopping' then '🛍️'
  when type = 'income' and name = 'Salary' then '💼'
  when type = 'income' and name = 'Bonus' then '🎁'
  when type = 'income' and name = 'Freelance' then '💻'
  when type = 'income' and name = 'Investment' then '📈'
  when type = 'income' and name = 'Other Income' then '✨'
  else emoji
end;
