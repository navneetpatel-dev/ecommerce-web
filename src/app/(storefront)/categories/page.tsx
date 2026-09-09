import { generateStaticPageMetadata } from "@/shared/seo/metadata";
import { CategoriesPage } from "@/features/categories";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";
import { PATHS } from "@/shared/constants/paths/paths";

export const metadata = generateStaticPageMetadata(
  SEO_PAGE_COPY.categories.title,
  SEO_PAGE_COPY.categories.description,
  PATHS.categories,
);

export default function Categories() {
  return <CategoriesPage />;
}
