import type { HelpCategory } from "../../types/help.types";

export const PRIVACY_DATA_CATEGORY: HelpCategory = {
  id: "privacy-data",
  title: "Privacy & data",
  description:
    "What we collect, how it is used for orders, and your export or deletion options.",
  icon: "Shield",
  articles: [
    {
      slug: "data-we-collect-and-why",
      title: "Data we collect and why",
      summary:
        "Account, order, delivery, and payment-related data needed to run the marketplace.",
      sections: [
        {
          heading: "Account data",
          paragraphs: [
            "We store profile details you provide — such as name, email, phone, and addresses — so you can sign in, checkout, and receive delivery updates.",
          ],
        },
        {
          heading: "Order and fulfilment data",
          bullets: [
            "Items purchased, sellers involved, and order statuses",
            "Shipping addresses and phone numbers shared with fulfilment partners",
            "Return requests and related correspondence",
            "Support tickets you submit through Help",
          ],
        },
        {
          heading: "Payments",
          paragraphs: [
            "Online payments are processed by Razorpay. We receive payment status and references needed for orders and refunds; we do not store full card numbers on Ink & Brass servers.",
          ],
        },
        {
          heading: "Sellers and couriers",
          paragraphs: [
            "To deliver multi-seller orders, necessary address and contact details are shared with the fulfilling seller and courier partners. Limit optional data in address lines to what is required for delivery.",
          ],
        },
      ],
      relatedSlugs: [
        "export-or-delete-your-data",
        "buyer-protection-basics",
        "manage-profile-and-addresses",
      ],
    },
    {
      slug: "export-or-delete-your-data",
      title: "Export or delete your data",
      summary:
        "How to request an account data export or account deletion from your profile tools.",
      sections: [
        {
          heading: "Data export",
          paragraphs: [
            "Where available in Profile privacy settings, you can request an export of your account data. Processing may take time; you will be notified when the export is ready according to the product flow.",
          ],
        },
        {
          heading: "Account deletion",
          paragraphs: [
            "Account deletion removes or anonymises personal data that is no longer required, subject to legal and operational retention (for example, completed order records needed for tax, dispute, or fraud prevention).",
          ],
        },
        {
          heading: "Before you delete",
          bullets: [
            "Download any invoices you may need later",
            "Complete or cancel open orders and returns",
            "Understand that seller payouts and financial records may retain necessary transaction data",
          ],
        },
        {
          heading: "Need help",
          paragraphs: [
            "If privacy tools are unavailable or fail, contact support with Account topic and describe whether you need export or deletion. Verify your identity using the email on the account.",
          ],
        },
      ],
      relatedSlugs: [
        "data-we-collect-and-why",
        "password-and-login-security",
        "contact-support",
      ],
    },
    {
      slug: "buyer-protection-basics",
      title: "Buyer protection basics",
      summary:
        "Practical steps that keep payments, personal data, and deliveries safer.",
      sections: [
        {
          heading: "Stay on-platform",
          paragraphs: [
            "Pay only through Ink & Brass checkout (Razorpay or eligible COD). Do not share OTPs or transfer money to personal UPI IDs provided in chat.",
          ],
        },
        {
          heading: "Protect personal information",
          bullets: [
            "Do not post addresses or phone numbers in public reviews",
            "Use strong unique passwords",
            "Beware of phishing links claiming package problems",
            "Share AWB numbers only with trusted parties",
          ],
        },
        {
          heading: "Delivery safety",
          paragraphs: [
            "Prefer OTP-based delivery confirmation when couriers offer it. If a package is marked delivered but missing, report it quickly under Shipping.",
          ],
        },
        {
          heading: "Disputes",
          paragraphs: [
            "Use returns and support channels with clear evidence. Chargebacks may be appropriate in limited cases after platform investigation — provide order and payment references when asked.",
          ],
        },
      ],
      relatedSlugs: [
        "password-and-login-security",
        "report-a-seller-or-listing",
        "damaged-or-wrong-item",
      ],
    },
    {
      slug: "cookies-and-communications",
      title: "Cookies and communications",
      summary:
        "How session and preference storage supports login, cart, and essential messages.",
      sections: [
        {
          heading: "Essential site function",
          paragraphs: [
            "We use cookies or similar storage for sign-in sessions, cart continuity, and security. Without them, checkout and account features may not work reliably.",
          ],
        },
        {
          heading: "Communications",
          paragraphs: [
            "Transactional emails and messages about orders, shipments, returns, and security are part of operating your purchases. Marketing preferences are managed separately in Profile when offered.",
          ],
        },
        {
          heading: "Third parties",
          paragraphs: [
            "Payment (Razorpay) and courier partners process data needed for their services under their own policies in addition to ours.",
          ],
        },
        {
          heading: "Questions",
          paragraphs: [
            "For privacy questions not covered here, contact support with Account topic or refer to the full privacy policy linked in the site footer when published.",
          ],
        },
      ],
      relatedSlugs: [
        "notification-preferences",
        "data-we-collect-and-why",
        "export-or-delete-your-data",
      ],
    },
  ],
};
