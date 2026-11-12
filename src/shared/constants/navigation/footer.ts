import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";

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
      { href: PATHS.vendors, label: LABELS.allShops },
      { href: PATHS.orderTracking, label: LABELS.trackOrder },
      { href: PATHS.returns, label: LABELS.returnsPolicy },
      { href: PATHS.help, label: LABELS.helpCenter },
      { href: PATHS.supportTickets, label: LABELS.mySupportTickets },
      { href: PATHS.bugReports, label: LABELS.reportABug },
      { href: PATHS.faq, label: LABELS.faq },
      { href: PATHS.privacy, label: LABELS.privacyPolicy },
      { href: PATHS.terms, label: LABELS.termsOfService },
    ],
  },

  {
    title: LABELS.sellOnMarketplace,
    links: [
      // The landing page explains selling first; sellers reach their dashboard from their own menu.
      { href: PATHS.vendor.root, label: LABELS.sellWithUs },
      { href: PATHS.vendor.register, label: LABELS.becomeSeller },
    ],
  },
  {
    title: LABELS.connect,
    links: [] as Array<{ href: string; label: string }>,
    isNewsletter: true,
  },
] as const;
