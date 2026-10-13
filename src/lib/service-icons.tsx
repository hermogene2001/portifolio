import {
  Briefcase,
  Code2,
  Database,
  Globe,
  Layers,
  PenTool,
  Rocket,
  Server,
  Smartphone,
  Sparkles,
} from "lucide-react"
import type { ComponentType } from "react"

export const SERVICE_ICONS: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  code: Code2,
  design: PenTool,
  mobile: Smartphone,
  server: Server,
  database: Database,
  rocket: Rocket,
  sparkles: Sparkles,
  layers: Layers,
  globe: Globe,
  briefcase: Briefcase,
}

export const SERVICE_ICON_OPTIONS = Object.keys(SERVICE_ICONS)

export function ServiceIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = SERVICE_ICONS[name] ?? Code2
  return <Icon className={className} />
}
