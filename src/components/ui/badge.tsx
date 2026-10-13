import { cn } from "cn"
import type * as React from "react"

type BadgeProps = React.ComponentProps<"span"> & {
  variant?: "default" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
        variant === "outline" && "bg-background text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
