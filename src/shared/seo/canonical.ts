import { SITE } from './constants'
import { PATHS } from '@/shared/constants/paths'

export function canonicalUrl(path: string): string {
  const base = SITE.url.endsWith('/') ? SITE.url.slice(0, -1) : SITE.url
  const pathPrefix = path.startsWith('/') ? path : `/${path}`
  return `${base}${pathPrefix}`
}

export function productCanonical(slug: string): string {
  return canonicalUrl(PATHS.product(slug))
}

export function categoryCanonical(slug: string): string {
  return canonicalUrl(PATHS.category(slug))
}
