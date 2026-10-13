import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

// Single-row table (id is always 1) holding the profile and resume summary.
export const siteProfile = pgTable("site_profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  currentRole: text("current_role").notNull(),
  summary: text("summary").notNull(),
  resumeSummary: text("resume_summary").notNull(),
  imagePath: text("image_path").notNull().default("/headshot-on-white.jpg"),
  github: text("github"),
  linkedin: text("linkedin"),
  x: text("x"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull().default(""),
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  summary: text("summary").notNull().default(""),
  content: text("content").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  school: text("school").notNull(),
  summary: text("summary").notNull().default(""),
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  content: text("content").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().unique(),
  description: text("description").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  github: text("github"),
  liveUrl: text("live_url"),
  content: text("content").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  date: text("date").notNull().default(""),
  summary: text("summary").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  author: text("author").notNull().default(""),
  content: text("content").notNull().default(""),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type Profile = typeof siteProfile.$inferSelect
export type ExperienceItem = typeof experience.$inferSelect
export type EducationItem = typeof education.$inferSelect
export type Skill = typeof skills.$inferSelect
export type Project = typeof projects.$inferSelect
export type Post = typeof posts.$inferSelect

// Shapes returned to the client (timestamps omitted so they serialize cleanly).
export type ProfileView = Omit<Profile, "updatedAt">
export type ProjectView = Omit<Project, "createdAt">
export type PostView = Omit<Post, "createdAt">

export type ProfileInput = Omit<Profile, "updatedAt"> & { updatedAt?: never }
export type ExperienceInput = Omit<ExperienceItem, "id"> & { id?: number }
export type EducationInput = Omit<EducationItem, "id"> & { id?: number }
export type SkillInput = Omit<Skill, "id"> & { id?: number }
export type ProjectInput = Omit<Project, "id" | "createdAt"> & { id?: number }
export type PostInput = Omit<Post, "id" | "createdAt"> & { id?: number }
