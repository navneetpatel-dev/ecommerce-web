import type { HelpArticle } from "../../types/help.types";

export const TROUBLESHOOTING_SUPPORT_ARTICLES: HelpArticle[] = [
  {
    slug: "tracking-and-status-mismatches",
    title: "Tracking and status mismatches",
    summary:
      "When order status, courier scans, and what you received do not line up.",
    sections: [
      {
        heading: "Shipped but no AWB",
        paragraphs: [
          "Sellers may mark processing as shipped shortly before the courier scan appears. Wait a short interval, then recheck. Persistent gaps warrant a Shipping support ticket with order ID.",
        ],
      },
      {
        heading: "Delivered but not received",
        paragraphs: [
          "Check with household or building staff, then contact support immediately with AWB and order ID. Early reports improve recovery chances.",
        ],
      },
      {
        heading: "One seller delivered, another has not",
        paragraphs: [
          "This is expected on multi-seller orders. Track each sub-order separately rather than assuming the parent order is complete.",
        ],
      },
      {
        heading: "Return status unclear",
        paragraphs: [
          "Open My Returns for the latest state. If a reverse pickup was missed, request reschedule via support with Returns topic and return ID.",
        ],
      },
    ],
    relatedSlugs: [
      "track-your-order",
      "failed-delivery-attempts",
      "request-a-return",
    ],
  },
  {
    slug: "contact-support",
    title: "Contact support",
    summary:
      "How to reach Ink & Brass Help with the right topic, order ID, and clear details.",
    sections: [
      {
        heading: "Before you write",
        bullets: [
          "Search this Help Centre for an existing answer",
          "Note your order ID, AWB, return ID, or payment reference",
          "Gather photos for damage or wrong-item cases",
          "Use the email on your account so we can verify you",
        ],
      },
      {
        heading: "Choose the right topic",
        paragraphs: [
          "Pick ORDERS, SHIPPING, RETURNS, PAYMENTS, ACCOUNT, PRODUCTS, SELLERS, or OTHER so your request routes correctly. Accurate topics reduce back-and-forth.",
        ],
      },
      {
        heading: "What to include in the message",
        paragraphs: [
          "State the problem in plain language, what you already tried, and the outcome you need (refund status, address change before ship, tracking investigation, etc.). Avoid sending passwords, OTPs, or full card numbers.",
        ],
      },
      {
        heading: "Where to submit",
        paragraphs: [
          "Go to My Account → Support Tickets and open a new ticket. For policy reading, see /returns. For open return cases, monitor /my-returns while you wait for a reply. You can also report bugs via My Account → Bug Reports.",
        ],
      },
      {
        heading: "Response expectations",
        paragraphs: [
          "We aim to respond in a clear, calm, and practical way. Complex courier or bank investigations can take longer than simple account questions. Reply to follow-up questions promptly so your case stays unblocked.",
        ],
      },
    ],
    relatedSlugs: [
      "view-and-understand-orders",
      "buyer-protection-basics",
      "payment-pending-or-failed",
    ],
  },
  {
    slug: "app-and-browser-issues",
    title: "Browser and device issues",
    summary:
      "Page errors, blank screens, and tips for a stable shopping session.",
    sections: [
      {
        heading: "Basic fixes",
        bullets: [
          "Hard-refresh the page or try another browser",
          "Update your browser to a current version",
          "Disable conflicting extensions (ad blockers on checkout)",
          "Ensure cookies are allowed for the Ink & Brass domain",
        ],
      },
      {
        heading: "Mobile browsers",
        paragraphs: [
          "If layout or payment sheets misbehave, try desktop or another mobile browser. Keep the OS WebView components updated on Android when using in-app browsers.",
        ],
      },
      {
        heading: "Slow performance",
        paragraphs: [
          "Large catalogues and image-heavy pages need a stable connection. On slow networks, wait for checkout totals to finish calculating before paying.",
        ],
      },
      {
        heading: "Report a bug",
        paragraphs: [
          "Contact support with OTHER or ACCOUNT topic, device/browser details, screenshots, and steps to reproduce. Include the URL where the issue occurs.",
        ],
      },
    ],
    relatedSlugs: [
      "checkout-and-cart-problems",
      "account-access-issues",
      "contact-support",
    ],
  },
];
