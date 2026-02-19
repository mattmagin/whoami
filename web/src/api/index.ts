import { hc, type InferResponseType } from 'hono/client';
import type { ApiType } from '../../server/api';
import { parseApiError, ApiError, isApiError } from './errors';

// ---------------------------------------------------------------------------
// Hono RPC client
// ---------------------------------------------------------------------------

const client = hc<ApiType>('/api');

// ---------------------------------------------------------------------------
// Derived types (inferred from server route definitions)
// ---------------------------------------------------------------------------

type PostsResponse = InferResponseType<typeof client.posts.$get, 200>;
type ProjectsResponse = InferResponseType<typeof client.projects.$get, 200>;
type ResumeResponse = InferResponseType<typeof client.resume.$get, 200>;

// Entity types
export type Post = PostsResponse['data'][number];
export type Project = ProjectsResponse['data'][number];

// Pagination
export type PaginationMeta = PostsResponse['meta'];
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta };

// Resume
export type ResumeData = ResumeResponse;
export type ResumeContact = ResumeData['contact'];
export type ResumeExperience = ResumeData['experience'][number];
export type ResumeProject = ResumeData['projects'][number];
export type ResumeEducation = ResumeData['education'][number];
export type ResumeCertification = ResumeData['certifications'][number];

// Request payloads (manual — contacts route lacks typed validation middleware)
export interface ContactPayload {
    name: string;
    email: string;
    message: string;
}

// Re-export error utilities
export { ApiError, isApiError };

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export interface PaginationParams {
    page?: number;
}

export const getPosts = async (params: PaginationParams = {}): Promise<PaginatedResponse<Post>> => {
    const query: Record<string, string> = {};
    if (params.page != null) query.page = String(params.page);
    const res = await client.posts.$get({ query });
    if (!res.ok) throw await parseApiError(res);
    return res.json();
};

export const getPost = async (slug: string) => {
    const res = await client.posts[':slug'].$get({ param: { slug } });
    if (!res.ok) throw await parseApiError(res);
    return res.json();
};

export const getProjects = async (params: PaginationParams = {}): Promise<PaginatedResponse<Project>> => {
    const query: Record<string, string> = {};
    if (params.page != null) query.page = String(params.page);
    const res = await client.projects.$get({ query });
    if (!res.ok) throw await parseApiError(res);
    return res.json();
};

export const getProject = async (slug: string) => {
    const res = await client.projects[':slug'].$get({ param: { slug } });
    if (!res.ok) throw await parseApiError(res);
    return res.json();
};

export const getResume = async (): Promise<ResumeData> => {
    const res = await client.resume.$get();
    if (!res.ok) throw await parseApiError(res);
    return res.json();
};

export const createContact = async (payload: ContactPayload): Promise<void> => {
    const res = await client.contacts.$post({
        json: { contact: payload },
    });
    if (!res.ok) throw await parseApiError(res);
};

export const getContentVersion = async (): Promise<string> => {
    const res = await client.version.$get();
    if (!res.ok) throw await parseApiError(res);
    const data = await res.json();
    return data.version;
};
