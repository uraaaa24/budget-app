# Backend

## Environment variables

Only these environment variables are used:

- `API_URL` (required)
- `SUPABASE_URL` (optional)
- `SUPABASE_SERVICE_ROLE_KEY` (optional)

If both Supabase variables are set, backend uses Supabase.
If either is missing, it falls back to the in-memory repository.

Copy `apps/backend/.env.example` and set your values.

## Supabase table

Table names are managed in code constants: `src/infrastructure/supabase/constants.ts`.

Current required table:

```sql
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('expense', 'income')),
  amount double precision not null,
  category text not null,
  memo text null,
  spent_at timestamptz not null,
  created_at timestamptz not null default now()
);
```
