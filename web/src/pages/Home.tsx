import { Link } from 'react-router-dom'
import { ArrowRight, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CopyButton from '@/components/CopyButton'
import TypewriterText from '@/components/TypewriterText'
import { Separator } from '@/components/ui/separator'
import PostCard from '@/components/PostCard'
import ProjectCard from '@/components/ProjectCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import TuiEntryPoint from '@/components/TuiEntryPoint'
import { usePosts, useProjects } from '@/hooks/queries'
import { name, summary } from '@/consts'
import { useStrings } from '@/content'

const Home = () => {
  const { common, home } = useStrings()
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
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      {/* Hero Section */}
      <section className="mb-20">
        <p className="mb-4 text-sm font-medium text-primary animate-fade-in">
          {home.greeting}
        </p>
        <h1 className="mb-2 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-slide-up">
          {name}
        </h1>
        <div className="mb-6 h-8 text-xl text-primary md:text-2xl animate-slide-up-delay-1">
          <TypewriterText />
        </div>
        <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl animate-slide-up-delay-2">
          {summary}
        </p>
        <div className="flex flex-wrap gap-4 animate-slide-up-delay-3">
          <Button asChild size="lg">
            <Link to="/projects">
              {home.viewWork}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">{common.getInTouch}</Link>
          </Button>
        </div>

        {/* SSH Access Hint */}
        <div className="mt-12 inline-flex items-center gap-1 rounded-lg bg-muted/50 pl-4 pr-1 py-1 font-mono text-sm text-muted-foreground animate-slide-up-delay-3">
          <Terminal className="h-4 w-4 mr-1" />
          <span>{home.sshHint} {common.sshCommand}</span>
          <CopyButton text={common.sshCommand} className="h-8 w-8" />
        </div>
      </section>

      <Separator className="mb-20" />

      {/* Featured Projects */}
      <AnimatedSection>
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                {home.featuredProjects}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {home.featuredDescription}
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/projects">
                {common.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {projectsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <LoadingSkeleton variant="card" count={3} />
            </div>
          ) : (
            <AnimatedList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <AnimatedListItem key={project.slug}>
                  <ProjectCard project={project} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          )}

          <Button variant="ghost" asChild className="mt-6 sm:hidden">
            <Link to="/projects">
              {home.viewAllProjects}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </AnimatedSection>

      <Separator className="mb-20" />

      {/* Recent Posts */}
      <AnimatedSection>
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                {home.recentWriting}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {home.recentDescription}
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/blog">
                {common.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {postsLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              <LoadingSkeleton variant="card" count={2} />
            </div>
          ) : (
            <AnimatedList className="grid gap-6 md:grid-cols-2">
              {recentPosts.map((post) => (
                <AnimatedListItem key={post.slug}>
                  <PostCard post={post} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          )}

          <Button variant="ghost" asChild className="mt-6 sm:hidden">
            <Link to="/blog">
              {home.viewAllPosts}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </AnimatedSection>

      {/* TUI Entry Point */}
      <TuiEntryPoint />
    </div>
  )
}

export default Home
