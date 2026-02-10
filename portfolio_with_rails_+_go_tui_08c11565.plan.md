---
name: Portfolio with Rails + Rust TUI
overview: Build a personal portfolio with a Rails API backend, PostgreSQL database, Rust-based SSH TUI for terminal access, and a React frontend — demonstrating full-stack skills across multiple languages.
todos:
  - id: phase1-rails
    content: "Phase 1: Rails API - Setup, models, migrations, controllers, API key auth, rate limiting"
    status: pending
  - id: phase2-tui
    content: "Phase 2: Rust SSH/TUI - Ratatui + tui-realm views, SSH server, API client, graceful shutdown"
    status: pending
    dependencies:
      - phase1-rails
  - id: phase3-react
    content: "Phase 3: React frontend - Vite setup, shadcn/ui, pages, terminal styling"
    status: pending
    dependencies:
      - phase1-rails
  - id: phase4-docker
    content: "Phase 4: Docker + Local Integration - Dockerfiles, docker-compose, local testing"
    status: pending
    dependencies:
      - phase2-tui
      - phase3-react
  - id: phase5-observability
    content: "Phase 5: Observability - Structured logging, Prometheus metrics, Grafana dashboard"
    status: pending
    dependencies:
      - phase4-docker
  - id: phase6-terraform
    content: "Phase 6: AWS Infrastructure with Terraform - VPC, EC2, RDS, S3, CloudFront"
    status: pending
    dependencies:
      - phase5-observability
  - id: phase7-cicd
    content: "Phase 7: CI/CD Pipeline - GitLab CI for test, build, deploy, tfsec security scanning"
    status: pending
    dependencies:
      - phase6-terraform
  - id: phase7-mirror
    content: "Phase 7: Set up GitLab to GitHub repo mirroring for visibility"
    status: pending
    dependencies:
      - phase7-cicd
---

# Personal Portfolio: Rails API + Rust SSH TUI + React Frontend

## What You're Building

A personal website with three distinct interfaces sharing one Rails API:

1. **Public Website** — React SPA for web visitors
2. **Public SSH TUI** — Rust/Ratatui terminal interface via `ssh yoursite.com`
3. **Admin** — Rails console + rake tasks (or optional Rust admin CLI)

---

## Architecture

```mermaid
graph TB
    subgraph aws [AWS - Managed by Terraform]
        subgraph vpc [VPC]
            subgraph ec2 [EC2 Instance]
                Rails[Rails API :3000]
                RustSSH[Rust SSH Server :22]
            end
            RDS[(RDS PostgreSQL)]
        end
        S3[S3 Bucket]
        CloudFront[CloudFront CDN]
        Route53[Route53 DNS]
    end
    
    subgraph local [Local Development]
        MD[resume.md]
        TF[Terraform]
        GHA[GitHub Actions]
    end
    
    subgraph observability [Observability Stack]
        Prometheus[Prometheus]
        Grafana[Grafana Dashboard]
    end
    
    User((Web User)) --> Route53
    SSHUser((SSH User)) --> Route53
    Route53 --> CloudFront
    Route53 --> RustSSH
    CloudFront --> S3
    S3 --> ReactSPA[React SPA]
    Rails --> RDS
    RustSSH --> Rails
    Rails --> Prometheus
    RustSSH --> Prometheus
    Prometheus --> Grafana
    TF --> aws
    GHA --> aws
```

**Three ways to access your site:**

1. `https://yoursite.com` - React SPA via CloudFront
2. `ssh yoursite.com` - Rust TUI via SSH
3. `https://api.yoursite.com` - Rails API directly

---

## Technology Stack

| Component | Technology | Why |

|-----------|------------|-----|

| **API** | Rails 7 (API mode) | Fast development, familiar, great conventions |

| **Database** | PostgreSQL | Industry standard, excellent Rails integration |

| **ORM** | Active Record | Built into Rails, migrations, validations |

