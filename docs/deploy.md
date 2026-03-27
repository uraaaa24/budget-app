# Deployment Guide

This document describes how to deploy the Budget App to production.

## Architecture Overview

| Layer | Service | Purpose | Free Tier |
|-------|---------|---------|-----------|
| **Web** | Vercel | Frontend UI delivery (SSR) | Yes |
| **Backend** | Render | API server | Yes (with sleep) |
| **Database** | Supabase | PostgreSQL database | Yes |

### Why This Architecture?

- **Cost**: All services offer free tiers suitable for low-traffic applications
- **Simplicity**: Minimal configuration, Git-based deployments
- **Maintainability**: Each service has clear responsibilities and well-documented APIs
- **Scalability**: Easy to upgrade when traffic increases

### Trade-offs

- **Render Free Tier**: Backend will sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.
- **Supabase Free Tier**: 500MB database, 2GB bandwidth/month, auto-pauses after 1 week of inactivity
- **Vercel Free Tier**: 100GB bandwidth/month, commercial use allowed

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account (for code hosting and deployments)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Render account (sign up at https://render.com)
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

## Step 3: Backend Deployment (Render)

### Create Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `budget-app-backend`
   - **Region**: Same as Supabase (for lower latency)
   - **Branch**: `main`
   - **Root Directory**: `apps/backend`
   - **Runtime**: Node
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm run start`
   - **Plan**: Free

### Set Environment Variables

In Render dashboard → Environment tab, add:

```
DATABASE_URL=<Supabase connection string>
CLERK_SECRET_KEY=<Clerk secret key>
API_URL=<Will be your Render URL, e.g., https://budget-app-backend.onrender.com>
NODE_ENV=production
```

### Deploy

1. Click "Create Web Service"
2. Wait for initial deployment (~5 minutes)
3. Once deployed, copy the service URL (e.g., `https://budget-app-backend.onrender.com`)
4. Update `API_URL` environment variable with this URL
5. Trigger redeploy: Manual Deploy → Deploy latest commit

### Verify

```sh
# Test health endpoint (create one if needed)
curl https://your-backend-url.onrender.com/health
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
VITE_API_BASE_URL=<Your Render backend URL>
VITE_CLERK_PUBLISHABLE_KEY=<Clerk publishable key>
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

```sh
# Make changes locally
git add .
git commit -m "feat: your feature"
git push origin main
```

- **Vercel**: Automatically deploys on push to `main`
- **Render**: Automatically deploys on push to `main`

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

### Backend (Render)

1. Go to Render dashboard → Your Service → Events
2. Find previous successful deployment
3. Click "Rollback to this version"

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

- Check Render logs for errors
- Verify environment variables are set correctly
- Check database connection (Supabase may pause after inactivity)
- Free tier: First request may take ~30s to wake service

### Frontend can't connect to backend

- Verify `VITE_API_BASE_URL` matches Render URL
- Check CORS configuration in backend
- Check Render service is running (not failed deployment)

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

- **Vercel**: 100GB bandwidth/month
- **Render**: 750 hours/month (enough for 1 service), sleeps after 15min inactivity
- **Supabase**: 500MB database, 2GB bandwidth/month
- **Clerk**: 10,000 MAU (Monthly Active Users)

### When to Upgrade

Consider upgrading when:

- Render sleep time becomes disruptive → Upgrade to Starter ($7/month)
- Database exceeds 500MB → Supabase Pro ($25/month)
- Traffic exceeds Vercel limits → Pro ($20/month)
- Need more MAU → Clerk Pro ($25/month)

### Monitoring Usage

- **Vercel**: Dashboard → Usage
- **Render**: Dashboard → Billing
- **Supabase**: Dashboard → Settings → Billing
- **Clerk**: Dashboard → Usage

## Next Steps

- Set up monitoring (Sentry, LogRocket, etc.)
- Configure custom domain
- Enable HTTPS (automatic on Vercel and Render)
- Set up staging environment
- Add CI/CD for automated testing
