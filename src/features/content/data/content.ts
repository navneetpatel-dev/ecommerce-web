export const blogPosts = [
  {
    slug: 'how-to-choose-right-size',
    title: 'How to choose the right size',
    excerpt: 'A quick guide to choosing fit, style, and confidence for every order.',
  },
  {
    slug: 'vendor-quality-checks',
    title: 'How vendor quality checks work',
    excerpt: 'Understand moderation, approval, and trust signals across the marketplace.',
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

export const returnTimelineSteps = [
  { label: 'Requested', status: 'completed' as const, timestamp: 'Today, 10:30 AM' },
  { label: 'Approved', status: 'current' as const },
  { label: 'Pickup Scheduled', status: 'upcoming' as const },
  { label: 'Received', status: 'upcoming' as const },
  { label: 'Refunded', status: 'upcoming' as const },
]

export function formatBlogTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
}