| **SSH Server** | Rust + [russh](https://github.com/warp-tech/russh) | Memory-safe, zero-cost abstractions, async SSH |

| **TUI Framework** | Rust + [Ratatui](https://ratatui.rs/) | Modern terminal UI framework for Rust |

| **TUI Architecture** | [tui-realm](https://github.com/veeso/tui-realm) | Component-based, event-driven architecture on top of Ratatui |

| **TUI Styling** | Ratatui built-in styles (Tokyo Night theme) | Native style system, no extra dependencies |

| **Markdown Rendering** | [termimad](https://github.com/Canop/termimad) | Terminal markdown rendering for Rust |

| **Frontend** | React 18 + TypeScript + Vite | Modern, fast builds |

| **UI Components** | shadcn/ui + Tailwind | Beautiful, accessible |

| **API Client** | TanStack Query | Caching, loading states |

| **Infrastructure** | Terraform | Infrastructure as Code, reproducible |

| **Cloud** | AWS (EC2, RDS, S3, CloudFront) | Industry standard, free tier, impressive |

| **CI/CD** | GitLab CI | Full pipeline with security scanning |

| **Observability** | Prometheus + Grafana | Industry-standard metrics and dashboards |

| **Rate Limiting** | Rack::Attack (Rails) + IP-based (Rust) | Prevent abuse on API and SSH |

---

## Repository Structure

```
yoursite/
├── api/                      # Rails API application
│   ├── app/
│   │   ├── controllers/
│   │   │   ├── application_controller.rb
│   │   │   ├── posts_controller.rb
│   │   │   ├── projects_controller.rb
│   │   │   ├── resume_controller.rb
│   │   │   └── contacts_controller.rb
│   │   ├── models/
│   │   │   ├── post.rb
│   │   │   ├── project.rb
│   │   │   ├── contact.rb
│   │   │   └── api_key.rb
│   │   └── resources/        # JSON serialization (jsonapi-resources)
│   ├── config/
│   │   ├── routes.rb
│   │   └── database.yml
│   ├── db/
│   │   ├── migrate/
│   │   ├── seeds.rb
│   │   └── schema.rb
│   ├── lib/
│   │   └── tasks/            # Rake tasks for admin operations
│   ├── content/
│   │   └── resume.yaml       # Your resume
│   ├── Gemfile
│   └── Dockerfile
│
├── tui/                      # Rust SSH/TUI application
│   ├── src/
│   │   ├── main.rs           # Entry point, terminal setup, event loop
│   │   ├── model.rs          # Application state (Update trait)
│   │   ├── msg.rs            # Message protocol + ViewId enum
│   │   ├── styles.rs         # Tokyo Night color palette + style helpers
│   │   ├── ui.rs             # View orchestration (mount/unmount)
│   │   ├── content.rs        # JSON content loader (compile-time embed)
│   │   ├── components/       # tui-realm components (Event→Msg bridge)
│   │   │   ├── mod.rs
│   │   │   ├── home.rs       # ASCII logo, typewriter animation, nav menu
│   │   │   ├── resume.rs     # Markdown rendering with scrollbar
│   │   │   ├── blog.rs       # List/detail modes, code block rendering
│   │   │   ├── projects.rs   # Featured badges, tech stack tags
│   │   │   ├── contact.rs    # Multi-field form with validation
│   │   │   └── loading.rs    # Bouncing ball animation
│   │   └── widgets/          # Reusable rendering primitives
│   │       ├── mod.rs
│   │       ├── markdown.rs   # Markdown → styled Line renderer
│   │       ├── page_layout.rs # Header/divider/content/help layout + scrollbar
│   │       ├── code_block.rs # Syntax-highlighted code blocks
│   │       ├── selectable_item.rs # Cursor-navigable list items
│   │       ├── tag_list.rs   # Tech stack badge rendering
│   │       ├── text_input.rs # Focused/unfocused text fields
│   │       ├── text_wrap.rs  # Word wrapping utility
│   │       ├── typewriter.rs # Typing/deleting animation state machine
│   │       └── loading.rs    # Loading state tracker
│   ├── content.json          # Static content (compile-time embedded)
│   ├── Cargo.toml
│   ├── Cargo.lock
│   └── Dockerfile
│
├── web/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── infrastructure/           # Terraform AWS infrastructure
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── terraform.tfvars.example
│   ├── modules/
│   │   ├── networking/       # VPC, subnets, security groups
│   │   ├── database/         # RDS PostgreSQL
│   │   ├── compute/          # EC2 instance(s)
│   │   ├── storage/          # S3 + CloudFront for static
│   │   └── dns/              # Route53
│   └── environments/
│       ├── dev.tfvars
│       └── prod.tfvars
│
├── .gitlab-ci.yml            # GitLab CI/CD pipeline
│
├── docker-compose.yml        # Local development (Postgres, all services, observability)
├── Makefile                  # Root-level commands
└── README.md
```

---

## Database Schema

```ruby
# db/migrate/001_create_posts.rb
class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts, id: :uuid do |t|
      t.string :slug, null: false, index: { unique: true }
      t.string :title, null: false
      t.text :content, null: false          # Markdown
      t.text :excerpt
      t.boolean :published, default: false
      t.datetime :published_at
      t.timestamps
    end
    add_index :posts, [:published, :published_at]
  end
end

# db/migrate/002_create_projects.rb
class CreateProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :projects, id: :uuid do |t|
      t.string :slug, null: false, index: { unique: true }
      t.string :name, null: false
      t.text :description, null: false      # Markdown
      t.string :tech_stack, array: true, default: []
      t.string :url
      t.string :github_url
      t.boolean :featured, default: false
      t.integer :display_order, default: 0
      t.timestamps
    end
  end
end

# db/migrate/003_create_contacts.rb
class CreateContacts < ActiveRecord::Migration[7.1]
  def change
    create_table :contacts, id: :uuid do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.text :message, null: false
      t.boolean :read, default: false
      t.timestamps
    end
  end
end

# db/migrate/004_create_api_keys.rb
class CreateApiKeys < ActiveRecord::Migration[7.1]
  def change
    create_table :api_keys, id: :uuid do |t|
      t.string :key_hash, null: false       # SHA-256 hash
      t.string :name, null: false
      t.datetime :last_used_at
      t.timestamps
    end
  end
end
```

---

## API Endpoints

### Public Endpoints

| Method | Path | Description |

|--------|------|-------------|

| GET | `/api/resume` | Returns resume content + metadata |

| GET | `/api/posts` | List published posts |

| GET | `/api/posts/:slug` | Single post by slug |

| GET | `/api/projects` | List projects |

| GET | `/api/projects/:slug` | Single project |

| POST | `/api/contacts` | Submit contact form |

### Admin Endpoints (API key required)

| Method | Path | Description |

|--------|------|-------------|

| GET | `/api/admin/posts` | All posts including drafts |

| POST | `/api/admin/posts` | Create post |

| PATCH | `/api/admin/posts/:id` | Update post |

| DELETE | `/api/admin/posts/:id` | Delete post |

| GET | `/api/admin/projects` | All projects |

| POST | `/api/admin/projects` | Create project |

| PATCH | `/api/admin/projects/:id` | Update project |

| DELETE | `/api/admin/projects/:id` | Delete project |

| GET | `/api/admin/contacts` | View contact submissions |

---

## Implementation Steps

### Phase 1: Rails API Foundation (Days 1-3)

**Step 1.1: Rails Setup**

```bash
rails new api --api --database=postgresql --skip-test
cd api
```

- Add gems: `pg`, `rack-cors`, `blueprinter` (or use jbuilder), `rack-attack`
- Configure CORS for frontend domain
- Set up UUID primary keys

**Step 1.2: Database + Models**

- Create migrations as shown above
- Add model validations and scopes
- Add `published` scope to Post
- Add `featured` scope to Project

**Step 1.3: Controllers**

- Implement CRUD for posts, projects
- Resume controller reads `content/resume.yaml`
- Contact controller with email notification (optional)
- Admin authentication via `X-API-Key` header

**Step 1.4: Rate Limiting with Rack::Attack**

```ruby
# config/initializers/rack_attack.rb
class Rack::Attack
  # Throttle all requests by IP (300 requests per 5 minutes)
  throttle("req/ip", limit: 300, period: 5.minutes) do |req|
    req.ip
  end

  # Stricter limit on contact form submissions
  throttle("contacts/ip", limit: 5, period: 1.hour) do |req|
    req.ip if req.path == "/api/contacts" && req.post?
  end

  # Strict limit on admin auth attempts
  throttle("admin/ip", limit: 10, period: 15.minutes) do |req|
    req.ip if req.path.start_with?("/api/admin")
  end
end
```

**Step 1.5: Seeds + Rake Tasks**

```ruby
# lib/tasks/admin.rake
namespace :admin do
  desc "Create a new API key"
  task :create_key, [:name] => :environment do |t, args|
    key = SecureRandom.hex(32)
    ApiKey.create!(name: args[:name], key_hash: Digest::SHA256.hexdigest(key))
    puts "API Key: #{key}"
  end
end
```

### Phase 2: Rust SSH/TUI (Days 4-10)

> **Note:** The TUI is built with Rust using Ratatui + tui-realm, not Go/Bubble Tea.
> This demonstrates systems programming, memory safety, and async I/O.

**Step 2.1: Rust Project Setup**

The project is initialized as a Rust binary crate:

```toml
# tui/Cargo.toml
[package]
name = "whoami-tui"
version = "0.1.0"
edition = "2024"
authors = ["Michael Magin"]
description = "A terminal-based portfolio viewer built with Ratatui"

[dependencies]
tuirealm = { version = "3", features = ["derive", "crossterm"] }
ratatui = "0.29"
crossterm = "0.28"
termimad = "0.31"
unicode-width = "0.2"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
once_cell = "1.19"

[[bin]]
name = "tui"
path = "src/main.rs"
```

**Step 2.2: Architecture Overview**

The TUI uses tui-realm's component-based architecture with an event-driven message system:

- **`msg.rs`** — Defines `Msg` enum (NavigateTo, Quit, ScrollUp, TypeChar, etc.) and `ViewId` enum (Loading, Home, Resume, Blog, Projects, Contact) with keyboard shortcut mappings
- **`model.rs`** — `Model` struct with `Update<Msg>` trait impl for centralized state transitions
- **`ui.rs`** — `mount_view()` function that unmounts all components then mounts the active one
- **`content.rs`** — Compile-time JSON embedding via `include_str!()` with lazy deserialization into typed structs
- **`styles.rs`** — Tokyo Night color palette as `const Color` values with helper functions (`title()`, `selected()`, `accent()`, `muted()`, etc.)

**Step 2.3: Components (tui-realm)**

Each view is a pair: an inner `MockComponent` (handles rendering + state) wrapped by an outer `Component` (bridges keyboard events to `Msg`).

- **Loading** — Bouncing ball animation (`( ●    )` → `(    ● )`) with timed auto-transition to Home
- **Home** — ASCII art logo, typewriter animation (type/pause/delete/pause cycle across phrases), j/k navigable menu with shortcut keys
- **Resume** — Markdown rendering via custom `Markdown` widget with word wrapping, scrollbar, page up/down
- **Blog** — List mode (selectable posts with excerpts) and Detail mode (scrollable post with code blocks, tags, metadata)
- **Projects** — Featured-first sorting, tech stack tag badges, GitHub/live URL links
- **Contact** — Tab-navigable form fields (Name, Email, Message, Submit) with client-side validation and success state

**Step 2.4: Reusable Widgets**

- **`PageLayout`** — Standard layout: header → divider → content → divider → help text, with optional `Scrollbar` widget
- **`Markdown`** — Renders markdown headings, lists, bold labels, italics, horizontal rules with styled `Line`/`Span` output
- **`CodeBlock`** — Renders fenced code blocks with language labels and distinct background color
- **`SelectableItem`** — `▶ ` pointer + highlight style for cursor-navigable lists, with optional badges/suffixes
- **`TagList`** — Renders `[tag1] [tag2]` style badges with configurable indent
- **`TextInput`** — Renders labeled text fields with focused/unfocused border styles
- **`text_wrap`** — Word-wrapping utility for reflowing content to terminal width

**Step 2.5: SSH Server Integration**

- Add `russh` crate for async SSH server
- Spawn a Ratatui session per SSH connection (each client gets their own TUI instance)
- Load/generate SSH host keys from disk
- IP-based connection rate limiting (sliding window, reject after threshold)
- Configure port (typically 22 or 2222)

**Step 2.6: Graceful Shutdown**

- Handle `SIGTERM`/`SIGINT` via `tokio::signal` (or `signal-hook` for sync)
- Drain active SSH connections: stop accepting new connections, send "server shutting down" message to active sessions, wait for graceful disconnect with timeout
- Clean up terminal state on crash/panic (crossterm restore already implemented in `main.rs`)

**Step 2.7: API Client**

- Create async HTTP client for Rails API using `reqwest`
- Typed response structs matching API JSON schema
- Error handling with `thiserror` or `anyhow`
- Replace compile-time `content.json` with live API calls (keep JSON fallback for offline/demo mode)

**Step 2.8: Polish**

- Vim-style keybindings (j/k navigation) ✅ already implemented
- Consistent Tokyo Night theme ✅ already implemented
- Loading animation with bouncy ball ✅ already implemented
- Typewriter animation on home ✅ already implemented
- Error states and loading indicators

### Phase 3: React Frontend (Days 11-15)

**Step 3.1: Project Setup**

```bash
npm create vite@latest web -- --template react-ts
cd web
npx shadcn-ui@latest init
```

- Configure Tailwind with terminal-inspired theme
- Set up React Router
- Configure TanStack Query

**Step 3.2: API Integration**

```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  getPosts: () => fetch(`${API_URL}/api/posts`).then(r => r.json()),
  getPost: (slug: string) => fetch(`${API_URL}/api/posts/${slug}`).then(r => r.json()),
  // ... etc
};
```

**Step 3.3: Pages**

- **Home**: Hero with ASCII art, featured projects, recent posts
- **Resume**: Markdown rendering, download PDF link
- **Blog**: List with excerpts, individual post pages
- **Projects**: Cards with tech stack, links
- **Contact**: Form with validation

**Step 3.4: Terminal Vibe Styling**

- Monospace fonts (JetBrains Mono, Fira Code)
- Dark theme with terminal colors (green/amber accents)
- Subtle CRT/scanline effects (optional)
- Typing animations for hero text

### Phase 4: Docker + Local Integration (Days 16-17)

**Step 4.1: Dockerfiles**

```dockerfile
# api/Dockerfile
FROM ruby:3.3-slim
WORKDIR /app
COPY Gemfile* ./
RUN bundle install
COPY . .
EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]
```
```dockerfile
# tui/Dockerfile
FROM rust:1.83-slim AS builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
# Cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release && rm -rf src
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/tui /usr/local/bin/tui
EXPOSE 22
CMD ["tui"]
```

**Step 4.2: Docker Compose (Local Dev)**

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: yoursite_dev
    ports:
     - "5432:5432"
    volumes:
     - postgres_data:/var/lib/postgresql/data
  
  api:
    build: ./api
    ports:
     - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/yoursite_dev
      RAILS_ENV: development
    depends_on:
     - db
  
  tui:
    build: ./tui
    ports:
     - "2222:22"
    environment:
      API_URL: http://api:3000
    depends_on:
     - api
  
  web:
    build: ./web
    ports:
     - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3000

volumes:
  postgres_data:
```

**Step 4.3: Local Testing**

- Run `docker-compose up` and verify all services
- Test SSH: `ssh -p 2222 localhost`
- Test web: `http://localhost:5173`
- Test API: `curl http://localhost:3000/api/posts`

---

### Phase 5: Observability Stack (Days 18-19)

> Show that you don't just deploy code — you monitor its health.
> This phase adds structured logging, Prometheus metrics, and a Grafana dashboard.

**Step 5.1: Structured JSON Logging**

Add structured logging middleware to both services so logs are machine-parseable:

**Rails API:**

```ruby
# config/initializers/lograge.rb
# Add gem 'lograge' to Gemfile
Rails.application.configure do
  config.lograge.enabled = true
  config.lograge.formatter = Lograge::Formatters::Json.new
  config.lograge.custom_payload do |controller|
    {
      request_id: controller.request.request_id,
      user_agent: controller.request.user_agent,
      ip: controller.request.remote_ip
    }
  end
end
```

**Rust SSH Server:**

```rust
// Use tracing + tracing-subscriber with JSON formatting
// Each SSH session gets a span with session_id, client_ip
tracing::info!(
    session_id = %id,
    client_ip = %addr,
    view = "blog",
    "client navigated to view"
);
```

**Step 5.2: Prometheus Metrics**

**Rails API — Add `/metrics` endpoint:**

```ruby
# Add gem 'prometheus-exporter' to Gemfile
# Exposes: http_request_duration_seconds, http_requests_total
# Automatically instruments request count, latency, status codes
```

**Rust SSH Server — Add `/metrics` HTTP endpoint:**

Track these metrics:
- `ssh_active_sessions` (gauge) — currently connected clients
- `ssh_connections_total` (counter) — total connections since startup
- `ssh_session_duration_seconds` (histogram) — how long each session lasts
- `ssh_commands_total` (counter, label: view) — navigation events per view

```rust
// Use prometheus crate to expose metrics on a separate HTTP port (e.g., :9090/metrics)
// Prometheus scrapes this alongside the Rails metrics endpoint
```

**Step 5.3: Grafana Dashboard**

Add Prometheus + Grafana to Docker Compose for local observability:

```yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus:latest
    ports:
     - "9090:9090"
    volumes:
     - ./observability/prometheus.yml:/etc/prometheus/prometheus.yml
    depends_on:
     - api
     - tui

  grafana:
    image: grafana/grafana:latest
    ports:
     - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
     - ./observability/dashboards:/var/lib/grafana/dashboards
     - ./observability/provisioning:/etc/grafana/provisioning
    depends_on:
     - prometheus
```

**Step 5.4: Dashboard Panels**

Create a multi-service health dashboard with:
- API request rate and latency (p50, p95, p99)
- API error rate by status code
- Active SSH sessions (real-time gauge)
- SSH session duration distribution
- TUI view popularity (which views get the most traffic)
- System uptime for both services

> Include a screenshot of this dashboard in your README.

---

### Phase 6: AWS Infrastructure with Terraform (Days 20-23)

**AWS Architecture:**

```mermaid
graph TB
    subgraph aws [AWS Cloud]
        subgraph vpc [VPC]
            subgraph public_subnet [Public Subnet]
                EC2[EC2 Instance]
                ALB[Application Load Balancer]
            end
            subgraph private_subnet [Private Subnet]
                RDS[(RDS PostgreSQL)]
            end
        end
        
        S3[S3 Bucket]
        CF[CloudFront CDN]
        R53[Route53 DNS]
    end
    
    User((User)) --> R53
    R53 --> CF
    R53 --> ALB
    R53 --> EC2
    CF --> S3
    ALB --> EC2
    EC2 --> RDS
```

**Step 6.1: Terraform Setup**

```bash
cd infrastructure
terraform init
```

**Step 6.2: Networking Module**

```hcl
# infrastructure/modules/networking/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public"
  }
}

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidr
  availability_zone = var.availability_zone

  tags = {
    Name = "${var.project_name}-private"
  }
}

resource "aws_security_group" "app" {
  name        = "${var.project_name}-app-sg"
  description = "Security group for app server"
  vpc_id      = aws_vpc.main.id

  # SSH access (for TUI)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP for Rails API
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**Step 6.3: Database Module**

```hcl
# infrastructure/modules/database/main.tf
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet"
  subnet_ids = var.subnet_ids
}

resource "aws_db_instance" "postgres" {
  identifier           = "${var.project_name}-db"
  engine               = "postgres"
  engine_version       = "16"
  instance_class       = "db.t3.micro"  # Free tier eligible
  allocated_storage    = 20
  
  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password
  
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.security_group_id]
  
  skip_final_snapshot  = true  # For dev; set false for prod
  publicly_accessible  = false

  tags = {
    Name = "${var.project_name}-postgres"
  }
}
```

**Step 6.4: Compute Module**

```hcl
# infrastructure/modules/compute/main.tf
resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.small"
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = var.key_name

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl start docker
    systemctl enable docker
    
    # Pull and run containers
    docker pull ${var.api_image}
    docker pull ${var.tui_image}
    
    docker run -d -p 3000:3000 \
      -e DATABASE_URL=${var.database_url} \
      ${var.api_image}
    
    docker run -d -p 22:22 \
      -e API_URL=http://localhost:3000 \
      ${var.tui_image}
  EOF

  tags = {
    Name = "${var.project_name}-app"
  }
}
```

**Step 6.5: Storage Module (Static Site)**

```hcl
# infrastructure/modules/storage/main.tf
resource "aws_s3_bucket" "static" {
  bucket = "${var.project_name}-static"
}

resource "aws_s3_bucket_website_configuration" "static" {
  bucket = aws_s3_bucket.static.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"  # SPA fallback
  }
}

