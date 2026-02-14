alter table public.transactions
  add column if not exists user_id text;

update public.transactions
set user_id = 'legacy'
where user_id is null;

alter table public.transactions
  alter column user_id set not null;

create index if not exists transactions_user_id_idx
  on public.transactions (user_id);
