import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { ProjectLoadError } from "@/components/project-load-error"
import { loadProjects } from "@/lib/data"
import { Code2, ExternalLink } from "lucide-react"

export const Route = createFileRoute("/projects")({
  loader: loadProjects,
  component: ProjectsPage,
  errorComponent: ({ error }) => <ProjectLoadError error={error} />,
})

function ProjectsPage() {
  const projects = Route.useLoaderData()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold">Projects</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        A selection of systems and platforms I&apos;ve designed and built.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.title} className="h-full gap-3">
            <CardHeader>
              <CardTitle className="text-lg">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <p className="text-muted-foreground text-sm">{project.description}</p>
              <p className="flex-1 text-sm">{project.content}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <Code2 />
                    GitHub
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ size: "sm" })}
                  >
                    <ExternalLink />
                    Live Demo
                  </a>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {projects.length === 0 ? (
        <p className="text-muted-foreground mt-8">No projects are published yet.</p>
      ) : null}
    </div>
  )
}