resource "aws_cloudfront_distribution" "static" {
  origin {
    domain_name = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id   = "S3Origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.static.cloudfront_access_identity_path
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # SPA routing - serve index.html for 404s
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.certificate_arn
    ssl_support_method  = "sni-only"
  }
}
```

**Step 6.6: Main Configuration**

```hcl
# infrastructure/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "yoursite-terraform-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

module "networking" {
  source       = "./modules/networking"
  project_name = var.project_name
  # ... other vars
}

module "database" {
  source            = "./modules/database"
  project_name      = var.project_name
  subnet_ids        = [module.networking.private_subnet_id]
  security_group_id = module.networking.db_security_group_id
  # ... other vars
}

module "compute" {
  source            = "./modules/compute"
  project_name      = var.project_name
  subnet_id         = module.networking.public_subnet_id
  security_group_id = module.networking.app_security_group_id
  database_url      = module.database.connection_url
  # ... other vars
}

module "storage" {
  source       = "./modules/storage"
  project_name = var.project_name
  # ... other vars
}
```

**Step 6.7: Apply Infrastructure**

```bash
# Create S3 bucket for state (one-time)
aws s3 mb s3://yoursite-terraform-state

# Initialize and apply
cd infrastructure
terraform init
terraform plan -var-file=environments/dev.tfvars
terraform apply -var-file=environments/dev.tfvars
```

---

### Phase 7: CI/CD Pipeline (Days 24-25)

**Step 7.1: GitLab CI - Pipeline Configuration**

```yaml
# .gitlab-ci.yml
stages:
 - security
 - test
 - build
 - deploy

