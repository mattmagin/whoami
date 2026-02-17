# Portfolio Site - Development Guide

> **Note:** This project is actively under development. The structure, patterns, and 
> conventions described here represent the intended architecture but may not yet be 
> fully implemented. When working on this codebase, verify what exists before making 
> assumptions. Update this file as the project evolves.

## Project Status

- [x] Phase 1: Hono API (migrated from Rails)
- [ ] Phase 2: Rust TUI (public)
- [x] Phase 3: React Frontend
- [x] Phase 4: Docker Integration
- [x] Phase 5: Terraform/Railway
- [ ] Phase 6: CI/CD + GitHub Mirror
- [ ] Phase 7: Admin CLI (local TUI for editing content)

## Repository Structure

- `/web/`: Full-stack application — React frontend + Hono API server (Bun runtime)
  - `/web/src/`: React frontend with TypeScript, Vite, shadcn/ui, Tailwind
  - `/web/server/`: Hono API server with Drizzle ORM (PostgreSQL)
  - `/web/content/`: Static content files (resume.yaml)
- `/tui/`: Rust-based Terminal UI (ratatui + tui-realm)
- `/infra/`: Terraform for Railway (project, services, env vars)
- `/admin/`: (future) Local CLI for content management

## Build & Run Commands

### Web (`/web`) — Full-Stack (Frontend + API)
- `bun install`: Install dependencies
- `bun run dev`: Run frontend (Vite) + API server (Hono) concurrently
- `bun run dev:web`: Run only the Vite dev server (port 5173)
- `bun run dev:server`: Run only the Hono API server (port 3001)
- `bun run build`: TypeScript check + Vite production build
- `bun run start`: Run production server (serves SPA + API from single process)
- `bun run lint`: Run ESLint
- `bun run db:generate`: Generate Drizzle migration files from schema changes
- `bun run db:migrate`: Run Drizzle migrations
- `bun run db:push`: Push schema changes directly (dev only)
- `bun run db:seed`: Seed database with sample data
- `bun run db:studio`: Open Drizzle Studio (database browser)

### Rust TUI (`/tui`)
- `cargo build`: Build the TUI binary
- `cargo run`: Run the TUI locally
- Uses compile-time embedded `content.json` — independent of the API

### Terraform (`/infra`)
- `terraform init`: Initialize providers
- `terraform plan -var-file=terraform.tfvars`: Preview changes
- `terraform apply -var-file=terraform.tfvars`: Apply changes
- `terraform destroy`: Tear down infrastructure

## Code Style Guidelines

### Hono API (`/web/server`)
- **Runtime**: Bun
- **Framework**: Hono with typed routes
- **ORM**: Drizzle ORM with PostgreSQL
- **Schema**: Defined in `server/db/schema.ts` — single source of truth for DB types
- **Serialization**: Direct JSON responses with camelCase keys (no transform layer)
- **UUIDs**: All tables use UUID primary keys (gen_random_uuid())
- **Email**: Resend for transactional email (contact form notifications)
- **Validation**: Inline validation in route handlers
- **Error format**: `{ error: string, message: string }` with appropriate HTTP status

### Rust TUI
- **Framework**: ratatui + tui-realm (component-based)
- **Content**: Static `content.json` embedded at compile time
- **Architecture**: Model-View-Update pattern
- **Styling**: ratatui styles with consistent color palette

