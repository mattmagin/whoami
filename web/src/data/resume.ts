import type { Resume } from './types'

export const resume: Resume = {
  name: 'Alex Developer',
  title: 'Full-Stack Software Engineer',
  summary: `
Passionate full-stack developer with 5+ years of experience building web applications 
and developer tools. I specialize in Go, Ruby, and TypeScript, with a focus on 
clean architecture and developer experience. Currently exploring the intersection 
of terminal UIs and modern web development.
  `.trim(),
  contact: {
    email: 'hello@example.com',
    location: 'Portland, OR',
    github: 'github.com/username',
    linkedin: 'linkedin.com/in/username',
    website: 'yoursite.com',
  },
  sections: [
    {
      title: 'Experience',
      items: [
        {
          title: 'Senior Software Engineer',
          subtitle: 'TechCorp Inc.',
          date: '2023 - Present',
          description: 'Leading development of internal developer tools and platform services.',
          highlights: [
            'Architected and built a Go-based CLI tool that reduced deployment time by 60%',
            'Led migration from monolith to microservices, improving system reliability to 99.9% uptime',
            'Mentored junior developers and established code review practices',
            'Introduced Infrastructure as Code with Terraform, reducing provisioning time from days to hours',
          ],
        },
        {
          title: 'Software Engineer',
          subtitle: 'StartupXYZ',
          date: '2020 - 2023',
          description: 'Full-stack development for a B2B SaaS platform.',
          highlights: [
            'Built real-time analytics dashboard with WebSockets serving 10K+ concurrent users',
            'Developed Rails API backend with comprehensive test coverage (95%+)',
            'Implemented CI/CD pipeline with GitHub Actions, reducing deployment frequency from weekly to daily',
            'Optimized PostgreSQL queries, reducing average response time by 40%',
          ],
        },
        {
          title: 'Junior Developer',
          subtitle: 'WebAgency Co.',
          date: '2018 - 2020',
          description: 'Front-end development for client websites and web applications.',
          highlights: [
            'Developed responsive React applications for 20+ client projects',
            'Introduced TypeScript to the team, improving code quality and developer productivity',
            'Built reusable component library used across all client projects',
          ],
        },
      ],
    },
    {
      title: 'Education',
      items: [
        {
          title: 'B.S. Computer Science',
          subtitle: 'University of Technology',
          date: '2014 - 2018',
          highlights: [
            'Graduated with honors (GPA: 3.8)',
            'Teaching assistant for Data Structures & Algorithms',
            'Senior project: Distributed task scheduler in Go',
          ],
        },
      ],
    },
    {
      title: 'Certifications',
      items: [
        {
          title: 'AWS Certified Solutions Architect – Associate',
          date: '2024',
        },
        {
          title: 'HashiCorp Terraform Associate',
          date: '2023',
        },
      ],
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['Go', 'Ruby', 'TypeScript', 'JavaScript', 'Python', 'SQL'],
    },
    {
      category: 'Frameworks',
      items: ['Rails', 'React', 'Next.js', 'Bubble Tea', 'Gin'],
    },
    {
      category: 'Infrastructure',
      items: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'GitHub Actions'],
    },
    {
      category: 'Databases',
      items: ['PostgreSQL', 'Redis', 'SQLite', 'MongoDB'],
    },
    {
      category: 'Tools',
      items: ['Git', 'Neovim', 'tmux', 'Linux', 'Figma'],
    },
  ],
}
