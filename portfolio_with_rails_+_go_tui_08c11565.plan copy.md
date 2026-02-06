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
  - id: phase7-admin-cli
    content: "Phase 7: Admin CLI - Local Bubble Tea TUI for editing posts/projects via API"
    status: pending
    dependencies:
      - phase2-tui
---