variables:
  POSTGRES_DB: test_db
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres

# ============ SECURITY STAGE ============

tfsec-scan:
  stage: security
  image:
    name: aquasec/tfsec:latest
    entrypoint: [""]
  script:
  - tfsec infrastructure/ --format json --out tfsec-results.json || true
  - tfsec infrastructure/ --soft-fail
  artifacts:
    reports:
      terraform: tfsec-results.json
    paths:
    - tfsec-results.json
  only:
  - merge_requests
  - main

# ============ TEST STAGE ============

test-api:
  stage: test
  image: ruby:3.3
  services:
  - postgres:16
  variables:
    DATABASE_URL: "postgres://postgres:postgres@postgres:5432/test_db"
  before_script:
  - cd api
  - bundle install
  script:
  - bundle exec rails db:create db:migrate
  - bundle exec rspec
  only:
  - merge_requests
  - main

test-tui:
  stage: test
  image: rust:1.83-slim
  before_script:
  - cd tui
  script:
  - cargo test --release
  - cargo clippy -- -D warnings
  only:
  - merge_requests
  - main

test-web:
  stage: test
  image: node:20
  before_script:
  - cd web
  - npm ci
  script:
  - npm run lint
  - npm run build
  only:
  - merge_requests
  - main

# ============ BUILD STAGE ============

