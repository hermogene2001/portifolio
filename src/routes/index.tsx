import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import {
  ArrowUp,
  Briefcase,
  Code2,
  Download,
  ExternalLink,
  Globe,
  Layers,
  Mail,
  MapPin,
  Phone,
  Send,
  Settings,
  Sparkles,
} from "lucide-react"

import { ProjectLoadError } from "@/components/project-load-error"
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons"
import { getHomeData } from "@/server/api"
import { ServiceIcon } from "@/lib/service-icons"
import { useReveal } from "@/lib/use-reveal"
import { projectImage } from "@/lib/project-image"

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  component: HomePage,
  errorComponent: ({ error }) => <ProjectLoadError error={error} />,
})

/* ------------------------------ static bits ------------------------------ */

const SPECIALTIES = [
  "Full-Stack Developer",
  "AI & ML Enthusiast",
  "Data & Database Systems",
  "IoT Solutions",
  "Freelancer",
  "Digital Transformation",
] as const

const SKINS = [
  "#f021b2",
  "#1854b4",
  "#37b182",
  "#fa5b0f",
  "#ec1839",
] as const

const FILTERS = [
  { id: "all", label: "All" },
  { id: "web", label: "Web Apps" },
  { id: "system", label: "Systems" },
  { id: "ai", label: "AI" },
] as const

function projectCategories(tags: string[]) {
  const t = tags.join(" ").toLowerCase()
  const cats: string[] = []
  if (/(openai|chatbot|machine|artificial|\bai\b)/.test(t)) cats.push("ai")
  if (/(mysql|gps|nodemcu|php|python|django|backend|system)/.test(t))
    cats.push("system")
  if (/(html|css|javascript|bootstrap|django|react|web|frontend)/.test(t))
    cats.push("web")
  return cats
}

/* ------------------------------ small hooks ------------------------------ */

function TypingText({ strings }: { strings: readonly string[] }) {
  const [text, setText] = useState(strings[0] ?? "")

  useEffect(() => {
    let index = 0
    let char = 0
    let deleting = false
    let timer: number

    const tick = () => {
      const current = strings[index] ?? ""
      if (!deleting) {
        char += 1
        setText(current.slice(0, char))
        if (char >= current.length) {
          deleting = true
          timer = window.setTimeout(tick, 1300)
          return
        }
        timer = window.setTimeout(tick, 75)
      } else {
        char -= 1
        setText(current.slice(0, Math.max(char, 0)))
        if (char <= 0) {
          deleting = false
          index = (index + 1) % strings.length
          timer = window.setTimeout(tick, 350)
          return
        }
        timer = window.setTimeout(tick, 45)
      }
    }

    timer = window.setTimeout(tick, 900)
    return () => window.clearTimeout(timer)
  }, [strings])

  return (
    <span className="typing-text">
      {text}
      <span className="typing-caret" aria-hidden="true" />
    </span>
  )
}

/* -------------------------------- page ---------------------------------- */

