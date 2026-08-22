import { PrivacyPage } from "@/features/content";
import { generateStaticPageMetadata } from "@/shared/seo/metadata";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";

export const metadata = generateStaticPageMetadata(
  SEO_PAGE_COPY.privacy.title,
  SEO_PAGE_COPY.privacy.description,
  "/privacy",
);

export default function Privacy() {
  return <PrivacyPage />;
}
