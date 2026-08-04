import type { Metadata } from 'next'
import { getProductBySlug } from '@/shared/seo/data'
import { generateProductMetadata } from '@/shared/seo/metadata'
import { JsonLd, generateProductSchema, generateBreadcrumbSchema } from '@/shared/seo'
import { ProductDetailPage } from '@/features/products/pages/ProductDetailPage'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    }
  }
  return generateProductMetadata(product)
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return (
    <>
      {product && (
        <>
          <JsonLd data={generateProductSchema(product)} />
          <JsonLd data={generateBreadcrumbSchema(product.category.breadcrumbs)} />
        </>
      )}
      <ProductDetailPage />
    </>
  )
}