function HomePage() {
  const { profile, projects, posts, skills, experience, services, testimonials } =
    Route.useLoaderData()

  const [skin, setSkin] = useState<string>(SKINS[0])
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [filter, setFilter] = useState<string>("all")

  const glowRef = useRef<HTMLDivElement>(null)

  useReveal([filter])

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_skin")
    if (saved) setSkin(saved)
  }, [])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const el = glowRef.current
    if (!el) return
    if (!window.matchMedia("(pointer: fine)").matches) {
      el.style.display = "none"
      return
    }
    const move = (event: MouseEvent) => {
      el.style.left = `${event.clientX}px`
      el.style.top = `${event.clientY}px`
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  const chooseSkin = (color: string) => {
    setSkin(color)
    localStorage.setItem("portfolio_skin", color)
  }

  const imageIndex = new Map(projects.map((project, index) => [project.id, index]))
  const featuredProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => projectCategories(project.tags).includes(filter))
  const featuredPosts = posts.slice(0, 2)
  const barSkills = skills.slice(0, 6)

  const name = profile?.name ?? "Hermogene UKUNDAYEZU"
  const socials = [
    { href: profile?.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile?.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile?.x, label: "X", Icon: XIcon },
    { href: profile?.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: profile?.facebook, label: "Facebook", Icon: FacebookIcon },
  ].filter((social): social is typeof social & { href: string } =>
    Boolean(social.href)
  )

  return (
    <div
      className="site-theme"
      style={{ "--skin-color": skin } as CSSProperties}
    >
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />

      {/* ---------------------------- hero ---------------------------- */}
      <section id="home" className="hero-section section-space">
        <div className="hero-shape hero-shape-1" />
        <div className="hero-shape hero-shape-2" />
        <div className="relative mx-auto w-full max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div data-reveal="right">
              <span className="section-kicker">
                {profile?.role ?? "Information Technology Graduate"}
              </span>
              <h1 className="hero-title mt-3">
                {profile?.headline ??
                  "Building Smart Digital Solutions for Real-World Problems"}
              </h1>
              <p className="hero-text mt-4">
                {profile?.summary ??
                  "I develop practical software, AI/ML-driven solutions, data systems, and connected technologies that combine technical depth with business value."}
              </p>

              <div className="typing-wrap mt-4">
                <span className="typing-label">Specialties:</span>
                <TypingText strings={SPECIALTIES} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/contact" className="btn btn-brand btn-lg">
                  Hire Me
                </Link>
                <a
                  href="/cv.pdf"
                  download
                  className="btn btn-outline-brand btn-lg"
                >
                  <Download className="size-4" />
                  Download CV
                </a>
                <Link to="/projects" className="btn btn-ghost btn-lg">
                  View Projects
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="glass-badge">
                  <Briefcase className="size-3.5" /> IT Graduate
                </span>
                <span className="glass-badge">
                  <Sparkles className="size-3.5" /> AI &amp; Data Focus
                </span>
                <span className="glass-badge">
                  <Layers className="size-3.5" /> Software &amp; IoT Enthusiast
                </span>
              </div>
            </div>

            <div data-reveal="left">
              <div className="hero-portrait-card">
                <img
                  src={profile?.imagePath ?? "/headshot-on-white.jpg"}
                  alt={`Portrait of ${name}`}
                  className="hero-portrait"
                />
                <div className="floating-chip chip-a">UI/UX Focused</div>
                <div className="floating-chip chip-b">API + DB Systems</div>
                <div className="floating-chip chip-c">Client-Ready Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- about --------------------------- */}
      {profile ? (
        <section id="about" className="section-space scroll-mt-20">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="section-heading text-center" data-reveal>
              <span className="section-kicker">About Me</span>
              <h2>{profile.aboutHeading}</h2>
            </div>
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="about-image-wrap" data-reveal="right">
                <img
                  src={profile.aboutImagePath || "/about.jpg"}
                  alt={`About ${name}`}
                />
              </div>
              <div className="premium-card p-6 md:p-10" data-reveal="left">
                <p>{profile.summary}</p>
                <p className="mt-4">{profile.resumeSummary}</p>
                <div className="info-grid mt-6">
                  <div>
                    <strong>Full Name:</strong> {profile.name}
                  </div>
                  <div>
                    <strong>Location:</strong> {profile.location}
                  </div>
                  <div>
                    <strong>Current Role:</strong> {profile.currentRole}
                  </div>
                  <div>
                    <strong>Area of Focus:</strong> IT, AI, Data &amp; IoT
                  </div>
                  <div>
                    <strong>Email:</strong> {profile.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {profile.phone}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/cv.pdf"
                    download
                    className="btn btn-brand"
                  >
                    <Download className="size-4" />
                    Download CV
                  </a>
                  <Link to="/contact" className="btn btn-outline-brand">
                    Contact Me
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* --------------------------- services ------------------------- */}
      {services.length > 0 ? (
        <section
          id="services"
          className="section-space section-muted scroll-mt-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="section-heading text-center" data-reveal>
              <span className="section-kicker">Services</span>
              <h2>Premium Solutions for Modern Businesses</h2>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.id} className="service-card" data-reveal>
                  <div className="service-icon">
                    <ServiceIcon name={service.icon} className="size-6" />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------------------- skills -------------------------- */}
      {skills.length > 0 ? (
        <section id="skills" className="section-space scroll-mt-20">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="section-heading text-center" data-reveal>
              <span className="section-kicker">Skills</span>
              <h2>What I Work With</h2>
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="premium-card p-6 md:p-10" data-reveal="right">
                {barSkills.map((skill, index) => (
                  <div key={skill.id} className="skill-item">
                    <div className="skill-head">
                      <span>{skill.name}</span>
                    </div>
                    <div className="skill-bar">
                      <span
                        style={
                          {
                            "--w": `${Math.max(72, 96 - index * 5)}%`,
                          } as CSSProperties
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="premium-card h-full p-6 md:p-10"
                data-reveal="left"
              >
                <h3 className="mb-6 text-xl font-bold">
                  Tech Stack Highlights
                </h3>
                <div className="badge-cloud">
                  {skills.map((skill) => (
                    <span key={skill.id} className="tech-badge">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* --------------------------- projects ------------------------- */}
      <section
        id="projects"
        className="section-space section-muted scroll-mt-20"
      >
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="section-heading text-center" data-reveal>
            <span className="section-kicker">Portfolio</span>
            <h2>Featured Projects</h2>
          </div>

          <div className="project-filters mt-8" data-reveal>
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`filter-btn${filter === item.id ? " active" : ""}`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article key={project.id} className="project-card" data-reveal>
                <div className="project-image-wrap">
                  <img
                    src={projectImage(imageIndex.get(project.id) ?? 0)}
                    alt={project.title}
                  />
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="mt-2">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-brand"
                      >
                        <ExternalLink className="size-3.5" />
                        Live Demo
                      </a>
                    ) : null}
                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-brand"
                      >
                        <Code2 className="size-3.5" />
                        GitHub
                      </a>
                    ) : null}
                    <Link to="/projects" className="btn btn-sm btn-ghost">
                      Case Study
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {featuredProjects.length === 0 ? (
            <p className="mt-8 text-center">No projects match this filter.</p>
          ) : null}

          <div className="mt-10 text-center" data-reveal>
            <Link to="/projects" className="btn btn-outline-brand btn-lg">
              View all projects
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------- journey -------------------------- */}
      <section id="journey" className="section-space scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="section-heading text-center" data-reveal>
            <span className="section-kicker">Experience</span>
            <h2>Professional Journey</h2>
          </div>
          <div className="timeline mt-8">
            {experience.map((job) => (
              <article key={job.id} className="timeline-item" data-reveal>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <h3>{job.jobTitle}</h3>
                  <p className="timeline-meta mt-1">
                    {job.company}
                    {job.startDate || job.endDate
                      ? ` · ${job.startDate}—${job.endDate}`
                      : ""}
                  </p>
                  <p className="mt-2">{job.summary}</p>
                </div>
              </article>
            ))}
            {experience.length === 0 ? (
              <p className="text-center">No experience added yet.</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* ----------------------------- blog --------------------------- */}
      {featuredPosts.length > 0 ? (
        <section className="section-space scroll-mt-20">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="section-heading text-center" data-reveal>
              <span className="section-kicker">Blog</span>
              <h2>From the Blog</h2>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  to="/posts/$slug"
                  params={{ slug: post.slug }}
                  className="premium-card block p-6 md:p-8"
                  data-reveal
                >
                  <p className="timeline-meta">
                    {post.date
                      ? new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{post.title}</h3>
                  <p className="mt-2">{post.summary}</p>
                  <span
                    className="mt-4 inline-block font-semibold"
                    style={{ color: "var(--skin-color)" }}
                  >
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center" data-reveal>
              <Link to="/posts" className="btn btn-outline-brand btn-lg">
                View all posts
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------- testimonials ----------------------- */}
      {testimonials.length > 0 ? (
        <section
          id="testimonials"
          className="section-space section-muted scroll-mt-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="section-heading text-center" data-reveal>
              <span className="section-kicker">Testimonials</span>
              <h2>What Clients Say</h2>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item) => (
                <article key={item.id} className="testimonial-card" data-reveal>
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt=""
                      className="testimonial-avatar"
                    />
                  ) : null}
                  <p>{`“${item.quote}”`}</p>
                  <h4 className="mt-4">{item.name}</h4>
                  <span>{item.role}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* --------------------------- contact -------------------------- */}
      <section id="contact" className="section-space scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="grid items-stretch gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="premium-card h-full p-6 md:p-10" data-reveal="right">
              <span className="section-kicker">Contact</span>
              <h2 className="mt-3 text-3xl font-bold">
                Let’s Build Something Great Together
              </h2>
              <p className="mt-3">
                Available for freelance projects, long-term collaborations, and
                job opportunities focused on modern digital product development.
              </p>

              <div className="contact-list mt-6">
                {profile?.email ? (
                  <div className="contact-item">
                    <Mail /> <span>{profile.email}</span>
                  </div>
                ) : null}
                {profile?.phone ? (
                  <div className="contact-item">
                    <Phone /> <span>{profile.phone}</span>
                  </div>
                ) : null}
                {profile?.location ? (
                  <div className="contact-item">
                    <MapPin /> <span>{profile.location}</span>
                  </div>
                ) : null}
                <div className="contact-item">
                  <Globe /> <span>Portfolio available on request</span>
                </div>
              </div>

              <div className="social-links mt-6">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <form
              className="premium-card contact-form h-full p-6 md:p-10"
              data-reveal="left"
              onSubmit={(event) => {
                event.preventDefault()
                const data = new FormData(event.currentTarget)
                const senderName = String(data.get("name") ?? "")
                const senderEmail = String(data.get("email") ?? "")
                const subject = String(data.get("subject") ?? "")
                const message = String(data.get("message") ?? "")
                const to = profile?.email ?? ""
                window.location.href = `mailto:${to}?subject=${encodeURIComponent(
                  subject || `Portfolio message from ${senderName}`
                )}&body=${encodeURIComponent(
                  `Name: ${senderName}\nEmail: ${senderEmail}\n\n${message}`
                )}`
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="emailAddress">
                    Email Address
                  </label>
                  <input
                    id="emailAddress"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="form-label" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  required
                  placeholder="How can this project help?"
                  className="form-control"
                />
              </div>
              <div className="mt-4">
                <label className="form-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  placeholder="Share project details"
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-brand mt-5">
                <Send className="size-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ----------------------- floating widgets --------------------- */}
      <button
        type="button"
        className={`scroll-top${showTop ? " show" : ""}`}
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="size-4" />
      </button>

      <div className={`style-switcher${switcherOpen ? " open" : ""}`}>
        <button
          type="button"
          className="s-icon style-switcher-toggler"
          aria-label="Theme colors"
          onClick={() => setSwitcherOpen((value) => !value)}
        >
          <Settings className="size-4" />
        </button>
        <h4>Theme Colors</h4>
        <div className="colors">
          {SKINS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Use color ${color}`}
              style={{ background: color }}
              onClick={() => chooseSkin(color)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
