// Generates the favicon and app icons from public/logo.svg.
// Usage: npm run icons
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import pngToIco from "png-to-ico"

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(here, "../public")
const svg = readFileSync(resolve(publicDir, "logo.svg"))

const pngSizes = {
  "favicon-16x16.png": 16,
  "favicon-32x32.png": 32,
  "favicon-48x48.png": 48,
  "apple-touch-icon.png": 180,
  "logo192.png": 192,
  "logo512.png": 512,
}

const buffers = new Map()
for (const [file, size] of Object.entries(pngSizes)) {
  const buffer = await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toBuffer()
  writeFileSync(resolve(publicDir, file), buffer)
  buffers.set(size, buffer)
  console.log(`wrote ${file} (${size}x${size})`)
}

const ico = await pngToIco([buffers.get(16), buffers.get(32), buffers.get(48)])
writeFileSync(resolve(publicDir, "favicon.ico"), ico)
console.log("wrote favicon.ico (16/32/48)")