### React Frontend (`/web/src`)
- **Components**: Functional components with TypeScript props
- **Functions**: Use arrow function syntax (`const fn = () => {}`) instead of standard function declarations
- **Exports**: Use `export default` for files with a single main component matching the filename (e.g., `PostCard.tsx` exports `PostCard`). Use named exports for files with multiple exports (e.g., `AnimatedSection.tsx` with 3 components, or `ThemeContext.tsx` with multiple hooks)
- **Barrel Files**: Re-export default exports as named in index.ts files (`export { default as Component } from './Component'`)
- **State**: TanStack Query for server state, useState for local
- **Styling**: Tailwind CSS + shadcn/ui components
- **shadcn/ui**: Do not modify auto-generated components in `/src/components/ui/` — these may be regenerated
- **API Calls**: Centralized in `/src/api/index.ts`, using relative `/api/*` paths
- **Types**: Defined in `/src/types/index.ts` — no auto-generated types
- **Routing**: React Router with lazy loading
- **Forms**: React Hook Form with Zod validation
- **DRY Constants**: When a value, set of options, or definition (routes, theme options, feature flags, etc.) is used in more than one file, it **must** be extracted into `/src/consts/` as a single source of truth. Follow this pattern:
  1. Define an `as const` enum-like object for keys (e.g., `ROUTE`, `THEME_PREFERENCE`, `COLOR_THEME`).
  2. Export a matching TypeScript type derived from that object (e.g., `type Route = typeof ROUTE[keyof typeof ROUTE]`).
  3. Define a typed `Record` mapping each key to a definition object that carries all associated metadata — paths, labels (as string-key references into `strings.json`), icons, shortcuts, aliases, etc. (e.g., `ROUTE_DEFINITIONS`, `THEME_OPTIONS`, `COLOR_THEME_ALIASES`).
  4. Derive any convenience lookups from the definitions rather than duplicating data (e.g., `NAV_SHORTCUTS` is derived from `ROUTE_DEFINITIONS`).
  5. Re-export everything through `consts/index.ts` so consumers import from `@/consts`.
  6. **Never** duplicate these values locally in components — always import from the central const file.

### Terraform (`/infra`)
- **Provider**: `terraform-community-providers/railway`
- **Variables**: All configurable values in variables.tf
- **Secrets**: Use .tfvars files (gitignored) for tokens, database URLs, API keys
- **Resources**: Project, web service, Postgres service, environment variables
- **Naming**: Consistent `whoami-{resource}` pattern

## Environment Variables

### Web (API Server)
```
DATABASE_URL=postgres://user:pass@host:5432/dbname
# OR individual vars:
DATABASE_USER=whoami
DATABASE_PASSWORD=shhhhItsASecret
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5434
DATABASE_NAME=whoami_development
PORT=3001
NODE_ENV=development|production
RESEND_API_KEY=<key>
RESEND_FROM_EMAIL=Portfolio <noreply@yourdomain.com>
CONTACT_NOTIFICATION_EMAIL=you@example.com
```

### Terraform
```
RAILWAY_TOKEN=<token>  # or set in terraform.tfvars
```

## API Endpoints

All served from the Hono server at `/api/*`:

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/resume` | Resume content (parsed YAML) |
| GET | `/api/posts` | All blog posts |
| GET | `/api/posts/:slug` | Single post (by slug or UUID) |
| GET | `/api/projects` | All projects |
| GET | `/api/projects/:slug` | Single project (by slug or UUID) |
| POST | `/api/contacts` | Submit contact form |
| GET | `/api/version` | Content version hash (cache invalidation) |

## Database Schema

Managed by Drizzle ORM. Schema defined in `web/server/db/schema.ts`.

- `posts`: id (uuid), slug, title, content (markdown), excerpt, tags[], feature_image_url, project_id, published_at, deleted_at, timestamps
- `projects`: id (uuid), slug, name, description, excerpt, tech_stack[], url, github_url, image_url, featured, published_at, deleted_at, timestamps
- `contacts`: id (uuid), name, email, message, timestamps
- `resumes`: id (uuid), slug, data (YAML text), timestamps

## Git Workflow

- Main branch: `main` (protected, requires MR)
- Feature branches: `feature/description`
- GitLab CI runs on all MRs and main
- Auto-mirrors to GitHub for visibility

## Deployment

- **Platform**: Railway
- **Web + API**: Single Bun process serving React SPA + Hono API (Dockerized)
- **Database**: Railway-managed PostgreSQL
- **IaC**: Terraform (`/infra`) manages Railway project, services, and env vars
- **Docker**: Multi-stage Bun build (`web/Dockerfile`)
- **CI/CD**: GitLab CI → auto-deploy on main
