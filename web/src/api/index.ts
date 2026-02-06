import ky from 'ky';
import { transformResponse } from './utils';
import type { Post as PostResponse, Project as ProjectResponse } from '../types/generated';
import type { Post, Project } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = ky.create({
    prefixUrl: API_BASE_URL,
});

export type { Post, Project };

export const getPosts = async (): Promise<Post[]> => {
    const posts = await api.get('api/posts').json<PostResponse[]>();
    return posts.map(transformResponse) as Post[];
};

export const getPost = async (slug: string): Promise<Post> => {
    const post = await api.get(`api/posts/${slug}`).json<PostResponse>();
    return transformResponse(post) as Post;
};

export const getProjects = async (): Promise<Project[]> => {
    const projects = await api.get('api/projects').json<ProjectResponse[]>();
    return projects.map(transformResponse) as Project[];
};

export const getProject = async (slug: string): Promise<Project> => {
    const project = await api.get(`api/projects/${slug}`).json<ProjectResponse>();
    return transformResponse(project) as Project;
};

export const getResume = async (): Promise<string> => {
    return api.get('api/resume').text();
};
