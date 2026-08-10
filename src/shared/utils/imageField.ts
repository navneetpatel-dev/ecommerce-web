/** Keys that hold a single image URL or list of image URLs on table/detail records. */
const IMAGE_FIELD_KEYS = new Set([
  'image',
  'imageurl',
  'images',
  'imageurls',
  'coverimage',
  'coverimageurl',
  'avatar',
  'avatarurl',
  'logo',
  'logourl',
  'bannerurl',
  'thumbnail',
  'thumbnailurl',
  'photo',
  'photos',
  'photourl',
  'photourls',
])

export function isImageFieldKey(key: string): boolean {
  const normalized = key.replace(/[_-]/g, '').toLowerCase()
  if (IMAGE_FIELD_KEYS.has(normalized)) return true
  return /(?:image|photo|avatar|logo|banner|thumbnail)(?:url|src)?$/i.test(key)
}

function isLikelyImageUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('/')) return true
  if (/^https?:\/\//i.test(trimmed)) return true
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(trimmed)
}

/** Normalize a detail/table cell value into zero or more image URLs. */
export function extractImageUrls(value: unknown): string[] {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed && isLikelyImageUrl(trimmed) ? [trimmed] : []
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === 'string') return extractImageUrls(item)
        if (item != null && typeof item === 'object') {
          const row = item as Record<string, unknown>
          const nested =
            row.url ?? row.imageUrl ?? row.src ?? row.href ?? row.path
          if (typeof nested === 'string') return extractImageUrls(nested)
        }
        return []
      })
      .filter(Boolean)
  }

  if (value != null && typeof value === 'object') {
    const row = value as Record<string, unknown>
    const nested = row.url ?? row.imageUrl ?? row.src
    if (typeof nested === 'string') return extractImageUrls(nested)
  }

  return []
}

export function isImageDetailValue(key: string, value: unknown): boolean {
  if (!isImageFieldKey(key)) return false
  return extractImageUrls(value).length > 0
}
