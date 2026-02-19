import { useQuery } from '@tanstack/react-query'
import { getPosts, getPost, getProjects, getProject, getResume } from '@/api'

/** Ensures a minimum delay so skeleton loaders feel intentional */
const withMinDelay = <T,>(promise: Promise<T>, ms = 400): Promise<T> =>
  Promise.all([promise, new Promise((r) => setTimeout(r, ms))]).then(([result]) => result)

export const usePosts = (page: number) => {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () =>
      page === 1
        ? getPosts({ page })
        : withMinDelay(getPosts({ page })),
  })
}

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ['posts', slug],
    queryFn: () => getPost(slug),
    enabled: !!slug,
  })
}

export const useProjects = (page: number) => {
  return useQuery({
    queryKey: ['projects', page],
    queryFn: () =>
      page === 1
        ? getProjects({ page })
        : withMinDelay(getProjects({ page })),
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

