# Deployment Guide

This document describes how to deploy the Budget App to production.

## Architecture Overview

| Layer | Service | Purpose | Free Tier |
|-------|---------|---------|-----------|
| **Web** | Vercel | Frontend UI delivery (SSR) | Yes |
| **Backend** | Cloudflare Workers | API server (edge runtime) | Yes |
| **Database** | Supabase | PostgreSQL database | Yes |

### Why This Architecture?

- **Cost**: All services offer generous free tiers suitable for low-traffic applications
- **Performance**: Cloudflare Workers runs on global edge network with <50ms cold start
- **No Sleep**: Unlike Render free tier, Cloudflare Workers doesn't sleep after inactivity
- **Simplicity**: Minimal configuration, Git-based deployments
- **Maintainability**: Each service has clear responsibilities and well-documented APIs
- **Scalability**: Easy to upgrade when traffic increases

### Trade-offs

- **Cloudflare Workers Free Tier**: 100,000 requests/day, 10ms CPU time per request
  - Sufficient for most personal budget apps
  - CPU time limit requires efficient code (our app is well within limits)
- **Supabase Free Tier**: 500MB database, 2GB bandwidth/month, auto-pauses after 1 week of inactivity
  - Supabase Connection Pooler provides HTTP-based access (required for Workers)
