import type { Metadata, Viewport } from "next";
import { SITE } from "./constants";

/** Root viewport configuration (theme colors mirror the theme baseline). */
export const ROOT_VIEWPORT: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F3EC" },
    { media: "(prefers-color-scheme: dark)", color: "#121113" },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

/**
 * Root application metadata (Rule 27): title template, Open Graph/Twitter,
 * robots and icons — all copy pulled from the centralized `SITE` constants.
 */
export function generateRootMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: `%s | ${SITE.name}`,
      default: SITE.name,
    },
    description: SITE.description,
    keywords: [
      "t-shirts",
      "online shopping",
      "premium clothing",
      "e-commerce",
      "multi-vendor",
    ],
    authors: [{ name: SITE.author }],
    creator: SITE.author,
    publisher: SITE.author,
    generator: "Next.js",
    applicationName: SITE.name,
    category: "e-commerce",
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      url: siteUrl,
      title: SITE.name,
      description: SITE.description,
      images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
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
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      apple: [{ url: "/icon-192.png", sizes: "192x192" }],
      other: [{ url: "/icon-512.png", sizes: "512x512" }],
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}
