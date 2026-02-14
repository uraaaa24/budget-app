# Backend

## Environment variables

- `API_URL` (required)
- `CLERK_SECRET_KEY` (required)
- `DATABASE_URL` (required)

## Auth

All transaction endpoints require Clerk session token via:

- `Authorization: Bearer <token>`

The backend verifies the token and uses `sub` as `user_id`.

## Supabase table

Table names are managed in code constants: `src/infrastructure/database/schema/constants.ts`.

## Migrations

Supabase migrations are managed under `supabase/migrations`.

- `pnpm db:start`: start local Supabase stack
- `pnpm db:reset`: apply migrations + seed to local DB
- `pnpm db:push`: apply migrations to linked project
- `pnpm db:migration:new <name>`: create a new migration file

## Drizzle

Drizzle is used for runtime DB access in backend.

- `pnpm --filter backend orm:generate`: generate SQL migration from Drizzle schema
- `pnpm --filter backend orm:push`: push schema directly (development only)
- `pnpm --filter backend orm:studio`: open Drizzle Studio
