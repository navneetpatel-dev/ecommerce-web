import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryPlpPage } from '@/features/categories/pages/CategoryPlpPage'
import { generateCategoryMetadata } from '@/shared/seo/metadata'
import { JsonLd, generateBreadcrumbSchema } from '@/shared/seo'
import { canonicalUrl } from '@/shared/seo/canonical'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import { API } from '@/shared/constants/apiRoutes'
import { getServerApiOrigin } from '@/shared/api/serverOrigin'

interface CategoryResolve {
  id: string
  name: string
  slug: string
  seoTitle?: string | null
  seoDescription?: string | null
  path?: string
  breadcrumb?: Array<{ id: string; name: string; slug: string }>
}

async function resolveCategory(slugPath: string[]): Promise<CategoryResolve | null> {
  try {
    const path = slugPath.join('/')
    const res = await fetch(`${getServerApiOrigin()}${API.categories.resolve(path)}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 120 },
    })
    if (!res.ok) return null
    const body = (await res.json()) as { success: boolean; data: CategoryResolve }
    return body.success ? body.data : null
  } catch {
    return null
  }
}

interface Props {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function hasFilterOrSortParams(searchParams: Record<string, string | string[] | undefined>) {
  return Object.keys(searchParams).some((key) => key !== undefined && key.length > 0)
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const query = await searchParams
  const category = await resolveCategory(slug)
  if (!category) {
    return {
      title: LABELS.categoryNotFound,
      robots: { index: false, follow: false },
    }
  }

  const pathSlugs = category.path?.split('/').filter(Boolean) ?? slug
  return generateCategoryMetadata(
    {
      name: category.name,
      slug: category.slug,
      seoTitle: category.seoTitle,
      seoDescription: category.seoDescription,
      pathSlugs,
      breadcrumbs: [
        { name: LABELS.categoryBreadcrumbHome, href: canonicalUrl(PATHS.home) },
        ...(category.breadcrumb ?? []).map((node, index) => {
          const slugs = (category.breadcrumb ?? []).slice(0, index + 1).map((item) => item.slug)
          return { name: node.name, href: canonicalUrl(PATHS.category(...slugs)) }
        }),
      ],
    },
    { noindex: hasFilterOrSortParams(query) },
  )
}

export default async function CategoryPlpRoute({ params }: Props) {
  const { slug } = await params
  const category = await resolveCategory(slug)
  if (!category) notFound()

  const breadcrumbs = [
    { name: LABELS.categoryBreadcrumbHome, href: canonicalUrl(PATHS.home) },
    ...(category.breadcrumb ?? []).map((node, index) => {
      const slugs = (category.breadcrumb ?? []).slice(0, index + 1).map((item) => item.slug)
      return { name: node.name, href: canonicalUrl(PATHS.category(...slugs)) }
    }),
  ]

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <CategoryPlpPage slugPath={slug} />
    </>
  )
}
