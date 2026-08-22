import { VendorsIndexPage } from "@/features/vendors";
import { generateStaticPageMetadata } from "@/shared/seo/metadata";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";

export const metadata = generateStaticPageMetadata(
  SEO_PAGE_COPY.vendors.title,
  SEO_PAGE_COPY.vendors.description,
  "/vendors",
);

export default function VendorsPage() {
  return <VendorsIndexPage />;
}
