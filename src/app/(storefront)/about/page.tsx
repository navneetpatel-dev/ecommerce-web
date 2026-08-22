import { AboutPage } from "@/features/content";
import { generateStaticPageMetadata } from "@/shared/seo/metadata";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";

export const metadata = generateStaticPageMetadata(
  SEO_PAGE_COPY.about.title,
  SEO_PAGE_COPY.about.description,
  "/about",
);

export default function About() {
  return <AboutPage />;
}
