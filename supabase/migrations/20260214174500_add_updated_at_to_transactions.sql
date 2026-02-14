alter table public.transactions
  add column if not exists updated_at timestamptz not null default now();

-- Keep updated_at in sync for future update queries.
create or replace function public.set_transactions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_transactions_updated_at on public.transactions;

create trigger set_transactions_updated_at
before update on public.transactions
for each row
execute function public.set_transactions_updated_at();
