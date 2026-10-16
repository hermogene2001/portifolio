// Client-side helpers that turn an uploaded image file into a compact data URL
// so it can be stored alongside the profile in PostgreSQL.

/** Reject images larger than this (as a data URL) to keep the DB and payloads sane. */
export const MAX_IMAGE_BYTES = 2_500_000

const DEFAULT_MAX_DIMENSION = 800
const DEFAULT_QUALITY = 0.85

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("That file could not be read."))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("That image could not be loaded."))
    image.src = src
  })
}

/**
 * Read an image file, downscale it so its longest side is at most
 * `maxDimension`, and re-encode it as a JPEG data URL. Only runs in the
 * browser; falls back to the original data URL if a canvas is unavailable.
 */
export async function resizeImageFile(
  file: File,
  {
    maxDimension = DEFAULT_MAX_DIMENSION,
    quality = DEFAULT_QUALITY,
  }: { maxDimension?: number; quality?: number } = {}
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, or WebP).")
  }

  const original = await readAsDataUrl(file)
  if (typeof document === "undefined") return original

  let image: HTMLImageElement
  try {
    image = await loadImage(original)
  } catch {
    return original
  }

  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) return original

  // Flatten transparency onto white to match the "on white" portrait style.
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)

  const resized = canvas.toDataURL("image/jpeg", quality)
  const smallest = resized.length < original.length ? resized : original

  if (smallest.length > MAX_IMAGE_BYTES) {
    throw new Error(
      "That image is too large. Please choose a smaller photo (under ~2 MB)."
    )
  }

  return smallest
}
