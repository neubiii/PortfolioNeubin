/**
 * Resolves an image key — `meet-in-room/user-flow` — to its bundled URL, so
 * the file extension is not baked into the project data.
 *
 * See ASSETS.md for the Figma node behind each key.
 */
const files = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,gif,svg}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

// Preference order when a key resolves to more than one file: the modern
// format first, an SVG placeholder last.
const priority = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg']

const byKey = new Map<string, { url: string; rank: number }>()

for (const [path, url] of Object.entries(files)) {
  const match = path.match(/\.\.\/assets\/(.+)\.([a-z]+)$/i)
  if (!match) continue
  const [, key, ext] = match
  const rank = priority.indexOf(`.${ext.toLowerCase()}`)
  const current = byKey.get(key)
  if (!current || rank < current.rank) byKey.set(key, { url, rank })
}

export function asset(key: string): string {
  const found = byKey.get(key)
  if (!found) {
    // A missing image should be obvious while wiring content, not a silently
    // broken <img>.
    if (import.meta.env.DEV) console.warn(`[assets] no file found for "${key}"`)
    return ''
  }
  return found.url
}

/** True while the key still resolves to a placeholder rather than a real export. */
export function isPlaceholder(key: string): boolean {
  const found = byKey.get(key)
  return !found || found.url.includes('.svg')
}
