import type { Metadata } from "next";
import {
  VendorStorefrontPage,
  resolveVendorBySlugServer,
} from "@/features/vendors";
import { SITE } from "@/shared/seo/constants";
import { canonicalUrl } from "@/shared/seo/canonical";
import { PATHS } from "@/shared/constants/paths";

const SEO_VENDOR_FALLBACK_TITLE = "Vendor";

interface VendorPageProps {
  params: Promise<{ slug: string }>;
}

/** Entity-derived metadata for the public vendor storefront (Rule 27). */
export async function generateMetadata({
  params,
}: VendorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await resolveVendorBySlugServer(slug);
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
  return <VendorStorefrontPage slug={slug} />;
}
