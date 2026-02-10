import ky from 'ky';
import { transformResponse } from './utils';
import { parseApiError, ApiError, isApiError } from './errors';
import type { Post as PostResponse, Project as ProjectResponse } from '../types/generated';
import type { Post, Project, ResumeData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = ky.create({
    prefixUrl: API_BASE_URL,
});

export type { Post, Project, ResumeData };
export { ApiError, isApiError };

export const getPosts = async (): Promise<Post[]> => {
    try {
        const posts = await api.get('posts').json<PostResponse[]>();
        return posts.map(transformResponse) as Post[];
    } catch (error) {
        throw await parseApiError(error);
    }
};

export const getPost = async (slug: string): Promise<Post> => {
    try {
        const post = await api.get(`posts/${slug}`).json<PostResponse>();
        return transformResponse(post) as Post;
    } catch (error) {
        throw await parseApiError(error);
    }
};

export const getProjects = async (): Promise<Project[]> => {
    try {
        const projects = await api.get('projects').json<ProjectResponse[]>();
        return projects.map(transformResponse) as Project[];
    } catch (error) {
        throw await parseApiError(error);
    }
};

export const getProject = async (slug: string): Promise<Project> => {
    try {
        const project = await api.get(`projects/${slug}`).json<ProjectResponse>();
        return transformResponse(project) as Project;
    } catch (error) {
        throw await parseApiError(error);
    }
};

export const getResume = async (): Promise<ResumeData> => {
    try {
        return await api.get('resume').json<ResumeData>();
    } catch (error) {
        throw await parseApiError(error);
    }
};
