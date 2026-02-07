// Re-export generated API types
export type { Post as PostResponse, Project as ProjectResponse } from './generated';

// Transformed types with camelCase keys for frontend use
// These types mirror the generated API types but with camelCase keys
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
