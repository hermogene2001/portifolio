import "@tanstack/react-start/server-only"
import { createHmac, timingSafeEqual } from "node:crypto"

const TOKEN_MESSAGE = "portfolio-admin-session-v1"

function secret() {
  return process.env.ADMIN_PASSWORD ?? ""
}

export function adminConfigured() {
  return secret().length > 0
}

export function createAdminToken() {
  return createHmac("sha256", secret() || "unconfigured")
    .update(TOKEN_MESSAGE)
    .digest("hex")
}

export function verifyAdminToken(token: unknown): boolean {
  if (typeof token !== "string" || token.length === 0 || !adminConfigured()) {
    return false
  }
  const expected = createAdminToken()
  const provided = Buffer.from(token)
  const wanted = Buffer.from(expected)
  if (provided.length !== wanted.length) {
    return false
  }
  return timingSafeEqual(provided, wanted)
}
