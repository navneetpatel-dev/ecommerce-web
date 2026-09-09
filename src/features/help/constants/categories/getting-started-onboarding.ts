import type { HelpArticle } from "../../types/help/help.types";

export const GETTING_STARTED_ONBOARDING_ARTICLES: HelpArticle[] = [
  {
    slug: "welcome-to-ink-and-brass",
    title: "Welcome to Ink & Brass",
    summary:
      "How our multi-vendor marketplace works, what you can buy, and what to expect at checkout.",
    sections: [
      {
        heading: "What Ink & Brass is",
        paragraphs: [
          "Ink & Brass is an India-focused multi-vendor marketplace. Independent sellers list products under one storefront; you shop in one cart and pay once in Indian Rupees (INR).",
          "Orders may be fulfilled by more than one seller. When that happens, items ship as separate packages with their own tracking and delivery timelines.",
        ],
      },
      {
        heading: "What you can do here",
        bullets: [
          "Browse catalogues from multiple sellers in one place",
          "Save addresses with Indian pincodes for faster checkout",
          "Pay online with Razorpay or choose Cash on Delivery where available",
          "Track each seller shipment and request returns per item",
          "Manage profile, orders, and returns from your account",
        ],
      },
      {
        heading: "Accounts and guest browsing",
        paragraphs: [
          "You can browse without signing in. To place an order, save addresses, track purchases, or request a return, you need an Ink & Brass account.",
          "Seller accounts are separate from buyer accounts. If you sell on the marketplace, use the seller portal after your seller profile is approved.",
        ],
      },
      {
        heading: "Prices, taxes, and currency",
        paragraphs: [
          "All prices are shown in INR. Where GST applies, it is typically reflected in the listed price or broken out at checkout depending on the seller’s listing.",
          "Shipping charges may vary by seller, weight, and destination pincode. Review the order summary before you confirm payment.",
        ],
      },
    ],
    relatedSlugs: [
      "create-your-account",
      "placing-your-first-order",
      "how-multi-seller-orders-work",
    ],
  },
  {
    slug: "create-your-account",
    title: "Create your account",
    summary:
      "Sign up with email, verify your details, and set up a profile ready for checkout.",
    sections: [
      {
        heading: "Sign-up steps",
        paragraphs: [
          "Open Sign up from the header and enter your name, email, and a strong password. Confirm any verification email if prompted before signing in.",
        ],
        bullets: [
          "Use an email you check regularly — order updates are sent there",
          "Choose a unique password; do not reuse passwords from other sites",
          "After sign-in, complete your profile and add at least one delivery address",
        ],
      },
      {
        heading: "Delivery address essentials",
        paragraphs: [
          "Indian deliveries rely on an accurate pincode, locality, and phone number. Couriers use the pincode to route packages and may call the number on the label.",
        ],
        bullets: [
          "Enter a valid 6-digit pincode that matches your city and area",
          "Include landmark or flat/house details so the package can be found",
          "Keep your mobile number reachable during delivery hours",
        ],
      },
      {
        heading: "Preferences worth setting early",
        paragraphs: [
          "In your profile you can manage notification preferences, default address, and personal details. Setting a default address speeds up checkout on future orders.",
        ],
      },
      {
        heading: "If you already have an account",
        paragraphs: [
          "Use Log in with the same email. If you forget your password, use the reset flow from the login page. Never share one-time codes or passwords with anyone claiming to be support.",
        ],
      },
    ],
    relatedSlugs: [
      "welcome-to-ink-and-brass",
      "manage-profile-and-addresses",
      "password-and-login-security",
    ],
  },
  {
    slug: "placing-your-first-order",
    title: "Placing your first order",
    summary:
      "From product page to confirmation — cart, address, payment, and what happens next.",
    sections: [
      {
        heading: "Add items and review the cart",
        paragraphs: [
          "Open a product, choose variants if offered, and add to cart. Your cart may contain items from several sellers. Quantities and availability are checked again at checkout.",
        ],
      },
      {
        heading: "Checkout checklist",
        bullets: [
          "Select or add a delivery address with the correct pincode",
          "Review per-seller shipping estimates and any COD eligibility notes",
          "Choose Razorpay (UPI, cards, netbanking, wallets) or COD if offered",
          "Confirm the total in INR, including shipping, before paying",
        ],
      },
      {
        heading: "After you place the order",
        paragraphs: [
          "You receive an order confirmation with an order ID. Each seller prepares their portion independently. Tracking appears when a shipment is handed to the courier.",
          "Open Orders in your account to see status for the parent order and each seller sub-order.",
        ],
      },
      {
        heading: "Common first-order mistakes",
        bullets: [
          "Wrong pincode — fix the address before the seller ships",
          "Unreachable phone — couriers may mark the attempt as failed",
          "Expecting one package when items are from multiple sellers",
        ],
      },
    ],
    relatedSlugs: [
      "how-multi-seller-orders-work",
      "payment-methods-razorpay-cod",
      "track-your-order",
    ],
  },
];
