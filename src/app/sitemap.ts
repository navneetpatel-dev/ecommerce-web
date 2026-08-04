import type { MetadataRoute } from 'next'
import { SITE } from '@/shared/seo/constants'
import { getLiveProductSlugs } from '@/shared/seo/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getLiveProductSlugs()

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE.url}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  for (const slug of products) {
    entries.push({
      url: `${SITE.url}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  entries.push({
    url: `${SITE.url}/orders/tracking`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  })

  return entries
}