- **Vercel Free Tier**: 100GB bandwidth/month, commercial use allowed

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account (for code hosting and CI/CD)
- [ ] Cloudflare account (sign up at https://dash.cloudflare.com/sign-up)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Supabase account (sign up at https://supabase.com)
- [ ] Clerk account (for authentication, sign up at https://clerk.com)
- [ ] Local development environment working (see root README.md)

## Environment Variables

### Overview

| Variable | Used By | Local Value | Production Value |
|----------|---------|-------------|------------------|
| `DATABASE_URL` | backend | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` | Supabase connection string |
| `API_URL` | backend | `http://localhost:3001` | Render backend URL |
| `CLERK_SECRET_KEY` | backend | Clerk test key | Clerk production key |
| `VITE_API_BASE_URL` | web | `http://localhost:3001` | Render backend URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | web | Clerk test publishable key | Clerk production publishable key |

### Where to Set

- **Backend (Render)**: Set in Render dashboard → Service → Environment
- **Web (Vercel)**: Set in Vercel dashboard → Project → Settings → Environment Variables
- **Local**: `apps/backend/.env` and `apps/web/.env.local`

## Step 1: Database Setup (Supabase)

### Create Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Configure:
   - **Name**: `budget-app` (or your preferred name)
   - **Database Password**: Generate strong password (save securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free
4. Wait for project to be provisioned (~2 minutes)

### Get Connection String

1. In Supabase dashboard, go to **Project Settings** → **Database**
2. Find **Connection String** section
3. Copy the **Connection pooling** string (mode: Transaction)
4. Replace `[YOUR-PASSWORD]` with your database password
5. Save this as your production `DATABASE_URL`

### Run Migrations

```sh
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link local project to remote
supabase link --project-ref <your-project-ref>

# Push migrations to production
supabase db push
```

**Project ref** can be found in: Project Settings → General → Reference ID

### Verify

```sh
# Check migration status
supabase migration list
```

All migrations should show as "Applied".

## Step 2: Authentication Setup (Clerk)

### Create Application

1. Go to https://dashboard.clerk.com
2. Click "Create Application"
3. Configure:
   - **Name**: `Budget App`
   - **Authentication methods**: Email + Password (or your preferred methods)
4. Click "Create Application"

### Get API Keys

1. In Clerk dashboard, go to **API Keys**
2. Copy:
   - **Publishable Key** → Use for `VITE_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → Use for `CLERK_SECRET_KEY`
3. Save both keys securely

### Configure Allowed Origins

1. Go to **Paths** in Clerk dashboard
2. Under **Allowed origins**, add:
   - Your Vercel deployment URL (e.g., `https://budget-app.vercel.app`)
   - For testing: `http://localhost:3000`

## Step 3: Backend Deployment (Cloudflare Workers)

### Install Wrangler CLI

```sh
npm install -g wrangler
```

### Login to Cloudflare

```sh
wrangler login
```

This will open a browser to authenticate with your Cloudflare account.

### Set Environment Variables (Secrets)

Cloudflare Workers requires sensitive values to be set as secrets:

```sh
# Navigate to backend directory
cd apps/backend

# Set secrets (replace with actual values)
wrangler secret put DATABASE_URL
# Paste: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

wrangler secret put CLERK_SECRET_KEY
# Paste: your_clerk_secret_key

wrangler secret put API_URL
# Paste: https://budget-app-backend.<your-subdomain>.workers.dev
```

**Note**: `API_URL` will be your Workers URL. You can find it after first deployment.

### Deploy

```sh
# From apps/backend directory
pnpm run deploy
```

Or manually:

```sh
wrangler deploy
```

### Get Your Worker URL

After deployment, Wrangler will output:

```
Published budget-app-backend (X.XX sec)
  https://budget-app-backend.<your-subdomain>.workers.dev
```

Copy this URL - you'll need it for:
1. Updating `API_URL` secret (run `wrangler secret put API_URL` again)
2. Setting `VITE_API_BASE_URL` in Vercel (next step)

### Update API_URL Secret

```sh
wrangler secret put API_URL
# Paste the Worker URL you just copied
```

### Verify

```sh
# Test your deployed API
curl https://budget-app-backend.<your-subdomain>.workers.dev/health
```

### Viewing Logs

```sh
# Real-time logs
wrangler tail

# View logs in Cloudflare Dashboard
# Dashboard → Workers & Pages → budget-app-backend → Logs
```

## Step 4: Frontend Deployment (Vercel)

### Import Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist` (or check `apps/web/vite.config.ts`)
   - **Install Command**: `pnpm install`

### Set Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
VITE_API_BASE_URL=<Your Cloudflare Workers URL>
VITE_CLERK_PUBLISHABLE_KEY=<Clerk publishable key>
```

Example:
```
VITE_API_BASE_URL=https://budget-app-backend.<your-subdomain>.workers.dev
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Set for: **Production**, **Preview**, and **Development** environments.

### Deploy

1. Click "Deploy"
2. Wait for deployment (~3 minutes)
3. Once deployed, visit the deployment URL

### Verify

1. Open your Vercel deployment URL
2. Test:
   - Page loads correctly
   - Authentication works (sign up / sign in)
   - API calls to backend succeed (check browser console)

## Post-Deployment

### Update Clerk Allowed Origins

1. Go back to Clerk dashboard → **Paths**
2. Ensure your Vercel production URL is in **Allowed origins**

### Test End-to-End

1. Sign up with a new account
2. Create a transaction
3. Verify data is persisted in Supabase

### Monitor

- **Vercel**: Dashboard → Your Project → Deployments
- **Render**: Dashboard → Your Service → Logs
- **Supabase**: Dashboard → Your Project → Database → Logs

## Updating the Application

### Code Changes

#### Backend (Cloudflare Workers)

Cloudflare Workers deployment is **manual** - it does not auto-deploy on git push.

```sh
# Make changes locally
cd apps/backend

# Test locally first
pnpm run dev

# Deploy to production
pnpm run deploy
```

#### Frontend (Vercel)

```sh
# Make changes locally
git add .
git commit -m "feat: your feature"
git push origin main
```

- **Vercel**: Automatically deploys on push to `main`

### Database Schema Changes

See `docs/operations.md` for detailed migration workflow.

Quick version:

```sh
# Create migration locally
pnpm run db:migration:new <migration_name>

# Edit the generated SQL file in supabase/migrations/

# Test locally
pnpm run db:reset

# Push to production
supabase db push
```

### Environment Variable Changes

1. Update in service dashboard (Vercel/Render)
2. Trigger redeploy if auto-deploy doesn't pick it up

## Rollback

### Backend (Cloudflare Workers)

Cloudflare Workers supports rollback via Wrangler:

```sh
# List recent deployments
wrangler deployments list

# Rollback to a specific version
wrangler rollback <deployment-id>
```

Or via Cloudflare Dashboard:
1. Go to Cloudflare Dashboard → Workers & Pages → budget-app-backend
2. Click "Deployments" tab
3. Find previous version → Click "Rollback"

### Frontend (Vercel)

1. Go to Vercel dashboard → Your Project → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Database

Supabase doesn't have built-in rollback. For critical issues:

1. Create a new migration that reverts changes
2. Push to production

For severe cases, restore from backup (Supabase Pro feature).

## Troubleshooting

### Backend not responding

- Check Cloudflare Workers logs: `wrangler tail` or Dashboard → Logs
- Verify secrets are set correctly: `wrangler secret list`
- Check database connection (Supabase may pause after inactivity)
- Verify Supabase Connection Pooler URL is correct (should use port 6543)
- Check CPU time limits (should be well under 10ms for our app)

### Frontend can't connect to backend

- Verify `VITE_API_BASE_URL` matches Cloudflare Workers URL
- Check CORS configuration in backend (apps/backend/src/presentation/http/create-app.ts)
- Check Workers deployment succeeded: `wrangler deployments list`

### Authentication not working

- Verify Clerk keys are correct
- Check Clerk allowed origins include Vercel URL
- Check browser console for Clerk errors

### Database connection errors

- Verify `DATABASE_URL` is correct
- Check Supabase project is not paused (free tier pauses after 1 week inactivity)
- Verify IP allowlist if configured (Supabase Settings → Database → Connection pooling)

## Cost Management

### Free Tier Limits

- **Cloudflare Workers**: 100,000 requests/day, 10ms CPU time/request
- **Vercel**: 100GB bandwidth/month
- **Supabase**: 500MB database, 2GB bandwidth/month
- **Clerk**: 10,000 MAU (Monthly Active Users)

### When to Upgrade

Consider upgrading when:

- Workers requests exceed 100,000/day → Workers Paid ($5/month for 10M requests)
- Database exceeds 500MB → Supabase Pro ($25/month)
- Traffic exceeds Vercel limits → Vercel Pro ($20/month)
- Need more MAU → Clerk Pro ($25/month)

### Monitoring Usage

- **Cloudflare Workers**: Dashboard → Workers & Pages → Analytics
- **Vercel**: Dashboard → Usage
- **Supabase**: Dashboard → Settings → Billing
- **Clerk**: Dashboard → Usage

### Daily Monitoring Commands

```sh
# Check Workers usage and errors
wrangler tail

# View analytics in dashboard
# Cloudflare Dashboard → Workers & Pages → budget-app-backend → Analytics
```

## Next Steps

- Set up monitoring (Sentry, LogRocket, etc.)
- Configure custom domain
- Enable HTTPS (automatic on Vercel and Render)
- Set up staging environment
- Add CI/CD for automated testing

## Automatic Deployment (GitHub Actions)

### Setup Automatic Backend Deployment

The repository includes GitHub Actions workflow for automatic backend deployment.

#### Get Cloudflare API Token

1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Click "Continue to summary" → "Create Token"
5. Copy the token (you won't see it again)

#### Add GitHub Secret

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `CLOUDFLARE_API_TOKEN`
5. Value: Paste the token from above
6. Click "Add secret"

#### Set Cloudflare Workers Secrets

Even with automatic deployment, you still need to set Worker secrets once:

```sh
cd apps/backend

wrangler secret put DATABASE_URL
wrangler secret put CLERK_SECRET_KEY
wrangler secret put API_URL
```

#### How It Works

After setup, backend automatically deploys when:
- You push to `main` branch
- AND changes are in `apps/backend/**` or `packages/**`

**Deployment flow**:
1. Runs type check
2. Runs lint
3. Runs build
4. Deploys to Cloudflare Workers

**Monitoring**:
- GitHub → Actions tab → See deployment status
- Deployments typically complete in 2-3 minutes

#### Manual Deployment (Optional)

You can still deploy manually:

```sh
cd apps/backend
pnpm run deploy
```

### CI Quality Checks

The repository also runs quality checks on every pull request and push:

- Type checking (web + backend)
- Linting (web + backend)
- Build verification (web + backend)

These checks must pass before merging PRs.

**Note**: CI excludes `mobile` from checks as it's deprecated.

