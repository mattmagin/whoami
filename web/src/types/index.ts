// Re-export generated API types
export type { Post as PostResponse, Project as ProjectResponse } from './generated';

// Transformed types with camelCase keys for frontend use
export interface Post {
    id: string;
    title: string | null;
    content: string | null;
    publishedAt: string | null;
    readingTime: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface Project {
    id: string;
    name: string | null;
    description: string | null;
    technologies: string[] | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
