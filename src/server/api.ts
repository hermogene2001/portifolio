import { createServerFn } from "@tanstack/react-start"

import type {
  EducationInput,
  ExperienceInput,
  PostInput,
  ProfileInput,
  ProjectInput,
  SkillInput,
} from "@/db/schema"
import { adminConfigured, createAdminToken, verifyAdminToken } from "./auth"
import {
  deleteEducation as storeDeleteEducation,
  deleteExperience as storeDeleteExperience,
  deletePost as storeDeletePost,
  deleteProject as storeDeleteProject,
  deleteSkill as storeDeleteSkill,
  readAllPosts,
  readAllProjects,
  readEducation,
  readExperience,
  readPostBySlug,
  readPosts,
  readProfile,
  readProjects,
  readSkills,
  saveEducation as storeSaveEducation,
  saveExperience as storeSaveExperience,
  savePost as storeSavePost,
  saveProfile as storeSaveProfile,
  saveProject as storeSaveProject,
  saveSkill as storeSaveSkill,
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
    const [profile, projects, posts, skills, experience] = await Promise.all([
      readProfile(),
      readProjects(),
      readPosts(),
      readSkills(),
      readExperience(),
    ])
    return { profile, projects, posts, skills, experience }
  }
)

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
    const [profile, experience, education, skills, projects, posts] =
      await Promise.all([
        readProfile(),
        readExperience(),
        readEducation(),
        readSkills(),
        readAllProjects(),
        readAllPosts(),
      ])
    return { profile, experience, education, skills, projects, posts }
  })

export const adminSaveProfile = createServerFn({ method: "POST" })
  .validator((data: { token: string; profile: ProfileInput }) => data)
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
