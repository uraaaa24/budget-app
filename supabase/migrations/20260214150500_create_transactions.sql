create extension if not exists pgcrypto;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('expense', 'income')),
  amount double precision not null,
  category text not null,
  memo text null,
  spent_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists transactions_spent_at_idx
  on public.transactions (spent_at desc);

create index if not exists transactions_created_at_idx
  on public.transactions (created_at desc);
