import { createServerFn } from "@tanstack/react-start"

import type {
  EducationInput,
  ExperienceInput,
  PostInput,
  ProfileInput,
  ProjectInput,
  ServiceInput,
  SkillInput,
  TestimonialInput,
} from "@/db/schema"
import { adminConfigured, createAdminToken, verifyAdminToken } from "./auth"
import { isInlineField, type InlineTarget } from "@/lib/inline"
import { mailConfigured, sendContactEmail } from "./mail"
import {
  applyInlineUpdate as storeApplyInlineUpdate,
  deleteEducation as storeDeleteEducation,
  deleteExperience as storeDeleteExperience,
  deletePost as storeDeletePost,
  deleteProject as storeDeleteProject,
  deleteService as storeDeleteService,
  deleteSkill as storeDeleteSkill,
  deleteTestimonial as storeDeleteTestimonial,
  readAllPosts,
  readAllProjects,
  readEducation,
  readExperience,
  readPostBySlug,
  readPosts,
  readProfile,
  readProjects,
  readServices,
  readSkills,
  readTestimonials,
  saveEducation as storeSaveEducation,
  saveExperience as storeSaveExperience,
  savePost as storeSavePost,
  saveProfile as storeSaveProfile,
  saveProject as storeSaveProject,
  saveService as storeSaveService,
  saveSkill as storeSaveSkill,
  saveTestimonial as storeSaveTestimonial,
} from "./store"

/* ---------------------------- public reads ---------------------------- */

export const getProfile = createServerFn({ method: "GET" }).handler(async () =>
  readProfile()
)

export const getProjects = createServerFn({ method: "GET" }).handler(async () =>
  readProjects()
)

export const getResume = createServerFn({ method: "GET" }).handler(async () => {
  const [profile, experience, education, skills] = await Promise.all([
    readProfile(),
    readExperience(),
    readEducation(),
    readSkills(),
  ])
  return {
    summary: profile?.resumeSummary ?? "",
    experience,
    education,
    skills,
  }
})

export const getPosts = createServerFn({ method: "GET" }).handler(async () =>
  readPosts()
)

export const getPostBySlug = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => readPostBySlug(data.slug))

export const getHomeData = createServerFn({ method: "GET" }).handler(
  async () => {
    const [profile, projects, posts, skills, experience, services, testimonials] =
      await Promise.all([
        readProfile(),
        readProjects(),
        readPosts(),
        readSkills(),
        readExperience(),
        readServices(),
        readTestimonials(),
      ])
    return {
      profile,
      projects,
      posts,
      skills,
      experience,
      services,
      testimonials,
    }
  }
)

/* ---------------------------- contact form ---------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ContactInput = {
  name: string
  email: string
  message: string
  /** Honeypot: real users leave this empty. */
  company?: string
}

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = (input ?? {}) as Partial<ContactInput>
    const name = String(data.name ?? "").trim()
    const email = String(data.email ?? "").trim()
    const message = String(data.message ?? "").trim()
    const company = String(data.company ?? "").trim()

    // Honeypot tripped: pretend it worked so bots move on.
    if (company) return { name, email, message, company }

    if (name.length < 2 || name.length > 120) {
      throw new Error("Please enter your name.")
    }
    if (email.length > 200 || !EMAIL_RE.test(email)) {
      throw new Error("Please enter a valid email address.")
    }
    if (message.length < 10 || message.length > 5000) {
      throw new Error("Please enter a message between 10 and 5000 characters.")
    }

    return { name, email, message, company }
  })
  .handler(async ({ data }) => {
    if (data.company) return { ok: true }
    if (!mailConfigured()) {
      throw new Error(
        "The contact form is not configured yet. Please email me directly."
      )
    }
    await sendContactEmail({
      name: data.name,
      email: data.email,
      message: data.message,
    })
    return { ok: true }
  })

/* ------------------------------- admin ------------------------------- */

function assertAdmin(token: unknown) {
  if (!verifyAdminToken(token)) {
    throw new Error("Unauthorized. Please sign in again.")
  }
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    if (!adminConfigured()) {
      throw new Error(
        "Admin is not configured. Set the ADMIN_PASSWORD environment variable."
      )
    }
    if (data.password !== process.env.ADMIN_PASSWORD) {
      throw new Error("Incorrect password.")
    }
    return { token: createAdminToken() }
  })

