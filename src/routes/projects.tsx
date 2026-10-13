import { createFileRoute } from "@tanstack/react-router"
import { Code2, ExternalLink } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { ProjectLoadError } from "@/components/project-load-error"
import { useReveal } from "@/lib/use-reveal"
import { projectImage } from "@/lib/project-image"
import { getProjects } from "@/server/api"

export const Route = createFileRoute("/projects")({
  loader: () => getProjects(),
  component: ProjectsPage,
  errorComponent: ({ error }) => <ProjectLoadError error={error} />,
})

function ProjectsPage() {
  const projects = Route.useLoaderData()

  useReveal()

  return (
    <div className="site-theme">
      <PageHero
        kicker="Portfolio"
        title="Projects & Case Studies"
        description="A selection of systems and platforms I've designed and built, from legal-tech platforms to AI chatbots and IoT trackers."
      />

      <section className="page-section">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <article key={project.id} className="project-card" data-reveal>
                <div className="project-image-wrap">
                  <img
                    src={projectImage(index)}
                    alt=""
                    loading="lazy"
                    width={640}
                    height={400}
                  />
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="mt-2 muted">{project.description}</p>
                  {project.content ? (
                    <p className="mt-2 text-sm">{project.content}</p>
                  ) : null}
                  {project.tags.length > 0 ? (
                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  ) : null}
                  <div className="project-actions">
                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-brand btn-sm"
                      >
                        <Code2 className="size-4" />
                        GitHub
                      </a>
                    ) : null}
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-brand btn-sm"
                      >
                        <ExternalLink className="size-4" />
                        Live Demo
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {projects.length === 0 ? (
            <p className="muted mt-8">No projects are published yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