build-api:
  stage: build
  image: docker:latest
  services:
  - docker:dind
  script:
  - docker build -t $CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHA ./api
  - docker push $CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHA
  only:
  - main

build-tui:
  stage: build
  image: docker:latest
  services:
  - docker:dind
  script:
  - docker build -t $CI_REGISTRY_IMAGE/tui:$CI_COMMIT_SHA ./tui
  - docker push $CI_REGISTRY_IMAGE/tui:$CI_COMMIT_SHA
  only:
  - main

build-web:
  stage: build
  image: node:20
  script:
  - cd web
  - npm ci
  - npm run build
  artifacts:
    paths:
   - web/dist/
  only:
  - main

# ============ DEPLOY STAGE ============

deploy-infrastructure:
  stage: deploy
  image: hashicorp/terraform:latest
  script:
  - cd infrastructure
  - terraform init
  - terraform apply -auto-approve -var-file=environments/prod.tfvars
  only:
  - main
  when: manual  # Require manual approval for infra changes

deploy-api:
  stage: deploy
  needs: [build-api, deploy-infrastructure]
  script:
  - ssh $EC2_USER@$EC2_HOST "docker pull $CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHA && docker-compose up -d api"
  only:
  - main

deploy-tui:
  stage: deploy
  needs: [build-tui, deploy-infrastructure]
  script:
  - ssh $EC2_USER@$EC2_HOST "docker pull $CI_REGISTRY_IMAGE/tui:$CI_COMMIT_SHA && docker-compose up -d tui"
  only:
  - main

