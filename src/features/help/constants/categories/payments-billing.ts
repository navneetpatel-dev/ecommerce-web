import type { HelpArticle } from "../../types/help.types";

export const PAYMENTS_BILLING_ARTICLES: HelpArticle[] = [
  {
    slug: "invoices-and-gst",
    title: "Invoices and GST",
    summary:
      "How invoicing works with multiple sellers and light guidance on GST on invoices.",
    sections: [
      {
        heading: "Who issues the invoice",
        paragraphs: [
          "On a multi-vendor marketplace, invoices are typically issued per seller for the items they fulfilled. Your order detail page is the starting point for retrieving available invoice documents.",
        ],
      },
      {
        heading: "GST on invoices",
        paragraphs: [
          "Where GST applies, seller invoices may show GSTIN and tax breakups as required. Ink & Brass surfaces seller-provided documents; for GST credit eligibility, follow your tax advisor’s guidance and the invoice contents.",
        ],
      },
      {
        heading: "Business purchases",
        paragraphs: [
          "If you need a specific billing name or GSTIN on invoices, check whether checkout or profile supports billing details before you pay. Not all sellers can revise invoices after dispatch.",
        ],
      },
      {
        heading: "Missing invoice",
        paragraphs: [
          "Allow time after delivery for invoices to generate. If still unavailable, contact support with Orders topic and the seller name so we can follow up.",
        ],
      },
    ],
    relatedSlugs: [
      "view-and-understand-orders",
      "how-multi-seller-orders-work",
      "selling-gst-and-compliance",
    ],
  },
  {
    slug: "wallet-points-and-recharge",
    title: "Wallet points and recharge",
    summary:
      "Store points you can buy and spend at checkout — not withdrawable cash.",
    sections: [
      {
        heading: "What are wallet points?",
        paragraphs: [
          "Wallet points are closed-loop store credit for Ink & Brass. One point equals ₹1 off at checkout. Points from returns, cashback, and recharge share the same balance.",
        ],
      },
      {
        heading: "Recharging points",
        bullets: [
          "Open Wallet from your account menu to buy points via Razorpay",
          "Minimum and maximum recharge amounts are shown on the wallet page",
          "The maximum balance cap applies to recharge only — refunds and cashback may take you above the cap",
          "If points-per-rupee is above 1, extra points apply on recharge only; checkout still treats 1 point as ₹1 off",
          "Points are credited after successful payment — usually within seconds",
          "A prepaid store-credit invoice is available on the wallet page for paid recharges — it is not a merchandise GST invoice",
        ],
      },
      {
        heading: "Using points at checkout",
        paragraphs: [
          "Apply points on the payment step before you pay the remaining amount online. Points cannot be combined with Cash on Delivery.",
        ],
      },
      {
        heading: "Important",
        bullets: [
          "Points are non-transferable and cannot be withdrawn to a bank account",
          "They are promotional store credit, not a prepaid payment wallet",
          "Refunds for eligible returns may be credited back as points",
        ],
      },
    ],
    relatedSlugs: [
      "payment-methods-razorpay-cod",
      "refunds-timelines-and-methods",
      "contact-support",
    ],
  },
  {
    slug: "promotions-and-pricing",
    title: "Promotions and pricing",
    summary:
      "Coupons, sale prices, and how discounts apply across multi-seller carts.",
    sections: [
      {
        heading: "Listed vs payable price",
        paragraphs: [
          "The amount due is confirmed on the checkout summary, including item discounts, shipping, and any COD fee. Taxes included in list prices are reflected according to each listing.",
        ],
      },
      {
        heading: "Coupons and offers",
        bullets: [
          "Enter coupon codes at checkout when a field is available",
          "Offers may exclude certain sellers, categories, or payment methods",
          "One coupon per order unless a promotion explicitly stacks",
          "Expired or ineligible codes show an error — remove them to continue",
        ],
      },
      {
        heading: "Price changes",
        paragraphs: [
          "Sellers can update prices. The price locked at successful payment is what you pay for that order. Wishlist or earlier page views may show outdated amounts until refresh.",
        ],
      },
      {
        heading: "Fair pricing concerns",
        paragraphs: [
          "If a checkout total does not match the summary you agreed to at pay time, do not complete a second payment. Contact support with Payments topic and details.",
        ],
      },
    ],
    relatedSlugs: [
      "placing-your-first-order",
      "payment-methods-razorpay-cod",
      "shipping-charges-explained",
    ],
  },
];
