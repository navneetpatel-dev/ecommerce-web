import type { HelpArticle } from "../../types/help.types";

export const SHIPPING_DELIVERY_RATES_ARTICLES: HelpArticle[] = [
  {
    slug: "delivery-timelines-and-pincodes",
    title: "Delivery timelines and pincodes",
    summary:
      "How serviceability, distance, and seller location affect estimated delivery in India.",
    sections: [
      {
        heading: "Pincode serviceability",
        paragraphs: [
          "Shipping options and COD availability depend on your destination pincode. Remote or restricted pincodes may have longer transit times or limited courier options.",
        ],
      },
      {
        heading: "Estimates vs promises",
        paragraphs: [
          "Checkout and product pages may show estimated delivery windows. These are guidance based on seller handling time and typical courier transit — not guaranteed same-day promises unless explicitly stated.",
        ],
      },
      {
        heading: "Factors that change timelines",
        bullets: [
          "Seller processing and handover speed",
          "Origin city versus destination city",
          "Courier network load, weather, and regional holidays",
          "Incorrect address or failed delivery attempts",
        ],
      },
      {
        heading: "Split deliveries",
        paragraphs: [
          "Multi-seller orders arrive as separate packages. You may receive part of an order days before the rest. Track each shipment individually on the order detail page.",
        ],
      },
    ],
    relatedSlugs: [
      "track-your-order",
      "shipping-charges-explained",
      "failed-delivery-attempts",
    ],
  },
  {
    slug: "shipping-charges-explained",
    title: "Shipping charges explained",
    summary:
      "Why shipping amounts vary by seller, weight, and destination — and what you see at checkout.",
    sections: [
      {
        heading: "Per-seller calculation",
        paragraphs: [
          "Because fulfilment is multi-vendor, shipping is often calculated for each seller’s package and then summed at checkout. Free shipping thresholds, if any, apply according to each seller’s rules unless a platform promotion says otherwise.",
        ],
      },
      {
        heading: "What influences the fee",
        bullets: [
          "Destination pincode and zone",
          "Package weight and dimensions",
          "Seller shipping configuration",
          "Promotions or coupons that waive shipping when eligible",
        ],
      },
      {
        heading: "COD and shipping",
        paragraphs: [
          "Cash on Delivery may include an additional fee on some orders, or may be unavailable for certain pincodes or sellers. The checkout summary reflects any COD-related charges before you confirm.",
        ],
      },
      {
        heading: "Disputing a shipping charge",
        paragraphs: [
          "If the charged shipping differs from what checkout showed at payment time, contact support with Orders or Shipping topic and your order ID. Screenshots of the checkout summary help investigation.",
        ],
      },
    ],
    relatedSlugs: [
      "payment-methods-razorpay-cod",
      "how-multi-seller-orders-work",
      "delivery-timelines-and-pincodes",
    ],
  },
];