deploy-web:
  stage: deploy
  needs: [build-web]
  image: amazon/aws-cli:latest
  script:
  - aws s3 sync web/dist s3://$S3_BUCKET --delete
  - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
  only:
  - main
```

**Step 7.2: GitLab CI Variables**

Set these in GitLab → Settings → CI/CD → Variables:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `EC2_HOST` — Your EC2 public IP/DNS
- `EC2_USER` — Usually `ec2-user`
- `S3_BUCKET` — Your static site bucket
- `CLOUDFRONT_ID` — Your distribution ID

---

### Step 7.3: GitLab to GitHub Mirroring

Set up push mirroring so your code appears on GitHub for recruiters:

1. **Create empty GitHub repo** — `github.com/yourusername/yoursite`

2. **Create GitHub Personal Access Token**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Scopes: `repo` (full control)
   - Copy the token

3. **Configure GitLab Push Mirror**
   - GitLab → Your Project → Settings → Repository → Mirroring repositories
   - Git repository URL: `https://yourusername@github.com/yourusername/yoursite.git`
   - Mirror direction: **Push**
   - Password: Your GitHub personal access token
   - Check "Keep divergent refs"

4. **Verify** — Push to GitLab, check GitHub within a few minutes

**Result:**

```
GitLab (primary - where you work)
    ↓ auto-push on every commit
GitHub (mirror - for recruiters/visibility)
```

