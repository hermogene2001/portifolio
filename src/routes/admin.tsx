import { createFileRoute } from "@tanstack/react-router"
import { useCallback, useEffect, useState, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import type {
  EducationItem,
  ExperienceItem,
  PostView,
  ProfileView,
  ProjectView,
  Service,
  Skill,
  Testimonial,
} from "@/db/schema"
import {
  adminDeleteEducation,
  adminDeleteExperience,
  adminDeletePost,
  adminDeleteProject,
  adminDeleteService,
  adminDeleteSkill,
  adminDeleteTestimonial,
  adminGetAll,
  adminLogin,
  adminSaveEducation,
  adminSaveExperience,
  adminSavePost,
  adminSaveProfile,
  adminSaveProject,
  adminSaveService,
  adminSaveSkill,
  adminSaveTestimonial,
} from "@/server/api"
import { friendlyError } from "@/lib/errors"
import { resizeImageFile } from "@/lib/image-resize"
import { SERVICE_ICON_OPTIONS } from "@/lib/service-icons"

export const Route = createFileRoute("/admin")({ component: AdminPage })

const TOKEN_KEY = "portfolio_admin_token"

const DEFAULT_HEADSHOT = "/headshot-on-white.jpg"
const DEFAULT_ABOUT = "/about.jpg"

const inputClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

const textareaClass = `${inputClass} h-auto min-h-24 py-2`

type AdminData = {
  profile: ProfileView | null
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: Skill[]
  projects: ProjectView[]
  posts: PostView[]
  services: Service[]
  testimonials: Testimonial[]
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  )
}

function parseTags(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [data, setData] = useState<AdminData | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState("projects")

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY))
  }, [])

  const reload = useCallback(async (activeToken: string) => {
    const result = await adminGetAll({ data: { token: activeToken } })
    setData(result)
  }, [])

  useEffect(() => {
    if (!token) return
    reload(token).catch((err: unknown) => {
      setError(friendlyError(err, "Failed to load data"))
      setToken(null)
      localStorage.removeItem(TOKEN_KEY)
    })
  }, [token, reload])

  async function run(action: () => Promise<unknown>, message: string) {
    setError(null)
    setStatus(null)
    try {
      await action()
      if (token) await reload(token)
      setStatus(message)
    } catch (err) {
      setError(friendlyError(err, "Something went wrong"))
    }
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setData(null)
  }

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Admin sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={async (event) => {
                event.preventDefault()
                setError(null)
                const formData = new FormData(event.currentTarget)
                try {
                  const result = await adminLogin({
                    data: { password: String(formData.get("password") ?? "") },
                  })
                  localStorage.setItem(TOKEN_KEY, result.token)
                  setToken(result.token)
                } catch (err) {
                  setError(friendlyError(err, "Sign in failed"))
                }
              }}
            >
              <Field label="Password">
                <input
                  name="password"
                  type="password"
                  required
                  autoFocus
                  className={inputClass}
                />
              </Field>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <button className={`${buttonVariants()} w-fit`} type="submit">
                Sign in
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  const tabs = [
    { id: "projects", label: "Projects" },
    { id: "posts", label: "Posts" },
    { id: "services", label: "Services" },
    { id: "testimonials", label: "Testimonials" },
    { id: "resume", label: "Resume" },
    { id: "profile", label: "Profile" },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Content admin</h1>
        <button
          type="button"
          onClick={signOut}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Sign out
        </button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Changes are saved straight to PostgreSQL and appear on the site
        immediately.
      </p>

      {status ? (
        <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-sm">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={buttonVariants({
              variant: tab === item.id ? "default" : "outline",
              size: "sm",
            })}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        {tab === "profile" ? (
          <ProfileSection token={token} profile={data.profile} run={run} />
        ) : null}
        {tab === "projects" ? (
          <ProjectsSection token={token} projects={data.projects} run={run} />
        ) : null}
        {tab === "posts" ? (
          <PostsSection token={token} posts={data.posts} run={run} />
        ) : null}
        {tab === "services" ? (
          <ServicesSection token={token} services={data.services} run={run} />
        ) : null}
        {tab === "testimonials" ? (
          <TestimonialsSection
            token={token}
            testimonials={data.testimonials}
            run={run}
          />
        ) : null}
        {tab === "resume" ? (
          <ResumeSection
            token={token}
            experience={data.experience}
            education={data.education}
            skills={data.skills}
            run={run}
          />
        ) : null}
      </div>
    </div>
  )
}

