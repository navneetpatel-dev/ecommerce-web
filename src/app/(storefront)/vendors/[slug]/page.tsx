import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  VendorStorefrontPage,
  resolveVendorSeoEntry,
} from "@/features/vendors";
import { SITE } from "@/shared/seo/constants";
import { canonicalUrl } from "@/shared/seo/canonical";
import { JsonLd, generateStoreSchema } from "@/shared/seo";
import { PATHS } from "@/shared/constants/paths/paths";

const SEO_VENDOR_FALLBACK_TITLE = "Vendor";

interface VendorPageProps {
  params: Promise<{ slug: string }>;
}

/** Entity-derived metadata for the public vendor storefront (Rule 27). */
export async function generateMetadata({
  params,
}: VendorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await resolveVendorSeoEntry(slug);

  // A missing storefront must stay out of the index. The response status cannot
  // be 404: the root/group `loading.tsx` streams every route, so `notFound()`
  // renders the not-found UI into an already-committed 200 (measured on this
  // app). `noindex` is what actually keeps `/vendors/<anything>` out of search.
  if (entry.status === "missing") {
    return {
      title: SEO_VENDOR_FALLBACK_TITLE,
      robots: { index: false, follow: false },
    };
  }

  // An outage keeps the page as it was rather than de-indexing a real vendor.
  const vendor = entry.status === "found" ? entry.data : null;
  const title = vendor?.businessName ?? SEO_VENDOR_FALLBACK_TITLE;
  const description =
    vendor?.description?.trim() ||
    `Shop ${vendor?.businessName ?? "this seller"}'s catalog on ${SITE.name}.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(PATHS.vendorPage(slug)) },
    openGraph: {
      title,
      description,
      url: canonicalUrl(PATHS.vendorPage(slug)),
      type: "website",
      siteName: SITE.name,
    },
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params;
  const entry = await resolveVendorSeoEntry(slug);
  // The API says this storefront does not exist: answer 404 instead of serving
  // an empty 200 that crawlers happily index. "unavailable" still renders, so a
  // backend outage never hides a real vendor.
  if (entry.status === "missing") notFound();
  const vendor = entry.status === "found" ? entry.data : null;

  return (
    <>
      {vendor ? (
        <JsonLd
          data={generateStoreSchema({
            name: vendor.businessName,
            description: vendor.description,
            imageUrl: vendor.logoUrl,
            url: canonicalUrl(PATHS.vendorPage(slug)),
          })}
        />
      ) : null}
      <VendorStorefrontPage slug={slug} />
    </>
  );
}
