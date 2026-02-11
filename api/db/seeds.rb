# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

require 'yaml'

puts "Seeding database..."

# Clear existing data (posts first due to foreign key)
Post.destroy_all
Project.destroy_all
Resume.destroy_all

# Helper: attach a feature image from db/seeds/images/ if one exists for the given slug.
# Looks for any common image extension (jpg, jpeg, png, webp, gif).
SEED_IMAGES_DIR = Rails.root.join('db', 'seeds', 'images')
IMAGE_EXTENSIONS = %w[.jpg .jpeg .png .webp .gif].freeze

def attach_feature_image(post)
  IMAGE_EXTENSIONS.each do |ext|
    path = SEED_IMAGES_DIR.join("#{post.slug}#{ext}")
    next unless File.exist?(path)

    post.feature_image.attach(
      io: File.open(path),
      filename: "#{post.slug}#{ext}",
      content_type: Marcel::MimeType.for(extension: ext.delete('.'))
    )
    puts "    Attached feature image: #{post.slug}#{ext}"
    return
  end
  puts "    No feature image found for: #{post.slug}"
end

# ============================================
# Projects (created first so posts can reference them)
# ============================================
projects_data = [
  {
    slug: "portfolio-tui",
    name: "Portfolio TUI",
    excerpt: "A terminal-based portfolio viewer with smooth animations and keyboard navigation.",
    description: "A terminal-based portfolio viewer built with Go and Bubble Tea. Features smooth animations, keyboard navigation, and real-time data fetching from a Rails API. Demonstrates how TUIs can be both functional and beautiful.",
    tech_stack: %w[Go BubbleTea Lipgloss REST],
    github_url: "https://github.com/example/portfolio-tui",
    featured: true,
    published_at: 1.week.ago
  },
  {
    slug: "portfolio-api",
    name: "Portfolio API",
    excerpt: "RESTful API backend powering the portfolio with Rails 8 in API-only mode.",
    description: "RESTful API backend powering the portfolio. Built with Rails 8 in API-only mode. Features include blog posts with reading time estimation, project showcases, and a contact form. Deployed with Kamal to a VPS.",
    tech_stack: %w[Ruby Rails PostgreSQL Docker Kamal],
    github_url: "https://github.com/example/portfolio-api",
    featured: true,
    published_at: 1.week.ago
  },
  {
    slug: "task-flow",
    name: "Task Flow",
    excerpt: "A kanban-style task management app with real-time WebSocket updates.",
    description: "A kanban-style task management app with drag-and-drop interface. Real-time updates via WebSockets keep all connected clients in sync. Supports multiple boards, labels, and due dates.",
    tech_stack: %w[React TypeScript Rails ActionCable PostgreSQL],
    url: "https://taskflow.example.com",
    github_url: "https://github.com/example/task-flow",
    featured: true,
    published_at: 2.months.ago
  },
  {
    slug: "code-review-bot",
    name: "Code Review Bot",
    excerpt: "GitHub App providing automated code review using static analysis.",
    description: "GitHub App that provides automated code review comments using static analysis. Integrates with CI pipelines to catch common issues before human review. Reduced review cycles by 30% on team projects.",
    tech_stack: %w[Python FastAPI GitHub-API Docker],
    github_url: "https://github.com/example/code-review-bot",
    featured: false,
    published_at: 4.months.ago
  },
  {
    slug: "expense-tracker-cli",
    name: "Expense Tracker CLI",
    excerpt: "Command-line expense tracking with SQLite and beautiful terminal output.",
    description: "Command-line expense tracking with SQLite storage and beautiful terminal output. Supports categories, recurring expenses, and monthly reports. Syncs to a simple REST API for backup.",
    tech_stack: %w[Rust SQLite REST],
    github_url: "https://github.com/example/expense-tracker",
    featured: false,
    published_at: 6.months.ago
  },
  {
    slug: "weather-dashboard",
    name: "Weather Dashboard",
    excerpt: "Minimal weather dashboard with geolocation and accessibility-first design.",
    description: "Minimal weather dashboard aggregating data from multiple APIs. Features geolocation, 7-day forecasts, and severe weather alerts. Designed with accessibility in mind—fully keyboard navigable.",
    tech_stack: %w[Vue.js Tailwind OpenWeatherAPI Netlify],
    url: "https://weather.example.com",
    featured: false,
    published_at: 8.months.ago
  }
]

