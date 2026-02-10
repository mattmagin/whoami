import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, Separator, Text, Stack, Flex, Grid, Container } from '@/components/ui'
import PostCard from '@/components/PostCard'
import ProjectCard from '@/components/ProjectCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import { usePosts, useProjects } from '@/hooks/queries'
import { useContent } from '@/providers/ContentProvider'
import HeroSection from './HeroSection'

const Home = () => {
  const { common, home } = useContent()
  const { data: posts, isLoading: postsLoading } = usePosts()
  const { data: projects, isLoading: projectsLoading } = useProjects()

  // Get recent posts (sorted by date, take 2)
  const recentPosts = [...(posts ?? [])]
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
    .slice(0, 2)

  // Get featured projects (take 3)
  const featuredProjects = (projects ?? [])
    .filter((p) => p.featured)
    .slice(0, 3)

  return (
    <Container size="lg" padding="lg">
      <HeroSection />

      <Separator className="mb-20" />

      {/* Featured Projects */}
      <AnimatedSection>
        <Stack as="section" gap="lg" className="mb-20">
          <Flex align="end" justify="between" gap="md">
            <Stack gap="xs">
              <Text variant="sectionTitle">
                {home.featuredProjects}
              </Text>
              <Text variant="muted" as="p">
                {home.featuredDescription}
              </Text>
            </Stack>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/projects">
                {common.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Flex>

          {projectsLoading ? (
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
              <LoadingSkeleton variant="card" count={3} />
            </Grid>
          ) : (
            <AnimatedList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <AnimatedListItem key={project.slug}>
                  <ProjectCard project={project} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          )}

          <Button variant="ghost" asChild className="sm:hidden">
            <Link to="/projects">
              {home.viewAllProjects}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Stack>
      </AnimatedSection>

      <Separator className="mb-20" />

      {/* Recent Posts */}
      <AnimatedSection>
        <Stack as="section" gap="lg">
          <Flex align="end" justify="between" gap="md">
            <Stack gap="xs">
              <Text variant="sectionTitle">
                {home.recentWriting}
              </Text>
              <Text variant="muted" as="p">
                {home.recentDescription}
              </Text>
            </Stack>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/blog">
                {common.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Flex>

          {postsLoading ? (
            <Grid cols={{ base: 1, md: 2 }} gap="lg">
              <LoadingSkeleton variant="card" count={2} />
            </Grid>
          ) : (
            <AnimatedList className="grid gap-6 md:grid-cols-2">
              {recentPosts.map((post) => (
                <AnimatedListItem key={post.slug}>
                  <PostCard post={post} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          )}

          <Button variant="ghost" asChild className="sm:hidden">
            <Link to="/blog">
              {home.viewAllPosts}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Stack>
      </AnimatedSection>
    </Container>
  )
}

export default Home
