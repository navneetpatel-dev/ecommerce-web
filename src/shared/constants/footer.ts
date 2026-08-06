export const FOOTER_SECTIONS = [
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { href: '/orders', label: 'Track Order' },
      { href: '/help', label: 'Help Center' },
      { href: '/faq', label: 'FAQ' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
  {
    title: 'Sell on Marketplace',
    links: [
      { href: '/vendor/register', label: 'Become a Seller' },
      { href: '/vendor/dashboard/overview', label: 'Vendor Dashboard' },
    ],
  },
  {
    title: 'Connect',
    links: [] as Array<{ href: string; label: string }>,
    isNewsletter: true,
  },
] as const
