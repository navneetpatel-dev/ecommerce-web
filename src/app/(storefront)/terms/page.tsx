import { TermsPage } from "@/features/content";
import { generateStaticPageMetadata } from "@/shared/seo/metadata";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";

export const metadata = generateStaticPageMetadata(
  SEO_PAGE_COPY.terms.title,
  SEO_PAGE_COPY.terms.description,
  "/terms",
);

export default function Terms() {
  return <TermsPage />;
}
