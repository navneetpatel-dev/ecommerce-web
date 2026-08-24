/**
 * Ink & Brass Help Centre — quick links.
 */

import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import type { HelpQuickLink } from "../types/help.types";

export const HELP_QUICK_LINKS: HelpQuickLink[] = [
  {
    label: LABELS.helpQuickLinkOrders,
    href: PATHS.orders,
    description: LABELS.helpQuickLinkOrdersDesc,
  },
  {
    label: LABELS.helpQuickLinkProfile,
    href: PATHS.profile,
    description: LABELS.helpQuickLinkProfileDesc,
  },
  {
    label: LABELS.helpQuickLinkReturnsPolicy,
    href: PATHS.returns,
    description: LABELS.helpQuickLinkReturnsPolicyDesc,
  },
  {
    label: LABELS.helpQuickLinkMyReturns,
    href: PATHS.myReturns,
    description: LABELS.helpQuickLinkMyReturnsDesc,
  },
  {
    label: LABELS.helpQuickLinkTickets,
    href: PATHS.supportTickets,
    description: LABELS.helpQuickLinkTicketsDesc,
  },
  {
    label: LABELS.helpQuickLinkBugs,
    href: PATHS.bugReportNew,
    description: LABELS.helpQuickLinkBugsDesc,
  },
  {
    label: LABELS.helpQuickLinkContact,
    href: PATHS.contact,
    description: LABELS.helpQuickLinkContactDesc,
  },
];
