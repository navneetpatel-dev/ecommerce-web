import type { HelpArticle } from "../help-types";

export const SHIPPING_DELIVERY_ISSUES_ARTICLES: HelpArticle[] = [
  {
    slug: "failed-delivery-attempts",
    title: "Failed delivery attempts",
    summary:
      "Why couriers mark attempts as failed and how to arrange reattempt or pickup.",
    sections: [
      {
        heading: "Common reasons",
        bullets: [
          "Recipient unavailable and phone not answered",
          "Incomplete or incorrect address or pincode",
          "Access restrictions (gated society, office hours)",
          "Customer refused the package",
        ],
      },
      {
        heading: "What to do next",
        paragraphs: [
          "Watch for courier SMS or calls and request a reattempt if offered. Update your address phone number in Profile for future orders. For an in-transit shipment, contact support with the AWB so we can coordinate with the seller or courier where possible.",
        ],
      },
      {
        heading: "Returns to seller",
        paragraphs: [
          "After repeated failed attempts, packages may return to the seller. Once returned, options typically include reshipment (may require a new order) or refund per the seller and platform policy.",
        ],
      },
      {
        heading: "COD refusals",
        paragraphs: [
          "Refusing a COD package without a valid reason may affect future COD eligibility. If the item is damaged on arrival, refuse delivery only when the courier allows inspection notes, and then contact support promptly.",
        ],
      },
    ],
    relatedSlugs: [
      "manage-profile-and-addresses",
      "track-your-order",
      "damaged-or-wrong-item",
    ],
  },
  {
    slug: "packaging-and-handover",
    title: "Packaging and handover",
    summary:
      "What sellers prepare, what to check on delivery, and proof of delivery notes.",
    sections: [
      {
        heading: "Seller packaging",
        paragraphs: [
          "Sellers pack items according to their fulfilment process. Fragile goods should be protected; if packaging arrives compromised, document it before discarding materials.",
        ],
      },
      {
        heading: "At the door",
        bullets: [
          "Verify the package is addressed to you and matches the order where possible",
          "Note visible damage on the courier receipt or app if the option exists",
          "For COD, pay only the amount shown for that delivery",
          "Keep outer packaging until you confirm contents are correct",
        ],
      },
      {
        heading: "Proof of delivery",
        paragraphs: [
          "Couriers may capture OTP, signature, or photo proof. If you did not receive a package marked delivered, contact support immediately with Shipping topic, order ID, and AWB.",
        ],
      },
      {
        heading: "Someone else accepted the parcel",
        paragraphs: [
          "Family members, neighbours, or building staff sometimes accept deliveries. Check with them first. If the parcel cannot be located, open a support request quickly so investigation can begin.",
        ],
      },
    ],
    relatedSlugs: [
      "damaged-or-wrong-item",
      "failed-delivery-attempts",
      "request-a-return",
    ],
  },
  {
    slug: "international-and-restricted",
    title: "Service area and restrictions",
    summary:
      "India-focused delivery, restricted items, and locations that may not be serviceable.",
    sections: [
      {
        heading: "Service area",
        paragraphs: [
          "Ink & Brass is built for delivery within India using domestic pincodes. International shipping is not a standard checkout option unless a specific seller explicitly supports it.",
        ],
      },
      {
        heading: "Restricted or non-serviceable pincodes",
        paragraphs: [
          "Some pincodes cannot be served by available couriers, or COD may be blocked. If checkout cannot proceed for your address, try another address or contact support with the pincode.",
        ],
      },
      {
        heading: "Product restrictions",
        paragraphs: [
          "Sellers must follow applicable laws for what they list. Certain categories may have shipping constraints (size, liquids, regulated goods). Listing pages note limitations when provided by the seller.",
        ],
      },
      {
        heading: "Festive and disruption periods",
        paragraphs: [
          "During major sale events, festivals, or regional disruptions, processing and transit times can extend. Check order tracking and seller handling updates rather than assuming the earliest estimate.",
        ],
      },
    ],
    relatedSlugs: [
      "delivery-timelines-and-pincodes",
      "shipping-charges-explained",
      "contact-support",
    ],
  },
];
