import type { Project } from "./site-data"
import { getSupabaseClient } from "./supabase"

export async function loadProjects(): Promise<Project[]> {
  const { data, error } = await getSupabaseClient()
    .from("projects")
    .select("title, description, tags, github, live_url, content")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true })

  if (error) {
    throw new Error(`Unable to load projects from Supabase: ${error.message}`)
  }

  return data.map((project) => ({
    title: project.title,
    description: project.description,
    tags: project.tags,
    github: project.github ?? undefined,
    liveUrl: project.live_url ?? undefined,
    content: project.content,
  }))
}