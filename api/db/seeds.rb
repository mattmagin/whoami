# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Seeding database..."

# Clear existing data
Post.destroy_all
Project.destroy_all

# ============================================
# Posts
# ============================================
posts_data = [
  {
    title: "Building a Terminal UI with Go and Bubble Tea",
    content: <<~MARKDOWN,
      Recently I've been exploring the world of terminal user interfaces (TUIs), and I have to say—Bubble Tea has completely changed how I think about CLI applications.

      ## Why Terminal UIs?

      In an age of web apps and mobile interfaces, why would anyone care about terminal UIs? A few reasons:

      - **Speed**: No browser overhead, instant startup
      - **Accessibility**: Works over SSH, in containers, anywhere
      - **Focus**: No distractions, just you and your workflow

      ## Getting Started with Bubble Tea

      Bubble Tea follows the Elm architecture, which means your app consists of three main components:

      1. **Model** - Your application state
      2. **Update** - How state changes in response to messages
      3. **View** - How to render your state as a string

      ```go
      type model struct {
          cursor int
          items  []string
      }

      func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
          switch msg := msg.(type) {
          case tea.KeyMsg:
              switch msg.String() {
              case "up":
                  m.cursor--
              case "down":
                  m.cursor++
              }
          }
          return m, nil
      }
      ```

      The elegance of this pattern really shines when building complex, stateful applications.

      ## What I Built

      I created a portfolio viewer that fetches data from a Rails API and displays it beautifully in the terminal. Complete with navigation, animations, and even syntax highlighting for code snippets.

      Stay tuned for more posts on this journey!
    MARKDOWN
    published_at: 3.days.ago
  },
  {
    title: "Why I Chose Rails for My API Backend",
    content: <<~MARKDOWN,
      When starting a new project, the framework choice can feel overwhelming. Here's why Rails was the right choice for my portfolio API.

      ## Convention Over Configuration

      Rails' opinionated nature is a feature, not a bug. Instead of spending hours debating folder structure or ORM choices, I can focus on building features.

      ## Rapid Development

      With generators, migrations, and a rich ecosystem of gems, Rails lets me move fast:

      ```bash
      rails g model Post title:string content:text published_at:datetime
      rails db:migrate
      ```

      In two commands, I have a fully-functional model with database backing.

      ## The Ecosystem

      - **Blueprinter** for JSON serialization
      - **RSpec** for testing
      - **Rack CORS** for API security

      These battle-tested tools mean I'm building on solid foundations.

      ## API-Only Mode

      Rails 5+ introduced API-only mode, stripping away the view layer overhead. My app boots faster and has a smaller footprint.

      For a personal project where I'm the only developer, Rails' productivity benefits far outweigh any performance considerations.
    MARKDOWN
    published_at: 1.week.ago
  },
  {
    title: "Deploying with Kamal: A Docker-First Approach",
    content: <<~MARKDOWN,
      Kamal (formerly MRSK) is Basecamp's answer to simple deployment. Here's my experience using it for this portfolio.

      ## What is Kamal?

      Kamal deploys containerized applications to bare metal servers. No Kubernetes complexity, no managed container services—just Docker and SSH.

      ## The Setup

      Configuration lives in a single YAML file:

      ```yaml
      service: portfolio-api
      image: myuser/portfolio-api

      servers:
        web:
          - 192.168.1.100

      registry:
        username: myuser
        password:
          - KAMAL_REGISTRY_PASSWORD
      ```

      ## Deploy in One Command

      ```bash
      kamal deploy
      ```

      That's it. Kamal builds the image, pushes it, and rolls out to your servers with zero downtime.

      ## What I Love

      - **Simplicity**: No cloud-specific lock-in
      - **Control**: I own my servers
      - **Cost**: A $5 VPS is all I need

      For small to medium projects, Kamal hits the sweet spot between simplicity and capability.
    MARKDOWN
    published_at: 2.weeks.ago
  },
  {
    title: "Testing Reading Time Calculations in Ruby",
    content: <<~MARKDOWN,
      A small but important feature: showing estimated reading time for blog posts. Here's how I tested it.

      ## The Requirements

      - Average reading speed: ~200 words per minute
      - Handle edge cases: empty content, very short posts
      - Round to nearest minute

      ## The Implementation

      ```ruby
      module ReadingTime
        WORDS_PER_MINUTE = 200

        def self.estimate(content)
          return 0 if content.blank?

          word_count = content.split.size
          (word_count.to_f / WORDS_PER_MINUTE).ceil
        end
      end
      ```

      ## Testing Edge Cases

      RSpec makes it easy to cover all scenarios:

      ```ruby
      describe ReadingTime do
        it "returns 0 for empty content" do
          expect(described_class.estimate("")).to eq(0)
        end

        it "rounds up partial minutes" do
          content = "word " * 201
          expect(described_class.estimate(content)).to eq(2)
        end
      end
      ```

      Small utilities like this benefit greatly from comprehensive test coverage.
    MARKDOWN
    published_at: 3.weeks.ago
  },
  {
    title: "Crafting a Developer Portfolio That Stands Out",
    content: <<~MARKDOWN,
      Your portfolio is your handshake with the tech world. Here's my philosophy on making it memorable.

      ## Show, Don't Tell

      Anyone can list technologies on a resume. A portfolio lets you demonstrate your skills:

      - **Clean code**: Link to GitHub repos
      - **Problem solving**: Explain your approach
      - **Communication**: Write about your journey

      ## The Tech Stack Choice

      I deliberately chose an unconventional stack—a Go terminal client talking to a Rails API. Why?

      1. It's memorable
      2. It demonstrates systems thinking
      3. It shows I can work across paradigms

      ## Content Over Flash

      Fancy animations are nice, but recruiters care about substance. Focus on:

      - Clear project descriptions
      - Measurable outcomes
      - Your unique perspective

      ## Keep It Updated

      A stale portfolio signals disengagement. Regular blog posts show you're actively learning and growing.

      Your portfolio is a living document—treat it that way.
    MARKDOWN
    published_at: 1.month.ago
  }
]

