import ky from 'ky';
import { parseApiError, ApiError, isApiError } from './errors';
import type { Post, Project, ResumeData } from '../types';

const api = ky.create({
    prefixUrl: '/api',
});

export type { Post, Project, ResumeData };
export { ApiError, isApiError };

export const getPosts = async (): Promise<Post[]> => {
    try {
        return await api.get('posts').json<Post[]>();
    } catch (error) {
        throw await parseApiError(error);
    }
};

export const getPost = async (slug: string): Promise<Post> => {
    try {
        return await api.get(`posts/${slug}`).json<Post>();
    } catch (error) {
        throw await parseApiError(error);
    }
};

export const getProjects = async (): Promise<Project[]> => {
    try {
        return await api.get('projects').json<Project[]>();
    } catch (error) {
        throw await parseApiError(error);
    }
};

export const getProject = async (slug: string): Promise<Project> => {
    try {
        return await api.get(`projects/${slug}`).json<Project>();
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

export interface ContactPayload {
    name: string;
    email: string;
    message: string;
}

export const createContact = async (payload: ContactPayload): Promise<void> => {
    try {
        await api.post('contacts', { json: { contact: payload } });
    } catch (error) {
        throw await parseApiError(error);
    }
};

export const getContentVersion = async (): Promise<string> => {
    const data = await api.get('version').json<{ version: string }>();
    return data.version;
};
