import type { HelpCategory } from "../../types/help.types";

export const PAYMENTS_CATEGORY: HelpCategory = {
  id: "payments",
  title: "Payments",
  description:
    "Razorpay checkout, Cash on Delivery, payment failures, and refunds to source.",
  icon: "CreditCard",
  articles: [
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
            "Points are credited after successful payment — usually within seconds",
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
  ],
};
