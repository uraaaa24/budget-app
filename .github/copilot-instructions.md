# Copilot Instructions for Budget App

## Project Overview

Turborepo monorepo for a budget tracking application with:
- **Mobile app**: React Native (Expo) with file-based routing
- **Backend API**: Hono server with Onion Architecture
- **Shared packages**: validation schemas (Valibot), UI components, configs
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **Auth**: Clerk

## Build, Test, and Lint Commands

### Root Level
```bash
# Install dependencies (first time setup)
pnpm install

# Setup git hooks (commit message validation)
pnpm run setup:git-hooks

# Build all apps and packages
pnpm build

# Run all linters
pnpm lint

# Type-check all packages
pnpm check-types

# Format code
pnpm format

# Run specific workspace commands
turbo build --filter=backend
turbo dev --filter=mobile
```

### Mobile (`apps/mobile`)
```bash
# Development
pnpm --filter mobile dev          # Start Expo dev server
pnpm --filter mobile android      # Run on Android
pnpm --filter mobile ios          # Run on iOS
pnpm --filter mobile web          # Run on web

# Lint
pnpm --filter mobile lint
```

### Backend (`apps/backend`)
```bash
# Development
pnpm --filter backend dev         # Watch mode with tsx
pnpm --filter backend start       # Run built version

# Build
pnpm --filter backend build       # tsc + tsc-alias for path resolution

# Type check
pnpm --filter backend check-types

# Lint
pnpm --filter backend lint
```

### UI Package (`packages/ui`)
```bash
# Storybook
pnpm storybook                    # Run from root
pnpm build-storybook

# Generate component
pnpm --filter @repo/ui generate:component
```

### Database (Supabase + Drizzle)
```bash
# Start local Supabase (requires Colima on macOS)
pnpm db:start

# Stop local stack
pnpm db:stop

# Check status
pnpm db:status

# Apply migrations + seed
pnpm db:reset

# Push migrations to linked project
pnpm db:push

# Create new migration
pnpm db:migration:new <name>
```

**Drizzle ORM**: When adding/modifying Drizzle:
- Schema definitions go in `apps/backend/src/infrastructure/database/schema/`
- Use Drizzle Kit for migrations: `drizzle-kit generate` → commit to `supabase/migrations/`
- Connection setup in `apps/backend/src/infrastructure/database/client.ts`

## Architecture

### Backend: Onion Architecture

```
apps/backend/src/
  domain/          # Domain models & interfaces (no external dependencies)
  application/     # Use cases (depends on domain abstractions)
  infrastructure/  # External I/O implementations (DB, APIs, etc.)
    database/      # Drizzle client, schema, repositories
    supabase/      # Supabase-specific utilities if needed
  presentation/    # HTTP routes/controllers (calls use cases)
  core/            # Shared utilities
  index.ts         # Entry point
```

**Dependency rules:**
- Dependencies flow inward: `presentation` → `application` → `domain`
- Inner layers (domain/application) never depend on outer layers
- Infrastructure implements domain abstractions (dependency inversion)

**Database layer:**
- Drizzle schema files define tables
- Repository implementations use Drizzle queries
- Domain defines repository interfaces; infrastructure implements them

### Mobile: Expo Router (File-based Routing)

```
apps/mobile/
  app/             # File-based routes
    _layout.tsx    # Root layout
    (tabs)/        # Tab navigation group
    sign-in.tsx    # Auth screen
  components/      # Reusable components
  features/        # Feature modules
  lib/             # Utilities, API clients
```

### Shared Validation

`@repo/validation` package contains Valibot schemas shared between frontend and backend:
- `transaction.ts` - Transaction data schemas
- `api-paths.ts` - API endpoint definitions

Both apps import from `@repo/validation/*`.

## Key Conventions

### Commit Messages

Enforced by git hook. Format: `<type>(optional-scope): <subject>`

Example: `feat(mobile): add transaction summary card`

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Backend Environment Variables

Required in `apps/backend/.env`:
- `API_URL`
- `CLERK_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (for Drizzle connection)

### Backend Auth

All transaction endpoints require Clerk session token:
```
Authorization: Bearer <token>
```

Backend verifies token and extracts `sub` as `user_id`.

### Database with Drizzle ORM

- **Schema**: Define tables using Drizzle schema in `apps/backend/src/infrastructure/database/schema/`
- **Migrations**: Generate with Drizzle Kit, stored in `supabase/migrations/`
- **Queries**: Use Drizzle query builder for type-safe database operations
- **Repositories**: Implement domain repository interfaces using Drizzle client
- **Connection**: Postgres client created from `SUPABASE_URL` or `DATABASE_URL`

### Path Aliases

Backend uses TypeScript path aliases (e.g., `@/domain/...`). The build process uses `tsc-alias` to resolve these to relative paths with `.js` extensions in the output.

### Package Manager

**Always use `pnpm`**, not npm or yarn. Node version: `>=18`.

### Turborepo Filters

When running commands for specific packages:
```bash
turbo <command> --filter=<package-name>
```

Package names:
- `mobile` (apps/mobile)
- `backend` (apps/backend)
- `@repo/ui` (packages/ui)
- `@repo/validation` (packages/validation)

### Global Environment Variables

Turbo is configured to pass these to all tasks:
- `API_URL`
- `CLERK_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Tech Stack Summary

- **Language**: TypeScript 5.9.2
- **Monorepo**: pnpm workspaces + Turborepo
- **Mobile**: Expo 54, React Native 0.81.5, React 19.1, NativeWind (Tailwind)
- **Backend**: Hono, Node.js, tsx (dev), tsc + tsc-alias (build)
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **Auth**: Clerk (Expo + Backend SDKs)
- **Validation**: Valibot (shared schemas)
- **UI Dev**: Storybook
- **Linting**: ESLint (shared config)
- **Formatting**: Prettier
