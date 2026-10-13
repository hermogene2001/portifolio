import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { profile } from "@/lib/site-data"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons"

export const Route = createFileRoute("/contact")({ component: ContactPage })

const SOCIALS = [
  { href: profile.socials.github, label: "GitHub", Icon: GitHubIcon },
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: profile.socials.x, label: "X", Icon: XIcon },
  { href: profile.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: profile.socials.facebook, label: "Facebook", Icon: FacebookIcon },
] as const

const inputClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Have a question or want to work together? Drop me a message.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-5">
        <Card className="h-fit gap-4 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Get in touch</CardTitle>
          </CardHeader>
          <CardContent className="gap-3 text-sm">
            <p className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-muted-foreground" />
              {profile.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-muted-foreground" />
              {profile.phone}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-muted-foreground" />
              {profile.location}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon-sm",
                  })}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              const name = String(formData.get("name") ?? "")
              const email = String(formData.get("email") ?? "")
              const message = String(formData.get("message") ?? "")
              const subject = encodeURIComponent(
                `Portfolio message from ${name}`
              )
              const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\n${message}`
              )

              window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Share project details"
                className={`${inputClass} h-auto py-2`}
              />
            </div>
            <button
              type="submit"
              className={`${buttonVariants({ size: "default" })} w-fit`}
            >
              <Send />
              Open Email App
            </button>
            <p className="text-xs text-muted-foreground">
              Your email app will open with the message ready for you to review
              and send.
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
