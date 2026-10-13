import "@tanstack/react-start/server-only"
import { asc, desc, eq } from "drizzle-orm"

import { getDb } from "@/db/client"
import {
  education,
  experience,
  posts,
  projects,
  services,
  siteProfile,
  skills,
  testimonials,
  type EducationInput,
  type ExperienceInput,
  type PostInput,
  type PostView,
  type ProfileInput,
  type ProfileView,
  type ProjectInput,
  type ServiceInput,
  type SkillInput,
  type TestimonialInput,
} from "@/db/schema"

const profileColumns = {
  id: siteProfile.id,
  name: siteProfile.name,
  shortName: siteProfile.shortName,
  role: siteProfile.role,
  location: siteProfile.location,
  email: siteProfile.email,
  phone: siteProfile.phone,
  currentRole: siteProfile.currentRole,
  summary: siteProfile.summary,
  resumeSummary: siteProfile.resumeSummary,
  imagePath: siteProfile.imagePath,
  github: siteProfile.github,
  linkedin: siteProfile.linkedin,
  x: siteProfile.x,
  instagram: siteProfile.instagram,
  facebook: siteProfile.facebook,
}

const projectColumns = {
  id: projects.id,
  title: projects.title,
  description: projects.description,
  tags: projects.tags,
  github: projects.github,
  liveUrl: projects.liveUrl,
  content: projects.content,
  sortOrder: projects.sortOrder,
  isPublished: projects.isPublished,
}

const postColumns = {
  id: posts.id,
  title: posts.title,
  slug: posts.slug,
  date: posts.date,
  summary: posts.summary,
  tags: posts.tags,
  author: posts.author,
  content: posts.content,
  isPublished: posts.isPublished,
}

/* ------------------------------- reads ------------------------------- */

export async function readProfile(): Promise<ProfileView | null> {
  const rows = await getDb()
    .select(profileColumns)
    .from(siteProfile)
    .where(eq(siteProfile.id, 1))
    .limit(1)
  return rows[0] ?? null
}

export async function readProjects() {
  return getDb()
    .select(projectColumns)
    .from(projects)
    .where(eq(projects.isPublished, true))
    .orderBy(asc(projects.sortOrder), asc(projects.title))
}

export async function readAllProjects() {
  return getDb()
    .select(projectColumns)
    .from(projects)
    .orderBy(asc(projects.sortOrder), asc(projects.id))
}

export async function readExperience() {
  return getDb()
    .select()
    .from(experience)
    .orderBy(asc(experience.sortOrder), asc(experience.id))
}

export async function readEducation() {
  return getDb()
    .select()
    .from(education)
    .orderBy(asc(education.sortOrder), asc(education.id))
}

export async function readSkills() {
  return getDb()
    .select()
    .from(skills)
    .orderBy(asc(skills.sortOrder), asc(skills.id))
}

export async function readServices() {
  return getDb()
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder), asc(services.id))
}

export async function readTestimonials() {
  return getDb()
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.id))
}

export async function readPosts() {
  return getDb()
    .select(postColumns)
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.date), desc(posts.id))
}

export async function readAllPosts() {
  return getDb()
    .select(postColumns)
    .from(posts)
    .orderBy(desc(posts.date), desc(posts.id))
}

export async function readPostBySlug(slug: string): Promise<PostView | null> {
  const rows = await getDb()
    .select(postColumns)
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1)
  return rows[0] ?? null
}

/* ------------------------------ writes ------------------------------- */

export async function saveProfile(input: ProfileInput) {
  const values = { ...input, id: 1, updatedAt: new Date() }
  const { id: _id, ...set } = values
  await getDb()
    .insert(siteProfile)
    .values(values)
    .onConflictDoUpdate({ target: siteProfile.id, set })
  return readProfile()
}

export async function saveExperience(input: ExperienceInput) {
  const { id, ...values } = input
  if (id) {
    await getDb().update(experience).set(values).where(eq(experience.id, id))
    return id
  }
  const rows = await getDb().insert(experience).values(values).returning({
    id: experience.id,
  })
  return rows[0]?.id ?? null
}

export async function deleteExperience(id: number) {
  await getDb().delete(experience).where(eq(experience.id, id))
}

export async function saveEducation(input: EducationInput) {
  const { id, ...values } = input
  if (id) {
    await getDb().update(education).set(values).where(eq(education.id, id))
    return id
  }
  const rows = await getDb().insert(education).values(values).returning({
    id: education.id,
  })
  return rows[0]?.id ?? null
}

export async function deleteEducation(id: number) {
  await getDb().delete(education).where(eq(education.id, id))
}

export async function saveSkill(input: SkillInput) {
  const { id, ...values } = input
  if (id) {
    await getDb().update(skills).set(values).where(eq(skills.id, id))
    return id
  }
  const rows = await getDb().insert(skills).values(values).returning({
    id: skills.id,
  })
  return rows[0]?.id ?? null
}

export async function deleteSkill(id: number) {
  await getDb().delete(skills).where(eq(skills.id, id))
}

export async function saveService(input: ServiceInput) {
  const { id, ...values } = input
  if (id) {
    await getDb().update(services).set(values).where(eq(services.id, id))
    return id
  }
  const rows = await getDb().insert(services).values(values).returning({
    id: services.id,
  })
  return rows[0]?.id ?? null
}

export async function deleteService(id: number) {
  await getDb().delete(services).where(eq(services.id, id))
}

export async function saveTestimonial(input: TestimonialInput) {
  const { id, ...values } = input
  if (id) {
    await getDb().update(testimonials).set(values).where(eq(testimonials.id, id))
    return id
  }
  const rows = await getDb().insert(testimonials).values(values).returning({
    id: testimonials.id,
  })
  return rows[0]?.id ?? null
}

export async function deleteTestimonial(id: number) {
  await getDb().delete(testimonials).where(eq(testimonials.id, id))
}

export async function saveProject(input: ProjectInput) {
  const { id, ...values } = input
  if (id) {
    await getDb().update(projects).set(values).where(eq(projects.id, id))
    return id
  }
  const rows = await getDb().insert(projects).values(values).returning({
    id: projects.id,
  })
  return rows[0]?.id ?? null
}

export async function deleteProject(id: number) {
  await getDb().delete(projects).where(eq(projects.id, id))
}

export async function savePost(input: PostInput) {
  const { id, ...values } = input
  if (id) {
    await getDb().update(posts).set(values).where(eq(posts.id, id))
    return id
  }
  const rows = await getDb().insert(posts).values(values).returning({
    id: posts.id,
  })
  return rows[0]?.id ?? null
}

export async function deletePost(id: number) {
  await getDb().delete(posts).where(eq(posts.id, id))
}