Your resume links to `github.com/yourusername/yoursite` but you develop in GitLab.

---

## DNS Configuration

| Subdomain | Points To |

|-----------|-----------|

| `yoursite.com` | CloudFront (React SPA) |

| `www.yoursite.com` | CloudFront (React SPA) |

| `api.yoursite.com` | EC2 / ALB (Rails API) |

| `ssh.yoursite.com` | EC2 public IP (Rust SSH, port 22) |

---

## Cost Estimate (AWS Free Tier)

| Resource | Year 1 | After Free Tier |

|----------|--------|-----------------|

| EC2 t3.micro | FREE | ~$8/mo |

| RDS db.t3.micro | FREE | ~$15/mo |

| S3 + CloudFront | FREE (limits) | ~$2/mo |

| Route53 | $0.50/mo | $0.50/mo |

| **Total** | **~$0.50/mo** | **~$25/mo**

---

## Key Code Patterns

### Rails Controller

```ruby
# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def index
    posts = Post.published.order(published_at: :desc)
    render json: PostBlueprint.render_as_hash(posts)
  end

  def show
    post = Post.published.find_by!(slug: params[:slug])
    render json: PostBlueprint.render_as_hash(post)
  end
end
```

### Rust Content Loader (compile-time JSON embed)

```rust
// src/content.rs
use once_cell::sync::Lazy;
use serde::Deserialize;

const CONTENT_JSON: &str = include_str!("../content.json");

#[derive(Debug, Deserialize)]
struct ContentData {
    resume: String,
    bio: String,
    logo: String,
    typewriter_phrases: Vec<String>,
    posts: Vec<PostData>,
    projects: Vec<ProjectData>,
}

static CONTENT: Lazy<ContentData> = Lazy::new(|| {
    serde_json::from_str(CONTENT_JSON).expect("Failed to parse content.json")
});

pub fn resume() -> &'static str { &CONTENT.resume }
pub fn posts() -> &'static [PostData] { &CONTENT.posts }
```

