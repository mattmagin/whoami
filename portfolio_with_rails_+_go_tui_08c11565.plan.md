---
name: Portfolio with Rails + Go TUI
overview: Build a personal portfolio with a Rails API backend, PostgreSQL database, Go-based SSH TUI for terminal access, and a React frontend — demonstrating full-stack skills across multiple languages.
todos:
  - id: phase1-rails
    content: "Phase 1: Rails API - Setup, models, migrations, controllers, API key auth"
    status: pending
  - id: phase2-tui
    content: "Phase 2: Go SSH/TUI - Wish server, API client, Bubble Tea views"
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
  - id: phase5-terraform
    content: "Phase 5: AWS Infrastructure with Terraform - VPC, EC2, RDS, S3, CloudFront"
    status: pending
    dependencies:
      - phase4-docker
  - id: phase6-cicd
    content: "Phase 6: CI/CD Pipeline - GitLab CI for test, build, deploy"
    status: pending
    dependencies:
      - phase5-terraform
  - id: phase6-mirror
    content: "Phase 6: Set up GitLab to GitHub repo mirroring for visibility"
    status: pending
    dependencies:
      - phase6-cicd
---

# Personal Portfolio: Rails API + Go SSH TUI + React Frontend

## What You're Building

A personal website with three distinct interfaces sharing one Rails API:

1. **Public Website** — React SPA for web visitors
2. **Public SSH TUI** — Go/Bubble Tea terminal interface via `ssh yoursite.com`
3. **Admin** — Rails console + rake tasks (or optional Go admin CLI)

---

## Architecture

```mermaid
graph TB
    subgraph aws [AWS - Managed by Terraform]
        subgraph vpc [VPC]
            subgraph ec2 [EC2 Instance]
                Rails[Rails API :3000]
                GoSSH[Go SSH Server :22]
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
    
    User((Web User)) --> Route53
    SSHUser((SSH User)) --> Route53
    Route53 --> CloudFront
    Route53 --> GoSSH
    CloudFront --> S3
    S3 --> ReactSPA[React SPA]
    Rails --> RDS
    GoSSH --> Rails
    TF --> aws
    GHA --> aws
```

**Three ways to access your site:**

1. `https://yoursite.com` - React SPA via CloudFront
2. `ssh yoursite.com` - Go TUI via Wish
3. `https://api.yoursite.com` - Rails API directly

---

## Technology Stack

| Component | Technology | Why |

|-----------|------------|-----|

| **API** | Rails 7 (API mode) | Fast development, familiar, great conventions |

| **Database** | PostgreSQL | Industry standard, excellent Rails integration |

| **ORM** | Active Record | Built into Rails, migrations, validations |

