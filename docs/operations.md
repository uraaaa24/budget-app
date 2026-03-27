# Operations Guide

Day-to-day operations and workflows for the Budget App.

## Daily Development Workflow

### Starting Local Development

```sh
# 1. Start database
pnpm run db:start

# 2. Start backend and frontend
pnpm run dev

# Backend runs on: http://localhost:8787
# Frontend runs on: http://localhost:3000
```

### Stopping Services

```sh
# Stop database and Docker
pnpm run db:stop
```

## Database Operations

### Migration Workflow

**Source of Truth**: `supabase/migrations/` directory

#### Creating a New Migration

```sh
# Create new migration file
pnpm run db:migration:new <migration_name>

# Example
pnpm run db:migration:new add_budget_table
```

This creates: `supabase/migrations/YYYYMMDDHHMMSS_<migration_name>.sql`

#### Writing Migration

Edit the generated SQL file:

```sql
-- Example: supabase/migrations/20260328120000_add_budget_table.sql

CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
```

#### Testing Migration Locally

```sh
# Reset database (runs all migrations + seed)
pnpm run db:reset

# Or apply new migrations only
pnpm run db:push:local
```

#### Applying to Production

```sh
# Link to Supabase project (one-time setup)
supabase link --project-ref <your-project-ref>

# Push migrations to production
supabase db push
```

**Important**: Always test locally first before pushing to production.

### Drizzle ORM vs Supabase Migrations

- **Supabase Migrations**: Source of truth, SQL files in `supabase/migrations/`
- **Drizzle ORM**: Query builder and type generator

**Workflow**:
1. Write SQL migration in `supabase/migrations/`
2. Apply migration locally: `pnpm run db:reset`
3. Update Drizzle schema if needed: `apps/backend/src/infrastructure/database/schema/`
4. Generate Drizzle types (if schema changed): `pnpm --filter backend run orm:generate`
5. Apply to production: `supabase db push`

**Do NOT use**:
- `pnpm run orm:push` in production (bypasses migration history)
- Schema drift between Supabase and Drizzle

### Viewing Database

```sh
# Open Drizzle Studio (local database)
pnpm --filter backend run orm:studio

# Or use Supabase Studio (local)
pnpm run db:start:full
# Then visit: http://localhost:54323

# Production database
# Visit Supabase Dashboard → Table Editor
```

### Seeding Data

Edit `supabase/seed.sql` and run:

```sh
pnpm run db:reset
```

## Deployment Workflows

### Frontend-Only Changes

```sh
# Make changes to apps/web
git add .
git commit -m "feat(web): ..."
git push origin main
```

Vercel automatically deploys.

### Backend-Only Changes

```sh
# Make changes to apps/backend
cd apps/backend

# Test locally
pnpm run dev

# Deploy to production
pnpm run deploy
```

**Note**: Backend deployment is manual.

### Database Schema Changes

See "Migration Workflow" above.

After deploying migration:
1. Restart backend if needed (Cloudflare Workers: automatic)
2. Verify frontend still works

### Full Stack Changes

1. Deploy database migration first
2. Deploy backend
3. Push frontend (Vercel auto-deploys)

**Critical**: Always deploy in this order to avoid breaking changes.

## Environment Variable Updates

### Local

**Backend**:
- Edit `apps/backend/.dev.vars`
- Restart `pnpm run dev`

**Frontend**:
- Edit `apps/web/.env.local`
- Restart `pnpm run dev`

### Production

**Backend (Cloudflare Workers)**:
```sh
cd apps/backend
wrangler secret put VARIABLE_NAME
```

**Frontend (Vercel)**:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Update value
3. Redeploy (Deployments → ... → Redeploy)

## Troubleshooting

### Backend Issues

**"Module not found" or import errors**:
```sh
cd apps/backend
pnpm install
pnpm run check-types
```

**Database connection errors locally**:
```sh
# Check database is running
pnpm run db:status

# Restart database
pnpm run db:stop
pnpm run db:start
```

**Database connection errors in production**:
- Check Supabase project is not paused (free tier pauses after 7 days inactivity)
- Verify `DATABASE_URL` secret in Cloudflare Workers
- Check Supabase Dashboard → Settings → Database → Connection pooling

### Frontend Issues

**API connection errors**:
- Verify `VITE_API_BASE_URL` points to correct backend URL
- Check browser console for CORS errors
- Verify backend is running (`curl <backend-url>/health`)

**Build errors**:
```sh
cd apps/web
pnpm run check-types
pnpm run lint
pnpm run build
```

### Database Issues

**Migration conflicts**:
```sh
# Check migration status
supabase migration list

# If migrations are out of sync, may need to:
# 1. Backup data
# 2. Reset local: pnpm run db:reset
# 3. Carefully reconcile with production
```

**Schema drift**:
- Always use `supabase/migrations/` as source of truth
- Don't manually edit production database schema
- Don't use `drizzle-kit push` in production

## Monitoring

### Checking Service Health

**Backend**:
```sh
# Production
curl https://your-worker.workers.dev/health

# Local
curl http://localhost:8787/health
```

**Frontend**:
Visit production URL and check:
- Page loads
- Login works
- API calls succeed

### Logs

**Backend (Cloudflare Workers)**:
```sh
# Real-time logs
wrangler tail

# Or Cloudflare Dashboard → Workers → Logs
```

**Frontend (Vercel)**:
- Vercel Dashboard → Project → Deployments → View Function Logs

**Database (Supabase)**:
- Supabase Dashboard → Logs → Database

### Usage Monitoring

Check free tier limits:

**Cloudflare Workers**:
- Dashboard → Workers → Analytics
- Watch: Requests/day, CPU time

**Supabase**:
- Dashboard → Settings → Billing
- Watch: Database size, Bandwidth

**Vercel**:
- Dashboard → Usage
- Watch: Bandwidth

## Common Tasks

### Adding a New API Endpoint

1. Create use case: `apps/backend/src/usecase/`
2. Create repository method if needed: `apps/backend/src/infrastructure/`
3. Register route: `apps/backend/src/presentation/http/`
4. Test locally: `curl http://localhost:8787/api/your-endpoint`
5. Deploy: `pnpm run deploy`

### Adding a New Database Table

1. Create migration: `pnpm run db:migration:new add_table_name`
2. Write SQL in generated file
3. Test locally: `pnpm run db:reset`
4. Update Drizzle schema: `apps/backend/src/infrastructure/database/schema/`
5. Create repository: `apps/backend/src/infrastructure/database/<table>/`
6. Deploy migration: `supabase db push`
7. Deploy backend: `pnpm --filter backend run deploy`

### Emergency Rollback

**Backend**:
```sh
# List deployments
wrangler deployments list

# Rollback
wrangler rollback <deployment-id>
```

**Frontend**:
- Vercel Dashboard → Deployments → Previous version → Promote to Production

**Database**:
- No automatic rollback
- Create reverse migration
- Or restore from Supabase backup (Pro plan)

## Best Practices

### Before Deploying

```sh
# Run quality checks
pnpm run lint
pnpm run check-types
pnpm run build
```

### Database Changes

- Always create migrations, never manual schema edits
- Test migrations locally first
- Keep migrations small and focused
- Add rollback migrations for complex changes

### Secrets Management

- Never commit `.env`, `.dev.vars`, or secrets to Git
- Use `wrangler secret put` for production secrets
- Rotate secrets periodically

### Testing

- Test locally before deploying
- Verify in production immediately after deploy
- Keep production data backups

## Getting Help

- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs/overview
