// Shared allow-list for the on-page (jQuery) inline editor.
// Imported by both the client editor and the /api/inline-update endpoint so the
// two can never drift apart.

export const INLINE_FIELDS = {
  profile: [
    "name",
    "shortName",
    "role",
    "location",
    "email",
    "phone",
    "currentRole",
    "summary",
    "resumeSummary",
    "headline",
    "aboutHeading",
    "github",
    "linkedin",
    "x",
    "instagram",
    "facebook",
  ],
  service: ["title", "description"],
  testimonial: ["name", "role", "quote"],
  project: ["title", "description"],
} as const

export type InlineTarget = keyof typeof INLINE_FIELDS

const FIELD_LOOKUP: Record<string, readonly string[] | undefined> = INLINE_FIELDS

export function isInlineField(target: string, field: string): boolean {
  return FIELD_LOOKUP[target]?.includes(field) ?? false
}

/** Fields long enough to deserve a textarea-style editor. */
export const INLINE_LONG_FIELDS = new Set<string>([
  "summary",
  "resumeSummary",
  "description",
  "quote",
  "content",
])
