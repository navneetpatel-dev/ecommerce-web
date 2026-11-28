import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import {
  fetchShortLink,
  safeRedirectPath,
  toInlineScriptString,
} from "@/shared/utils/sharing/shortLink";
import { shortLinkMetadata } from "@/shared/utils/sharing/shortLinkMetadata";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return shortLinkMetadata(await fetchShortLink(code), code);
}

export default async function ShortLinkRedirectPage({ params }: Props) {
  const { code } = await params;
  const link = await fetchShortLink(code);
  if (!link) notFound();

  const targetUrl = safeRedirectPath(link.targetUrl);
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
          __html: `window.location.replace(${toInlineScriptString(targetUrl)});`,
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
