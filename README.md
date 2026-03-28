# Budget App

Personal budget management application built with monorepo architecture.

## Production Applications

This repository manages the following production applications:

- **web**: Frontend UI (Vite + TanStack Start)
- **backend**: REST API server (Hono + Node.js)
- **db**: PostgreSQL database (managed by Supabase)

**Note**: `apps/mobile` exists in the repository but is not part of the production deployment flow. It is a deprecated application and excluded from production operations.

## Architecture

### Apps

- **apps/web**: Frontend application
  - Framework: Vite + TanStack Start (SSR-enabled)
  - Auth: Clerk React
  - Styling: Tailwind CSS
  - State: TanStack Query + Router
  - Port: 3000 (local)

- **apps/backend**: API server
  - Framework: Hono
  - Runtime: Cloudflare Workers
  - Auth: Clerk (JWT verification)
  - ORM: Drizzle
  - Database: PostgreSQL (Supabase Connection Pooler)
  - Port: 8787 (local via wrangler dev)

- **apps/mobile**: Mobile app (deprecated, not deployed)
  - Expo + React Native

### Packages

- `@repo/ui`: Shared UI components
- `@repo/validation`: Shared validation schemas
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: TypeScript configurations

### Database

- **Provider**: Supabase (PostgreSQL)
- **Migrations**: `supabase/migrations/` (source of truth)
- **Local Setup**: Supabase CLI + Docker (via Colima)
- **ORM**: Drizzle (schema definition and queries)

## Commit Convention

This repository enforces commit message naming through a local `commit-msg` hook.

### One-time setup

```sh
pnpm run setup:git-hooks
```

### Format

```txt
<type>(optional-scope): <subject>
```

Examples:

- `feat(web): add transaction summary card`
- `fix(backend): handle missing budget id`
- `chore: update workspace scripts`

Allowed `type` values:

- `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

## Local Development

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0
- Docker (for Supabase local development)

### Initial Setup

```sh
# Install dependencies
pnpm install

# Setup git hooks
pnpm run setup:git-hooks

# Start local database
pnpm run db:start

# Run migrations and seed data
pnpm run db:setup
```

### Environment Variables

Copy `.env.example` files and configure:

```sh
# Backend (Cloudflare Workers)
cp apps/backend/.dev.vars.example apps/backend/.dev.vars

# Web
cp apps/web/.env.example apps/web/.env.local
```

See each app's `.env.example` (or `.dev.vars.example`) for required values.

### Development

```sh
# Start web and backend together
pnpm run dev
# Web: http://localhost:3000
# Backend: http://localhost:8787

# Or start individually
pnpm run dev:web      # Port 3000
pnpm run dev:backend  # Port 8787

# Mobile (deprecated, local development only)
pnpm run dev:mobile
```

### Database Operations

```sh
# Start database
pnpm run db:start

# Stop database
pnpm run db:stop

# Check status
pnpm run db:status

# Reset database (run all migrations + seed)
pnpm run db:reset

# Create new migration
pnpm run db:migration:new <migration_name>
```

See `docs/operations.md` for detailed database workflow.

## Build and Validation

```sh
# Build all production apps (web + backend)
pnpm run build

# Lint all apps
pnpm run lint

# Type checking
pnpm run check-types

# Pre-deployment validation
pnpm run deploy:check
```

## Deployment

See `docs/deploy.md` for detailed deployment instructions.

**Quick overview**:
- **web**: Vercel (auto-deploys on push to `main`)
- **backend**: Cloudflare Workers (auto-deploys on push to `main` via GitHub Actions)
- **db**: Supabase (manual migration: `supabase db push`)

**CI/CD**:
- GitHub Actions runs quality checks (lint, typecheck, build) on all PRs
- Backend auto-deploys to Cloudflare Workers when changes pushed to `main`
- Frontend auto-deploys to Vercel when changes pushed to `main`

## Documentation

- `docs/deploy.md`: Deployment setup and procedures
- `docs/operations.md`: Day-to-day operations and troubleshooting
- `apps/docs/`: Technical specifications

## Monorepo Tools

This project uses:

- [pnpm workspace](https://pnpm.io/workspaces) for package management
- [Turborepo](https://turborepo.dev/) for build orchestration
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [ESLint](https://eslint.org/) for linting
- [Prettier](https://prettier.io) for formatting
