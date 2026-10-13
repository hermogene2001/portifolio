import { createFileRoute } from "@tanstack/react-router"
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
import { getProfile } from "@/server/api"

export const Route = createFileRoute("/contact")({
  loader: () => getProfile(),
  component: ContactPage,
})

function ContactPage() {
  const profile = Route.useLoaderData()
  const email = profile?.email ?? ""

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
              onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                const name = String(formData.get("name") ?? "")
                const senderEmail = String(formData.get("email") ?? "")
                const message = String(formData.get("message") ?? "")
                const subject = encodeURIComponent(
                  `Portfolio message from ${name}`
                )
                const body = encodeURIComponent(
                  `Name: ${name}\nEmail: ${senderEmail}\n\n${message}`
                )

                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
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
                  placeholder="Share project details"
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-brand w-fit">
                <Send className="size-4" />
                Open Email App
              </button>
              <p className="text-xs muted">
                Your email app will open with the message ready for you to
                review and send.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
