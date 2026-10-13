// Seeds the database from drizzle/seed.sql.
// Usage: npm run db:seed   (reads DATABASE_URL from .env.local or .env)
import { config } from "dotenv"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

config({ path: [".env.local", ".env"] })

const url = process.env.DATABASE_URL
if (!url) {
  console.error(
    "DATABASE_URL is not set. Add it to .env.local or the environment."
  )
  process.exit(1)
}

const ssl =
  /sslmode=require/i.test(url) ||
  /\.neon\.tech|supabase\.(co|com)|render\.com|railway\.app|amazonaws\.com/i.test(
    url
  )
    ? { rejectUnauthorized: false }
    : undefined

const here = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(resolve(here, "../drizzle/seed.sql"), "utf8")

const pool = new pg.Pool({ connectionString: url, ssl })
try {
  await pool.query(sql)
  console.log("Seed complete.")
} catch (error) {
  console.error("Seed failed:", error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await pool.end()
}
