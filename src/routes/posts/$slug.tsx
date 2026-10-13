import { createFileRoute, Link } from "@tanstack/react-router"
import { marked } from "marked"
import { ArrowLeft, Calendar } from "lucide-react"
import { getPostBySlug } from "@/server/api"
import { useReveal } from "@/lib/use-reveal"

export const Route = createFileRoute("/posts/$slug")({
  loader: ({ params }) => getPostBySlug({ data: { slug: params.slug } }),
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()

  useReveal()

  if (!post) {
    return (
      <div className="site-theme">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Link to="/posts" className="btn btn-outline-brand mt-6">
            Back to blog
          </Link>
        </div>
      </div>
    )
  }

  const html = marked.parse(post.content, { async: false })

  return (
    <div className="site-theme">
      <article className="mx-auto w-full max-w-3xl px-4 py-14">
        <Link to="/posts" className="btn btn-ghost btn-sm mb-8">
          <ArrowLeft className="size-4" />
          Back to blog
        </Link>

        <div data-reveal>
          <p className="timeline-meta">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="ml-3">{post.author}</span>
          </p>
          <h1 className="page-title mt-2">{post.title}</h1>
          {post.tags.length > 0 ? (
            <div className="project-tags">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="premium-card mt-6 p-6 sm:p-10" data-reveal>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>
    </div>
  )
}