| **SSH Server** | Go + [Wish](https://github.com/charmbracelet/wish) | Charm ecosystem, easy SSH setup |

| **TUI** | Go + [Bubble Tea](https://github.com/charmbracelet/bubbletea) | Best-in-class terminal UI framework |

| **TUI Styling** | [Lip Gloss](https://github.com/charmbracelet/lipgloss) | CSS-like styling for terminals |

| **Markdown Rendering** | [Glamour](https://github.com/charmbracelet/glamour) | Beautiful terminal markdown |

| **Frontend** | React 18 + TypeScript + Vite | Modern, fast builds |

| **UI Components** | shadcn/ui + Tailwind | Beautiful, accessible |

| **API Client** | TanStack Query | Caching, loading states |

| **Infrastructure** | Terraform | Infrastructure as Code, reproducible |

| **Cloud** | AWS (EC2, RDS, S3, CloudFront) | Industry standard, free tier, impressive |

| **CI/CD** | GitHub Actions | Free, integrated with repo |

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
│   │   └── serializers/      # JSON serialization (jbuilder or blueprinter)
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
│   │   └── resume.md         # Your resume
│   ├── Gemfile
│   └── Dockerfile
│
├── tui/                      # Go SSH/TUI application
│   ├── cmd/
│   │   └── server/
│   │       └── main.go       # SSH server entry point
│   ├── internal/
│   │   ├── api/              # Rails API client
│   │   │   └── client.go
│   │   ├── ssh/              # Wish SSH server setup
│   │   │   └── server.go
│   │   └── tui/              # Bubble Tea application
│   │       ├── app.go
│   │       ├── styles.go
│   │       └── views/
│   │           ├── home.go
│   │           ├── resume.go
│   │           ├── blog.go
│   │           ├── projects.go
│   │           └── contact.go
│   ├── go.mod
│   ├── go.sum
│   ├── Makefile
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
├── docker-compose.yml        # Local development (Postgres, all services)
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

- Add gems: `pg`, `rack-cors`, `blueprinter` (or use jbuilder)
- Configure CORS for frontend domain
- Set up UUID primary keys

**Step 1.2: Database + Models**

- Create migrations as shown above
- Add model validations and scopes
- Add `published` scope to Post
- Add `featured` scope to Project

**Step 1.3: Controllers**

- Implement CRUD for posts, projects
- Resume controller reads `content/resume.md`
- Contact controller with email notification (optional)
- Admin authentication via `X-API-Key` header

**Step 1.4: Seeds + Rake Tasks**

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

### Phase 2: Go SSH/TUI (Days 4-8)

**Step 2.1: Go Project Setup**

```bash
cd tui
go mod init github.com/yourusername/yoursite-tui
```

- Add dependencies: bubbletea, wish, lipgloss, glamour

**Step 2.2: API Client**

- Create HTTP client for Rails API
- Struct types matching API responses
- Error handling and retries

**Step 2.3: SSH Server**

- Set up Wish server with Bubble Tea middleware
- Generate/load SSH host keys
- Configure port (typically 22 or 2222)

**Step 2.4: TUI Views**

- **Home**: ASCII art, navigation menu
- **Resume**: Fetch from API, render with Glamour
- **Blog**: List view with pagination, detail view
- **Projects**: Grid/list with tech stack badges
- **Contact**: Text input form, submit to API

**Step 2.5: Polish**

- Vim-style keybindings (j/k navigation)
- Consistent styling with Lip Gloss
- Loading spinners
- Error states

### Phase 3: React Frontend (Days 9-13)

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

### Phase 4: Docker + Local Integration (Days 14-15)

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
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN go build -o server ./cmd/server

FROM alpine:latest
COPY --from=builder /app/server /server
EXPOSE 22
CMD ["/server"]
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

### Phase 5: AWS Infrastructure with Terraform (Days 16-19)

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

**Step 5.1: Terraform Setup**

```bash
cd infrastructure
terraform init
```

**Step 5.2: Networking Module**

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

**Step 5.3: Database Module**

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

**Step 5.4: Compute Module**

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

**Step 5.5: Storage Module (Static Site)**

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

**Step 5.6: Main Configuration**

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

**Step 5.7: Apply Infrastructure**

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

### Phase 6: CI/CD Pipeline (Days 20-21)

**Step 6.1: GitLab CI - Pipeline Configuration**

```yaml
# .gitlab-ci.yml
stages:
 - test
 - build
 - deploy

variables:
  POSTGRES_DB: test_db
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres

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
  image: golang:1.22
  script:
  - cd tui
  - go test ./...
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

**Step 6.2: GitLab CI Variables**

Set these in GitLab → Settings → CI/CD → Variables:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `EC2_HOST` — Your EC2 public IP/DNS
- `EC2_USER` — Usually `ec2-user`
- `S3_BUCKET` — Your static site bucket
- `CLOUDFRONT_ID` — Your distribution ID

---

### Step 6.3: GitLab to GitHub Mirroring

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

| `ssh.yoursite.com` | EC2 public IP (Go SSH, port 22) |

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

### Go API Client

```go
// internal/api/client.go
type Client struct {
    baseURL    string
    httpClient *http.Client
}

func (c *Client) GetPosts() ([]Post, error) {
    resp, err := c.httpClient.Get(c.baseURL + "/api/posts")
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var posts []Post
    if err := json.NewDecoder(resp.Body).Decode(&posts); err != nil {
        return nil, err
    }
    return posts, nil
}
```

### Bubble Tea View

```go
// internal/tui/views/blog.go
type BlogModel struct {
    client   *api.Client
    posts    []api.Post
    cursor   int
    loading  bool
}

func (m BlogModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.KeyMsg:
        switch msg.String() {
        case "j", "down":
            if m.cursor < len(m.posts)-1 {
                m.cursor++
            }
        case "k", "up":
            if m.cursor > 0 {
                m.cursor--
            }
        case "enter":
            // Navigate to post detail
        }
    case postsLoadedMsg:
        m.posts = msg.posts
        m.loading = false
    }
    return m, nil
}
```

---

## Future Improvements (README notes)

- Migrate Rails API to Go for single-language backend
- Add Go admin CLI (reusing TUI components)
- WebSocket terminal in React frontend (xterm.js)
- Analytics/view counts
- RSS feed for blog
- Minigame easter egg
- ECS Fargate instead of EC2 for container orchestration
- RDS Multi-AZ for production
- Terraform workspaces for environment isolation
- **AI Summarize in Context Menu** — Right-click selected text → "Summarize with AI" → LLM API call → show summary in tooltip/popover. Could use OpenAI, Claude, or local Ollama. Impressive UX touch for portfolio.

---

## Resources

**Rails:**

- [Rails API Mode Guide](https://guides.rubyonrails.org/api_app.html)

**Go TUI:**

- [Bubble Tea Tutorials](https://github.com/charmbracelet/bubbletea/tree/master/tutorials)
- [Wish Examples](https://github.com/charmbracelet/wish/tree/main/examples)
- [Glamour - Terminal Markdown](https://github.com/charmbracelet/glamour)
- [Lip Gloss - Terminal Styling](https://github.com/charmbracelet/lipgloss)

**React:**

- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)

**Terraform + AWS:**

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [AWS Free Tier](https://aws.amazon.com/free/)
- [EC2 User Data Scripts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)

**CI/CD:**

- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [GitLab Push Mirroring](https://docs.gitlab.com/ee/user/project/repository/mirror/push.html)