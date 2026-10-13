import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons"
import { PageHero } from "@/components/page-hero"
import { useReveal } from "@/lib/use-reveal"
import { getProfile, sendContactMessage } from "@/server/api"

export const Route = createFileRoute("/contact")({
  loader: () => getProfile(),
  component: ContactPage,
})

type Status = "idle" | "sending" | "sent" | "error"

function ContactPage() {
  const profile = Route.useLoaderData()

  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  useReveal()

  const socials = [
    { href: profile?.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile?.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile?.x, label: "X", Icon: XIcon },
    { href: profile?.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: profile?.facebook, label: "Facebook", Icon: FacebookIcon },
  ].filter((social): social is typeof social & { href: string } =>
    Boolean(social.href)
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setStatus("sending")
    setError("")

    try {
      await sendContactMessage({
        data: {
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          message: String(formData.get("message") ?? ""),
          company: String(formData.get("company") ?? ""),
        },
      })
      form.reset()
      setStatus("sent")
    } catch (submitError) {
      setStatus("error")
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again."
      )
    }
  }

  const sending = status === "sending"

  return (
    <div className="site-theme">
      <PageHero
        kicker="Contact"
        title="Let's Work Together"
        description="Have a question or a project in mind? Drop me a message and I'll get back to you."
      />

      <section className="page-section">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 md:grid-cols-5">
          <div className="premium-card h-fit p-7 md:col-span-2" data-reveal>
            <h2 className="page-heading">Get in touch</h2>
            <div className="contact-list text-sm">
              {profile?.email ? (
                <div className="contact-item">
                  <Mail />
                  <span>{profile.email}</span>
                </div>
              ) : null}
              {profile?.phone ? (
                <div className="contact-item">
                  <Phone />
                  <span>{profile.phone}</span>
                </div>
              ) : null}
              {profile?.location ? (
                <div className="contact-item">
                  <MapPin />
                  <span>{profile.location}</span>
                </div>
              ) : null}
            </div>

            {socials.length > 0 ? (
              <div className="social-links mt-7">
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
            ) : null}
          </div>

          <div className="premium-card p-7 md:col-span-3" data-reveal="left">
            <form
              className="contact-form flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              {/* Honeypot: hidden from people, tempting to bots. */}
              <div
                aria-hidden="true"
                className="absolute h-0 w-0 overflow-hidden opacity-0"
              >
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    maxLength={120}
                    placeholder="Your name"
                    className="form-control"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    placeholder="you@example.com"
                    className="form-control"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  minLength={10}
                  maxLength={5000}
                  placeholder="Share project details"
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="btn btn-brand w-fit disabled:cursor-not-allowed disabled:opacity-60"
                disabled={sending}
              >
                <Send className="size-4" />
                {sending ? "Sending…" : "Send Message"}
              </button>

              <p
                role="status"
                aria-live="polite"
                className="text-sm"
                style={{ minHeight: "1.25rem" }}
              >
                {status === "sent" ? (
                  <span style={{ color: "var(--skin-color)" }}>
                    Thanks! Your message was sent — I&apos;ll reply soon.
                  </span>
                ) : null}
                {status === "error" ? (
                  <span style={{ color: "#d92d20" }}>{error}</span>
                ) : null}
                {status === "idle" ? (
                  <span className="muted">
                    I usually reply within a day.
                  </span>
                ) : null}
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
