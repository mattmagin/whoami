# Portfolio Site - Development Guide

> **Note:** This project is actively under development. The structure, patterns, and 
> conventions described here represent the intended architecture but may not yet be 
> fully implemented. When working on this codebase, verify what exists before making 
> assumptions. Update this file as the project evolves.

## Project Status

- [ ] Phase 1: Rails API
- [ ] Phase 2: Go SSH/TUI (public)
- [ ] Phase 3: React Frontend
- [ ] Phase 4: Docker Integration
- [ ] Phase 5: Terraform/AWS
- [ ] Phase 6: CI/CD + GitHub Mirror
- [ ] Phase 7: Admin CLI (local TUI for editing content)

## Repository Structure

- `/api/`: Ruby on Rails API application (API mode)
- `/tui/`: Go-based SSH server and Terminal UI (Bubble Tea + Wish)
- `/admin/`: Local Go CLI for content management (reuses TUI components)
- `/web/`: React frontend with TypeScript, Vite, shadcn/ui, Tailwind
- `/infrastructure/`: Terraform modules for AWS (VPC, EC2, RDS, S3, CloudFront)
- `/content/`: Static content files (resume.md)

## Build & Run Commands

### Root Level
- `docker-compose up`: Run all services locally (Postgres, API, TUI, Web)
- `docker-compose up -d db`: Run just Postgres for local dev
- `make help`: Show all available commands

### Rails API (`/api`)
- `bundle install`: Install dependencies
- `rails db:create db:migrate`: Set up database
- `rails db:seed`: Seed sample data
- `rails server`: Run API server (port 3000)
- `bundle exec rspec`: Run tests
- `rails console`: Interactive Rails console
- `rake admin:create_key[name]`: Generate new API key

### Go TUI (`/tui`)
- `go mod download`: Install dependencies
- `go run ./cmd/server`: Run SSH server locally
- `go test ./...`: Run all tests
- `go build -o server ./cmd/server`: Build binary
- `make run`: Build and run
- `make test`: Run tests with race detection

### Admin CLI (`/admin`)
- `go run ./cmd/admin`: Run admin CLI
- `go build -o admin ./cmd/admin`: Build binary
- Requires `ADMIN_API_URL` and `ADMIN_API_KEY` env vars
- Creates/edits/deletes posts and projects via API

### React Frontend (`/web`)
- `npm install`: Install dependencies
- `npm run dev`: Run dev server (port 5173)
- `npm run build`: Production build
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

### Terraform (`/infrastructure`)
- `terraform init`: Initialize providers
- `terraform plan -var-file=environments/dev.tfvars`: Preview changes
- `terraform apply -var-file=environments/dev.tfvars`: Apply changes
- `terraform destroy`: Tear down infrastructure

## Code Style Guidelines

### Rails API
- **Controllers**: Thin controllers, business logic in models/services
- **Serialization**: Use Blueprinter for JSON responses
- **Authentication**: API key via `X-API-Key` header for admin routes
- **Scopes**: Use Active Record scopes (e.g., `Post.published`)
- **UUIDs**: All tables use UUID primary keys
- **Testing**: RSpec with FactoryBot

### Go TUI
- **Imports**: Standard library first, external deps, then local packages
- **Errors**: Explicit error returns with context, no panic in library code
- **Naming**: PascalCase for exported, camelCase for private
- **Packages**: Organized by domain (`api/`, `ssh/`, `tui/`, `tui/views/`)
- **Bubble Tea**: Model-View-Update pattern, keep models small
- **Styling**: Use Lip Gloss for consistent terminal styling
- **Markdown**: Render with Glamour

### React Frontend
- **Components**: Functional components with TypeScript props
- **Functions**: Use arrow function syntax (`const fn = () => {}`) instead of standard function declarations
- **Exports**: Use `export default` for files with a single main component matching the filename (e.g., `PostCard.tsx` exports `PostCard`). Use named exports for files with multiple exports (e.g., `AnimatedSection.tsx` with 3 components, or `ThemeContext.tsx` with multiple hooks)
- **Barrel Files**: Re-export default exports as named in index.ts files (`export { default as Component } from './Component'`)
- **State**: TanStack Query for server state, useState for local
- **Styling**: Tailwind CSS + shadcn/ui components
- **shadcn/ui**: Do not modify auto-generated components in `/src/components/ui/` — these may be regenerated
- **API Calls**: Centralized in `/src/lib/api.ts`
- **Routing**: React Router with lazy loading
- **Forms**: React Hook Form with Zod validation
- **DRY Constants**: When a value, set of options, or definition (routes, theme options, feature flags, etc.) is used in more than one file, it **must** be extracted into `/src/consts/` as a single source of truth. Follow this pattern:
  1. Define an `as const` enum-like object for keys (e.g., `ROUTE`, `THEME_PREFERENCE`, `COLOR_THEME`).
  2. Export a matching TypeScript type derived from that object (e.g., `type Route = typeof ROUTE[keyof typeof ROUTE]`).
  3. Define a typed `Record` mapping each key to a definition object that carries all associated metadata — paths, labels (as string-key references into `strings.json`), icons, shortcuts, aliases, etc. (e.g., `ROUTE_DEFINITIONS`, `THEME_OPTIONS`, `COLOR_THEME_ALIASES`).
  4. Derive any convenience lookups from the definitions rather than duplicating data (e.g., `NAV_SHORTCUTS` is derived from `ROUTE_DEFINITIONS`).
  5. Re-export everything through `consts/index.ts` so consumers import from `@/consts`.
  6. **Never** duplicate these values locally in components — always import from the central const file.

### Terraform
- **Modules**: Separate modules for networking, database, compute, storage
- **Variables**: All configurable values in variables.tf
- **Environments**: Use .tfvars files for dev/prod
- **State**: Remote state in S3 with locking
- **Naming**: Consistent `${project_name}-${resource}` pattern

## Environment Variables

### API
```
DATABASE_URL=postgres://user:pass@host:5432/dbname
RAILS_ENV=development|production
SECRET_KEY_BASE=<generated>
```

### TUI
```
API_URL=http://localhost:3000
SSH_HOST_KEY_PATH=./host_key
SSH_PORT=22
```

### Web
```
VITE_API_URL=http://localhost:3000
```

### Terraform
```
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
TF_VAR_db_password=<password>
```

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/resume` | Resume content + metadata |
| GET | `/api/posts` | Published blog posts |
| GET | `/api/posts/:slug` | Single post |
| GET | `/api/projects` | All projects |
| GET | `/api/projects/:slug` | Single project |
| POST | `/api/contacts` | Submit contact form |

### Admin (requires `X-API-Key` header)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/posts` | All posts (incl. drafts) |
| POST | `/api/admin/posts` | Create post |
| PATCH | `/api/admin/posts/:id` | Update post |
| DELETE | `/api/admin/posts/:id` | Delete post |

## Database Schema

- `posts`: id, slug, title, content (markdown), excerpt, published, published_at
- `projects`: id, slug, name, description, tech_stack[], url, github_url, featured
- `contacts`: id, name, email, message, read
- `api_keys`: id, key_hash, name, last_used_at

## Git Workflow

- Main branch: `main` (protected, requires MR)
- Feature branches: `feature/description`
- GitLab CI runs on all MRs and main
- Auto-mirrors to GitHub for visibility

## Deployment

- **Web**: S3 + CloudFront (static)
- **API + TUI**: EC2 with Docker
- **Database**: RDS PostgreSQL
- **DNS**: Route53
- **CI/CD**: GitLab CI → auto-deploy on main
