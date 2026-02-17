# yourname.dev

> A personal portfolio accessible via **web browser** or **SSH terminal**. Because why choose one when you can have both?

```
$ ssh yoursite.com

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ██╗   ██╗ ██████╗ ██╗   ██╗██████╗                      │
│    ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗                     │
│     ╚████╔╝ ██║   ██║██║   ██║██████╔╝                     │
│      ╚██╔╝  ██║   ██║██║   ██║██╔══██╗                     │
│       ██║   ╚██████╔╝╚██████╔╝██║  ██║                     │
│       ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝                     │
│                                                             │
│    Software Engineer                                        │
│                                                             │
│    [r] Resume   [b] Blog   [p] Projects   [c] Contact      │
│                                                             │
│    ↑/↓ Navigate   Enter Select   q Quit                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

- **Dual Interface** — Same content, two experiences:
  - 🌐 Modern React web app at `yoursite.com`
  - 💻 Terminal UI via `ssh yoursite.com`
- **Admin CLI** — Local TUI for managing content (because GUIs are overrated)
- **Resume** — Markdown-based, always up to date
- **Blog** — Technical posts with syntax highlighting
- **Projects** — Showcase with live links and tech stacks
- **Contact** — Reach out from terminal or web

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, TypeScript, Vite, Tailwind, shadcn/ui |
| **API** | Hono (Bun), PostgreSQL |
| **SSH/TUI** | Rust, Ratatui, Tuirealm, russh |
| **Infrastructure** | Terraform, Railway |
| **CI/CD** | GitLab CI, Docker |

## 📁 Project Structure

```
.
├── web/                 # React frontend + Hono API
├── tui/                 # Rust SSH server + Terminal UI (public)
├── admin/               # Future local CLI for content management
├── infra/               # Terraform Railway resources
└── .gitlab-ci.yml       # CI/CD pipeline
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Bun 1.x (for web/API development)
- Rust stable (for TUI development)
- Node 20+ (optional for web tooling)
- Terraform 1.5+ (for infrastructure)

### Local Development

```bash
# Clone the repo
git clone git@gitlab.com:yourusername/yoursite.git
cd yoursite

# Start all services
docker-compose up

# Access:
# - Web:  http://localhost:5173
# - API:  http://localhost:3001
# - SSH:  ssh -p 2222 localhost
```

### Individual Services

```bash
# Rust SSH TUI
cd tui
cargo run --bin ssh-server

# React Frontend
cd web
bun install
bun run dev
```

## 🔧 Configuration

Copy the example env files and configure:

```bash
cp web/.env.example web/.env
```

See [AGENTS.md](./AGENTS.md) for full environment variable reference.

## 🏗 Infrastructure

Infrastructure is managed with Terraform:

```bash
cd infra

# Initialize
terraform init

# Preview changes
terraform plan -var-file=terraform.tfvars

# Apply
terraform apply -var-file=terraform.tfvars
```

### Railway Resources

- **web** — Bun server (React SPA + Hono API)
- **tui** — Rust SSH server (`russh`) for terminal portfolio access
- **postgres** — Managed PostgreSQL service

## 📡 API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resume` | GET | Resume content |
| `/api/posts` | GET | List blog posts |
| `/api/posts/:slug` | GET | Single post |
| `/api/projects` | GET | List projects |
| `/api/contacts` | POST | Submit contact |

## 🎨 Customization

### Resume

Edit `content/resume.md` with your details. Supports full markdown with frontmatter:

```markdown
---
name: Your Name
title: Software Engineer
email: you@example.com
github: yourusername
linkedin: yourusername
---

## Experience

### Company Name — Role
*Jan 2023 - Present*

- Did amazing things
- Built cool stuff
```

### Theming

- **Web**: Customize in `web/tailwind.config.js`
- **TUI**: Modify styles in `tui/src/styles.rs`

## 🧪 Testing

```bash
# All tests
cd tui && cargo test
cd web && bun test

# Individual
cd tui && cargo test
cd web && bun test
```

## 📦 Deployment

Deployments are currently managed manually in Railway while infrastructure automation is being reworked:

1. Tests run in GitHub Actions (`ci.yml`) on pull requests and `main`
2. Services are configured/deployed manually in Railway

### Manual Deploy

```bash
# Build images
docker build -t yoursite/web ./web
docker build -t yoursite/tui ./tui

# Connect to SSH TUI after deploy
ssh -p <railway-tcp-port> <railway-generated-domain>
```

### GitHub Actions CI

This repository now includes:

- `.github/workflows/ci.yml` for web and TUI checks on pushes and pull requests.

## 🗺 Roadmap

- [x] Project setup
- [x] Hono API with PostgreSQL
- [x] Rust SSH/TUI server (public)
- [ ] React frontend with terminal aesthetic
- [ ] Docker containerization
- [ ] Terraform AWS infrastructure
- [ ] GitLab CI/CD pipeline
- [ ] GitHub mirror for visibility
- [ ] Admin CLI for content management (local TUI)

### Future Ideas

- [ ] WebSocket terminal in browser (xterm.js)
- [ ] Migrate API to Go (single language backend)
- [ ] RSS feed for blog
- [ ] View analytics
- [ ] Easter egg minigame 🎮

## 📄 License

MIT © Your Name

---

<p align="center">
  <strong>🌐 <a href="https://yoursite.com">yoursite.com</a></strong>
  &nbsp;•&nbsp;
  <strong>💻 <code>ssh yoursite.com</code></strong>
</p>
