import { createFileRoute, Link } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { posts } from "@/lib/site-data"

export const Route = createFileRoute("/posts/")({ component: PostsPage })

function PostsPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold">Blog</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Write-ups on the systems, tools and techniques I use in my projects.
      </p>

      <div className="mt-8 space-y-4">
        {sorted.map((post) => (
          <Link key={post.slug} to="/posts/$slug" params={{ slug: post.slug }}>
            <Card className="transition-colors hover:border-primary/40">
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <p className="text-muted-foreground text-xs">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  · {post.author}
                </p>
              </CardHeader>
              <CardContent className="gap-3">
                <p className="text-muted-foreground text-sm">{post.summary}</p>
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
    </div>
  )
}