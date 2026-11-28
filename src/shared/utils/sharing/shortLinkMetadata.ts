import type { Metadata } from "next";
import { SITE } from "@/shared/seo/constants";
import type { fetchShortLink } from "./shortLink";

/** The share-card metadata of a short link; a missing link is kept out of search. */
export function shortLinkMetadata(
  link: Awaited<ReturnType<typeof fetchShortLink>>,
  code: string,
): Metadata {
  if (!link) {
    return {
      title: `Product Not Found | ${SITE.name}`,
      robots: { index: false },
    };
  }

  const name = link.metadata?.name?.trim() || SITE.name;
  const description = link.metadata?.description
    ? link.metadata.description.slice(0, 180).replace(/\s+/g, " ").trim()
    : `Buy ${name} online at the best price on ${SITE.name}.`;
  const rawImage = link.metadata?.imageUrl;
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${SITE.url}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
    : `${SITE.url}${SITE.ogImage}`;
  const price = link.metadata?.price;
  const pageUrl = `${SITE.url}/s/${code}`;

  return {
    title: name,
    description,
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      title: name,
      description,
      url: pageUrl,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      site: SITE.twitter,
      creator: SITE.twitter,
      images: [imageUrl],
    },
    other: {
      ...(price != null
        ? {
            "product:price:amount": String(price),
            "product:price:currency": "INR",
          }
        : {}),
      "og:image:secure_url": imageUrl,
    },
  };
}
