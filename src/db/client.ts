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
    // Fail fast instead of hanging a serverless invocation when the database
    // is unreachable or slow to accept a connection. Without these, a stuck
    // connection can outlive the platform's function limit and the request is
    // killed, which the client sees as an opaque (header-less) 502.
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
    query_timeout: 30_000,
    keepAlive: true,
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