type Run = (action: () => Promise<unknown>, message: string) => Promise<void>

/* ------------------------------- profile ------------------------------ */

function ProfileSection({
  token,
  profile,
  run,
}: {
  token: string
  profile: ProfileView | null
  run: Run
}) {
  const [imagePath, setImagePath] = useState(
    profile?.imagePath ?? DEFAULT_HEADSHOT
  )
  const [aboutImagePath, setAboutImagePath] = useState(
    profile?.aboutImagePath ?? DEFAULT_ABOUT
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            const fd = new FormData(event.currentTarget)
            const item = {
              id: 1,
              name: String(fd.get("name") ?? ""),
              shortName: String(fd.get("shortName") ?? ""),
              role: String(fd.get("role") ?? ""),
              location: String(fd.get("location") ?? ""),
              email: String(fd.get("email") ?? ""),
              phone: String(fd.get("phone") ?? ""),
              currentRole: String(fd.get("currentRole") ?? ""),
              summary: String(fd.get("summary") ?? ""),
              resumeSummary: String(fd.get("resumeSummary") ?? ""),
              imagePath: imagePath.trim() || DEFAULT_HEADSHOT,
              aboutImagePath: aboutImagePath.trim() || DEFAULT_ABOUT,
              headline: String(fd.get("headline") ?? ""),
              aboutHeading: String(fd.get("aboutHeading") ?? ""),
              github: String(fd.get("github") ?? "") || null,
              linkedin: String(fd.get("linkedin") ?? "") || null,
              x: String(fd.get("x") ?? "") || null,
              instagram: String(fd.get("instagram") ?? "") || null,
              facebook: String(fd.get("facebook") ?? "") || null,
            }
            run(
              () => adminSaveProfile({ data: { token, profile: item } }),
              "Profile saved"
            )
          }}
        >
          <Field label="Name">
            <input
              name="name"
              defaultValue={profile?.name ?? ""}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Short name / initials">
            <input
              name="shortName"
              defaultValue={profile?.shortName ?? ""}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Role">
            <input
              name="role"
              defaultValue={profile?.role ?? ""}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Location">
            <input
              name="location"
              defaultValue={profile?.location ?? ""}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              name="email"
              type="email"
              defaultValue={profile?.email ?? ""}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Phone">
            <input
              name="phone"
              defaultValue={profile?.phone ?? ""}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Current role">
            <input
              name="currentRole"
              defaultValue={profile?.currentRole ?? ""}
              required
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Hero headline">
              <input
                name="headline"
                defaultValue={profile?.headline ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="About heading">
              <input
                name="aboutHeading"
                defaultValue={profile?.aboutHeading ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <input type="hidden" name="imagePath" value={imagePath} />
          <input
            type="hidden"
            name="aboutImagePath"
            value={aboutImagePath}
          />
          <ImageField
            label="Headshot"
            value={imagePath}
            onChange={setImagePath}
            fallback={DEFAULT_HEADSHOT}
            hint="Shown in the home hero. Upload a photo (JPG, PNG, or WebP) — it is resized and saved with your profile — or paste an image URL/path."
          />
          <ImageField
            label="About image"
            value={aboutImagePath}
            onChange={setAboutImagePath}
            fallback={DEFAULT_ABOUT}
            hint="Shown in the About Me section. Leave on default to use /about.jpg."
          />
          <Field label="GitHub URL">
            <input
              name="github"
              defaultValue={profile?.github ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="LinkedIn URL">
            <input
              name="linkedin"
              defaultValue={profile?.linkedin ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="X URL">
            <input
              name="x"
              defaultValue={profile?.x ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Instagram URL">
            <input
              name="instagram"
              defaultValue={profile?.instagram ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Facebook URL">
            <input
              name="facebook"
              defaultValue={profile?.facebook ?? ""}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="About summary">
              <textarea
                name="summary"
                defaultValue={profile?.summary ?? ""}
                className={textareaClass}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Resume summary">
              <textarea
                name="resumeSummary"
                defaultValue={profile?.resumeSummary ?? ""}
                className={textareaClass}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={`${buttonVariants()} w-fit`}>
              Save profile
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function ImageField({
  label,
  value,
  onChange,
  fallback,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  fallback: string
  hint?: string
}) {
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const isUpload = value.startsWith("data:")

  async function handleFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setLocalError(null)
    try {
      onChange(await resizeImageFile(file))
    } catch (err) {
      setLocalError(friendlyError(err, "Could not process that image."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:col-span-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <img
          src={value || fallback}
          alt={`${label} preview`}
          className="size-28 shrink-0 rounded-xl border border-border bg-muted object-cover"
        />
        <div className="flex min-w-52 flex-1 flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            aria-label={`Upload ${label.toLowerCase()}`}
            className="block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            onChange={(event) => {
              void handleFile(event.target.files?.[0])
              event.target.value = ""
            }}
          />
          <input
            value={isUpload ? "" : value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={
              isUpload
                ? "Uploaded image in use — type a URL to replace"
                : "Image URL or /path (blank = default)"
            }
            className={inputClass}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() => onChange(fallback)}
            >
              Use default
            </button>
            {busy ? (
              <span className="text-sm text-muted-foreground">Processing…</span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            {hint ??
              "Upload a photo (JPG, PNG, or WebP). It is resized to fit and saved with your profile. You can also paste an image URL or path."}
          </p>
          {localError ? (
            <p className="text-sm text-destructive" role="alert">
              {localError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ projects ------------------------------ */

function ProjectsSection({
  token,
  projects,
  run,
}: {
  token: string
  projects: ProjectView[]
  run: Run
}) {
  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">
              {project.title}{" "}
              {project.isPublished ? null : (
                <Badge variant="outline">unpublished</Badge>
              )}
            </CardTitle>
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() =>
                run(
                  () =>
                    adminDeleteProject({
                      data: { token, id: project.id },
                    }),
                  "Project deleted"
                )
              }
            >
              Delete
            </button>
          </CardHeader>
          <CardContent>
            <ProjectForm
              token={token}
              project={project}
              run={run}
              submitLabel="Update project"
            />
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Add project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm
            token={token}
            project={null}
            run={run}
            submitLabel="Create project"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function ProjectForm({
  token,
  project,
  run,
  submitLabel,
}: {
  token: string
  project: ProjectView | null
  run: Run
  submitLabel: string
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        const fd = new FormData(event.currentTarget)
        const item = {
          id: project?.id,
          title: String(fd.get("title") ?? ""),
          description: String(fd.get("description") ?? ""),
          tags: parseTags(fd.get("tags")),
          github: String(fd.get("github") ?? "") || null,
          liveUrl: String(fd.get("liveUrl") ?? "") || null,
          content: String(fd.get("content") ?? ""),
          sortOrder: Number(fd.get("sortOrder") ?? 0),
          isPublished: fd.get("isPublished") === "on",
        }
        run(() => adminSaveProject({ data: { token, item } }), "Project saved")
      }}
    >
      <Field label="Title">
        <input
          name="title"
          defaultValue={project?.title ?? ""}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Sort order">
        <input
          name="sortOrder"
          type="number"
          defaultValue={project?.sortOrder ?? 0}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <input
            name="description"
            defaultValue={project?.description ?? ""}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Tags (comma separated)">
        <input
          name="tags"
          defaultValue={project?.tags.join(", ") ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="GitHub URL">
        <input
          name="github"
          defaultValue={project?.github ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Live URL">
        <input
          name="liveUrl"
          defaultValue={project?.liveUrl ?? ""}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Content">
          <textarea
            name="content"
            defaultValue={project?.content ?? ""}
            className={textareaClass}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={project?.isPublished ?? true}
        />
        Published
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className={`${buttonVariants()} w-fit`}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

/* -------------------------------- posts ------------------------------- */

function PostsSection({
  token,
  posts,
  run,
}: {
  token: string
  posts: PostView[]
  run: Run
}) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">
              {post.title}{" "}
              {post.isPublished ? null : (
                <Badge variant="outline">unpublished</Badge>
              )}
            </CardTitle>
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() =>
                run(
                  () => adminDeletePost({ data: { token, id: post.id } }),
                  "Post deleted"
                )
              }
            >
              Delete
            </button>
          </CardHeader>
          <CardContent>
            <PostForm
              token={token}
              post={post}
              run={run}
              submitLabel="Update post"
            />
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Add post</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm
            token={token}
            post={null}
            run={run}
            submitLabel="Create post"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function PostForm({
  token,
  post,
  run,
  submitLabel,
}: {
  token: string
  post: PostView | null
  run: Run
  submitLabel: string
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        const fd = new FormData(event.currentTarget)
        const item = {
          id: post?.id,
          title: String(fd.get("title") ?? ""),
          slug: String(fd.get("slug") ?? ""),
          date: String(fd.get("date") ?? ""),
          summary: String(fd.get("summary") ?? ""),
          tags: parseTags(fd.get("tags")),
          author: String(fd.get("author") ?? ""),
          content: String(fd.get("content") ?? ""),
          isPublished: fd.get("isPublished") === "on",
        }
        run(() => adminSavePost({ data: { token, item } }), "Post saved")
      }}
    >
      <Field label="Title">
        <input
          name="title"
          defaultValue={post?.title ?? ""}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Slug">
        <input
          name="slug"
          defaultValue={post?.slug ?? ""}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Date (YYYY-MM-DD)">
        <input
          name="date"
          type="date"
          defaultValue={post?.date ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Author">
        <input
          name="author"
          defaultValue={post?.author ?? ""}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Summary">
          <input
            name="summary"
            defaultValue={post?.summary ?? ""}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Tags (comma separated)">
        <input
          name="tags"
          defaultValue={post?.tags.join(", ") ?? ""}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Content (Markdown)">
          <textarea
            name="content"
            defaultValue={post?.content ?? ""}
            className={`${textareaClass} min-h-48`}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={post?.isPublished ?? true}
        />
        Published
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className={`${buttonVariants()} w-fit`}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

/* ------------------------------- resume ------------------------------- */

function ResumeSection({
  token,
  experience,
  education,
  skills,
  run,
}: {
  token: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: Skill[]
  run: Run
}) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Card>
          <CardContent className="flex flex-wrap items-center gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="inline-flex items-center gap-1">
                <Badge variant="outline">{skill.name}</Badge>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    run(
                      () => adminDeleteSkill({ data: { token, id: skill.id } }),
                      "Skill removed"
                    )
                  }
                >
                  ✕
                </button>
              </span>
            ))}
            {skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills yet.</p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <form
              className="flex flex-wrap items-end gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                const fd = new FormData(event.currentTarget)
                const item = {
                  name: String(fd.get("name") ?? ""),
                  sortOrder: Number(fd.get("sortOrder") ?? 0),
                }
                run(
                  () => adminSaveSkill({ data: { token, item } }),
                  "Skill added"
                )
                event.currentTarget.reset()
              }}
            >
              <Field label="Skill name">
                <input name="name" required className={inputClass} />
              </Field>
              <Field label="Order">
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={0}
                  className={inputClass}
                />
              </Field>
              <button type="submit" className={buttonVariants()}>
                Add skill
              </button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Experience</h2>
        {experience.map((job) => (
          <Card key={job.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">{job.jobTitle}</CardTitle>
              <button
                type="button"
                className={buttonVariants({ variant: "outline", size: "sm" })}
                onClick={() =>
                  run(
                    () =>
                      adminDeleteExperience({ data: { token, id: job.id } }),
                    "Experience deleted"
                  )
                }
              >
                Delete
              </button>
            </CardHeader>
            <CardContent>
              <ExperienceForm
                token={token}
                item={job}
                run={run}
                submitLabel="Update"
              />
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader>
            <CardTitle>Add experience</CardTitle>
          </CardHeader>
          <CardContent>
            <ExperienceForm
              token={token}
              item={null}
              run={run}
              submitLabel="Add"
            />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Education</h2>
        {education.map((school) => (
          <Card key={school.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">{school.school}</CardTitle>
              <button
                type="button"
                className={buttonVariants({ variant: "outline", size: "sm" })}
                onClick={() =>
                  run(
                    () =>
                      adminDeleteEducation({ data: { token, id: school.id } }),
                    "Education deleted"
                  )
                }
              >
                Delete
              </button>
            </CardHeader>
            <CardContent>
              <EducationForm
                token={token}
                item={school}
                run={run}
                submitLabel="Update"
              />
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader>
            <CardTitle>Add education</CardTitle>
          </CardHeader>
          <CardContent>
            <EducationForm
              token={token}
              item={null}
              run={run}
              submitLabel="Add"
            />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function ExperienceForm({
  token,
  item,
  run,
  submitLabel,
}: {
  token: string
  item: ExperienceItem | null
  run: Run
  submitLabel: string
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        const fd = new FormData(event.currentTarget)
        const values = {
          id: item?.id,
          jobTitle: String(fd.get("jobTitle") ?? ""),
          company: String(fd.get("company") ?? ""),
          location: String(fd.get("location") ?? ""),
          startDate: String(fd.get("startDate") ?? ""),
          endDate: String(fd.get("endDate") ?? ""),
          tags: parseTags(fd.get("tags")),
          summary: String(fd.get("summary") ?? ""),
          content: String(fd.get("content") ?? ""),
          sortOrder: Number(fd.get("sortOrder") ?? 0),
        }
        run(
          () => adminSaveExperience({ data: { token, item: values } }),
          "Experience saved"
        )
      }}
    >
      <Field label="Job title">
        <input
          name="jobTitle"
          defaultValue={item?.jobTitle ?? ""}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Company">
        <input
          name="company"
          defaultValue={item?.company ?? ""}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Location">
        <input
          name="location"
          defaultValue={item?.location ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Sort order">
        <input
          name="sortOrder"
          type="number"
          defaultValue={item?.sortOrder ?? 0}
          className={inputClass}
        />
      </Field>
      <Field label="Start date">
        <input
          name="startDate"
          defaultValue={item?.startDate ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="End date">
        <input
          name="endDate"
          defaultValue={item?.endDate ?? ""}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Tags (comma separated)">
          <input
            name="tags"
            defaultValue={item?.tags.join(", ") ?? ""}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Summary">
          <input
            name="summary"
            defaultValue={item?.summary ?? ""}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Content">
          <textarea
            name="content"
            defaultValue={item?.content ?? ""}
            className={textareaClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className={`${buttonVariants()} w-fit`}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function EducationForm({
  token,
  item,
  run,
  submitLabel,
}: {
  token: string
  item: EducationItem | null
  run: Run
  submitLabel: string
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        const fd = new FormData(event.currentTarget)
        const values = {
          id: item?.id,
          school: String(fd.get("school") ?? ""),
          summary: String(fd.get("summary") ?? ""),
          startDate: String(fd.get("startDate") ?? ""),
          endDate: String(fd.get("endDate") ?? ""),
          tags: parseTags(fd.get("tags")),
          content: String(fd.get("content") ?? ""),
          sortOrder: Number(fd.get("sortOrder") ?? 0),
        }
        run(
          () => adminSaveEducation({ data: { token, item: values } }),
          "Education saved"
        )
      }}
    >
      <Field label="School / program">
        <input
          name="school"
          defaultValue={item?.school ?? ""}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Sort order">
        <input
          name="sortOrder"
          type="number"
          defaultValue={item?.sortOrder ?? 0}
          className={inputClass}
        />
      </Field>
      <Field label="Start date">
        <input
          name="startDate"
          defaultValue={item?.startDate ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="End date">
        <input
          name="endDate"
          defaultValue={item?.endDate ?? ""}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Tags (comma separated)">
          <input
            name="tags"
            defaultValue={item?.tags.join(", ") ?? ""}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Summary">
          <input
            name="summary"
            defaultValue={item?.summary ?? ""}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Content">
          <textarea
            name="content"
            defaultValue={item?.content ?? ""}
            className={textareaClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className={`${buttonVariants()} w-fit`}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

/* ------------------------------ services ------------------------------ */

function ServicesSection({
  token,
  services,
  run,
}: {
  token: string
  services: Service[]
  run: Run
}) {
  return (
    <div className="space-y-6">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">{service.title}</CardTitle>
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() =>
                run(
                  () => adminDeleteService({ data: { token, id: service.id } }),
                  "Service deleted"
                )
              }
            >
              Delete
            </button>
          </CardHeader>
          <CardContent>
            <ServiceForm
              token={token}
              service={service}
              run={run}
              submitLabel="Update service"
            />
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Add service</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceForm
            token={token}
            service={null}
            run={run}
            submitLabel="Create service"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function ServiceForm({
  token,
  service,
  run,
  submitLabel,
}: {
  token: string
  service: Service | null
  run: Run
  submitLabel: string
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        const fd = new FormData(event.currentTarget)
        const item = {
          id: service?.id,
          title: String(fd.get("title") ?? ""),
          description: String(fd.get("description") ?? ""),
          icon: String(fd.get("icon") ?? "code"),
          sortOrder: Number(fd.get("sortOrder") ?? 0),
        }
        run(() => adminSaveService({ data: { token, item } }), "Service saved")
      }}
    >
      <Field label="Title">
        <input
          name="title"
          defaultValue={service?.title ?? ""}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Icon">
        <select
          name="icon"
          defaultValue={service?.icon ?? "code"}
          className={inputClass}
        >
          {SERVICE_ICON_OPTIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Sort order">
        <input
          name="sortOrder"
          type="number"
          defaultValue={service?.sortOrder ?? 0}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea
            name="description"
            defaultValue={service?.description ?? ""}
            className={textareaClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className={`${buttonVariants()} w-fit`}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

/* ---------------------------- testimonials ---------------------------- */

function TestimonialsSection({
  token,
  testimonials,
  run,
}: {
  token: string
  testimonials: Testimonial[]
  run: Run
}) {
  return (
    <div className="space-y-6">
      {testimonials.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">{item.name}</CardTitle>
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() =>
                run(
                  () =>
                    adminDeleteTestimonial({ data: { token, id: item.id } }),
                  "Testimonial deleted"
                )
              }
            >
              Delete
            </button>
          </CardHeader>
          <CardContent>
            <TestimonialForm
              token={token}
              testimonial={item}
              run={run}
              submitLabel="Update testimonial"
            />
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Add testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialForm
            token={token}
            testimonial={null}
            run={run}
            submitLabel="Create testimonial"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function TestimonialForm({
  token,
  testimonial,
  run,
  submitLabel,
}: {
  token: string
  testimonial: Testimonial | null
  run: Run
  submitLabel: string
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        const fd = new FormData(event.currentTarget)
        const item = {
          id: testimonial?.id,
          name: String(fd.get("name") ?? ""),
          role: String(fd.get("role") ?? ""),
          quote: String(fd.get("quote") ?? ""),
          avatar: String(fd.get("avatar") ?? ""),
          sortOrder: Number(fd.get("sortOrder") ?? 0),
        }
        run(
          () => adminSaveTestimonial({ data: { token, item } }),
          "Testimonial saved"
        )
      }}
    >
      <Field label="Name">
        <input
          name="name"
          defaultValue={testimonial?.name ?? ""}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Role / company">
        <input
          name="role"
          defaultValue={testimonial?.role ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Avatar image URL (optional)">
        <input
          name="avatar"
          defaultValue={testimonial?.avatar ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Sort order">
        <input
          name="sortOrder"
          type="number"
          defaultValue={testimonial?.sortOrder ?? 0}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Quote">
          <textarea
            name="quote"
            defaultValue={testimonial?.quote ?? ""}
            className={textareaClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className={`${buttonVariants()} w-fit`}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
