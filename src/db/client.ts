import "@tanstack/react-start/server-only"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "./schema"

// Managed providers (Neon, Supabase, Render, Railway, ...) require TLS.
// Local PostgreSQL usually does not, so only enable SSL when it is needed.
function needsSsl(connectionString: string) {
  return (
    /sslmode=require/i.test(connectionString) ||
    /\.neon\.tech|supabase\.(co|com)|render\.com|railway\.app|amazonaws\.com/i.test(
      connectionString
    )
  )
}

function createDb() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add your PostgreSQL connection string to the environment."
    )
  }

  const pool = new Pool({
    connectionString,
    max: 5,
    ssl: needsSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
  })

  return drizzle(pool, { schema })
}

let cached: ReturnType<typeof createDb> | null = null

// Lazily create the client so the module has no side effects at import time.
export function getDb() {
  if (!cached) {
    cached = createDb()
  }
  return cached
}
