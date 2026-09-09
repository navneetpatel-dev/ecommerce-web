import type { HelpArticle } from "../../types/help/help.types";

export const RETURNS_REFUNDS_REQUESTS_ARTICLES: HelpArticle[] = [
  {
    slug: "returns-policy-overview",
    title: "Returns policy overview",
    summary:
      "Eligibility basics, windows, and how returns work on a multi-vendor marketplace.",
    sections: [
      {
        heading: "Item-level returns",
        paragraphs: [
          "Returns are requested per item (or eligible line), not only for an entire multi-seller order. Each item follows the return rules of its listing and seller, within platform guidelines.",
        ],
      },
      {
        heading: "Typical eligibility",
        bullets: [
          "Request within the return window shown for the item after delivery",
          "Item unused and in original condition with tags or packaging where required",
          "Non-returnable categories (personal care, perishables, customised goods, etc.) as marked on the listing",
          "Wrong, damaged, or defective items — report promptly with photos when asked",
        ],
      },
      {
        heading: "Policy page",
        paragraphs: [
          "Read the full returns policy at /returns for timelines, conditions, and exceptions. Seller-specific notes on a product page may add constraints within those rules.",
        ],
      },
      {
        heading: "Who approves the return",
        paragraphs: [
          "Return requests are reviewed according to marketplace and seller workflows. Status updates appear under My Returns. Keep your order ID and item details ready if support asks for clarification.",
        ],
      },
    ],
    relatedSlugs: [
      "request-a-return",
      "refunds-timelines-and-methods",
      "damaged-or-wrong-item",
    ],
  },
  {
    slug: "request-a-return",
    title: "How to request a return",
    summary:
      "Step-by-step: open the order, select items, submit reasons, and track My Returns.",
    sections: [
      {
        heading: "Start from the order",
        paragraphs: [
          "Go to Orders, open the delivered order, and choose the item you want to return. Only eligible items show a return action. Multi-seller orders may list return options separately per sub-order item.",
        ],
      },
      {
        heading: "Submit complete details",
        bullets: [
          "Select a clear reason (size issue, damaged, wrong item, quality, etc.)",
          "Add notes that help the seller verify the claim",
          "Upload photos when the form allows — especially for damage or wrong item",
          "Confirm pickup or drop-off instructions when provided",
        ],
      },
      {
        heading: "After you submit",
        paragraphs: [
          "Track progress under My Returns (/my-returns). Statuses typically move through requested, approved or rejected, in transit back, received, and refunded or closed.",
        ],
      },
      {
        heading: "Pickup and packaging",
        paragraphs: [
          "Pack the item securely with all original accessories. Be available for reverse pickup if scheduled. If self-ship is required, use the instructions and retain the courier receipt until the refund completes.",
        ],
      },
      {
        heading: "Rejected requests",
        paragraphs: [
          "If a return is rejected, the reason is shown on the request. You may contact support with Returns topic if you believe the decision does not match the listing policy or the item condition evidence.",
        ],
      },
    ],
    relatedSlugs: [
      "returns-policy-overview",
      "refunds-timelines-and-methods",
      "track-your-order",
    ],
  },
];
