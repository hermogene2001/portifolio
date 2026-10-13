import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { resumeData } from "@/lib/site-data"

export const Route = createFileRoute("/resume")({ component: ResumePage })

function ResumePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold">Resume</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">{resumeData.summary}</p>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Career Summary</h2>
        <Card>
          <CardContent className="gap-2">
            <p>{resumeData.summary}</p>
            <p className="text-muted-foreground text-sm">
              Currently working as a Field Technician at Piramie 4G while
              building full-stack and IoT solutions as a freelancer.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Work Experience</h2>
        <div className="space-y-4">
          {resumeData.experience.map((job) => (
            <Card key={`${job.jobTitle}-${job.company}`}>
              <CardHeader>
                <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {job.company} · {job.location} · {job.startDate}—{job.endDate}
                </p>
              </CardHeader>
              <CardContent className="gap-3">
                <p>{job.summary}</p>
                <p className="text-muted-foreground text-sm">{job.content}</p>
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
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Education</h2>
        <div className="space-y-4">
          {resumeData.education.map((school) => (
            <Card key={school.school}>
              <CardHeader>
                <CardTitle className="text-lg">{school.school}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {school.startDate}—{school.endDate}
                </p>
              </CardHeader>
              <CardContent className="gap-3">
                <p>{school.summary}</p>
                <p className="text-muted-foreground text-sm">{school.content}</p>
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
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Skills</h2>
        <Card>
          <CardContent className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}