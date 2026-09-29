import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductSeoEntry } from "@/shared/seo/data";
import { generateProductMetadata } from "@/shared/seo/metadata";
import { ProductDetailPage } from "@/features/products";
import { ProductSeoJsonLd } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getProductSeoEntry(slug);
  if (entry.status === "found") return generateProductMetadata(entry.data);

  // A miss: keep it out of the index. The status cannot be 404 here — every
  // route streams behind the root/group `loading.tsx`, so `notFound()` renders
  // the not-found UI into an already-committed 200 response (measured). `noindex`
  // is what actually keeps a nonexistent slug out of search.
  if (entry.status === "missing") {
    return {
      title: LABELS.productNotFoundTitle,
      robots: { index: false, follow: false },
    };
  }

  // Unavailable: the backend is down. Do not de-index a real product over it.
  return { title: LABELS.productNotFoundTitle };
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  const entry = await getProductSeoEntry(slug);
  // Shows the storefront "not found" UI instead of an empty product page. The
  // response is still a 200 (see generateMetadata above) — the discrimination
  // exists so a miss and an outage are treated differently rather than alike.
  if (entry.status === "missing") notFound();

  return (
    <>
      <ProductSeoJsonLd slug={slug} />
      <ProductDetailPage />
    </>
  );
}
