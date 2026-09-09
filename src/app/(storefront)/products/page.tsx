import { generateStaticPageMetadata } from "@/shared/seo/metadata";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";
import { PATHS } from "@/shared/constants/paths/paths";
import { ProductListingPage } from "@/features/products";

export const metadata = generateStaticPageMetadata(
  SEO_PAGE_COPY.products.title,
  SEO_PAGE_COPY.products.description,
  PATHS.products,
);

export default function Products() {
  return <ProductListingPage />;
}
