import type { HelpCategory } from "../help-types";

export const PRODUCTS_REVIEWS_CATEGORY: HelpCategory = {
  id: "products-reviews",
  title: "Products & reviews",
  description:
    "Listings, variants, ratings, and how reviews help other shoppers.",
  icon: "BookOpen",
  articles: [
    {
      slug: "product-listings-explained",
      title: "Product listings explained",
      summary:
        "How to read titles, variants, seller info, shipping notes, and return badges.",
      sections: [
        {
          heading: "Core listing elements",
          bullets: [
            "Title and images provided by the seller",
            "Price in INR and any discount display",
            "Variant selectors (size, colour, configuration)",
            "Seller name and link to more of their catalogue",
            "Return eligibility hints and shipping guidance when present",
          ],
        },
        {
          heading: "Descriptions and specifications",
          paragraphs: [
            "Read the full description for materials, dimensions, care, and inclusions. Specifications help confirm fit and compatibility before you add to cart.",
          ],
        },
        {
          heading: "Stock and fulfilment",
          paragraphs: [
            "Availability is seller-managed. “In stock” at browse time is revalidated at checkout. Handling time affects how quickly a shipment is created after you pay.",
          ],
        },
        {
          heading: "Report a listing issue",
          paragraphs: [
            "If a listing appears misleading or prohibited, contact support with Products topic and the product URL or name. Do not rely on reviews alone for safety-critical claims.",
          ],
        },
      ],
      relatedSlugs: [
        "finding-products-and-sellers",
        "writing-and-reading-reviews",
        "non-returnable-items",
      ],
    },
    {
      slug: "writing-and-reading-reviews",
      title: "Writing and reading reviews",
      summary:
        "When you can review, what makes a helpful review, and how ratings are shown.",
      sections: [
        {
          heading: "Who can review",
          paragraphs: [
            "Reviews are generally available after you purchase and receive an item, subject to platform rules. This helps keep feedback tied to real orders.",
          ],
        },
        {
          heading: "Writing a useful review",
          bullets: [
            "Describe fit, quality, and whether the item matched the listing",
            "Mention shipping experience only when relevant to the product decision",
            "Stay factual; avoid personal attacks on sellers",
            "Do not include phone numbers, addresses, or other private data",
          ],
        },
        {
          heading: "Reading reviews",
          paragraphs: [
            "Consider recent reviews, photo evidence, and whether reviewers mention the same variant you plan to buy. A small number of reviews means limited signal.",
          ],
        },
        {
          heading: "Moderation",
          paragraphs: [
            "Reviews that violate policy (hate, spam, irrelevant promo, private data) may be removed. Contact support if you need to report abusive content.",
          ],
        },
      ],
      relatedSlugs: [
        "product-listings-explained",
        "report-a-seller-or-listing",
        "view-and-understand-orders",
      ],
    },
    {
      slug: "variants-stock-and-availability",
      title: "Variants, stock, and availability",
      summary:
        "Choosing the right variant and understanding out-of-stock or limited inventory.",
      sections: [
        {
          heading: "Select variants carefully",
          paragraphs: [
            "Size, colour, and other options can change price and stock. Confirm the selected variant on the product page before adding to cart — returns for “wrong size chosen” follow normal return eligibility.",
          ],
        },
        {
          heading: "Out of stock",
          paragraphs: [
            "When a variant is unavailable, wait for restock or choose another option. We do not guarantee restock dates unless a seller explicitly provides one.",
          ],
        },
        {
          heading: "Cart reservations",
          paragraphs: [
            "Items in your cart are not always reserved indefinitely. Stock can sell out before you pay; checkout will notify you if something is no longer available.",
          ],
        },
        {
          heading: "Bundle or multi-item listings",
          paragraphs: [
            "If a listing sells a set, check whether pieces are sold separately elsewhere. Return rules may treat the set as a single line item.",
          ],
        },
      ],
      relatedSlugs: [
        "placing-your-first-order",
        "request-a-return",
        "product-listings-explained",
      ],
    },
    {
      slug: "report-a-seller-or-listing",
      title: "Report a seller or listing",
      summary:
        "How to flag policy concerns while keeping your order and payment details handy.",
      sections: [
        {
          heading: "When to report",
          bullets: [
            "Suspected counterfeit or prohibited items",
            "Grossly misleading photos or descriptions",
            "Harassment or inappropriate communication",
            "Policy abuse such as forcing off-platform payment",
          ],
        },
        {
          heading: "What to include",
          paragraphs: [
            "Send the product link or name, seller name, order ID if you purchased, screenshots, and a calm factual summary. Use the Sellers or Products contact topic as appropriate.",
          ],
        },
        {
          heading: "Orders already placed",
          paragraphs: [
            "Reporting a listing does not automatically cancel or refund an order. Use cancellation or returns flows in parallel when you need a commercial remedy.",
          ],
        },
        {
          heading: "Off-platform transactions",
          paragraphs: [
            "Complete payment only through Ink & Brass checkout. Off-platform deals are unsupported and risky; report sellers who pressure you to pay elsewhere.",
          ],
        },
      ],
      relatedSlugs: [
        "buyer-protection-basics",
        "contact-support",
        "payment-methods-razorpay-cod",
      ],
    },
  ],
};
