import { ReturnsPage } from "@/features/content";
import { generateStaticPageMetadata } from "@/shared/seo/metadata";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";

export const metadata = generateStaticPageMetadata(
  SEO_PAGE_COPY.returns.title,
  SEO_PAGE_COPY.returns.description,
  "/returns",
);

export default function Returns() {
  return <ReturnsPage />;
}
