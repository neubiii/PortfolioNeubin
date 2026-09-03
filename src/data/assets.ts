/**
 * Asset resolver.
 *
 * Images are referenced by key — `meet-in-room/user-flow` — not by file path,
 * so the extension is not baked into the data. Every asset in `src/assets` is
 * currently a ratio-accurate `.svg` placeholder; dropping the real `.png`
 * export in beside it and deleting the placeholder swaps the image with no
 * code change anywhere.
 *
 * See ASSETS.md for the Figma node each key maps to.
 */
const files = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,gif,svg}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

// Prefer a real bitmap export over the placeholder when both are present.
const priority = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']

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
    // Loud in dev, harmless in production: a missing image should be obvious
    // while wiring content, not a silently broken <img>.
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
