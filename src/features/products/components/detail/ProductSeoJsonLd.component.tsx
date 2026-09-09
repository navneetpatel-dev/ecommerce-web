import { getProductBySlug } from "@/shared/seo/data";
import {
  JsonLd,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/shared/seo";

interface ProductSeoJsonLdProps {
  slug: string;
}

/**
 * Server component that emits structured data (JSON-LD) for the product
 * detail route, keeping the route file composition-only (Rule 9 / Rule 27).
 */
export async function ProductSeoJsonLd({ slug }: ProductSeoJsonLdProps) {
  const product = await getProductBySlug(slug);
  if (!product) return null;

  return (
    <>
      <JsonLd data={generateProductSchema(product)} />
      <JsonLd data={generateBreadcrumbSchema(product.category.breadcrumbs)} />
    </>
  );
}
