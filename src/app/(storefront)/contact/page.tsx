import { ContactPage } from "@/features/content";
import { generateStaticPageMetadata } from "@/shared/seo/metadata";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";

export const metadata = generateStaticPageMetadata(
  SEO_PAGE_COPY.contact.title,
  SEO_PAGE_COPY.contact.description,
  "/contact",
);

export default function Contact() {
  return <ContactPage />;
}
