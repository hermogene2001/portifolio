import { createFileRoute } from "@tanstack/react-router"
import { PageHero } from "@/components/page-hero"
import { ProjectLoadError } from "@/components/project-load-error"
import { useReveal } from "@/lib/use-reveal"
import { getResume } from "@/server/api"

export const Route = createFileRoute("/resume")({
  loader: () => getResume(),
  component: ResumePage,
  errorComponent: ({ error }) => <ProjectLoadError error={error} />,
})

function ResumePage() {
  const { summary, experience, education, skills } = Route.useLoaderData()

  useReveal()

  return (
    <div className="site-theme">
      <PageHero
        kicker="Resume"
        title="Experience & Education"
        description={summary}
      />

      <section className="page-section">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="page-heading" data-reveal>
              Work Experience
            </h2>
            <div className="timeline">
              {experience.map((job) => (
                <div key={job.id} className="timeline-item" data-reveal="right">
                  <span className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-card">
                    <span className="timeline-meta">
                      {job.startDate}
                      {job.endDate ? ` — ${job.endDate}` : ""}
                    </span>
                    <h3 className="mt-1">{job.jobTitle}</h3>
                    <p className="mt-1 text-sm">
                      {[job.company, job.location].filter(Boolean).join(" · ")}
                    </p>
                    {job.summary ? <p className="mt-3">{job.summary}</p> : null}
                    {job.content ? (
                      <p className="mt-2 text-sm muted">{job.content}</p>
                    ) : null}
                    {job.tags.length > 0 ? (
                      <div className="project-tags">
                        {job.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              {experience.length === 0 ? (
                <p className="muted">No experience added yet.</p>
              ) : null}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="premium-card p-6" data-reveal="left">
              <h2 className="page-heading">Education</h2>
              <div className="space-y-5">
                {education.map((school) => (
                  <div key={school.id}>
                    <p className="timeline-meta">
                      {school.startDate}
                      {school.endDate ? ` — ${school.endDate}` : ""}
                    </p>
                    <h3 className="mt-1 text-lg font-bold">{school.school}</h3>
                    {school.summary ? (
                      <p className="mt-2 text-sm">{school.summary}</p>
                    ) : null}
                    {school.content ? (
                      <p className="mt-1 text-sm muted">{school.content}</p>
                    ) : null}
                    {school.tags.length > 0 ? (
                      <div className="project-tags">
                        {school.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                {education.length === 0 ? (
                  <p className="muted">No education added yet.</p>
                ) : null}
              </div>
            </div>

            <div className="premium-card p-6" data-reveal="left">
              <h2 className="page-heading">Skills</h2>
              {skills.length > 0 ? (
                <div className="badge-cloud">
                  {skills.map((skill) => (
                    <span key={skill.id} className="tech-badge">
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted">No skills added yet.</p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
