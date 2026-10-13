import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { ProjectLoadError } from "@/components/project-load-error"
import { useReveal } from "@/lib/use-reveal"
import { getPosts } from "@/server/api"

export const Route = createFileRoute("/posts/")({
  loader: () => getPosts(),
  component: PostsPage,
  errorComponent: ({ error }) => <ProjectLoadError error={error} />,
})

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function PostsPage() {
  const posts = Route.useLoaderData()

  useReveal()

  return (
    <div className="site-theme">
      <PageHero
        kicker="Blog"
        title="Notes & Write-ups"
        description="Write-ups on the systems, tools and techniques I use in my projects."
      />

      <section className="page-section">
        <div className="mx-auto w-full max-w-4xl px-4">
          <div className="space-y-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to="/posts/$slug"
                params={{ slug: post.slug }}
                className="block"
              >
                <article
                  className="premium-card p-6 transition-transform hover:-translate-y-1"
                  data-reveal
                >
                  <p className="timeline-meta">
                    {formatDate(post.date)} · {post.author}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">{post.title}</h2>
                  <p className="mt-2 muted">{post.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="project-tags !my-0">
                      {post.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--skin-color)]">
                      Read more
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          {posts.length === 0 ? (
            <p className="muted mt-8">No posts are published yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
