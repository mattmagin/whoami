import { db, schema } from './index';
import { sql } from 'drizzle-orm';

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const weeksAgo = (weeks: number) => daysAgo(weeks * 7);
const monthsAgo = (months: number) => daysAgo(months * 30);

async function seed() {
  console.log('Seeding database...');

  // Clear existing data (children first due to foreign keys)
  await db.delete(schema.resumeSkills);
  await db.delete(schema.resumeExperiences);
  await db.delete(schema.resumeProjects);
  await db.delete(schema.resumeEducation);
  await db.delete(schema.resumeCertifications);
  await db.delete(schema.resumes);
  await db.delete(schema.projects);
  await db.delete(schema.contacts);

  // ============================================
  // Projects (created first so posts can reference them)
  // ============================================
  const projectsData = [
    {
      slug: 'portfolio-tui',
      name: 'Portfolio TUI',
      excerpt: 'A terminal-based portfolio viewer with smooth animations and keyboard navigation.',
      description: `A terminal-based portfolio viewer built with Go and the Charm stack (Bubble Tea, Lip Gloss, and Glamour). The application follows the Elm architecture — Model, Update, View — to manage complex UI state without callbacks or event spaghetti.

The TUI features multiple views including a post reader with full Markdown rendering, a project showcase with tech-stack badges, and a contact form — all navigable via keyboard shortcuts or arrow keys. Smooth transitions between views are handled with frame-based animation ticks, giving the interface a polished, responsive feel that rivals graphical applications.

Under the hood, the app communicates with the Portfolio API over REST, fetching posts, projects, and resume data on demand. Responses are cached in memory to keep navigation snappy after the initial load. A Wish-based SSH server wraps the entire application, allowing anyone to connect and browse the portfolio with a single \`ssh\` command — no installation required.

Styling is handled entirely through Lip Gloss, with a consistent color palette and adaptive layouts that reflow based on terminal dimensions. Glamour renders Markdown content with syntax highlighting, blockquotes, and styled headings directly in the terminal.

This project was an exercise in proving that terminal interfaces can be beautiful, accessible, and genuinely enjoyable to use — not just utilitarian tools for power users.`,
      techStack: ['Go', 'BubbleTea', 'Lipgloss', 'REST'],
      githubUrl: 'https://github.com/example/portfolio-tui',
      imageUrl: 'https://picsum.photos/seed/portfolio-tui/800/450',
      featured: true,
      publishedAt: weeksAgo(1),
    },
    {
      slug: 'portfolio-api',
      name: 'Portfolio API',
      excerpt: 'RESTful API backend powering the portfolio with Rails 8 in API-only mode.',
      description: `The RESTful API backend that powers every surface of the portfolio — the React frontend, the terminal UI, and the admin CLI all consume the same endpoints. Built with Rails 8 in API-only mode, it prioritizes clean JSON responses, consistent error handling, and a minimal footprint.

The API serves blog posts with automatic reading-time estimation calculated from word count, project listings with filterable tech stacks, and a resume endpoint that returns structured YAML-sourced data. Posts support full Markdown content, tagging, and draft/published states. Projects track tech stacks as Postgres array columns for efficient querying.

Authentication uses a straightforward API-key scheme — admin routes require an \`X-API-Key\` header validated against bcrypt-hashed keys stored in the database. Each key tracks its last usage timestamp for auditing. Public endpoints are unauthenticated and read-only by design.

All tables use UUID primary keys to avoid exposing sequential IDs. Blueprinter handles JSON serialization with explicit field declarations, keeping response shapes predictable and decoupled from Active Record internals. Feature images are stored via Active Storage with an S3-compatible backend in production and local disk in development.

The API includes rate limiting on the contact form endpoint to prevent abuse, input validation with descriptive error messages, and CORS configuration scoped to known frontend origins. Deployment is handled through Kamal, which orchestrates Docker containers on a VPS with zero-downtime rolling deploys and automatic SSL via Let's Encrypt.`,
      techStack: ['Ruby', 'Rails', 'PostgreSQL', 'Docker', 'Kamal'],
      githubUrl: 'https://github.com/example/portfolio-api',
      imageUrl: 'https://picsum.photos/seed/portfolio-api/800/450',
      featured: true,
      publishedAt: weeksAgo(1),
    },
    {
      slug: 'task-flow',
      name: 'Task Flow',
      excerpt: 'A kanban-style task management app with real-time WebSocket updates.',
      description: `A kanban-style task management application built to explore real-time collaboration patterns on the web. The frontend is a React SPA with TypeScript, featuring a drag-and-drop board interface built on top of dnd-kit. Cards can be rearranged within columns or moved across them, with optimistic UI updates that feel instantaneous.

The real-time layer is powered by Rails Action Cable over WebSockets. When one user moves a card, creates a task, or updates a label, every other connected client sees the change reflected immediately — no polling required. The server broadcasts granular diffs rather than full board state, keeping payloads small and updates efficient even on slower connections.

Each workspace supports multiple boards, and boards support customizable columns, color-coded labels, due dates with reminder notifications, assignees, and Markdown-formatted descriptions. A search and filter bar lets users quickly narrow down tasks by label, assignee, or keyword.

The backend follows a service-object pattern to keep controllers thin. Board state is stored in PostgreSQL with advisory locks to handle concurrent drag operations gracefully — if two users move the same card simultaneously, the server resolves the conflict deterministically and notifies both clients of the final state.

On the frontend, TanStack Query manages server state with automatic cache invalidation triggered by WebSocket events, so the app stays consistent without manual refetching. The UI is styled with Tailwind CSS and includes keyboard shortcuts for power users who prefer to manage tasks without reaching for the mouse.`,
      techStack: ['React', 'TypeScript', 'Rails', 'ActionCable', 'PostgreSQL'],
      url: 'https://taskflow.example.com',
      githubUrl: 'https://github.com/example/task-flow',
      imageUrl: 'https://picsum.photos/seed/task-flow/800/450',
      featured: true,
      publishedAt: monthsAgo(2),
    },
    {
      slug: 'code-review-bot',
      name: 'Code Review Bot',
      excerpt: 'GitHub App providing automated code review using static analysis.',
      description: `A GitHub App that listens for pull request events and runs a suite of static analysis checks against the changed files, posting inline review comments directly on the relevant lines. The goal was to automate the tedious, mechanical parts of code review — style violations, common bug patterns, security anti-patterns — so that human reviewers can focus on architecture and logic.

The bot is built with Python and FastAPI, receiving GitHub webhook payloads and processing them asynchronously via a task queue. When a PR is opened or updated, the bot clones the repository at the target commit, runs a configurable set of linters and analyzers (including Ruff, Bandit, and custom AST-based rules), and maps findings back to the PR diff. Only issues on changed lines are reported, avoiding the noise of flagging pre-existing problems.

Configuration is handled through a \`.codereviewbot.yml\` file in the repository root, allowing teams to enable or disable specific checks, set severity thresholds, and define file-path exclusions. The bot respects \`.gitignore\` and supports monorepo setups with per-directory configs.

Results are posted as a single review with inline comments rather than individual comments, keeping notification noise low. A summary comment at the top provides an overview of findings grouped by severity. If no issues are found, the bot approves the PR with a brief confirmation message.

The entire application runs in a Docker container with health checks and structured JSON logging. In practice, the bot caught roughly 30% of issues that would have otherwise required a human review round-trip, measurably shortening the feedback loop on team projects.`,
      techStack: ['Python', 'FastAPI', 'GitHub-API', 'Docker'],
      githubUrl: 'https://github.com/example/code-review-bot',
      imageUrl: 'https://picsum.photos/seed/code-review-bot/800/450',
      featured: false,
      publishedAt: monthsAgo(4),
    },
    {
      slug: 'expense-tracker-cli',
      name: 'Expense Tracker CLI',
      excerpt: 'Command-line expense tracking with SQLite and beautiful terminal output.',
      description: `A command-line expense tracker written in Rust, designed for developers who prefer to manage their finances without leaving the terminal. Expenses are stored locally in an embedded SQLite database, so the tool works offline and starts instantly with no server dependency.

Adding an expense is a single command: \`expense add 42.50 --category groceries --note "Weekly shop"\`. The CLI supports a rich set of subcommands for listing, filtering, editing, and deleting entries. Expenses can be tagged with categories, and the tool ships with sensible defaults (food, transport, housing, utilities, entertainment) that are fully customizable.

Recurring expenses — rent, subscriptions, bills — can be defined once and are automatically projected into future months. The \`report\` subcommand generates monthly and yearly breakdowns with colored bar charts and category-level summaries rendered directly in the terminal using Unicode block characters. Reports can be exported to CSV for use in spreadsheets.

An optional \`sync\` subcommand pushes the local database to a simple REST API for backup and cross-device access. The sync protocol is append-only and conflict-free — each expense carries a UUID and timestamp, and the server merges entries idempotently.

The project was an exercise in writing ergonomic CLI tools in Rust. It uses \`clap\` for argument parsing with shell completions, \`rusqlite\` for the storage layer, and \`comfy-table\` for formatted terminal output. The binary compiles to a single static executable under 5 MB with no runtime dependencies.`,
      techStack: ['Rust', 'SQLite', 'REST'],
      githubUrl: 'https://github.com/example/expense-tracker',
      imageUrl: 'https://picsum.photos/seed/expense-tracker-cli/800/450',
      featured: false,
      publishedAt: monthsAgo(6),
    },
    {
      slug: 'weather-dashboard',
      name: 'Weather Dashboard',
      excerpt: 'Minimal weather dashboard with geolocation and accessibility-first design.',
      description: `A minimal, fast-loading weather dashboard that aggregates data from the OpenWeather and Open-Meteo APIs into a single, clean interface. The app detects the user's location via the Geolocation API on first visit (with a manual city search fallback) and displays current conditions, hourly forecasts for the next 24 hours, and a 7-day outlook.

The frontend is built with Vue 3 using the Composition API and styled with Tailwind CSS. Weather conditions are represented with animated SVG icons that adapt to time of day — sunny skies at noon, a moonlit clear sky at midnight. Temperature, wind speed, and precipitation values update on a configurable polling interval without full page reloads.

Severe weather alerts from the National Weather Service API are displayed as a dismissible banner at the top of the page with appropriate urgency styling (yellow for watches, red for warnings). Alert data is fetched separately and cached for 15 minutes to stay within API rate limits.

Accessibility was a primary design goal. The entire dashboard is navigable via keyboard with clear focus indicators. All weather icons carry descriptive \`aria-label\` attributes, color contrasts meet WCAG AA standards, and a screen-reader-optimized summary is generated for each forecast card. A high-contrast toggle in the header switches to a simplified palette for users with low vision.

The app is deployed to Netlify as a static site with serverless functions proxying the weather API calls to keep API keys off the client. Build times are under 10 seconds, and the production bundle is under 80 KB gzipped — a deliberate constraint to keep the dashboard fast on any connection.`,
      techStack: ['Vue.js', 'Tailwind', 'OpenWeatherAPI', 'Netlify'],
      url: 'https://weather.example.com',
      imageUrl: 'https://picsum.photos/seed/weather-dashboard/800/450',
      featured: false,
      publishedAt: monthsAgo(8),
    },
  ];

  for (const projectData of projectsData) {
    await db.insert(schema.projects).values(projectData);
    console.log(`  Created project: ${projectData.name}`);
  }

  // ============================================
  // Resume (structured data)
  // ============================================
  const [insertedResume] = await db.insert(schema.resumes).values({
    slug: 'primary',
    name: 'Matt Magin',
    title: 'Full-Stack Software Engineer',
    summary: 'Full-stack software engineer with 5+ years of experience building scalable web applications and APIs. Passionate about clean code, developer experience, and bridging the gap between elegant architecture and practical solutions. Experienced in Ruby, Go, TypeScript, and cloud infrastructure.',
    email: 'mail@magin.tech',
    location: 'Brisbane, Australia',
    githubUrl: 'github.com/mattmagin',
    linkedinUrl: 'linkedin.com/in/mattmagin',
    interests: [
      'Open source contribution',
      'Terminal aesthetics',
      'Mechanical keyboards',
      'Rock climbing',
      'Coffee brewing',
    ],
    publishedAt: now,
  }).returning({ id: schema.resumes.id });

  const resumeId = insertedResume.id;
  console.log('  Created resume: primary');

  // Skills (grouped by category, sort_order controls display order within category)
  const skillsData: { category: string; name: string; sortOrder: number }[] = [];
  const skillCategories: Record<string, string[]> = {
    languages: ['Ruby', 'Go', 'TypeScript', 'JavaScript', 'Python', 'SQL'],
    frameworks: ['Ruby on Rails', 'React', 'Next.js', 'Bubble Tea', 'Express'],
    databases: ['PostgreSQL', 'Redis', 'SQLite', 'MongoDB'],
    infrastructure: ['AWS (EC2, RDS, S3, CloudFront)', 'Docker', 'Kubernetes', 'Terraform'],
    tools: ['Git', 'GitHub Actions', 'GitLab CI', 'Kamal', 'Linux', 'Vim'],
  };

  for (const [category, skills] of Object.entries(skillCategories)) {
    skills.forEach((skill, i) => {
      skillsData.push({ category, name: skill, sortOrder: i });
    });
  }

  await db.insert(schema.resumeSkills).values(
    skillsData.map((s) => ({ resumeId, ...s, publishedAt: now }))
  );
  console.log(`  Created ${skillsData.length} resume skills`);

  // Experience
  await db.insert(schema.resumeExperiences).values([
    {
      resumeId,
      title: 'Senior Software Engineer',
      company: 'Acme Corp',
      location: 'San Francisco, CA',
      startDate: '2023-01-01',
      current: true,
      highlights: [
        'Led development of a real-time collaboration platform serving 50K+ daily active users',
        'Redesigned API architecture, reducing average response time by 40%',
        'Mentored junior developers through code reviews and pair programming sessions',
        'Implemented CI/CD pipelines that reduced deployment time from 45 minutes to 8 minutes',
      ],
      sortOrder: 0,
      publishedAt: now,
    },
    {
      resumeId,
      title: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      startDate: '2020-03-01',
      endDate: '2022-12-01',
      current: false,
      highlights: [
        'Built and maintained Ruby on Rails APIs powering mobile and web applications',
        'Developed a Go-based microservice for high-throughput data processing (10K events/sec)',
        'Integrated third-party payment systems handling $2M+ in monthly transactions',
        'Created internal tooling that automated 15+ hours of manual work per week',
      ],
      sortOrder: 1,
      publishedAt: now,
    },
    {
      resumeId,
      title: 'Junior Developer',
      company: 'WebAgency Inc',
      location: 'Portland, OR',
      startDate: '2018-06-01',
      endDate: '2020-02-01',
      current: false,
      highlights: [
        'Developed responsive web applications using React and Node.js',
        'Collaborated with design team to implement pixel-perfect UI components',
        'Maintained legacy PHP applications while planning migration to modern stack',
        'Wrote comprehensive test suites increasing code coverage from 40% to 85%',
      ],
      sortOrder: 2,
      publishedAt: now,
    },
  ]);
  console.log('  Created 3 resume experiences');

  // Resume Projects
  await db.insert(schema.resumeProjects).values([
    {
      resumeId,
      name: 'Portfolio TUI',
      description: 'A terminal-based portfolio viewer built with Go and Bubble Tea. Connects to a Rails API over SSH, featuring smooth animations and keyboard navigation.',
      technologies: ['Go', 'Bubble Tea', 'Lip Gloss', 'Wish'],
      sortOrder: 0,
      publishedAt: now,
    },
    {
      resumeId,
      name: 'Task Flow',
      description: 'Kanban-style task management with real-time updates via WebSockets. Features drag-and-drop interface and multi-board support.',
      technologies: ['React', 'TypeScript', 'Rails', 'ActionCable', 'PostgreSQL'],
      sortOrder: 1,
      publishedAt: now,
    },
    {
      resumeId,
      name: 'Code Review Bot',
      description: 'GitHub App providing automated code review using static analysis. Reduced review cycles by 30% on team projects.',
      technologies: ['Python', 'FastAPI', 'GitHub API', 'Docker'],
      sortOrder: 2,
      publishedAt: now,
    },
  ]);
  console.log('  Created 3 resume projects');

  // Education
  await db.insert(schema.resumeEducation).values([
    {
      resumeId,
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Oregon State University',
      location: 'Corvallis, OR',
      startYear: 2014,
      endYear: 2018,
      details: [
        'GPA: 3.7/4.0',
        'Relevant coursework: Algorithms, Databases, Operating Systems, Software Engineering',
      ],
      sortOrder: 0,
      publishedAt: now,
    },
  ]);
  console.log('  Created 1 resume education entry');

  // Certifications
  await db.insert(schema.resumeCertifications).values([
    {
      resumeId,
      name: 'AWS Certified Solutions Architect – Associate',
      year: 2024,
      sortOrder: 0,
      publishedAt: now,
    },
    {
      resumeId,
      name: 'HashiCorp Certified: Terraform Associate',
      year: 2023,
      sortOrder: 1,
      publishedAt: now,
    },
  ]);
  console.log('  Created 2 resume certifications');

  // Print summary
  const projectCount = await db.select({ count: sql<number>`count(*)` }).from(schema.projects);
  const resumeCount = await db.select({ count: sql<number>`count(*)` }).from(schema.resumes);
  const skillCount = await db.select({ count: sql<number>`count(*)` }).from(schema.resumeSkills);
  const expCount = await db.select({ count: sql<number>`count(*)` }).from(schema.resumeExperiences);

  console.log('\nSeeding complete!');
  console.log(`  ${projectCount[0].count} projects created`);
  console.log(`  ${resumeCount[0].count} resume(s) created`);
  console.log(`  ${skillCount[0].count} resume skills created`);
  console.log(`  ${expCount[0].count} resume experiences created`);

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
