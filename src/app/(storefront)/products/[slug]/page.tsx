import type { Metadata } from "next";
import { getProductBySlug } from "@/shared/seo/data";
import { generateProductMetadata } from "@/shared/seo/metadata";
import { ProductDetailPage } from "@/features/products";
import { ProductSeoJsonLd } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: LABELS.productNotFoundTitle,
      robots: { index: false, follow: false },
    };
  }
  return generateProductMetadata(product);
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <ProductSeoJsonLd slug={slug} />
      <ProductDetailPage />
    </>
  );
}
