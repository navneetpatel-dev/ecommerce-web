import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces, IBM_Plex_Mono } from 'next/font/google'
import { SITE } from '@/shared/seo/constants'
import '@/shared/styles/globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf8' },
    { media: '(prefers-color-scheme: dark)', color: '#14171c' },
  ],
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${SITE.name}`,
    default: SITE.name,
  },
  description: SITE.description,
  keywords: ['t-shirts', 'online shopping', 'premium clothing', 'e-commerce', 'multi-vendor'],
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  publisher: SITE.author,
  generator: 'Next.js',
  applicationName: SITE.name,
  category: 'e-commerce',
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: siteUrl,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE.twitter,
    creator: SITE.twitter,
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: [{ url: '/icon-192.png', sizes: '192x192' }],
    other: [{ url: '/icon-512.png', sizes: '512x512' }],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={SITE.locale.split('_')[0]} className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
