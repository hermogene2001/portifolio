import { friendlyError } from "@/lib/errors"

export function ProjectLoadError({ error }: { error: unknown }) {
  const message = friendlyError(error, "An unexpected error occurred.")

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Projects could not be loaded</h1>
      <p className="text-muted-foreground mt-2" role="alert">
        {message}
      </p>
    </main>
  )
}
