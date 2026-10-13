import { createFileRoute, Link } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { posts } from "@/lib/site-data"
import { marked } from "marked"
import { ArrowLeft, Calendar } from "lucide-react"

export const Route = createFileRoute("/posts/$slug")({
  component: PostPage,
})

function PostPage() {
  const { slug } = Route.useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link
          to="/posts"
          className={`${buttonVariants({ variant: "outline" })} mt-6`}
        >
          Back to blog
        </Link>
      </div>
    )
  }

  const html = marked.parse(post.content, { async: false })

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link
        to="/posts"
        className={`${buttonVariants({ variant: "ghost", size: "sm" })} mb-8`}
      >
        <ArrowLeft />
        Back to blog
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {post.title}
      </h1>
      <p className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span>{post.author}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <div
        className="prose mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}