projects = {}
projects_data.each do |project_attrs|
  project = Project.create!(project_attrs)
  projects[project_attrs[:slug]] = project
  puts "  Created project: #{project_attrs[:name]}"
end

# ============================================
# Posts (some linked to projects)
# ============================================
posts_data = [
  {
    slug: "building-a-terminal-ui-with-go-and-bubble-tea",
    title: "Building a Terminal UI with Go and Bubble Tea",
    excerpt: "A deep dive into building rich terminal user interfaces with Go's Bubble Tea framework — from the Elm architecture to styling with Lip Gloss and fetching live data over REST.",
    tags: %w[Go TUI BubbleTea CLI],
    project: projects["portfolio-tui"],
    content: <<~'MARKDOWN',
      I've spent the last few weeks building a terminal-based portfolio viewer, and it completely changed how I think about CLI applications. Not the usual `--help` flag and plain text output kind of CLI, but a full interactive interface — navigation, animations, live data — all inside a terminal.

      The secret weapon? [Bubble Tea](https://github.com/charmbracelet/bubbletea), a Go framework for building terminal apps using the Elm architecture.

      ## Why build a TUI in 2026?

      It's a fair question. We have React, we have native apps, we have Electron. Why would anyone voluntarily render pixels with ANSI escape codes?

      A few reasons stood out to me:

      - **Universal access.** A terminal is the one interface every developer already has. It works over SSH, inside containers, on a Raspberry Pi, in a CI runner. No browser required, no GPU needed.
      - **Speed.** There is no DOM, no layout engine, no style recalculation. Bubble Tea apps start in milliseconds and respond to input on the same frame.
      - **Focus.** A terminal app is inherently distraction-free. There are no push notifications competing for attention, no cookie banners, no ads in the sidebar.
      - **It's just cool.** Let's be honest — there's something deeply satisfying about a polished terminal interface. It signals craft.

      The developer tools renaissance has made TUIs genuinely viable again. Tools like [lazygit](https://github.com/jesseduffield/lazygit), [k9s](https://k9scli.io/), and [bottom](https://github.com/ClementTsang/bottom) have shown that terminal applications can be beautiful, intuitive, and powerful.

      ## The Elm Architecture in Go

      Bubble Tea borrows the Elm architecture wholesale: your entire application is expressed as three functions operating on an immutable model.

      ```go
      // Model holds all application state
      type model struct {
          tabs     []string
          active   int
          posts    []Post
          loading  bool
          err      error
          width    int
          height   int
      }

      // Init returns the initial command (e.g., fetch data)
      func (m model) Init() tea.Cmd {
          return fetchPosts
      }

      // Update processes messages and returns new state
      func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
          switch msg := msg.(type) {
          case tea.KeyMsg:
              switch msg.String() {
              case "tab":
                  m.active = (m.active + 1) % len(m.tabs)
              case "q", "ctrl+c":
                  return m, tea.Quit
              }
          case tea.WindowSizeMsg:
              m.width = msg.Width
              m.height = msg.Height
          case postsMsg:
              m.posts = msg.posts
              m.loading = false
          case errMsg:
              m.err = msg.err
              m.loading = false
          }
          return m, nil
      }

      // View renders the current state as a string
      func (m model) View() string {
          if m.loading {
              return "Loading..."
          }
          return renderTabs(m) + "\n" + renderContent(m)
      }
      ```

      If you've used React or Redux, this will feel immediately familiar. State goes in, a string comes out, and the framework handles the diff and rendering. The key difference is that your "DOM" is a single string of characters, which makes reasoning about layout surprisingly straightforward.

      ## Styling with Lip Gloss

      Raw ANSI codes are nobody's idea of a good time. Lip Gloss, Bubble Tea's companion library, provides a CSS-like API for terminal styling:

      ```go
      import "github.com/charmbracelet/lipgloss"

      var (
          titleStyle = lipgloss.NewStyle().
              Bold(true).
              Foreground(lipgloss.Color("#7c3aed")).
              MarginBottom(1)

          cardStyle = lipgloss.NewStyle().
              Border(lipgloss.RoundedBorder()).
              BorderForeground(lipgloss.Color("#4a7c59")).
              Padding(1, 2).
              Width(60)

          activeTab = lipgloss.NewStyle().
              Bold(true).
              Foreground(lipgloss.Color("#7c3aed")).
              BorderBottom(true).
              BorderForeground(lipgloss.Color("#7c3aed"))
      )
      ```

      You compose styles, apply them to strings, and Lip Gloss handles the escape codes. It supports borders, padding, margins, alignment, and even inline color gradients. Building a consistent design system for a terminal app becomes almost as ergonomic as working with Tailwind.

      ## Fetching live data

      The portfolio TUI doesn't hardcode any content — it fetches everything from the Rails API at runtime. Bubble Tea's command system makes async operations clean:

      ```go
      func fetchPosts() tea.Msg {
          resp, err := http.Get(os.Getenv("API_URL") + "/api/posts")
          if err != nil {
              return errMsg{err}
          }
          defer resp.Body.Close()

          var posts []Post
          if err := json.NewDecoder(resp.Body).Decode(&posts); err != nil {
              return errMsg{err}
          }
          return postsMsg{posts}
      }
      ```

      Commands are just functions that return a message. Bubble Tea runs them asynchronously and delivers the result back through `Update`. No goroutine management, no channels, no mutexes — just pure functions.

      ## Lessons learned

      After a few weeks of building with Bubble Tea, a few things stand out:

      1. **Start with the model.** Nail down your state shape before writing any view code. Everything flows from the model.
      2. **Keep views pure.** If your `View()` function is making decisions about state transitions, you've gone wrong. It should only transform state into strings.
      3. **Compose with sub-models.** Large apps should break into smaller Bubble Tea models that forward messages to each other. Think of them like components.
      4. **Test the Update function.** Since it's a pure function (state + message = new state), it's trivially testable without any UI framework overhead.

      ## What's next

      The TUI is live and accessible over SSH. In the next post, I'll cover how I set up the Wish SSH server and wired it into the Bubble Tea application — turning `ssh portfolio.example.com` into a fully interactive experience.
    MARKDOWN
    published_at: 3.days.ago
  },
  {
    slug: "why-i-chose-rails-for-my-api-backend",
    title: "Why I Chose Rails for My API Backend",
    excerpt: "In a world of microservices and serverless, Rails remains a remarkably productive choice for building APIs. Here's the case for convention over configuration in 2026.",
    tags: %w[Rails Ruby API Backend],
    project: projects["portfolio-api"],
    content: <<~'MARKDOWN',
      Every new project starts with the same question: what framework do I use? For my portfolio's API backend, I needed something that would let me move fast, produce clean code, and not fight me on conventions. I chose Rails, and I haven't regretted it for a second.

      This isn't a "Rails vs. X" post. It's a practical account of why Rails was the right tool for this particular job, and what I've learned along the way.

      ## The problem I was solving

      The portfolio has three consumers: a React web frontend, a Go terminal UI, and (eventually) an admin CLI. All three need the same data — blog posts, projects, resume content, and a contact form endpoint. That means a clean JSON API with consistent conventions.

      The requirements weren't exotic:

      - CRUD for posts and projects
      - Markdown content with reading time estimation
      - Tag and technology filtering
      - API key authentication for admin routes
      - UUID primary keys for external-facing IDs
      - Clean error responses

      No WebSockets, no real-time sync, no complex authorization matrix. Just a solid, well-structured REST API.

      ## Convention over configuration, revisited

      Rails' most powerful feature isn't any single gem or pattern — it's the fact that ten thousand decisions have already been made for you. Database migrations, model validations, controller routing, serialization, testing setup — Rails has an opinion on all of it.

      For a solo developer, this is a superpower. I'm not spending an afternoon evaluating five ORM libraries or debating whether to put business logic in services or use cases or interactors. Rails says "put it in the model" and I move on.

      ```ruby
      # This is a complete, functional model with validations,
      # associations, scopes, and computed attributes.
      class Post < ApplicationRecord
        belongs_to :project, optional: true
        has_one_attached :feature_image

        validates :title, presence: true, uniqueness: true
        validates :slug, presence: true, uniqueness: true

        scope :published, -> { where.not(published_at: nil) }
        scope :recent, -> { order(published_at: :desc).limit(5) }

        before_validation :generate_slug, if: -> { slug.blank? && title.present? }

        def reading_time
          ReadingTime.format(content)
        end

        private

        def generate_slug
          self.slug = title.parameterize
        end
      end
      ```

      That's not a simplification for the blog post. That's the actual model. Rails gives you expressive, readable code out of the box.

      ## API-only mode

      Since Rails 5, you can generate an API-only application that strips out everything related to browser rendering — views, cookies, session middleware, asset pipeline. The result is a leaner app that boots faster and has a smaller surface area.

      ```bash
      rails new portfolio-api --api --database=postgresql
      ```

      The middleware stack shrinks considerably. You're left with routing, controllers, models, and serialization. Everything you need for a JSON API, nothing you don't.

      ## Serialization with Alba

      I'm using [Alba](https://github.com/okuramasafumi/alba) for JSON serialization. It's fast, flexible, and has a clean DSL:

      ```ruby
      class PostResource < ApplicationResource
        attributes :id, :slug, :title, :excerpt, :content,
                   :tags, :published_at

        attribute :reading_time do |post|
          ReadingTime.format(post.content)
        end

        attribute :feature_image_url do |post|
          post.feature_image_url
        end
      end
      ```

      Alba benchmarks significantly faster than ActiveModel Serializers and gives me full control over the JSON shape. Combined with [Typelizer](https://github.com/skryukov/typelizer), I get auto-generated TypeScript types from my serializers — the frontend always knows exactly what the API returns.

      ## UUID primary keys

      I opted for UUIDs over auto-incrementing integers for all tables. Sequential IDs leak information (how many users you have, how many posts exist) and create problems when merging data across environments.

      ```ruby
      create_table :posts, id: :uuid do |t|
        t.string :title, null: false
        t.text :content
        t.datetime :published_at
        t.timestamps
      end
      ```

      PostgreSQL's `gen_random_uuid()` handles generation at the database level, so there's no application-side overhead. The tradeoff is slightly larger indexes and less human-readable IDs, which is fine for an API.

      ## Testing with RSpec

      Rails' testing story is mature and well-documented. RSpec with FactoryBot gives me readable, maintainable tests:

      ```ruby
      RSpec.describe "GET /api/posts", type: :request do
        let!(:published_post) { create(:post, published_at: 1.day.ago) }
        let!(:draft_post) { create(:post, published_at: nil) }

        it "returns only published posts" do
          get "/api/posts"

          expect(response).to have_http_status(:ok)
          expect(json_body.size).to eq(1)
          expect(json_body.first["slug"]).to eq(published_post.slug)
        end
      end
      ```

      The test reads like a specification. Anyone can understand what it's verifying without knowing the implementation details.

      ## The productivity argument

      Here's the bottom line: I went from `rails new` to a fully functional API with five resources, authentication, tests, and deployment configuration in about two days. Not two days of frantic coding — two days of steady, enjoyable work.

      Could I have built the same thing with Express? Phoenix? FastAPI? Absolutely. But I doubt I would have shipped as quickly, and I'm certain the codebase wouldn't be as consistent.

      Rails isn't the right choice for everything. But for a well-scoped REST API built by a small team (or a team of one), it's hard to beat.
    MARKDOWN
    published_at: 1.week.ago
  },
  {
    slug: "deploying-with-kamal-a-docker-first-approach",
    title: "Deploying with Kamal: A Docker-First Approach",
    excerpt: "Kamal brings zero-downtime deployments to bare metal servers with nothing more than Docker and SSH. Here's how I set it up for a Rails API and what surprised me along the way.",
    tags: %w[DevOps Docker Kamal Deployment],
    project: projects["portfolio-api"],
    content: <<~'MARKDOWN',
      Deployment has always been the part of personal projects that gets hand-waved away. "I'll figure out hosting later" usually means the project never sees production. For this portfolio, I wanted deployment to be a solved problem from day one — and [Kamal](https://kamal-deploy.org/) made that possible.

      ## The landscape of deployment options

      Before settling on Kamal, I evaluated the usual suspects:

      | Option | Pros | Cons |
      |--------|------|------|
      | Heroku / Render | Zero config, managed | Expensive at scale, cold starts |
      | Kubernetes | Industry standard, scalable | Massive complexity for one app |
      | AWS ECS / Fargate | Serverless containers | Vendor lock-in, complex IAM |
      | Capistrano | Ruby-native, mature | Not container-based, ageing |
      | **Kamal** | **Simple, Docker-native, self-hosted** | **Newer, smaller community** |

      For a personal portfolio, I don't need horizontal autoscaling or service mesh networking. I need reliable, repeatable deployments to a single server. Kamal fits that perfectly.

      ## What Kamal actually does

      At its core, Kamal is a deployment tool that uses SSH to manage Docker containers on remote servers. There's no agent to install, no daemon to run. Your server just needs Docker and an SSH key.

      The deployment flow looks like this:

      1. Build a Docker image locally (or in CI)
      2. Push it to a container registry
      3. SSH into each server
      4. Pull the new image
      5. Start new containers with the updated image
      6. Health-check the new containers
      7. Swap traffic from old to new (via Traefik)
      8. Stop the old containers

      Zero downtime, no manual intervention.

      ## Configuration

      Everything lives in `config/deploy.yml`:

      ```yaml
      service: portfolio-api
      image: ghcr.io/myuser/portfolio-api

      servers:
        web:
          hosts:
            - 192.168.1.100
          labels:
            traefik.http.routers.portfolio-api.rule: Host(`api.example.com`)

      registry:
        server: ghcr.io
        username: myuser
        password:
          - KAMAL_REGISTRY_PASSWORD

      env:
        clear:
          RAILS_ENV: production
          DATABASE_URL: postgres://user:pass@db:5432/portfolio
        secret:
          - SECRET_KEY_BASE
          - RAILS_MASTER_KEY

      traefik:
        options:
          publish:
            - "443:443"
          volume:
            - "/letsencrypt:/letsencrypt"
        args:
          entryPoints.websecure.address: ":443"
          certificatesResolvers.letsencrypt.acme.email: "me@example.com"
          certificatesResolvers.letsencrypt.acme.storage: "/letsencrypt/acme.json"
          certificatesResolvers.letsencrypt.acme.httpChallenge.entryPoint: "web"
      ```

      That single file covers the application, registry, environment variables, and TLS configuration. Compare that to the equivalent Kubernetes manifests and the simplicity becomes obvious.

      ## The deployment experience

      ```bash
      $ kamal deploy

      Acquiring the deploy lock...
      Building the image...
      Pushing the image to ghcr.io...
      Pulling the image on 192.168.1.100...
      Starting container with version abc123...
      Container is healthy, switching traffic...
      Stopping old container...
      Pruning old images...
      ```

      First deploy takes a few minutes (building the image from scratch). Subsequent deploys — with Docker layer caching — are usually under 60 seconds.

      ## Running database migrations

      Kamal has first-class support for running commands before or after deploys:

      ```bash
      kamal app exec --reuse "bin/rails db:migrate"
      ```

      Or you can configure a pre-deploy hook that runs migrations automatically. I prefer the explicit command for now — it gives me a chance to review the migration output before traffic switches.

      ## What surprised me

      **The good:**
      - Setup took about 30 minutes from zero to first deploy
      - Rollbacks are instant — just `kamal rollback` to the previous image
      - Logs are accessible via `kamal app logs` without SSH-ing in manually
      - The built-in Traefik proxy handles TLS certificates automatically

      **The rough edges:**
      - Error messages can be cryptic when Docker builds fail remotely
      - The `deploy.yml` documentation assumes some Docker/Traefik familiarity
      - Multi-server setups with different roles need careful configuration

      ## Cost breakdown

      My entire hosting setup for this portfolio:

      | Resource | Provider | Monthly Cost |
      |----------|----------|-------------|
      | VPS (2GB RAM) | Hetzner | $4.50 |
      | Domain | Cloudflare | $10/year |
      | Container registry | GitHub (free tier) | $0 |
      | **Total** | | **~$5.30/mo** |

      For five dollars a month, I have a production server with SSL, automated deployments, and full control over the infrastructure. Try getting that from a PaaS.

      ## Should you use Kamal?

      If you're building something that fits on one to three servers and you're comfortable with Docker, Kamal is excellent. It removes the complexity of Kubernetes without sacrificing the benefits of containerized deployments.

      For larger systems with complex networking, service discovery, or autoscaling requirements, you'll probably outgrow Kamal. But for everything else — personal projects, small SaaS apps, internal tools — it's become my default deployment strategy.
    MARKDOWN
    published_at: 2.weeks.ago
  },
  {
    slug: "testing-reading-time-calculations-in-ruby",
    title: "Testing Reading Time Calculations in Ruby",
    excerpt: "A seemingly simple feature — estimated reading time — turns into a lesson on edge cases, content parsing, and the value of thorough testing.",
    tags: %w[Ruby Testing RSpec],
    content: <<~'MARKDOWN',
      Every blog platform shows an estimated reading time next to each post. Medium popularized it, and now readers expect it. It seems like a trivial feature — count the words, divide by 200, done. But as with most "trivial" features, the devil is in the details.

      ## The naive implementation

      The simplest version looks like this:

      ```ruby
      def reading_time(content)
        (content.split.size / 200.0).ceil
      end
      ```

      Split on whitespace, count the tokens, divide by the average reading speed (200 words per minute), round up. Ship it.

      Except... what about code blocks? A reader doesn't process `def initialize(attributes = {})` at the same speed as prose. What about images — don't they add time? What about empty posts?

      ## Handling edge cases

      Here's the production version:

      ```ruby
      module ReadingTime
        WORDS_PER_MINUTE = 200
        SECONDS_PER_IMAGE = 12
        CODE_BLOCK_REGEX = /```[\s\S]*?```/

        def self.estimate(content)
          return 0 if content.blank?

          # Strip code blocks and count them separately
          code_blocks = content.scan(CODE_BLOCK_REGEX)
          prose = content.gsub(CODE_BLOCK_REGEX, '')

          # Count words in prose
          word_count = prose.split.size

          # Count images (markdown syntax)
          image_count = content.scan(/!\[.*?\]\(.*?\)/).size

          # Code blocks are read slower — estimate 50 WPM
          code_word_count = code_blocks.sum { |block| block.split.size }
          code_minutes = code_word_count / 50.0

          # Images add ~12 seconds each
          image_minutes = (image_count * SECONDS_PER_IMAGE) / 60.0

          # Total
          total = (word_count / WORDS_PER_MINUTE.to_f) + code_minutes + image_minutes
          total.ceil.clamp(1, Float::INFINITY).to_i
        end

        def self.format(content)
          minutes = estimate(content)
          "#{minutes} min read"
        end
      end
      ```

      This version accounts for three content types: prose (200 WPM), code blocks (50 WPM), and images (12 seconds each). The numbers come from [research on reading speed](https://scholarwithin.com/average-reading-speed) and are tuned to feel right rather than be scientifically precise.

      ## The test suite

      This is where the real value lies. The module is a pure function — input string, output integer — which makes it ideal for comprehensive unit testing:

      ```ruby
      RSpec.describe ReadingTime do
        describe ".estimate" do
          it "returns 0 for nil content" do
            expect(described_class.estimate(nil)).to eq(0)
          end

          it "returns 0 for empty content" do
            expect(described_class.estimate("")).to eq(0)
          end

          it "returns 0 for whitespace-only content" do
            expect(described_class.estimate("   \n\t  ")).to eq(0)
          end

          it "returns 1 for a single word" do
            expect(described_class.estimate("Hello")).to eq(1)
          end

          it "calculates correctly for a 200-word post" do
            content = "word " * 200
            expect(described_class.estimate(content)).to eq(1)
          end

          it "rounds up partial minutes" do
            content = "word " * 201
            expect(described_class.estimate(content)).to eq(2)
          end

          it "counts code blocks at a slower rate" do
            prose = "word " * 100  # 0.5 min at 200 WPM
            code = "```ruby\n" + ("code " * 100) + "\n```"  # 2 min at 50 WPM
            content = "#{prose}\n#{code}"
            expect(described_class.estimate(content)).to eq(3)
          end

          it "accounts for images" do
            content = "word " * 200 + "\n![photo](https://example.com/img.jpg)"
            # 1 min for words + 0.2 min for image = 1.2 -> 2
            expect(described_class.estimate(content)).to eq(2)
          end
        end

        describe ".format" do
          it "returns a human-readable string" do
            content = "word " * 600
            expect(described_class.format(content)).to eq("3 min read")
          end
        end
      end
      ```

      Every edge case is documented as a test. When someone asks "what happens if the content is nil?", the answer is right there in the spec file.

      ## Why this matters

      Reading time estimation is a small feature, but the pattern it illustrates is universal:

      1. **Start with the simplest implementation that could work.** `content.split.size / 200` is a perfectly valid V1.
      2. **Identify edge cases through real usage.** Posts with lots of code were showing unrealistically short reading times.
      3. **Extract into a testable module.** Pure functions with no side effects are the easiest code to test and maintain.
      4. **Write tests that document behavior.** The test suite serves as living documentation for how the module works.

      The feature itself took maybe 30 minutes to build. The tests took another 30. But those tests have caught three regressions already — each time I refactored the content parsing, the tests told me exactly what broke.

      That's the value of testing: not proving your code works today, but protecting it from breaking tomorrow.
    MARKDOWN
    published_at: 3.weeks.ago
  },
  {
    slug: "crafting-a-developer-portfolio-that-stands-out",
    title: "Crafting a Developer Portfolio That Stands Out",
    excerpt: "Most developer portfolios look the same. Here's a framework for building one that actually demonstrates your skills, tells your story, and lands interviews.",
    tags: %w[Career Portfolio Advice],
    content: <<~'MARKDOWN',
      I've reviewed hundreds of developer portfolios — as a hiring manager, as a peer, and as someone who's constantly iterating on my own. Most of them follow the same template: a hero section with a waving hand emoji, a grid of project cards with tech badges, and a contact form that goes to a Gmail address.

      There's nothing wrong with that format. But if your portfolio looks identical to every other developer's, you've missed the point. A portfolio isn't a template to fill in — it's an argument for why someone should work with you.

      ## Start with the "why hire me" question

      Before writing any code, answer this: **What do you want someone to feel after spending 60 seconds on your portfolio?**

      Not "what technologies do you know." Not "how many projects have you built." The feeling. Possible answers:

      - "This person writes exceptionally clean code."
      - "This person can take a project from idea to production."
      - "This person thinks deeply about user experience."
      - "This person is creative and technically fearless."

      Once you have that answer, every decision — tech stack, design, content — should reinforce it.

      ## Show, don't tell

      "Proficient in React, TypeScript, and Node.js" tells me nothing. Everyone writes that. Instead, show me:

      - **A real application** that uses React with thoughtful state management
      - **A blog post** explaining a tricky TypeScript pattern you solved
      - **A GitHub contribution** to an open-source Node.js project

      For my own portfolio, I deliberately chose an unconventional tech stack: a Go terminal UI talking to a Rails API, with a React frontend as the "traditional" view. This wasn't arbitrary — it demonstrates a few things I want potential collaborators to know about me:

      1. **I'm comfortable across paradigms.** Go for systems programming, Ruby for rapid development, TypeScript for frontend work.
      2. **I think about the full stack.** API design, deployment, frontend rendering — it's all connected.
      3. **I value craft.** Building a TUI for a portfolio is extra work. That extra work communicates that I care about quality.

      ## Content is king (still)

      The most common mistake I see: beautiful portfolios with no substance. A card that says "E-commerce Platform — React, Node, MongoDB" with a GitHub link and nothing else.

      For each project, answer these questions:

      - **What problem were you solving?** Not the tech problem — the human problem.
      - **What decisions did you make and why?** Framework choices, architecture patterns, tradeoffs.
      - **What was the outcome?** Users, performance improvements, lessons learned.
      - **What would you do differently?** This shows self-awareness and growth mindset.

      Write it as prose, not bullet points. A paragraph that explains your database choice is more compelling than a badge that says "PostgreSQL."

      ## The blog as a differentiator

      If you're choosing between adding another project card or writing a blog post about an existing project, write the blog post. Every time.

      Blog posts demonstrate skills that project cards can't:

      - **Communication.** Can you explain a complex topic clearly?
      - **Depth of understanding.** Do you know *why* things work, not just *how*?
      - **Continuous learning.** Are you actively growing as a developer?

      You don't need to write a 3,000-word treatise every week. A focused post about one specific problem you solved — 800 to 1,000 words, with code samples — is more valuable than a lengthy tutorial covering well-trodden ground.

      ## Design matters (but not how you think)

      I've seen developers spend weeks tweaking animations and gradients on their portfolio while the content remained placeholder text. Don't do this.

      Good portfolio design means:

      - **Readable typography.** A comfortable line length, sufficient contrast, appropriate font size.
      - **Clear hierarchy.** Visitors should know where to look first, second, and third.
      - **Fast loading.** If your portfolio takes 3 seconds to load, you've already lost most visitors.
      - **Mobile-friendly.** Recruiters often browse portfolios on their phones between meetings.

      That's it. You don't need parallax scrolling, WebGL backgrounds, or custom cursor effects. Clean and readable beats flashy and slow.

      ## Keep it alive

      A portfolio with all projects dated two years ago signals one thing: you've stopped building. Even if that's not true, perception is reality.

      Commit to publishing something new every month. It doesn't have to be groundbreaking:

      - A short post about a tool you discovered
      - An update to an existing project
      - A retrospective on something you shipped at work (respecting NDAs, of course)

      The cadence matters more than the scale. A portfolio that grows over time tells a story of continuous engagement with the craft.

      ## The meta-portfolio

      Here's the move that ties everything together: **make your portfolio itself a project worth showcasing.**

      Document your tech choices, write about the build process, open-source the code. Your portfolio becomes self-referential in the best way — it's simultaneously the showcase and the showcase piece.

      That's exactly what I've done here. The portfolio is the project. The blog posts explain the portfolio. The code is on GitHub for anyone to read. It's portfolios all the way down.

      And honestly? That's the most fun I've had building anything in a long time.
    MARKDOWN
    published_at: 1.month.ago
  }
]

posts_data.each do |post_attrs|
  post = Post.create!(post_attrs)
  attach_feature_image(post)
  puts "  Created post: #{post_attrs[:title]}"
end

# ============================================
# Resume (loaded from YAML)
# ============================================
resume_path = Rails.root.join('content', 'resume.yaml')
if File.exist?(resume_path)
  resume_yaml = File.read(resume_path)
  Resume.create!(slug: 'primary', data: resume_yaml)
  puts "  Created resume: primary"
else
  puts "  Warning: resume.yaml not found at #{resume_path}"
end

puts "\nSeeding complete!"
puts "  #{Post.count} posts created"
puts "  #{Project.count} projects created"
puts "  #{Resume.count} resume(s) created"
