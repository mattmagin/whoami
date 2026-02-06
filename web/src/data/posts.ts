import type { Post } from './types'

export const posts: Post[] = [
  {
    slug: 'building-a-portfolio-with-multiple-interfaces',
    title: 'Building a Portfolio with Multiple Interfaces',
    excerpt: 'How I built a portfolio that can be accessed via web, SSH, and API — demonstrating full-stack skills across multiple languages.',
    content: `
# Building a Portfolio with Multiple Interfaces

When I set out to build my portfolio, I wanted to do something different. Instead of just another React site, I created a system with three distinct interfaces — all sharing the same backend.

## The Architecture

The system consists of:

1. **Rails API** — Serves JSON data for all clients
2. **React Frontend** — The website you're viewing now
3. **Go SSH/TUI** — A terminal interface accessible via SSH

## Why This Approach?

As a full-stack developer, I wanted to demonstrate proficiency across multiple languages and paradigms. Each component showcases different skills:

- **Ruby/Rails**: RESTful API design, database modeling
- **Go**: Systems programming, the Charm ecosystem
- **React/TypeScript**: Modern frontend development
- **Terraform**: Infrastructure as Code

## Technical Highlights

The SSH interface uses [Bubble Tea](https://github.com/charmbracelet/bubbletea) for the TUI and [Wish](https://github.com/charmbracelet/wish) for the SSH server. Try it yourself:

\`\`\`bash
ssh visitor@yoursite.com
\`\`\`

## What I Learned

Building this project taught me the value of API-first design. By keeping the API clean and well-documented, adding new clients became straightforward.

The biggest challenge was ensuring consistent data representation across all interfaces while respecting each medium's constraints.
    `.trim(),
    publishedAt: '2026-01-15',
    readingTime: '5 min read',
    tags: ['Architecture', 'Full-Stack', 'Go', 'Rails', 'React'],
  },
  {
    slug: 'terminal-uis-with-bubble-tea',
    title: 'Building Beautiful Terminal UIs with Bubble Tea',
    excerpt: 'An introduction to creating elegant terminal user interfaces in Go using the Charm ecosystem.',
    content: `
# Building Beautiful Terminal UIs with Bubble Tea

Terminal applications are making a comeback. With tools like Bubble Tea, we can create rich, interactive experiences right in the terminal.

## What is Bubble Tea?

Bubble Tea is a Go framework based on The Elm Architecture. If you've used Redux or any other state management solution, the pattern will feel familiar:

- **Model**: Your application state
- **Update**: Handle messages and update state
- **View**: Render state to the terminal

## A Simple Example

\`\`\`go
type model struct {
    cursor int
    items  []string
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.KeyMsg:
        switch msg.String() {
        case "j", "down":
            m.cursor++
        case "k", "up":
            m.cursor--
        }
    }
    return m, nil
}
\`\`\`

## Styling with Lip Gloss

Lip Gloss is like CSS for your terminal. You define styles and apply them to strings:

\`\`\`go
var style = lipgloss.NewStyle().
    Bold(true).
    Foreground(lipgloss.Color("#7D56F4"))

fmt.Println(style.Render("Hello, styled world!"))
\`\`\`

## Why Terminals?

There's something satisfying about terminal applications. They're fast, focused, and accessible over SSH. For developer tools and system utilities, they're often the perfect choice.
    `.trim(),
    publishedAt: '2026-01-08',
    readingTime: '4 min read',
    tags: ['Go', 'Terminal', 'TUI', 'Bubble Tea'],
  },
  {
    slug: 'infrastructure-as-code-with-terraform',
    title: 'Infrastructure as Code: My Terraform Journey',
    excerpt: 'Lessons learned from managing AWS infrastructure with Terraform, from VPCs to CI/CD pipelines.',
    content: `
# Infrastructure as Code: My Terraform Journey

When I started managing cloud infrastructure, clicking through the AWS console felt wrong. There had to be a better way. Enter Terraform.

## Why Infrastructure as Code?

- **Reproducibility**: Spin up identical environments
- **Version Control**: Track changes over time
- **Documentation**: Your infra is self-documenting
- **Automation**: Integrate with CI/CD pipelines

## Project Structure

I organize my Terraform code into modules:

\`\`\`
infrastructure/
├── main.tf
├── variables.tf
├── outputs.tf
└── modules/
    ├── networking/
    ├── database/
    ├── compute/
    └── storage/
\`\`\`

## Lessons Learned

**Start Simple**: Don't over-engineer. Start with the basics and add complexity as needed.

**Use Modules**: Encapsulate related resources. A networking module, a database module, etc.

**Remote State**: Use S3 + DynamoDB for state management. Local state doesn't scale.

**Plan Before Apply**: Always run \`terraform plan\` and review changes carefully.

## Cost Awareness

With the AWS free tier, you can run a small portfolio site for nearly free. Just watch out for data transfer costs!
    `.trim(),
    publishedAt: '2025-12-20',
    readingTime: '6 min read',
    tags: ['Terraform', 'AWS', 'DevOps', 'IaC'],
  },
]

export const getPost = (slug: string): Post | undefined => {
  return posts.find((post) => post.slug === slug)
}

export const getRecentPosts = (count: number = 3): Post[] => {
  return [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count)
}
