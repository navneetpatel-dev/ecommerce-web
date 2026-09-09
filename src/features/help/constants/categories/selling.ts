import type { HelpCategory } from "../../types/help/help.types";

export const SELLING_CATEGORY: HelpCategory = {
  id: "selling",
  title: "Selling on the marketplace",
  description:
    "Seller onboarding, catalogue, orders, and fulfilment expectations for merchants.",
  icon: "Store",
  articles: [
    {
      slug: "become-a-seller",
      title: "Become a seller",
      summary:
        "Overview of applying to sell on Ink & Brass and what approval involves.",
      sections: [
        {
          heading: "Who can sell",
          paragraphs: [
            "Independent merchants who can fulfil orders within India may apply to sell on Ink & Brass, subject to onboarding checks and marketplace policies.",
          ],
        },
        {
          heading: "Application basics",
          bullets: [
            "Business and contact details",
            "Tax identifiers such as GSTIN where applicable",
            "Bank account information for settlements",
            "Agreement to seller terms and fulfilment standards",
          ],
        },
        {
          heading: "After approval",
          paragraphs: [
            "Approved sellers access the seller portal to manage catalogue, inventory, orders, and returns. Keep business details current to avoid payout or compliance delays.",
          ],
        },
        {
          heading: "Buyers vs sellers",
          paragraphs: [
            "A seller account is distinct from shopping as a customer. Use the correct portal for each role. Support can help route you if you are unsure which login to use.",
          ],
        },
      ],
      relatedSlugs: [
        "seller-orders-and-shipping",
        "selling-gst-and-compliance",
        "seller-returns-handling",
      ],
    },
    {
      slug: "seller-orders-and-shipping",
      title: "Seller orders and shipping",
      summary:
        "How sellers process their portion of a multi-vendor order and hand over to couriers.",
      sections: [
        {
          heading: "Your slice of a buyer order",
          paragraphs: [
            "When a buyer’s cart includes multiple merchants, each seller sees and fulfils only their line items. Timely acceptance, packing, and dispatch protect your metrics and the buyer experience.",
          ],
        },
        {
          heading: "Fulfilment checklist",
          bullets: [
            "Confirm stock before accepting or processing",
            "Pack securely with accurate packing slips where required",
            "Generate or attach shipment labels per portal instructions",
            "Hand over to the courier and ensure tracking syncs to the order",
          ],
        },
        {
          heading: "Pincode and serviceability",
          paragraphs: [
            "Buyers enter destination pincodes at checkout. Configure shipping rules so rates and serviceability stay accurate; incorrect rules cause failed checkouts or delivery issues.",
          ],
        },
        {
          heading: "Delays",
          paragraphs: [
            "If you cannot ship on time, update the order in the portal and communicate per platform guidelines. Extended silence often leads to cancellations and support escalations.",
          ],
        },
      ],
      relatedSlugs: [
        "become-a-seller",
        "seller-returns-handling",
        "how-multi-seller-orders-work",
      ],
    },
    {
      slug: "seller-returns-handling",
      title: "Seller returns handling",
      summary:
        "Approve or reject return requests, receive reverse pickups, and close refund loops.",
      sections: [
        {
          heading: "Item-level requests",
          paragraphs: [
            "Buyers raise returns against specific items you sold. Review reason codes and photos promptly so eligible returns move to pickup without unnecessary delay.",
          ],
        },
        {
          heading: "Quality checks",
          bullets: [
            "Inspect returned goods against the stated reason",
            "Document condition if you dispute a claim",
            "Follow platform timelines for approval and refund initiation",
          ],
        },
        {
          heading: "Refunds and settlements",
          paragraphs: [
            "Refunds to buyers follow marketplace payment rules (Razorpay prepaid vs COD). Settlements with you are adjusted according to seller agreements when returns complete.",
          ],
        },
        {
          heading: "Reduce return rates",
          paragraphs: [
            "Accurate photos, sizing charts, and honest descriptions reduce avoidable returns. Clear handling times set better buyer expectations for multi-seller deliveries.",
          ],
        },
      ],
      relatedSlugs: [
        "returns-policy-overview",
        "seller-orders-and-shipping",
        "selling-gst-and-compliance",
      ],
    },
    {
      slug: "selling-gst-and-compliance",
      title: "GST and seller compliance",
      summary:
        "Light-touch guidance on GST mentions, invoices, and keeping seller information current.",
      sections: [
        {
          heading: "Tax identifiers",
          paragraphs: [
            "Provide valid GSTIN or other required identifiers during onboarding when applicable. Incorrect tax details can block invoicing or payouts.",
          ],
        },
        {
          heading: "Invoicing buyers",
          paragraphs: [
            "Issue invoices that match fulfilled items and applicable tax. Buyers on multi-seller orders may receive separate invoices from each merchant.",
          ],
        },
        {
          heading: "Prohibited listings",
          paragraphs: [
            "Do not list goods restricted by law or marketplace policy. Violations can lead to listing removal or account action.",
          ],
        },
        {
          heading: "This is not tax advice",
          paragraphs: [
            "Ink & Brass help content explains marketplace mechanics only. Consult a qualified tax professional for GST registration, filing, and input credit decisions.",
          ],
        },
      ],
      relatedSlugs: [
        "become-a-seller",
        "invoices-and-gst",
        "buyer-protection-basics",
      ],
    },
  ],
};
