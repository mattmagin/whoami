export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  readingTime: string
  tags: string[]
}

export interface Project {
  slug: string
  name: string
  description: string
  longDescription: string
  techStack: string[]
  url?: string
  githubUrl?: string
  featured: boolean
  imageUrl?: string
}

export interface ResumeSection {
  title: string
  items: ResumeItem[]
}

export interface ResumeItem {
  title: string
  subtitle?: string
  date?: string
  description?: string
  highlights?: string[]
}

export interface Resume {
  name: string
  title: string
  summary: string
  contact: {
    email: string
    location: string
    github?: string
    linkedin?: string
    website?: string
  }
  sections: ResumeSection[]
  skills: {
    category: string
    items: string[]
  }[]
}
