import { useQuery } from '@tanstack/react-query'
import { getPosts, getPost, getProjects, getProject, getResume } from '@/api'
import type { Post, Project, ResumeData } from '@/api'

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })
}

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ['posts', slug],
    queryFn: () => getPost(slug),
    enabled: !!slug,
  })
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
}

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => getProject(slug),
    enabled: !!slug,
  })
}

export const useResume = () => {
  return useQuery({
    queryKey: ['resume'],
    queryFn: getResume,
  })
}

export type { Post, Project, ResumeData }
