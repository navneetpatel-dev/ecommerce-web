import type { HelpArticle } from "../../types/help.types";

export const RETURNS_REFUNDS_OUTCOMES_ARTICLES: HelpArticle[] = [
  {
    slug: "refunds-timelines-and-methods",
    title: "Refunds: timelines and methods",
    summary:
      "How refunds are issued for Razorpay and COD, and how long posting can take.",
    sections: [
      {
        heading: "When refunds start",
        paragraphs: [
          "Refunds start as soon as a return is approved — they are not blocked on reverse pickup or warehouse receipt. Logistics (pickup and receipt) can continue in parallel.",
        ],
      },
      {
        heading: "Razorpay (prepaid) refunds",
        bullets: [
          "The Razorpay-paid portion is refunded to the original payment method",
          "Status becomes refunded only after Razorpay confirms the refund (refund.processed)",
          "UPI and wallets often post faster than credit cards",
          "Banks may take additional business days after Razorpay initiates the refund",
          "Check My Returns for refund progress before disputing with the bank",
        ],
      },
      {
        heading: "COD and points refunds",
        paragraphs: [
          "Cash on Delivery returns are credited as store points automatically on approval — no bank account or UPI details are collected. Points used at checkout are also credited back as points immediately.",
        ],
      },
      {
        heading: "Partial refunds",
        paragraphs: [
          "If you return only some items from a multi-seller order, the refund covers those items and related shipping components as applicable under policy — not necessarily the full order total. Split-paid orders (wallet + Razorpay) refund each portion to its original source.",
        ],
      },
      {
        heading: "Refund not visible",
        paragraphs: [
          "Confirm My Returns shows the refund track as completed or initiated. For Razorpay, allow bank posting time after initiation. If the window has passed, contact support with order ID and return ID.",
        ],
      },
    ],
    relatedSlugs: [
      "request-a-return",
      "cancel-an-order",
      "payment-pending-or-failed",
    ],
  },
  {
    slug: "damaged-or-wrong-item",
    title: "Damaged, defective, or wrong item",
    summary:
      "What to do when the package contents are not what you ordered or arrive in poor condition.",
    sections: [
      {
        heading: "Act quickly",
        paragraphs: [
          "Report damaged, defective, or incorrect items as soon as you notice them. Early reports with photos are easier to verify. Keep packaging until the case is resolved.",
        ],
      },
      {
        heading: "Evidence that helps",
        bullets: [
          "Photos of the outer package and shipping label",
          "Photos of the item damage or incorrect product",
          "Order ID, item name, and seller name",
          "Unboxing video if you already recorded one (optional but useful)",
        ],
      },
      {
        heading: "Return or replacement",
        paragraphs: [
          "Depending on stock and policy, resolution may be a return-to-refund, replacement shipment, or other adjustment. Follow the return request flow or contact support under Returns if the self-serve path is blocked.",
        ],
      },
      {
        heading: "Do not discard required proof",
        paragraphs: [
          "Discarding the item or packaging before inspection can delay or prevent a favourable outcome. Wait for reverse pickup or disposition instructions.",
        ],
      },
    ],
    relatedSlugs: [
      "request-a-return",
      "packaging-and-handover",
      "contact-support",
    ],
  },
  {
    slug: "non-returnable-items",
    title: "Non-returnable items",
    summary:
      "Categories and conditions that usually cannot be returned, and limited exceptions.",
    sections: [
      {
        heading: "Why some items are excluded",
        paragraphs: [
          "Hygiene, customisation, perishability, and regulatory rules mean certain products cannot be accepted back once delivered. Listings should indicate when an item is non-returnable.",
        ],
      },
      {
        heading: "Common exclusions",
        bullets: [
          "Personal care and intimate products (when sealed/unsealed rules apply)",
          "Customised or made-to-order goods",
          "Perishable or time-sensitive items",
          "Digital goods or downloadable products, if offered",
          "Items marked final sale or non-returnable on the product page",
        ],
      },
      {
        heading: "Exceptions",
        paragraphs: [
          "Wrong item shipped or items damaged in transit may still qualify for resolution even in restricted categories. Contact support with clear evidence under Returns.",
        ],
      },
      {
        heading: "Check before you buy",
        paragraphs: [
          "Review return notes on the product page and the /returns policy. If return flexibility matters for your purchase, confirm eligibility before checkout.",
        ],
      },
    ],
    relatedSlugs: [
      "returns-policy-overview",
      "damaged-or-wrong-item",
      "product-listings-explained",
    ],
  },
];
