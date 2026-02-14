create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id text null,
  name text not null,
  type text not null check (type in ('expense', 'income')),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx
  on public.categories (user_id);

create index if not exists categories_type_idx
  on public.categories (type);

create index if not exists categories_created_at_idx
  on public.categories (created_at desc);

create or replace function public.set_categories_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;

create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_categories_updated_at();

insert into public.categories (name, type, is_default)
select seed.name, seed.type, true
from (
  values
    ('Food', 'expense'),
    ('Housing', 'expense'),
    ('Transportation', 'expense'),
    ('Utilities', 'expense'),
    ('Healthcare', 'expense'),
    ('Entertainment', 'expense'),
    ('Shopping', 'expense'),
    ('Salary', 'income'),
    ('Bonus', 'income'),
    ('Freelance', 'income'),
    ('Investment', 'income'),
    ('Other Income', 'income')
) as seed(name, type)
where not exists (
  select 1
  from public.categories c
  where c.user_id is null
    and c.name = seed.name
    and c.type = seed.type
);
