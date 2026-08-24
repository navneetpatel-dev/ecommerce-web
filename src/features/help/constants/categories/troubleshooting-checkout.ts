import type { HelpArticle } from "../../types/help.types";

export const TROUBLESHOOTING_CHECKOUT_ARTICLES: HelpArticle[] = [
  {
    slug: "checkout-and-cart-problems",
    title: "Checkout and cart problems",
    summary:
      "Cart empties, address errors, pincode blocks, and stuck payment screens.",
    sections: [
      {
        heading: "Cart unexpected changes",
        bullets: [
          "Sign in to sync cart across devices",
          "Out-of-stock items may be removed at checkout",
          "Try refreshing once; avoid duplicate tabs competing for the same cart",
        ],
      },
      {
        heading: "Address or pincode errors",
        paragraphs: [
          "Ensure the pincode matches the city and state. Invalid or non-serviceable pincodes block shipping calculation. Edit the address and retry.",
        ],
      },
      {
        heading: "Stuck on Razorpay",
        paragraphs: [
          "If the payment window hangs, close it and check Orders before paying again. Use a stable network; disable VPN if bank pages fail to load.",
        ],
      },
      {
        heading: "Mixed COD eligibility",
        paragraphs: [
          "A single non-COD item or seller in a multi-seller cart can remove COD for the whole checkout. Pay prepaid or remove the restricting item.",
        ],
      },
    ],
    relatedSlugs: [
      "payment-pending-or-failed",
      "delivery-timelines-and-pincodes",
      "account-access-issues",
    ],
  },
  {
    slug: "emails-not-received",
    title: "Emails not received",
    summary:
      "Missing confirmations or reset links — filters, delays, and verification steps.",
    sections: [
      {
        heading: "Quick checks",
        bullets: [
          "Spam, junk, and promotions folders",
          "Correct email on the account profile",
          "Delay of several minutes during peak load",
          "Corporate email rules blocking marketplace senders",
        ],
      },
      {
        heading: "Password reset specifically",
        paragraphs: [
          "Request a new reset link if the previous one expired. Links are single-use and time-limited for security.",
        ],
      },
      {
        heading: "Orders without email",
        paragraphs: [
          "An order can still exist under Orders even if email is delayed. Use the website as the source of truth, then contact support if both email and order history are missing after a successful payment.",
        ],
      },
      {
        heading: "Still stuck",
        paragraphs: [
          "Contact support with Account or Orders topic, the email address you expect mail on, and approximate timing of the missing message.",
        ],
      },
    ],
    relatedSlugs: [
      "notification-preferences",
      "order-confirmation-and-emails",
      "account-access-issues",
    ],
  },
];
