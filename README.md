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
| **API** | Ruby on Rails (API mode), PostgreSQL |
| **SSH/TUI** | Go, Bubble Tea, Wish, Lip Gloss, Glamour |
| **Infrastructure** | Terraform, AWS (EC2, RDS, S3, CloudFront) |
| **CI/CD** | GitLab CI, Docker |

## 📁 Project Structure

```
.
├── api/                 # Rails API backend
├── tui/                 # Go SSH server + Terminal UI (public)
├── admin/               # Go CLI for content management (local)
├── web/                 # React frontend
├── infrastructure/      # Terraform AWS modules
├── content/            
│   └── resume.md        # Your resume (markdown)
├── docker-compose.yml   # Local development
└── .gitlab-ci.yml       # CI/CD pipeline
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Ruby 3.3+ (for API development)
- Go 1.22+ (for TUI development)
- Node 20+ (for web development)
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
# - API:  http://localhost:3000
# - SSH:  ssh -p 2222 localhost
```

### Individual Services

```bash
# Rails API
cd api
bundle install
rails db:setup
rails server

# Go TUI
cd tui
go run ./cmd/server

# React Frontend
cd web
npm install
npm run dev
```

## 🔧 Configuration

Copy the example env files and configure:

```bash
cp api/.env.example api/.env
cp tui/.env.example tui/.env
cp web/.env.example web/.env
```

See [AGENTS.md](./AGENTS.md) for full environment variable reference.

## 🏗 Infrastructure

Infrastructure is managed with Terraform:

```bash
cd infrastructure

# Initialize
terraform init

# Preview changes
terraform plan -var-file=environments/dev.tfvars

# Apply
terraform apply -var-file=environments/dev.tfvars
```

### AWS Resources

- **EC2** — Runs Rails API + Go SSH server
- **RDS** — PostgreSQL database
- **S3 + CloudFront** — React static site hosting
- **Route53** — DNS management

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
- **TUI**: Modify styles in `tui/internal/tui/styles.go`

## 🧪 Testing

```bash
# All tests
docker-compose run --rm api bundle exec rspec
docker-compose run --rm tui go test ./...
docker-compose run --rm web npm test

# Individual
cd api && bundle exec rspec
cd tui && go test ./...
cd web && npm test
```

## 📦 Deployment

Deployments are automated via GitLab CI on merge to `main`:

1. Tests run on all merge requests
2. Docker images built and pushed
3. Terraform applies infrastructure changes
4. Services deployed to EC2
5. React app synced to S3, CloudFront invalidated

### Manual Deploy

```bash
# Build images
docker build -t yoursite/api ./api
docker build -t yoursite/tui ./tui

# Deploy web
cd web && npm run build
aws s3 sync dist/ s3://your-bucket --delete
```

## 🗺 Roadmap

- [x] Project setup
- [ ] Rails API with PostgreSQL
- [ ] Go SSH/TUI server (public)
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
