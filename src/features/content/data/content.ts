export const blogPosts = [
  {
    slug: 'how-to-choose-right-size',
    title: 'How to choose the right size',
    excerpt: 'A quick guide to choosing fit, style, and confidence for every order.',
    body: 'Start with the vendor size chart on each product page. Measure yourself against chest, waist, and length guidance, then prefer the larger size when you are between measurements. Save preferred sizes in your account notes for faster reordering.',
  },
  {
    slug: 'vendor-quality-checks',
    title: 'How vendor quality checks work',
    excerpt: 'Understand moderation, approval, and trust signals across the marketplace.',
    body: 'New products enter a pending queue before they go live. Catalog managers review imagery, pricing, and category accuracy. Approved listings appear in search and collections; rejected listings return to the vendor with notes so they can resubmit.',
  },
] as const

export const faqItems = [
  {
    q: 'How does multi-vendor shipping work?',
    a: 'Products from different vendors may ship separately with their own tracking updates.',
  },
  {
    q: 'Can I return items from one vendor only?',
    a: 'Yes. Returns are handled per eligible order item and vendor return policy.',
  },
  {
    q: 'When is payment captured?',
    a: 'Payment is captured during checkout confirmation through the selected payment method.',
  },
] as const

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null
}