posts_data.each do |post_attrs|
  Post.create!(post_attrs)
  puts "  Created post: #{post_attrs[:title]}"
end

# ============================================
# Projects
# ============================================
projects_data = [
  {
    name: "Portfolio TUI",
    description: "A terminal-based portfolio viewer built with Go and Bubble Tea. Features smooth animations, keyboard navigation, and real-time data fetching from a Rails API. Demonstrates how TUIs can be both functional and beautiful.",
    technologies: %w[Go BubbleTea Lipgloss REST],
    published_at: 1.week.ago
  },
  {
    name: "Portfolio API",
    description: "RESTful API backend powering the portfolio. Built with Rails 8 in API-only mode. Features include blog posts with reading time estimation, project showcases, and a contact form. Deployed with Kamal to a VPS.",
    technologies: %w[Ruby Rails PostgreSQL Docker Kamal],
    published_at: 1.week.ago
  },
  {
    name: "Task Flow",
    description: "A kanban-style task management app with drag-and-drop interface. Real-time updates via WebSockets keep all connected clients in sync. Supports multiple boards, labels, and due dates.",
    technologies: %w[React TypeScript Rails ActionCable PostgreSQL],
    published_at: 2.months.ago
  },
  {
    name: "Code Review Bot",
    description: "GitHub App that provides automated code review comments using static analysis. Integrates with CI pipelines to catch common issues before human review. Reduced review cycles by 30% on team projects.",
    technologies: %w[Python FastAPI GitHub-API Docker],
    published_at: 4.months.ago
  },
  {
    name: "Expense Tracker CLI",
    description: "Command-line expense tracking with SQLite storage and beautiful terminal output. Supports categories, recurring expenses, and monthly reports. Syncs to a simple REST API for backup.",
    technologies: %w[Rust SQLite REST],
    published_at: 6.months.ago
  },
  {
    name: "Weather Dashboard",
    description: "Minimal weather dashboard aggregating data from multiple APIs. Features geolocation, 7-day forecasts, and severe weather alerts. Designed with accessibility in mind—fully keyboard navigable.",
    technologies: %w[Vue.js Tailwind OpenWeatherAPI Netlify],
    published_at: 8.months.ago
  }
]

projects_data.each do |project_attrs|
  Project.create!(project_attrs)
  puts "  Created project: #{project_attrs[:name]}"
end

puts "Seeding complete!"
puts "  #{Post.count} posts created"
puts "  #{Project.count} projects created"
