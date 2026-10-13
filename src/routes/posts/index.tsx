import { createFileRoute, Link } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectLoadError } from "@/components/project-load-error"
import { getPosts } from "@/server/api"

export const Route = createFileRoute("/posts/")({
  loader: () => getPosts(),
  component: PostsPage,
  errorComponent: ({ error }) => <ProjectLoadError error={error} />,
})

function PostsPage() {
  const posts = Route.useLoaderData()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold">Blog</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Write-ups on the systems, tools and techniques I use in my projects.
      </p>

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <Link key={post.slug} to="/posts/$slug" params={{ slug: post.slug }}>
            <Card className="transition-colors hover:border-primary/40">
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  · {post.author}
                </p>
              </CardHeader>
              <CardContent className="gap-3">
                <p className="text-sm text-muted-foreground">{post.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {posts.length === 0 ? (
        <p className="mt-8 text-muted-foreground">
          No posts are published yet.
        </p>
      ) : null}
    </div>
  )
}
