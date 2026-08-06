import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'

export const FOOTER_SECTIONS = [
  {
    title: LABELS.company,
    links: [
      { href: PATHS.about, label: LABELS.about },
      { href: PATHS.contact, label: LABELS.contact },
      { href: PATHS.blog, label: LABELS.blog },
    ],
  },
  {
    title: LABELS.customerService,
    links: [
      { href: PATHS.orders, label: LABELS.trackOrder },
      { href: PATHS.help, label: LABELS.helpCenter },
      { href: PATHS.faq, label: LABELS.faq },
      { href: PATHS.privacy, label: LABELS.privacyPolicy },
      { href: PATHS.terms, label: LABELS.termsOfService },
    ],
  },
  {
    title: LABELS.sellOnMarketplace,
    links: [
      { href: PATHS.vendor.register, label: LABELS.becomeSeller },
      { href: PATHS.vendor.overview, label: LABELS.vendorDashboard },
    ],
  },
  {
    title: LABELS.connect,
    links: [] as Array<{ href: string; label: string }>,
    isNewsletter: true,
  },
] as const
