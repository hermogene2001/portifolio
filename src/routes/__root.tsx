import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import appCss from "../styles.css?url"
import { SiteLayout } from "@/components/site-layout"
import { buttonVariants } from "@/components/ui/button"
import { getProfile } from "@/server/api"

export const Route = createRootRoute({
  loader: () => getProfile(),
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Hermogene UKUNDAYEZU"
    const title = `${name} | IT Portfolio`
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        {
          name: "description",
          content:
            loaderData?.summary ??
            "Information Technology graduate focused on software development, AI/ML, data systems, IoT, and digital transformation. Based in Kigali, Rwanda.",
        },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content:
            "Software, AI/ML, data and IoT solutions from Kigali, Rwanda.",
        },
        {
          property: "og:image",
          content: loaderData?.imagePath ?? "/headshot-on-white.jpg",
        },
        { name: "twitter:card", content: "summary" },
        { name: "theme-color", content: "#ffffff" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/manifest.json" },
      ],
    }
  },
  component: RootComponent,
  notFoundComponent: () => (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-5xl font-bold">404</p>
      <p className="mt-3 text-muted-foreground">
        The page you are looking for could not be found.
      </p>
      <Link to="/" className={`${buttonVariants({ variant: "outline" })} mt-6`}>
        Back to home
      </Link>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootComponent() {
  const profile = Route.useLoaderData()
  return <SiteLayout profile={profile} />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
