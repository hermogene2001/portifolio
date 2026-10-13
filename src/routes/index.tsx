import { createFileRoute, Link } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { ProjectLoadError } from "@/components/project-load-error"
import { getHomeData } from "@/server/api"
import { ArrowRight, Briefcase, MapPin, Sparkles } from "lucide-react"

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  component: HomePage,
  errorComponent: ({ error }) => <ProjectLoadError error={error} />,
})

function HomePage() {
  const { profile, projects, posts, skills } = Route.useLoaderData()
  const featuredPosts = posts.slice(0, 2)
  const featuredProjects = projects.slice(0, 3)

  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      {/* Hero */}
      <section className="grid items-center gap-10 py-16 sm:py-20 md:grid-cols-2">
        <div>
          <Badge className="mb-4 rounded-full px-3 py-1">
            <Sparkles className="size-3" />
            {profile?.role ?? "Information Technology Graduate"}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Building smart digital solutions for real-world problems
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            I develop practical software, AI/ML-driven solutions, data systems,
            and connected technologies that combine technical depth with
            business value.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className={buttonVariants({ size: "lg" })}>
              Hire Me
            </Link>
            <Link
              to="/projects"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              View Projects
            </Link>
            <Link
              to="/resume"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              My Resume
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-transparent blur-2xl" />
          <img
            src={profile?.imagePath ?? "/headshot-on-white.jpg"}
            alt={`Portrait of ${profile?.name ?? "Hermogene UKUNDAYEZU"}`}
            className="aspect-[4/5] w-full rounded-2xl border border-border object-cover"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">
              <Briefcase className="size-3" />
              IT Graduate
            </Badge>
            <Badge variant="outline">
              <Sparkles className="size-3" />
              AI &amp; Data Focus
            </Badge>
            <Badge variant="outline">Software &amp; IoT</Badge>
          </div>
        </div>
      </section>

      {/* About */}
      {profile ? (
        <section className="pb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{profile.summary}</p>
              <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <dt className="text-muted-foreground">Full name:</dt>
                  <dd>{profile.name}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-muted-foreground">Current role:</dt>
                  <dd>{profile.currentRole}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-muted-foreground">Location:</dt>
                  <dd className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {profile.location}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-muted-foreground">Area of focus:</dt>
                  <dd>IT, AI, Data &amp; IoT</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {/* Skills */}
      {skills.length > 0 ? (
        <section className="pb-16">
          <h2 className="mb-4 text-2xl font-bold">What I Work With</h2>
          <Card>
            <CardContent className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="outline">
                  {skill.name}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </section>
      ) : null}

      {/* Featured projects */}
      <section className="pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Link
            to="/projects"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="gap-3">
              <CardHeader>
                <CardTitle className="text-base">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <p className="flex-1 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {featuredProjects.length === 0 ? (
          <p className="text-muted-foreground">
            No projects are published yet.
          </p>
        ) : null}
      </section>

      {/* Recent posts */}
      <section className="pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">From the Blog</h2>
          <Link
            to="/posts"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Read more
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              to="/posts/$slug"
              params={{ slug: post.slug }}
            >
              <Card className="h-full gap-3 transition-colors hover:border-primary/40">
                <CardHeader>
                  <CardTitle className="text-base">{post.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 items-end justify-between gap-2">
                  <p className="flex-1 text-sm text-muted-foreground">
                    {post.summary}
                  </p>
                  <ArrowRight className="size-4 shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {featuredPosts.length === 0 ? (
          <p className="text-muted-foreground">No posts are published yet.</p>
        ) : null}
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Card className="items-center gap-4 border-primary/20 bg-primary/5 py-10 text-center">
          <h2 className="text-2xl font-bold">
            Let&apos;s build something great together
          </h2>
          <p className="max-w-lg text-muted-foreground">
            Available for freelance projects, long-term collaborations, and job
            opportunities focused on modern digital product development.
          </p>
          <Link to="/contact" className={buttonVariants({ size: "lg" })}>
            Get in touch
          </Link>
        </Card>
      </section>
    </div>
  )
}
