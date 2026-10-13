import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectLoadError } from "@/components/project-load-error"
import { getResume } from "@/server/api"

export const Route = createFileRoute("/resume")({
  loader: () => getResume(),
  component: ResumePage,
  errorComponent: ({ error }) => <ProjectLoadError error={error} />,
})

function ResumePage() {
  const { summary, experience, education, skills } = Route.useLoaderData()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold">Resume</h1>
      {summary ? (
        <p className="mt-2 max-w-2xl text-muted-foreground">{summary}</p>
      ) : null}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Work Experience</h2>
        <div className="space-y-4">
          {experience.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {job.company} · {job.location} · {job.startDate}—{job.endDate}
                </p>
              </CardHeader>
              <CardContent className="gap-3">
                <p>{job.summary}</p>
                <p className="text-sm text-muted-foreground">{job.content}</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {experience.length === 0 ? (
            <p className="text-muted-foreground">No experience added yet.</p>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Education</h2>
        <div className="space-y-4">
          {education.map((school) => (
            <Card key={school.id}>
              <CardHeader>
                <CardTitle className="text-lg">{school.school}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {school.startDate}—{school.endDate}
                </p>
              </CardHeader>
              <CardContent className="gap-3">
                <p>{school.summary}</p>
                <p className="text-sm text-muted-foreground">
                  {school.content}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {school.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {education.length === 0 ? (
            <p className="text-muted-foreground">No education added yet.</p>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Skills</h2>
        <Card>
          <CardContent className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill.id} variant="outline">
                {skill.name}
              </Badge>
            ))}
            {skills.length === 0 ? (
              <p className="text-muted-foreground">No skills added yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
