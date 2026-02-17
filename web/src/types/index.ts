// Post type matching the Hono API response shape (camelCase)
export interface Post {
    id: string;
    slug: string;
    title: string | null;
    excerpt: string | null;
    content: string | null;
    tags: string[] | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    readingTime: string;
    featureImageUrl: string | null;
}

export interface Project {
    id: string;
    slug: string;
    name: string | null;
    excerpt: string | null;
    description: string | null;
    techStack: string[] | null;
    url: string | null;
    githubUrl: string | null;
    featured: boolean;
    imageUrl: string | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

// Resume types (matches YAML structure from API)
export interface ResumeContact {
    email: string;
    location: string;
    github: string;
    linkedin: string;
}

export interface ResumeExperience {
    title: string;
    company: string;
    location: string;
    dates: string;
    highlights: string[];
}

export interface ResumeProject {
    name: string;
    description: string;
    technologies: string[];
}

export interface ResumeEducation {
    degree: string;
    institution: string;
    location: string;
    dates: string;
    details: string[];
}

export interface ResumeCertification {
    name: string;
    year: number;
}

export interface ResumeData {
    name: string;
    title: string;
    contact: ResumeContact;
    summary: string;
    skills: Record<string, string[]>;
    experience: ResumeExperience[];
    projects: ResumeProject[];
    education: ResumeEducation[];
    certifications: ResumeCertification[];
    interests: string[];
}
