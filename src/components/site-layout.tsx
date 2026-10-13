import { Link, Outlet } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import { Menu, Moon, Sun, X } from "lucide-react"
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons"
import type { ProfileView } from "@/db/schema"

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/resume", label: "Resume", exact: false },
  { to: "/projects", label: "Projects", exact: false },
  { to: "/posts", label: "Blog", exact: false },
  { to: "/contact", label: "Contact", exact: false },
] as const

function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_theme")
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    const isDark = saved ? saved === "dark" : prefersDark
    document.documentElement.classList.toggle("dark", isDark)
    setDark(isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("portfolio_theme", next ? "dark" : "light")
    setDark(next)
  }

  return (
    <button
      type="button"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

function NavLinks({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  return (
    <nav className={className} aria-label="Main navigation">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          activeOptions={{ exact: link.exact }}
          activeProps={{ className: "text-foreground font-semibold" }}
          inactiveProps={{
            className: "text-muted-foreground hover:text-foreground",
          }}
          className="text-sm transition-colors"
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export function SiteLayout({ profile }: { profile: ProfileView | null }) {
  const [menuOpen, setMenuOpen] = useState(false)

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
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <img
              src="/logo.svg"
              alt=""
              width={28}
              height={28}
              className="size-7 rounded-lg"
            />
            <span className="hidden sm:inline">{name}</span>
          </Link>

          <div className="flex items-center gap-1">
            <NavLinks className="hidden items-center gap-4 md:flex" />
            <ThemeToggle />
            <button
              type="button"
              className={`${buttonVariants({ variant: "ghost", size: "icon" })} md:hidden`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <NavLinks
            className="flex flex-col gap-1 border-t border-border/60 px-4 py-3 md:hidden"
            onNavigate={() => setMenuOpen(false)}
          />
        )}
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">
              Building smart solutions with purpose and creativity.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
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
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {name}. All rights reserved. ·{" "}
            <Link
              to="/admin"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              Admin
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
