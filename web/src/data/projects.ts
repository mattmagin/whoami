import type { Project } from './types'

export const projects: Project[] = [
  {
    slug: 'portfolio-multiplatform',
    name: 'Multi-Interface Portfolio',
    description: 'A personal portfolio accessible via web, SSH, and API.',
    longDescription: `
This portfolio demonstrates full-stack development across multiple languages and paradigms. 
It features a Rails API backend, a React frontend, and a Go-based SSH/TUI interface.

The project showcases:
- RESTful API design with Rails
- Modern React with TypeScript
- Terminal UI development with Bubble Tea
- Infrastructure as Code with Terraform
- CI/CD with GitLab Pipelines
    `.trim(),
    techStack: ['Rails', 'React', 'TypeScript', 'Go', 'PostgreSQL', 'Terraform', 'AWS'],
    githubUrl: 'https://github.com/username/portfolio',
    url: 'https://yoursite.com',
    featured: true,
  },
  {
    slug: 'cli-task-manager',
    name: 'TaskFlow CLI',
    description: 'A beautiful terminal-based task manager with Git integration.',
    longDescription: `
TaskFlow is a command-line task manager built with Go and Bubble Tea. 
It integrates with Git to automatically link commits to tasks and provides 
a smooth, keyboard-driven workflow.

Features include:
- Vim-style keybindings
- Git commit integration
- Markdown task descriptions
- Time tracking
- Export to various formats
    `.trim(),
    techStack: ['Go', 'Bubble Tea', 'SQLite', 'Git'],
    githubUrl: 'https://github.com/username/taskflow',
    featured: true,
  },
  {
    slug: 'realtime-dashboard',
    name: 'Real-time Analytics Dashboard',
    description: 'A WebSocket-powered analytics dashboard with live data visualization.',
    longDescription: `
Built for a SaaS application, this dashboard displays real-time analytics 
using WebSockets and D3.js visualizations. It handles thousands of concurrent 
connections and updates charts in real-time.

Technical highlights:
- WebSocket server in Go
- React frontend with D3.js
- Redis pub/sub for scaling
- Time-series data optimization
    `.trim(),
    techStack: ['React', 'TypeScript', 'Go', 'WebSockets', 'D3.js', 'Redis'],
    featured: true,
  },
  {
    slug: 'markdown-blog-engine',
    name: 'Evergreen Blog Engine',
    description: 'A static blog generator with live reload and Markdown support.',
    longDescription: `
Evergreen is a minimalist blog engine that converts Markdown files into 
a beautiful static site. It features live reload during development and 
produces optimized builds for production.

Key features:
- Zero JavaScript by default
- Automatic image optimization
- RSS feed generation
- Syntax highlighting
- Custom themes
    `.trim(),
    techStack: ['Go', 'HTML', 'CSS', 'Markdown'],
    githubUrl: 'https://github.com/username/evergreen',
    featured: false,
  },
  {
    slug: 'api-gateway',
    name: 'Lightweight API Gateway',
    description: 'A fast API gateway with rate limiting and authentication.',
    longDescription: `
A lightweight API gateway built in Go, designed for microservices architectures. 
It handles authentication, rate limiting, and request routing with minimal overhead.

Features:
- JWT authentication
- Redis-backed rate limiting
- Request/response transformation
- Health checks and circuit breakers
- Prometheus metrics
    `.trim(),
    techStack: ['Go', 'Redis', 'Docker', 'Prometheus'],
    githubUrl: 'https://github.com/username/gateway',
    featured: false,
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured)
}