export const adminGetAll = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    const [
      profile,
      experience,
      education,
      skills,
      projects,
      posts,
      services,
      testimonials,
    ] = await Promise.all([
      readProfile(),
      readExperience(),
      readEducation(),
      readSkills(),
      readAllProjects(),
      readAllPosts(),
      readServices(),
      readTestimonials(),
    ])
    return {
      profile,
      experience,
      education,
      skills,
      projects,
      posts,
      services,
      testimonials,
    }
  })

export const adminSaveProfile = createServerFn({ method: "POST" })
  .validator((data: { token: string; profile: ProfileInput }) => {
    // Safety net: uploaded images arrive here as data URLs.
    if (
      data.profile.imagePath.length > 3_000_000 ||
      data.profile.aboutImagePath.length > 3_000_000
    ) {
      throw new Error("That image is too large. Please choose a smaller photo.")
    }
    return data
  })
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    return storeSaveProfile(data.profile)
  })

export const adminSaveExperience = createServerFn({ method: "POST" })
  .validator((data: { token: string; item: ExperienceInput }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    return storeSaveExperience(data.item)
  })

export const adminDeleteExperience = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    await storeDeleteExperience(data.id)
    return { ok: true }
  })

export const adminSaveEducation = createServerFn({ method: "POST" })
  .validator((data: { token: string; item: EducationInput }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    return storeSaveEducation(data.item)
  })

export const adminDeleteEducation = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    await storeDeleteEducation(data.id)
    return { ok: true }
  })

export const adminSaveSkill = createServerFn({ method: "POST" })
  .validator((data: { token: string; item: SkillInput }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    return storeSaveSkill(data.item)
  })

export const adminDeleteSkill = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    await storeDeleteSkill(data.id)
    return { ok: true }
  })

export const adminSaveService = createServerFn({ method: "POST" })
  .validator((data: { token: string; item: ServiceInput }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    return storeSaveService(data.item)
  })

export const adminDeleteService = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    await storeDeleteService(data.id)
    return { ok: true }
  })

export const adminSaveTestimonial = createServerFn({ method: "POST" })
  .validator((data: { token: string; item: TestimonialInput }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    return storeSaveTestimonial(data.item)
  })

export const adminDeleteTestimonial = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    await storeDeleteTestimonial(data.id)
    return { ok: true }
  })

export const adminSaveProject = createServerFn({ method: "POST" })
  .validator((data: { token: string; item: ProjectInput }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    return storeSaveProject(data.item)
  })

export const adminDeleteProject = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    await storeDeleteProject(data.id)
    return { ok: true }
  })

export const adminSavePost = createServerFn({ method: "POST" })
  .validator((data: { token: string; item: PostInput }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    return storeSavePost(data.item)
  })

export const adminDeletePost = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    assertAdmin(data.token)
    await storeDeletePost(data.id)
    return { ok: true }
  })

/* --------------------------- inline editing --------------------------- */

function jsonResponse(status: number, body: { ok: boolean; error?: string }) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

/**
 * Save one field edited straight on the public page.
 *
 * The on-page jQuery editor posts an ordinary form-encoded request (jQuery's
 * default `$.ajax({ data })`) to `inlineUpdate.url`. Accepting `FormData` skips
 * TanStack's Seroval payload format entirely (see the form-data branch of
 * `handleServerAction`). Returning a raw `Response` is passed straight through —
 * Start sets `x-tss-raw` and returns it as-is — so the browser gets real status
 * codes and plain JSON to read in `.done()` / `.fail()`.
 */
export const inlineUpdate = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    if (!adminConfigured()) {
      return jsonResponse(500, {
        ok: false,
        error: "Admin editing is not configured.",
      })
    }
    if (!verifyAdminToken(data.get("token"))) {
      return jsonResponse(401, {
        ok: false,
        error: "Not authorized. Sign in at /admin again.",
      })
    }

    const target = String(data.get("target") ?? "")
    const field = String(data.get("field") ?? "")
    const value = String(data.get("value") ?? "")
    const idRaw = data.get("id")
    const id = idRaw ? Number(idRaw) : undefined

    if (!target || !field || data.get("value") === null) {
      return jsonResponse(400, {
        ok: false,
        error: "target, field and value are required.",
      })
    }
    if (!isInlineField(target, field)) {
      return jsonResponse(400, {
        ok: false,
        error: `Field "${target}.${field}" is not editable.`,
      })
    }

    try {
      await storeApplyInlineUpdate({
        target: target as InlineTarget,
        field,
        value,
        id,
      })
    } catch (error) {
      return jsonResponse(400, {
        ok: false,
        error: error instanceof Error ? error.message : "Update failed.",
      })
    }

    return jsonResponse(200, { ok: true })
  })
