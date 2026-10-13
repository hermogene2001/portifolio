/**
 * Turns an unknown thrown value into a message that is safe to show a user.
 *
 * Server functions are same-origin RPC calls. When the host cannot answer at
 * all (a cold-start failure, a timeout, or a proxy-generated error page) the
 * response can arrive without a `content-type`, and the TanStack Start client
 * throws an opaque internal error such as:
 *
 *   "Invariant failed: expected content-type header to be set"
 *
 * Framework and network internals are noise to visitors, so those are replaced
 * with a short, actionable message. Real validation/auth errors thrown by our
 * own server functions keep their original wording.
 */
const OPAQUE_ERROR_PATTERNS = [
  /content-type header/i,
  /invariant failed/i,
  /failed to fetch/i,
  /load failed/i,
  /networkerror/i,
  /err_(empty_response|connection|network|timed_out)/i,
  /fetch failed/i,
]

export const RETRY_MESSAGE =
  "The server is temporarily unavailable. Please try again in a moment."

export function friendlyError(error: unknown, fallback = RETRY_MESSAGE): string {
  if (error instanceof Error) {
    const message = error.message.trim()
    if (
      message &&
      !OPAQUE_ERROR_PATTERNS.some((pattern) => pattern.test(message))
    ) {
      return message
    }
  }
  return fallback
}