### Rust tui-realm Component Pattern

```rust
// src/components/blog.rs — MockComponent handles rendering
impl MockComponent for BlogMock {
    fn view(&mut self, frame: &mut Frame, area: Rect) {
        match self.mode {
            BlogMode::List => self.render_list(frame, area),
            BlogMode::Detail => self.render_post(frame, area),
        }
    }

    fn perform(&mut self, cmd: Cmd) -> CmdResult {
        match cmd {
            Cmd::Move(Direction::Up) => { self.cursor_up(); CmdResult::Changed(self.state()) }
            Cmd::Move(Direction::Down) => { self.cursor_down(); CmdResult::Changed(self.state()) }
            Cmd::Submit => { self.select(); CmdResult::Changed(self.state()) }
            _ => CmdResult::None,
        }
    }
}

// Component bridges events to Msg
impl Component<Msg, NoUserEvent> for Blog {
    fn on(&mut self, ev: Event<NoUserEvent>) -> Option<Msg> {
        match ev {
            Event::Keyboard(KeyEvent { code: Key::Char('j'), .. }) => {
                self.component.perform(Cmd::Move(Direction::Down));
                Some(Msg::None)
            }
            Event::Keyboard(KeyEvent { code: Key::Enter, .. }) => {
                self.component.perform(Cmd::Submit);
                Some(Msg::None)
            }
            // ...
        }
    }
}
```

---

## Future Improvements (README notes)

- Migrate Rails API to Rust for single-language backend
- Add Rust admin CLI (reusing TUI components)
- WebSocket terminal in React frontend (xterm.js)
- Analytics/view counts
- RSS feed for blog
- Minigame easter egg
- ECS Fargate instead of EC2 for container orchestration
- RDS Multi-AZ for production
- Terraform workspaces for environment isolation
- Pub/Sub live updates — broadcast "live" updates from Rails API (via Postgres LISTEN/NOTIFY) to all active TUI sessions via async channels
- Cross-service integration tests with Playwright (trigger action on Web UI, verify state change via Rails API)
- **AI Summarize in Context Menu** — Right-click selected text → "Summarize with AI" → LLM API call → show summary in tooltip/popover. Could use OpenAI, Claude, or local Ollama. Impressive UX touch for portfolio.

---

## Resources

**Rails:**

- [Rails API Mode Guide](https://guides.rubyonrails.org/api_app.html)
- [Rack::Attack - Rate Limiting](https://github.com/rack/rack-attack)
- [Lograge - Structured Logging](https://github.com/roidrage/lograge)

**Rust TUI:**

- [Ratatui Documentation](https://ratatui.rs/)
- [tui-realm - Component Framework](https://github.com/veeso/tui-realm)
- [termimad - Terminal Markdown](https://github.com/Canop/termimad)
- [russh - Async SSH](https://github.com/warp-tech/russh)
- [crossterm - Terminal Manipulation](https://github.com/crossterm-rs/crossterm)

**React:**

- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)

**Observability:**

- [Prometheus Rust Client](https://github.com/prometheus/client_rust)
- [prometheus-exporter (Rails)](https://github.com/discourse/prometheus_exporter)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)

**Terraform + AWS:**

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [tfsec - Terraform Security Scanner](https://github.com/aquasecurity/tfsec)
- [AWS Free Tier](https://aws.amazon.com/free/)
- [EC2 User Data Scripts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)

**CI/CD:**

- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [GitLab Push Mirroring](https://docs.gitlab.com/ee/user/project/repository/mirror/push.html)
