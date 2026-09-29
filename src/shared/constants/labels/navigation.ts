/** Footer and storefront navigation labels. Subset of LABELS; merged in labels/index.ts. */
export const navigationLabels = {
  company: "Company",
  customerService: "Customer Service",
  sellOnMarketplace: "Sell on Marketplace",
  connect: "Connect",

  // Footer / nav link labels
  about: "About",
  contact: "Contact",
  blog: "Blog",
  faq: "FAQ",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  trackOrder: "Track Order",
  helpCenter: "Help Center",
  becomeSeller: "Become a Seller",
  vendorDashboard: "Vendor Dashboard",
  deliveryDashboard: "Delivery Dashboard",
  /** First focusable element on every page (WCAG 2.4.1). */
  skipToContent: "Skip to main content",
  /** Announced by the route announcer when a page has no heading to read. */
  pageLoadedFallback: "Page loaded",
  /** Storefront notice while the browser reports no connection. */
  offlineNoticeTitle: "You're offline",
  offlineNoticeBody:
    "Prices, stock and delivery estimates may be out of date. They refresh automatically when you're back online.",
  /** The cached page the service worker falls back to for a failed navigation. */
  offlinePageTitle: "You're offline",
  offlinePageBody:
    "This page isn't saved for offline use. Reconnect to keep browsing, or open the home page to see what was saved.",
  offlinePageHome: "Go to the home page",
  offlinePageRetry: "Try again",

  // Admin nav
} as const;
