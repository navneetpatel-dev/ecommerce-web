import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPlpPage } from "@/features/categories";
import {
  buildCategoryBreadcrumbTrail,
  categoryNotFoundMetadata,
  hasFilterOrSortParams,
  resolveCategoryBySlugServer,
  toCategoryMetadataInput,
} from "@/features/categories";
import { generateCategoryMetadata } from "@/shared/seo/metadata";
import { JsonLd, generateBreadcrumbSchema } from "@/shared/seo";

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const category = await resolveCategoryBySlugServer(slug);
  if (!category) return categoryNotFoundMetadata();

  return generateCategoryMetadata(toCategoryMetadataInput(category, slug), {
    noindex: hasFilterOrSortParams(query),
  });
}

export default async function CategoryPlpRoute({ params }: Props) {
  const { slug } = await params;
  const category = await resolveCategoryBySlugServer(slug);
  if (!category) notFound();

  const breadcrumbTrail = buildCategoryBreadcrumbTrail(category);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbTrail);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <CategoryPlpPage slugPath={slug} />
    </>
  );
}
