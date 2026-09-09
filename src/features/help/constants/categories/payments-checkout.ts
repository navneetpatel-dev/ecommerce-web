import type { HelpArticle } from "../../types/help.types";

export const PAYMENTS_CHECKOUT_ARTICLES: HelpArticle[] = [
  {
    slug: "payment-methods-razorpay-cod",
    title: "Payment methods: Razorpay and COD",
    summary:
      "Pay online via Razorpay instruments or choose Cash on Delivery when your order qualifies.",
    sections: [
      {
        heading: "Razorpay (prepaid)",
        paragraphs: [
          "Online checkout is powered by Razorpay. Depending on what Razorpay offers for your payment, you may use UPI, credit/debit cards, netbanking, or supported wallets — all charged in INR.",
        ],
      },
      {
        heading: "Cash on Delivery",
        bullets: [
          "Available only when every relevant seller and your pincode allow COD",
          "Pay the courier the amount due for that delivery in cash (or as the courier accepts)",
          "COD may carry an extra fee or order-value limits",
          "Some high-value or restricted items may be prepaid-only",
        ],
      },
      {
        heading: "Multi-seller payments",
        paragraphs: [
          "You still pay once at checkout for the full parent order. Behind the scenes, settlement with individual sellers is handled by the marketplace — you do not pay each seller separately.",
        ],
      },
      {
        heading: "Security",
        paragraphs: [
          "Card and UPI credentials are entered on Razorpay’s secure flow. Ink & Brass does not ask you to share OTPs, card PINs, or UPI PINs over phone or email.",
        ],
      },
    ],
    relatedSlugs: [
      "payment-pending-or-failed",
      "shipping-charges-explained",
      "refunds-timelines-and-methods",
    ],
  },
  {
    slug: "payment-pending-or-failed",
    title: "Payment pending or failed",
    summary:
      "What to do when checkout fails, stays pending, or money leaves your account without an order.",
    sections: [
      {
        heading: "Failed at checkout",
        paragraphs: [
          "If Razorpay reports failure, no successful order should be created. You can retry with the same or another method. Check that your bank allows online merchant payments and that UPI limits are not exceeded.",
        ],
      },
      {
        heading: "Pending payment",
        bullets: [
          "Some bank authorisations take a short time to confirm",
          "Avoid rapid repeated payments for the same cart",
          "Refresh Orders after a few minutes before trying again",
        ],
      },
      {
        heading: "Amount deducted, order missing",
        paragraphs: [
          "Banks sometimes show a debit while payment capture is still resolving. Wait for the confirmation window noted in checkout messaging, then verify Orders. If nothing appears, contact support with Payments topic, Razorpay/bank reference, amount, and time.",
        ],
      },
      {
        heading: "COD not offered",
        paragraphs: [
          "If COD is missing, your pincode, cart value, or a seller in the cart may disallow it. Remove restricted items or pay prepaid to continue.",
        ],
      },
    ],
    relatedSlugs: [
      "order-confirmation-and-emails",
      "payment-methods-razorpay-cod",
      "contact-support",
    ],
  },
];
