import type { MetadataRoute } from 'next'
import { SITE } from '@/shared/seo/constants'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production'

  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/checkout',
          '/profile',
          '/orders',
          '/wallet',
          '/wishlist',
          '/admin/',
          '/vendor/',
          '/search?',
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
