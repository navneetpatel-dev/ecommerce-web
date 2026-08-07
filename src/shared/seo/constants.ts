export const SITE = {
  name: 'E-Commerce Marketplace',
  shortName: 'Marketplace',
  description: 'Multi-vendor e-commerce platform',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173',
  ogImage: '/og-image.png',
  locale: 'en_IN',
  twitter: '@marketplace',
  author: 'Marketplace',
} as const
