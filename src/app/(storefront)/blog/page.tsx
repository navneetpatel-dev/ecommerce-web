import type { Metadata } from "next";
import { BlogPage } from "@/features/content";
import { generateStaticPageMetadata } from "@/shared/seo/metadata";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";

export const metadata: Metadata = generateStaticPageMetadata(
  SEO_PAGE_COPY.blog.title,
  SEO_PAGE_COPY.blog.description,
  "/blog",
);

export default function Blog() {
  return <BlogPage />;
}
