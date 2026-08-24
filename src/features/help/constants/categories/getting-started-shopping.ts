import type { HelpArticle } from "../../types/help.types";

export const GETTING_STARTED_SHOPPING_ARTICLES: HelpArticle[] = [
  {
    slug: "how-multi-seller-orders-work",
    title: "How multi-seller orders work",
    summary:
      "One checkout, multiple sellers — split shipments, separate tracking, and item-level returns.",
    sections: [
      {
        heading: "One order, several fulfilments",
        paragraphs: [
          "When your cart includes products from more than one seller, Ink & Brass creates a single parent order for payment and history, then splits fulfilment by seller.",
          "Each seller ships from their own location. Delivery dates can differ even when items were purchased together.",
        ],
      },
      {
        heading: "What you will see in Orders",
        bullets: [
          "Parent order total and payment status",
          "Seller-wise sub-orders with their own status (processing, shipped, delivered)",
          "Separate tracking links or AWB numbers per shipment when available",
          "Return actions available per eligible item, not only for the whole order",
        ],
      },
      {
        heading: "Shipping charges across sellers",
        paragraphs: [
          "Shipping may be calculated per seller based on destination pincode, package size, and the seller’s shipping rules. The checkout summary shows the combined shipping amount before you pay.",
        ],
      },
      {
        heading: "Issues that affect only one seller",
        paragraphs: [
          "A delay, cancellation, or return for one seller’s items does not automatically cancel the rest of the order. Contact support with the order ID and the affected seller or item if you need help coordinating.",
        ],
      },
    ],
    relatedSlugs: [
      "track-your-order",
      "delivery-timelines-and-pincodes",
      "request-a-return",
    ],
  },
  {
    slug: "finding-products-and-sellers",
    title: "Finding products and sellers",
    summary:
      "Search, filters, seller pages, and how to judge listings before you buy.",
    sections: [
      {
        heading: "Search and browse",
        paragraphs: [
          "Use search for product names, categories, or keywords. Category pages and filters help narrow by price, attributes, and availability.",
        ],
      },
      {
        heading: "Seller storefronts",
        paragraphs: [
          "Each listing shows the selling merchant. Open the seller’s storefront to see more of their catalogue, policies summarised on listings, and other items they offer.",
        ],
      },
      {
        heading: "Before you buy",
        bullets: [
          "Read the full description, size or variant details, and images",
          "Check estimated shipping notes and return eligibility on the product",
          "Review recent customer ratings when available",
          "Confirm the destination pincode is serviceable at checkout",
        ],
      },
      {
        heading: "Unavailable or out of stock",
        paragraphs: [
          "Stock is managed by sellers and can change quickly. If an item becomes unavailable during checkout, remove it or try again later. You are only charged for items that complete payment successfully.",
        ],
      },
    ],
    relatedSlugs: [
      "placing-your-first-order",
      "product-listings-explained",
      "writing-and-reading-reviews",
    ],
  },
];
