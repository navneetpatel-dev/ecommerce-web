import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/shared/seo/constants";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { fetchShortLink } from "@/shared/utils/sharing/shortLink";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const link = await fetchShortLink(code);
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

export default async function ShortLinkRedirectPage({ params }: Props) {
  const { code } = await params;
  const link = await fetchShortLink(code);
  if (!link) notFound();

  const targetUrl = link.targetUrl.startsWith("/")
    ? link.targetUrl
    : `/${link.targetUrl}`;
  const name = link.metadata?.name || "Product";
  const imageUrl = link.metadata?.imageUrl;
  const price = link.metadata?.price;

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <noscript>
        <meta httpEquiv="refresh" content={`0;url=${targetUrl}`} />
      </noscript>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(targetUrl)});`,
        }}
      />

      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-sm text-center">
        {imageUrl ? (
          <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-lg border border-line bg-surface-raised">
            <Image
              src={imageUrl}
              alt={name}
              width={128}
              height={128}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
        <h1 className="text-body-lg font-semibold text-ink">{name}</h1>
        {price != null ? (
          <p className="mt-1 font-medium text-brand">{formatInr(price)}</p>
        ) : null}
        <div className="my-5 flex items-center justify-center gap-2 text-body-sm text-ink-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span>Redirecting to product...</span>
        </div>
        <Link
          href={targetUrl}
          className="inline-block rounded-md bg-ink px-4 py-2 text-body-sm font-medium text-paper transition-colors hover:bg-ink/90"
        >
          Click here if not redirected
        </Link>
      </div>
    </div>
  );
}
