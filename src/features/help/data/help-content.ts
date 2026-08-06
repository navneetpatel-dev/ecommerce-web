/**
 * Ink & Brass Help Centre — static content and lookup helpers.
 * Plain TypeScript data only (no React).
 */

import { PATHS } from '@/shared/constants/paths'

export type HelpCategoryId =
  | 'getting-started'
  | 'account-security'
  | 'orders-tracking'
  | 'shipping-delivery'
  | 'returns-refunds'
  | 'payments'
  | 'products-reviews'
  | 'selling'
  | 'privacy-data'
  | 'troubleshooting';

export type HelpSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type HelpArticle = {
  slug: string;
  title: string;
  summary: string;
  sections: HelpSection[];
  relatedSlugs: string[];
};

export type HelpCategory = {
  id: HelpCategoryId;
  title: string;
  description: string;
  /** Lucide icon component name */
  icon: string;
  articles: HelpArticle[];
};

export type HelpTopicOption = {
  value:
    | 'ORDERS'
    | 'SHIPPING'
    | 'RETURNS'
    | 'PAYMENTS'
    | 'ACCOUNT'
    | 'PRODUCTS'
    | 'SELLERS'
    | 'OTHER';
  label: string;
};

export type HelpQuickLink = {
  label: string;
  href: string;
  description: string;
};

/* -------------------------------------------------------------------------- */
/* Categories & articles                                                      */
/* -------------------------------------------------------------------------- */

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    description:
      'Create an account, browse sellers, and place your first order on Ink & Brass.',
    icon: 'BookOpen',
    articles: [
      {
        slug: 'welcome-to-ink-and-brass',
        title: 'Welcome to Ink & Brass',
        summary:
          'How our multi-vendor marketplace works, what you can buy, and what to expect at checkout.',
        sections: [
          {
            heading: 'What Ink & Brass is',
            paragraphs: [
              'Ink & Brass is an India-focused multi-vendor marketplace. Independent sellers list products under one storefront; you shop in one cart and pay once in Indian Rupees (INR).',
              'Orders may be fulfilled by more than one seller. When that happens, items ship as separate packages with their own tracking and delivery timelines.',
            ],
          },
          {
            heading: 'What you can do here',
            bullets: [
              'Browse catalogues from multiple sellers in one place',
              'Save addresses with Indian pincodes for faster checkout',
              'Pay online with Razorpay or choose Cash on Delivery where available',
              'Track each seller shipment and request returns per item',
              'Manage profile, orders, and returns from your account',
            ],
          },
          {
            heading: 'Accounts and guest browsing',
            paragraphs: [
              'You can browse without signing in. To place an order, save addresses, track purchases, or request a return, you need an Ink & Brass account.',
              'Seller accounts are separate from buyer accounts. If you sell on the marketplace, use the seller portal after your seller profile is approved.',
            ],
          },
          {
            heading: 'Prices, taxes, and currency',
            paragraphs: [
              'All prices are shown in INR. Where GST applies, it is typically reflected in the listed price or broken out at checkout depending on the seller’s listing.',
              'Shipping charges may vary by seller, weight, and destination pincode. Review the order summary before you confirm payment.',
            ],
          },
        ],
        relatedSlugs: [
          'create-your-account',
          'placing-your-first-order',
          'how-multi-seller-orders-work',
        ],
      },
      {
        slug: 'create-your-account',
        title: 'Create your account',
        summary:
          'Sign up with email, verify your details, and set up a profile ready for checkout.',
        sections: [
          {
            heading: 'Sign-up steps',
            paragraphs: [
              'Open Sign up from the header and enter your name, email, and a strong password. Confirm any verification email if prompted before signing in.',
            ],
            bullets: [
              'Use an email you check regularly — order updates are sent there',
              'Choose a unique password; do not reuse passwords from other sites',
              'After sign-in, complete your profile and add at least one delivery address',
            ],
          },
          {
            heading: 'Delivery address essentials',
            paragraphs: [
              'Indian deliveries rely on an accurate pincode, locality, and phone number. Couriers use the pincode to route packages and may call the number on the label.',
            ],
            bullets: [
              'Enter a valid 6-digit pincode that matches your city and area',
              'Include landmark or flat/house details so the package can be found',
              'Keep your mobile number reachable during delivery hours',
            ],
          },
          {
            heading: 'Preferences worth setting early',
            paragraphs: [
              'In your profile you can manage notification preferences, default address, and personal details. Setting a default address speeds up checkout on future orders.',
            ],
          },
          {
            heading: 'If you already have an account',
            paragraphs: [
              'Use Log in with the same email. If you forget your password, use the reset flow from the login page. Never share one-time codes or passwords with anyone claiming to be support.',
            ],
          },
        ],
        relatedSlugs: [
          'welcome-to-ink-and-brass',
          'manage-profile-and-addresses',
          'password-and-login-security',
        ],
      },
      {
        slug: 'placing-your-first-order',
        title: 'Placing your first order',
        summary:
          'From product page to confirmation — cart, address, payment, and what happens next.',
        sections: [
          {
            heading: 'Add items and review the cart',
            paragraphs: [
              'Open a product, choose variants if offered, and add to cart. Your cart may contain items from several sellers. Quantities and availability are checked again at checkout.',
            ],
          },
          {
            heading: 'Checkout checklist',
            bullets: [
              'Select or add a delivery address with the correct pincode',
              'Review per-seller shipping estimates and any COD eligibility notes',
              'Choose Razorpay (UPI, cards, netbanking, wallets) or COD if offered',
              'Confirm the total in INR, including shipping, before paying',
            ],
          },
          {
            heading: 'After you place the order',
            paragraphs: [
              'You receive an order confirmation with an order ID. Each seller prepares their portion independently. Tracking appears when a shipment is handed to the courier.',
              'Open Orders in your account to see status for the parent order and each seller sub-order.',
            ],
          },
          {
            heading: 'Common first-order mistakes',
            bullets: [
              'Wrong pincode — fix the address before the seller ships',
              'Unreachable phone — couriers may mark the attempt as failed',
              'Expecting one package when items are from multiple sellers',
            ],
          },
        ],
        relatedSlugs: [
          'how-multi-seller-orders-work',
          'payment-methods-razorpay-cod',
          'track-your-order',
        ],
      },
      {
        slug: 'how-multi-seller-orders-work',
        title: 'How multi-seller orders work',
        summary:
          'One checkout, multiple sellers — split shipments, separate tracking, and item-level returns.',
        sections: [
          {
            heading: 'One order, several fulfilments',
            paragraphs: [
              'When your cart includes products from more than one seller, Ink & Brass creates a single parent order for payment and history, then splits fulfilment by seller.',
              'Each seller ships from their own location. Delivery dates can differ even when items were purchased together.',
            ],
          },
          {
            heading: 'What you will see in Orders',
            bullets: [
              'Parent order total and payment status',
              'Seller-wise sub-orders with their own status (processing, shipped, delivered)',
              'Separate tracking links or AWB numbers per shipment when available',
              'Return actions available per eligible item, not only for the whole order',
            ],
          },
          {
            heading: 'Shipping charges across sellers',
            paragraphs: [
              'Shipping may be calculated per seller based on destination pincode, package size, and the seller’s shipping rules. The checkout summary shows the combined shipping amount before you pay.',
            ],
          },
          {
            heading: 'Issues that affect only one seller',
            paragraphs: [
              'A delay, cancellation, or return for one seller’s items does not automatically cancel the rest of the order. Contact support with the order ID and the affected seller or item if you need help coordinating.',
            ],
          },
        ],
        relatedSlugs: [
          'track-your-order',
          'delivery-timelines-and-pincodes',
          'request-a-return',
        ],
      },
      {
        slug: 'finding-products-and-sellers',
        title: 'Finding products and sellers',
        summary:
          'Search, filters, seller pages, and how to judge listings before you buy.',
        sections: [
          {
            heading: 'Search and browse',
            paragraphs: [
              'Use search for product names, categories, or keywords. Category pages and filters help narrow by price, attributes, and availability.',
            ],
          },
          {
            heading: 'Seller storefronts',
            paragraphs: [
              'Each listing shows the selling merchant. Open the seller’s storefront to see more of their catalogue, policies summarised on listings, and other items they offer.',
            ],
          },
          {
            heading: 'Before you buy',
            bullets: [
              'Read the full description, size or variant details, and images',
              'Check estimated shipping notes and return eligibility on the product',
              'Review recent customer ratings when available',
              'Confirm the destination pincode is serviceable at checkout',
            ],
          },
          {
            heading: 'Unavailable or out of stock',
            paragraphs: [
              'Stock is managed by sellers and can change quickly. If an item becomes unavailable during checkout, remove it or try again later. You are only charged for items that complete payment successfully.',
            ],
          },
        ],
        relatedSlugs: [
          'placing-your-first-order',
          'product-listings-explained',
          'writing-and-reading-reviews',
        ],
      },
    ],
  },

  {
    id: 'account-security',
    title: 'Account & security',
    description:
      'Profile details, addresses, passwords, and keeping your Ink & Brass account safe.',
    icon: 'UserRound',
    articles: [
      {
        slug: 'manage-profile-and-addresses',
        title: 'Manage profile and addresses',
        summary:
          'Update personal details, phone number, and saved delivery addresses with valid pincodes.',
        sections: [
          {
            heading: 'Profile information',
            paragraphs: [
              'Open Profile to update your display name, contact email (where editable), and phone number. Keep these accurate so order and delivery communications reach you.',
            ],
          },
          {
            heading: 'Saved addresses',
            bullets: [
              'Add home, work, or other addresses you use often',
              'Each address needs name, phone, line details, city, state, and pincode',
              'Set a default address for faster checkout',
              'Edit or remove outdated addresses so couriers are not sent to the wrong place',
            ],
          },
          {
            heading: 'Pincode accuracy',
            paragraphs: [
              'An incorrect pincode can delay shipping, cause failed delivery attempts, or show wrong shipping charges. Double-check the pincode against your area before saving.',
            ],
          },
          {
            heading: 'Avatar and preferences',
            paragraphs: [
              'Where available, you can upload a profile photo and adjust notification preferences for order updates and marketing. Transactional order emails are still sent for purchases and returns.',
            ],
          },
        ],
        relatedSlugs: [
          'password-and-login-security',
          'placing-your-first-order',
          'data-we-collect-and-why',
        ],
      },
      {
        slug: 'password-and-login-security',
        title: 'Password and login security',
        summary:
          'Protect your account with a strong password, careful login habits, and timely resets.',
        sections: [
          {
            heading: 'Strong passwords',
            paragraphs: [
              'Use a long password that is unique to Ink & Brass. Prefer a passphrase or a password manager. Avoid names, birthdays, or reused credentials.',
            ],
          },
          {
            heading: 'Signing in safely',
            bullets: [
              'Only sign in on the official Ink & Brass website',
              'Do not share your password or OTP with anyone, including people claiming to be support',
              'Sign out on shared or public devices after you finish',
              'Be cautious of phishing emails that mimic order alerts',
            ],
          },
          {
            heading: 'Forgot password',
            paragraphs: [
              'Use Forgot password on the login page. We send a reset link or code to your registered email. Complete the reset promptly and then sign in with the new password.',
            ],
          },
          {
            heading: 'Suspicious activity',
            paragraphs: [
              'If you notice orders you did not place or login alerts you do not recognise, change your password immediately and contact support under the Account topic with details.',
            ],
          },
        ],
        relatedSlugs: [
          'manage-profile-and-addresses',
          'export-or-delete-your-data',
          'contact-support',
        ],
      },
      {
        slug: 'notification-preferences',
        title: 'Notification preferences',
        summary:
          'Control which updates you receive while still getting essential order and return messages.',
        sections: [
          {
            heading: 'Types of messages',
            bullets: [
              'Order and payment confirmations',
              'Shipment and delivery updates',
              'Return and refund status changes',
              'Optional promotional or product updates, when enabled',
            ],
          },
          {
            heading: 'What you can turn off',
            paragraphs: [
              'Marketing and non-essential notifications can usually be disabled in Profile. Transactional messages required to complete purchases, deliveries, and refunds remain enabled.',
            ],
          },
          {
            heading: 'SMS and calls from couriers',
            paragraphs: [
              'Courier partners may SMS or call the phone number on your shipping label. That contact is for delivery coordination and is separate from Ink & Brass marketing preferences.',
            ],
          },
          {
            heading: 'Email not arriving',
            paragraphs: [
              'Check spam or promotions folders and ensure your profile email is correct. Corporate filters sometimes block marketplace mail; whitelist our domain if needed.',
            ],
          },
        ],
        relatedSlugs: [
          'manage-profile-and-addresses',
          'track-your-order',
          'emails-not-received',
        ],
      },
      {
        slug: 'account-access-issues',
        title: 'Account access issues',
        summary:
          'Cannot sign in, locked out, or email already registered — practical next steps.',
        sections: [
          {
            heading: 'Login fails',
            bullets: [
              'Confirm you are using the email you registered with',
              'Check Caps Lock and try resetting the password',
              'Clear cached session data or try a private browser window',
              'Disable aggressive blockers that may interfere with login forms',
            ],
          },
          {
            heading: 'Email already in use',
            paragraphs: [
              'If sign-up says the email is taken, try logging in or use password reset. You cannot create a second buyer account with the same email.',
            ],
          },
          {
            heading: 'Session expired mid-checkout',
            paragraphs: [
              'Sign in again and reopen your cart. Payment that did not complete will not create a paid order; verify under Orders before paying twice.',
            ],
          },
          {
            heading: 'When to contact support',
            paragraphs: [
              'If reset emails never arrive or you believe your account was compromised, contact us with the Account topic. Include the email on the account and a clear description — never send passwords.',
            ],
          },
        ],
        relatedSlugs: [
          'password-and-login-security',
          'payment-pending-or-failed',
          'contact-support',
        ],
      },
    ],
  },

  {
    id: 'orders-tracking',
    title: 'Orders & tracking',
    description:
      'Find orders, understand statuses, and track multi-seller shipments.',
    icon: 'Package',
    articles: [
      {
        slug: 'view-and-understand-orders',
        title: 'View and understand orders',
        summary:
          'Order history, statuses, and how parent orders relate to seller sub-orders.',
        sections: [
          {
            heading: 'Where to find orders',
            paragraphs: [
              'Signed-in customers can open Orders from the header or account area. Each order shows the date, total in INR, payment method, and current overall status.',
            ],
          },
          {
            heading: 'Typical status meanings',
            bullets: [
              'Pending / awaiting payment — payment not confirmed yet',
              'Confirmed / processing — sellers are preparing items',
              'Shipped — at least one package is with the courier',
              'Delivered — packages marked delivered (multi-seller orders may deliver at different times)',
              'Cancelled — order or a portion was cancelled before fulfilment',
            ],
          },
          {
            heading: 'Order detail page',
            paragraphs: [
              'Open an order to see line items, seller names, shipping addresses, payment summary, and shipment cards. Use this page for tracking links and return requests when eligible.',
            ],
          },
          {
            heading: 'Invoices and GST',
            paragraphs: [
              'Where sellers issue invoices, they may include GST details as applicable. Keep order IDs handy if you need documentation for expense or warranty purposes.',
            ],
          },
        ],
        relatedSlugs: [
          'how-multi-seller-orders-work',
          'track-your-order',
          'cancel-an-order',
        ],
      },
      {
        slug: 'track-your-order',
        title: 'Track your order',
        summary:
          'Follow AWB and courier updates for each seller shipment tied to your order.',
        sections: [
          {
            heading: 'Tracking availability',
            paragraphs: [
              'Tracking usually appears after the seller hands the package to a courier and an AWB (air waybill) number is generated. Processing time before handover varies by seller.',
            ],
          },
          {
            heading: 'Multi-seller tracking',
            bullets: [
              'Each seller shipment can have its own tracking number',
              'One item delivered does not mean the entire order is complete',
              'Refresh the order page periodically for the latest courier scan',
            ],
          },
          {
            heading: 'Tracking lookup',
            paragraphs: [
              'If you have a tracking or order reference, you can also use the tracking lookup tools where provided. Always match the destination address to your order before sharing tracking details with others.',
            ],
          },
          {
            heading: 'No movement for several days',
            paragraphs: [
              'Courier networks sometimes show gaps between scans, especially across cities. If there is no update for an extended period after ship confirmation, contact support with your order ID and AWB under Shipping.',
            ],
          },
        ],
        relatedSlugs: [
          'delivery-timelines-and-pincodes',
          'failed-delivery-attempts',
          'view-and-understand-orders',
        ],
      },
      {
        slug: 'cancel-an-order',
        title: 'Cancel an order or items',
        summary:
          'When cancellation is possible, what happens to payment, and multi-seller caveats.',
        sections: [
          {
            heading: 'Before the seller ships',
            paragraphs: [
              'Cancellation is most likely while items are still processing. Once a package is shipped, cancellation is usually not available; use the returns flow after delivery if the item is eligible.',
            ],
          },
          {
            heading: 'Partial cancellation',
            paragraphs: [
              'On multi-seller orders, one seller’s items may still be cancellable while another has already shipped. Review each sub-order status before requesting cancellation.',
            ],
          },
          {
            heading: 'Refunds after cancellation',
            bullets: [
              'Razorpay payments: refunds are initiated to the original payment method',
              'Bank or UPI posting times vary; allow several business days after initiation',
              'COD orders that never shipped typically have no collection to reverse',
            ],
          },
          {
            heading: 'How to request help',
            paragraphs: [
              'If self-serve cancel is unavailable, contact support with topic Orders, your order ID, and the items you need cancelled. Do not place a duplicate order until cancellation is confirmed.',
            ],
          },
        ],
        relatedSlugs: [
          'refunds-timelines-and-methods',
          'request-a-return',
          'payment-pending-or-failed',
        ],
      },
      {
        slug: 'order-confirmation-and-emails',
        title: 'Order confirmation and emails',
        summary:
          'What confirmation means, which emails to expect, and how to verify a successful order.',
        sections: [
          {
            heading: 'Successful placement',
            paragraphs: [
              'A successful order shows a confirmation screen with an order ID and appears under Orders. Save the order ID for support and tracking.',
            ],
          },
          {
            heading: 'Emails you may receive',
            bullets: [
              'Order confirmation with summary and total',
              'Payment success or failure notices for online payments',
              'Shipment emails when sellers dispatch packages',
              'Delivery and return status updates',
            ],
          },
          {
            heading: 'Paid but no confirmation',
            paragraphs: [
              'If Razorpay deducted money but Orders does not show a paid order, wait briefly for reconciliation, then check again. If the order is still missing, contact support with Payments topic, payment reference, and approximate time — avoid paying again immediately.',
            ],
          },
          {
            heading: 'Duplicate charges',
            paragraphs: [
              'Occasional double authorisations reverse automatically. Compare bank statements with Orders before disputing. Support can help match payment references to order IDs.',
            ],
          },
        ],
        relatedSlugs: [
          'payment-pending-or-failed',
          'view-and-understand-orders',
          'emails-not-received',
        ],
      },
    ],
  },

  {
    id: 'shipping-delivery',
    title: 'Shipping & delivery',
    description:
      'Pincodes, timelines, split shipments, and what to do when delivery fails.',
    icon: 'Truck',
    articles: [
      {
        slug: 'delivery-timelines-and-pincodes',
        title: 'Delivery timelines and pincodes',
        summary:
          'How serviceability, distance, and seller location affect estimated delivery in India.',
        sections: [
          {
            heading: 'Pincode serviceability',
            paragraphs: [
              'Shipping options and COD availability depend on your destination pincode. Remote or restricted pincodes may have longer transit times or limited courier options.',
            ],
          },
          {
            heading: 'Estimates vs promises',
            paragraphs: [
              'Checkout and product pages may show estimated delivery windows. These are guidance based on seller handling time and typical courier transit — not guaranteed same-day promises unless explicitly stated.',
            ],
          },
          {
            heading: 'Factors that change timelines',
            bullets: [
              'Seller processing and handover speed',
              'Origin city versus destination city',
              'Courier network load, weather, and regional holidays',
              'Incorrect address or failed delivery attempts',
            ],
          },
          {
            heading: 'Split deliveries',
            paragraphs: [
              'Multi-seller orders arrive as separate packages. You may receive part of an order days before the rest. Track each shipment individually on the order detail page.',
            ],
          },
        ],
        relatedSlugs: [
          'track-your-order',
          'shipping-charges-explained',
          'failed-delivery-attempts',
        ],
      },
      {
        slug: 'shipping-charges-explained',
        title: 'Shipping charges explained',
        summary:
          'Why shipping amounts vary by seller, weight, and destination — and what you see at checkout.',
        sections: [
          {
            heading: 'Per-seller calculation',
            paragraphs: [
              'Because fulfilment is multi-vendor, shipping is often calculated for each seller’s package and then summed at checkout. Free shipping thresholds, if any, apply according to each seller’s rules unless a platform promotion says otherwise.',
            ],
          },
          {
            heading: 'What influences the fee',
            bullets: [
              'Destination pincode and zone',
              'Package weight and dimensions',
              'Seller shipping configuration',
              'Promotions or coupons that waive shipping when eligible',
            ],
          },
          {
            heading: 'COD and shipping',
            paragraphs: [
              'Cash on Delivery may include an additional fee on some orders, or may be unavailable for certain pincodes or sellers. The checkout summary reflects any COD-related charges before you confirm.',
            ],
          },
          {
            heading: 'Disputing a shipping charge',
            paragraphs: [
              'If the charged shipping differs from what checkout showed at payment time, contact support with Orders or Shipping topic and your order ID. Screenshots of the checkout summary help investigation.',
            ],
          },
        ],
        relatedSlugs: [
          'payment-methods-razorpay-cod',
          'how-multi-seller-orders-work',
          'delivery-timelines-and-pincodes',
        ],
      },
      {
        slug: 'failed-delivery-attempts',
        title: 'Failed delivery attempts',
        summary:
          'Why couriers mark attempts as failed and how to arrange reattempt or pickup.',
        sections: [
          {
            heading: 'Common reasons',
            bullets: [
              'Recipient unavailable and phone not answered',
              'Incomplete or incorrect address or pincode',
              'Access restrictions (gated society, office hours)',
              'Customer refused the package',
            ],
          },
          {
            heading: 'What to do next',
            paragraphs: [
              'Watch for courier SMS or calls and request a reattempt if offered. Update your address phone number in Profile for future orders. For an in-transit shipment, contact support with the AWB so we can coordinate with the seller or courier where possible.',
            ],
          },
          {
            heading: 'Returns to seller',
            paragraphs: [
              'After repeated failed attempts, packages may return to the seller. Once returned, options typically include reshipment (may require a new order) or refund per the seller and platform policy.',
            ],
          },
          {
            heading: 'COD refusals',
            paragraphs: [
              'Refusing a COD package without a valid reason may affect future COD eligibility. If the item is damaged on arrival, refuse delivery only when the courier allows inspection notes, and then contact support promptly.',
            ],
          },
        ],
        relatedSlugs: [
          'manage-profile-and-addresses',
          'track-your-order',
          'damaged-or-wrong-item',
        ],
      },
      {
        slug: 'packaging-and-handover',
        title: 'Packaging and handover',
        summary:
          'What sellers prepare, what to check on delivery, and proof of delivery notes.',
        sections: [
          {
            heading: 'Seller packaging',
            paragraphs: [
              'Sellers pack items according to their fulfilment process. Fragile goods should be protected; if packaging arrives compromised, document it before discarding materials.',
            ],
          },
          {
            heading: 'At the door',
            bullets: [
              'Verify the package is addressed to you and matches the order where possible',
              'Note visible damage on the courier receipt or app if the option exists',
              'For COD, pay only the amount shown for that delivery',
              'Keep outer packaging until you confirm contents are correct',
            ],
          },
          {
            heading: 'Proof of delivery',
            paragraphs: [
              'Couriers may capture OTP, signature, or photo proof. If you did not receive a package marked delivered, contact support immediately with Shipping topic, order ID, and AWB.',
            ],
          },
          {
            heading: 'Someone else accepted the parcel',
            paragraphs: [
              'Family members, neighbours, or building staff sometimes accept deliveries. Check with them first. If the parcel cannot be located, open a support request quickly so investigation can begin.',
            ],
          },
        ],
        relatedSlugs: [
          'damaged-or-wrong-item',
          'failed-delivery-attempts',
          'request-a-return',
        ],
      },
      {
        slug: 'international-and-restricted',
        title: 'Service area and restrictions',
        summary:
          'India-focused delivery, restricted items, and locations that may not be serviceable.',
        sections: [
          {
            heading: 'Service area',
            paragraphs: [
              'Ink & Brass is built for delivery within India using domestic pincodes. International shipping is not a standard checkout option unless a specific seller explicitly supports it.',
            ],
          },
          {
            heading: 'Restricted or non-serviceable pincodes',
            paragraphs: [
              'Some pincodes cannot be served by available couriers, or COD may be blocked. If checkout cannot proceed for your address, try another address or contact support with the pincode.',
            ],
          },
          {
            heading: 'Product restrictions',
            paragraphs: [
              'Sellers must follow applicable laws for what they list. Certain categories may have shipping constraints (size, liquids, regulated goods). Listing pages note limitations when provided by the seller.',
            ],
          },
          {
            heading: 'Festive and disruption periods',
            paragraphs: [
              'During major sale events, festivals, or regional disruptions, processing and transit times can extend. Check order tracking and seller handling updates rather than assuming the earliest estimate.',
            ],
          },
        ],
        relatedSlugs: [
          'delivery-timelines-and-pincodes',
          'shipping-charges-explained',
          'contact-support',
        ],
      },
    ],
  },

  {
    id: 'returns-refunds',
    title: 'Returns & refunds',
    description:
      'Item-level returns, eligibility windows, refund routes, and My Returns status.',
    icon: 'RotateCcw',
    articles: [
      {
        slug: 'returns-policy-overview',
        title: 'Returns policy overview',
        summary:
          'Eligibility basics, windows, and how returns work on a multi-vendor marketplace.',
        sections: [
          {
            heading: 'Item-level returns',
            paragraphs: [
              'Returns are requested per item (or eligible line), not only for an entire multi-seller order. Each item follows the return rules of its listing and seller, within platform guidelines.',
            ],
          },
          {
            heading: 'Typical eligibility',
            bullets: [
              'Request within the return window shown for the item after delivery',
              'Item unused and in original condition with tags or packaging where required',
              'Non-returnable categories (personal care, perishables, customised goods, etc.) as marked on the listing',
              'Wrong, damaged, or defective items — report promptly with photos when asked',
            ],
          },
          {
            heading: 'Policy page',
            paragraphs: [
              'Read the full returns policy at /returns for timelines, conditions, and exceptions. Seller-specific notes on a product page may add constraints within those rules.',
            ],
          },
          {
            heading: 'Who approves the return',
            paragraphs: [
              'Return requests are reviewed according to marketplace and seller workflows. Status updates appear under My Returns. Keep your order ID and item details ready if support asks for clarification.',
            ],
          },
        ],
        relatedSlugs: [
          'request-a-return',
          'refunds-timelines-and-methods',
          'damaged-or-wrong-item',
        ],
      },
      {
        slug: 'request-a-return',
        title: 'How to request a return',
        summary:
          'Step-by-step: open the order, select items, submit reasons, and track My Returns.',
        sections: [
          {
            heading: 'Start from the order',
            paragraphs: [
              'Go to Orders, open the delivered order, and choose the item you want to return. Only eligible items show a return action. Multi-seller orders may list return options separately per sub-order item.',
            ],
          },
          {
            heading: 'Submit complete details',
            bullets: [
              'Select a clear reason (size issue, damaged, wrong item, quality, etc.)',
              'Add notes that help the seller verify the claim',
              'Upload photos when the form allows — especially for damage or wrong item',
              'Confirm pickup or drop-off instructions when provided',
            ],
          },
          {
            heading: 'After you submit',
            paragraphs: [
              'Track progress under My Returns (/my-returns). Statuses typically move through requested, approved or rejected, in transit back, received, and refunded or closed.',
            ],
          },
          {
            heading: 'Pickup and packaging',
            paragraphs: [
              'Pack the item securely with all original accessories. Be available for reverse pickup if scheduled. If self-ship is required, use the instructions and retain the courier receipt until the refund completes.',
            ],
          },
          {
            heading: 'Rejected requests',
            paragraphs: [
              'If a return is rejected, the reason is shown on the request. You may contact support with Returns topic if you believe the decision does not match the listing policy or the item condition evidence.',
            ],
          },
        ],
        relatedSlugs: [
          'returns-policy-overview',
          'refunds-timelines-and-methods',
          'track-your-order',
        ],
      },
      {
        slug: 'refunds-timelines-and-methods',
        title: 'Refunds: timelines and methods',
        summary:
          'How refunds are issued for Razorpay and COD, and how long posting can take.',
        sections: [
          {
            heading: 'When refunds start',
            paragraphs: [
              'Refunds are typically initiated after a return is approved and the item is received and inspected, or sooner for cancellations before ship. Exact timing depends on the case type.',
            ],
          },
          {
            heading: 'Razorpay (prepaid) refunds',
            bullets: [
              'Refunds go back to the original payment instrument when possible',
              'UPI and wallets often post faster than credit cards',
              'Banks may take additional business days after Razorpay initiates the refund',
              'Check Orders / My Returns for “refund initiated” before disputing with the bank',
            ],
          },
          {
            heading: 'COD refunds',
            paragraphs: [
              'For Cash on Delivery orders, refunds after a successful return are commonly issued via bank transfer or another method collected during the return process, as configured by the platform. Provide accurate account details when asked.',
            ],
          },
          {
            heading: 'Partial refunds',
            paragraphs: [
              'If you return only some items from a multi-seller order, the refund covers those items and related shipping components as applicable under policy — not necessarily the full order total.',
            ],
          },
          {
            heading: 'Refund not visible',
            paragraphs: [
              'Confirm the return status shows refund initiated, then allow bank posting time. If the window has passed, contact support with Payments or Returns topic, order ID, and return ID.',
            ],
          },
        ],
        relatedSlugs: [
          'request-a-return',
          'cancel-an-order',
          'payment-pending-or-failed',
        ],
      },
      {
        slug: 'damaged-or-wrong-item',
        title: 'Damaged, defective, or wrong item',
        summary:
          'What to do when the package contents are not what you ordered or arrive in poor condition.',
        sections: [
          {
            heading: 'Act quickly',
            paragraphs: [
              'Report damaged, defective, or incorrect items as soon as you notice them. Early reports with photos are easier to verify. Keep packaging until the case is resolved.',
            ],
          },
          {
            heading: 'Evidence that helps',
            bullets: [
              'Photos of the outer package and shipping label',
              'Photos of the item damage or incorrect product',
              'Order ID, item name, and seller name',
              'Unboxing video if you already recorded one (optional but useful)',
            ],
          },
          {
            heading: 'Return or replacement',
            paragraphs: [
              'Depending on stock and policy, resolution may be a return-to-refund, replacement shipment, or other adjustment. Follow the return request flow or contact support under Returns if the self-serve path is blocked.',
            ],
          },
          {
            heading: 'Do not discard required proof',
            paragraphs: [
              'Discarding the item or packaging before inspection can delay or prevent a favourable outcome. Wait for reverse pickup or disposition instructions.',
            ],
          },
        ],
        relatedSlugs: [
          'request-a-return',
          'packaging-and-handover',
          'contact-support',
        ],
      },
      {
        slug: 'non-returnable-items',
        title: 'Non-returnable items',
        summary:
          'Categories and conditions that usually cannot be returned, and limited exceptions.',
        sections: [
          {
            heading: 'Why some items are excluded',
            paragraphs: [
              'Hygiene, customisation, perishability, and regulatory rules mean certain products cannot be accepted back once delivered. Listings should indicate when an item is non-returnable.',
            ],
          },
          {
            heading: 'Common exclusions',
            bullets: [
              'Personal care and intimate products (when sealed/unsealed rules apply)',
              'Customised or made-to-order goods',
              'Perishable or time-sensitive items',
              'Digital goods or downloadable products, if offered',
              'Items marked final sale or non-returnable on the product page',
            ],
          },
          {
            heading: 'Exceptions',
            paragraphs: [
              'Wrong item shipped or items damaged in transit may still qualify for resolution even in restricted categories. Contact support with clear evidence under Returns.',
            ],
          },
          {
            heading: 'Check before you buy',
            paragraphs: [
              'Review return notes on the product page and the /returns policy. If return flexibility matters for your purchase, confirm eligibility before checkout.',
            ],
          },
        ],
        relatedSlugs: [
          'returns-policy-overview',
          'damaged-or-wrong-item',
          'product-listings-explained',
        ],
      },
    ],
  },

  {
    id: 'payments',
    title: 'Payments',
    description:
      'Razorpay checkout, Cash on Delivery, payment failures, and refunds to source.',
    icon: 'CreditCard',
    articles: [
      {
        slug: 'payment-methods-razorpay-cod',
        title: 'Payment methods: Razorpay and COD',
        summary:
          'Pay online via Razorpay instruments or choose Cash on Delivery when your order qualifies.',
        sections: [
          {
            heading: 'Razorpay (prepaid)',
            paragraphs: [
              'Online checkout is powered by Razorpay. Depending on what Razorpay offers for your payment, you may use UPI, credit/debit cards, netbanking, or supported wallets — all charged in INR.',
            ],
          },
          {
            heading: 'Cash on Delivery',
            bullets: [
              'Available only when every relevant seller and your pincode allow COD',
              'Pay the courier the amount due for that delivery in cash (or as the courier accepts)',
              'COD may carry an extra fee or order-value limits',
              'Some high-value or restricted items may be prepaid-only',
            ],
          },
          {
            heading: 'Multi-seller payments',
            paragraphs: [
              'You still pay once at checkout for the full parent order. Behind the scenes, settlement with individual sellers is handled by the marketplace — you do not pay each seller separately.',
            ],
          },
          {
            heading: 'Security',
            paragraphs: [
              'Card and UPI credentials are entered on Razorpay’s secure flow. Ink & Brass does not ask you to share OTPs, card PINs, or UPI PINs over phone or email.',
            ],
          },
        ],
        relatedSlugs: [
          'payment-pending-or-failed',
          'shipping-charges-explained',
          'refunds-timelines-and-methods',
        ],
      },
      {
        slug: 'payment-pending-or-failed',
        title: 'Payment pending or failed',
        summary:
          'What to do when checkout fails, stays pending, or money leaves your account without an order.',
        sections: [
          {
            heading: 'Failed at checkout',
            paragraphs: [
              'If Razorpay reports failure, no successful order should be created. You can retry with the same or another method. Check that your bank allows online merchant payments and that UPI limits are not exceeded.',
            ],
          },
          {
            heading: 'Pending payment',
            bullets: [
              'Some bank authorisations take a short time to confirm',
              'Avoid rapid repeated payments for the same cart',
              'Refresh Orders after a few minutes before trying again',
            ],
          },
          {
            heading: 'Amount deducted, order missing',
            paragraphs: [
              'Banks sometimes show a debit while payment capture is still resolving. Wait for the confirmation window noted in checkout messaging, then verify Orders. If nothing appears, contact support with Payments topic, Razorpay/bank reference, amount, and time.',
            ],
          },
          {
            heading: 'COD not offered',
            paragraphs: [
              'If COD is missing, your pincode, cart value, or a seller in the cart may disallow it. Remove restricted items or pay prepaid to continue.',
            ],
          },
        ],
        relatedSlugs: [
          'order-confirmation-and-emails',
          'payment-methods-razorpay-cod',
          'contact-support',
        ],
      },
      {
        slug: 'invoices-and-gst',
        title: 'Invoices and GST',
        summary:
          'How invoicing works with multiple sellers and light guidance on GST on invoices.',
        sections: [
          {
            heading: 'Who issues the invoice',
            paragraphs: [
              'On a multi-vendor marketplace, invoices are typically issued per seller for the items they fulfilled. Your order detail page is the starting point for retrieving available invoice documents.',
            ],
          },
          {
            heading: 'GST on invoices',
            paragraphs: [
              'Where GST applies, seller invoices may show GSTIN and tax breakups as required. Ink & Brass surfaces seller-provided documents; for GST credit eligibility, follow your tax advisor’s guidance and the invoice contents.',
            ],
          },
          {
            heading: 'Business purchases',
            paragraphs: [
              'If you need a specific billing name or GSTIN on invoices, check whether checkout or profile supports billing details before you pay. Not all sellers can revise invoices after dispatch.',
            ],
          },
          {
            heading: 'Missing invoice',
            paragraphs: [
              'Allow time after delivery for invoices to generate. If still unavailable, contact support with Orders topic and the seller name so we can follow up.',
            ],
          },
        ],
        relatedSlugs: [
          'view-and-understand-orders',
          'how-multi-seller-orders-work',
          'selling-gst-and-compliance',
        ],
      },
      {
        slug: 'promotions-and-pricing',
        title: 'Promotions and pricing',
        summary:
          'Coupons, sale prices, and how discounts apply across multi-seller carts.',
        sections: [
          {
            heading: 'Listed vs payable price',
            paragraphs: [
              'The amount due is confirmed on the checkout summary, including item discounts, shipping, and any COD fee. Taxes included in list prices are reflected according to each listing.',
            ],
          },
          {
            heading: 'Coupons and offers',
            bullets: [
              'Enter coupon codes at checkout when a field is available',
              'Offers may exclude certain sellers, categories, or payment methods',
              'One coupon per order unless a promotion explicitly stacks',
              'Expired or ineligible codes show an error — remove them to continue',
            ],
          },
          {
            heading: 'Price changes',
            paragraphs: [
              'Sellers can update prices. The price locked at successful payment is what you pay for that order. Wishlist or earlier page views may show outdated amounts until refresh.',
            ],
          },
          {
            heading: 'Fair pricing concerns',
            paragraphs: [
              'If a checkout total does not match the summary you agreed to at pay time, do not complete a second payment. Contact support with Payments topic and details.',
            ],
          },
        ],
        relatedSlugs: [
          'placing-your-first-order',
          'payment-methods-razorpay-cod',
          'shipping-charges-explained',
        ],
      },
    ],
  },

  {
    id: 'products-reviews',
    title: 'Products & reviews',
    description:
      'Listings, variants, ratings, and how reviews help other shoppers.',
    icon: 'BookOpen',
    articles: [
      {
        slug: 'product-listings-explained',
        title: 'Product listings explained',
        summary:
          'How to read titles, variants, seller info, shipping notes, and return badges.',
        sections: [
          {
            heading: 'Core listing elements',
            bullets: [
              'Title and images provided by the seller',
              'Price in INR and any discount display',
              'Variant selectors (size, colour, configuration)',
              'Seller name and link to more of their catalogue',
              'Return eligibility hints and shipping guidance when present',
            ],
          },
          {
            heading: 'Descriptions and specifications',
            paragraphs: [
              'Read the full description for materials, dimensions, care, and inclusions. Specifications help confirm fit and compatibility before you add to cart.',
            ],
          },
          {
            heading: 'Stock and fulfilment',
            paragraphs: [
              'Availability is seller-managed. “In stock” at browse time is revalidated at checkout. Handling time affects how quickly a shipment is created after you pay.',
            ],
          },
          {
            heading: 'Report a listing issue',
            paragraphs: [
              'If a listing appears misleading or prohibited, contact support with Products topic and the product URL or name. Do not rely on reviews alone for safety-critical claims.',
            ],
          },
        ],
        relatedSlugs: [
          'finding-products-and-sellers',
          'writing-and-reading-reviews',
          'non-returnable-items',
        ],
      },
      {
        slug: 'writing-and-reading-reviews',
        title: 'Writing and reading reviews',
        summary:
          'When you can review, what makes a helpful review, and how ratings are shown.',
        sections: [
          {
            heading: 'Who can review',
            paragraphs: [
              'Reviews are generally available after you purchase and receive an item, subject to platform rules. This helps keep feedback tied to real orders.',
            ],
          },
          {
            heading: 'Writing a useful review',
            bullets: [
              'Describe fit, quality, and whether the item matched the listing',
              'Mention shipping experience only when relevant to the product decision',
              'Stay factual; avoid personal attacks on sellers',
              'Do not include phone numbers, addresses, or other private data',
            ],
          },
          {
            heading: 'Reading reviews',
            paragraphs: [
              'Consider recent reviews, photo evidence, and whether reviewers mention the same variant you plan to buy. A small number of reviews means limited signal.',
            ],
          },
          {
            heading: 'Moderation',
            paragraphs: [
              'Reviews that violate policy (hate, spam, irrelevant promo, private data) may be removed. Contact support if you need to report abusive content.',
            ],
          },
        ],
        relatedSlugs: [
          'product-listings-explained',
          'report-a-seller-or-listing',
          'view-and-understand-orders',
        ],
      },
      {
        slug: 'variants-stock-and-availability',
        title: 'Variants, stock, and availability',
        summary:
          'Choosing the right variant and understanding out-of-stock or limited inventory.',
        sections: [
          {
            heading: 'Select variants carefully',
            paragraphs: [
              'Size, colour, and other options can change price and stock. Confirm the selected variant on the product page before adding to cart — returns for “wrong size chosen” follow normal return eligibility.',
            ],
          },
          {
            heading: 'Out of stock',
            paragraphs: [
              'When a variant is unavailable, wait for restock or choose another option. We do not guarantee restock dates unless a seller explicitly provides one.',
            ],
          },
          {
            heading: 'Cart reservations',
            paragraphs: [
              'Items in your cart are not always reserved indefinitely. Stock can sell out before you pay; checkout will notify you if something is no longer available.',
            ],
          },
          {
            heading: 'Bundle or multi-item listings',
            paragraphs: [
              'If a listing sells a set, check whether pieces are sold separately elsewhere. Return rules may treat the set as a single line item.',
            ],
          },
        ],
        relatedSlugs: [
          'placing-your-first-order',
          'request-a-return',
          'product-listings-explained',
        ],
      },
      {
        slug: 'report-a-seller-or-listing',
        title: 'Report a seller or listing',
        summary:
          'How to flag policy concerns while keeping your order and payment details handy.',
        sections: [
          {
            heading: 'When to report',
            bullets: [
              'Suspected counterfeit or prohibited items',
              'Grossly misleading photos or descriptions',
              'Harassment or inappropriate communication',
              'Policy abuse such as forcing off-platform payment',
            ],
          },
          {
            heading: 'What to include',
            paragraphs: [
              'Send the product link or name, seller name, order ID if you purchased, screenshots, and a calm factual summary. Use the Sellers or Products contact topic as appropriate.',
            ],
          },
          {
            heading: 'Orders already placed',
            paragraphs: [
              'Reporting a listing does not automatically cancel or refund an order. Use cancellation or returns flows in parallel when you need a commercial remedy.',
            ],
          },
          {
            heading: 'Off-platform transactions',
            paragraphs: [
              'Complete payment only through Ink & Brass checkout. Off-platform deals are unsupported and risky; report sellers who pressure you to pay elsewhere.',
            ],
          },
        ],
        relatedSlugs: [
          'buyer-protection-basics',
          'contact-support',
          'payment-methods-razorpay-cod',
        ],
      },
    ],
  },

  {
    id: 'selling',
    title: 'Selling on the marketplace',
    description:
      'Seller onboarding, catalogue, orders, and fulfilment expectations for merchants.',
    icon: 'Store',
    articles: [
      {
        slug: 'become-a-seller',
        title: 'Become a seller',
        summary:
          'Overview of applying to sell on Ink & Brass and what approval involves.',
        sections: [
          {
            heading: 'Who can sell',
            paragraphs: [
              'Independent merchants who can fulfil orders within India may apply to sell on Ink & Brass, subject to onboarding checks and marketplace policies.',
            ],
          },
          {
            heading: 'Application basics',
            bullets: [
              'Business and contact details',
              'Tax identifiers such as GSTIN where applicable',
              'Bank account information for settlements',
              'Agreement to seller terms and fulfilment standards',
            ],
          },
          {
            heading: 'After approval',
            paragraphs: [
              'Approved sellers access the seller portal to manage catalogue, inventory, orders, and returns. Keep business details current to avoid payout or compliance delays.',
            ],
          },
          {
            heading: 'Buyers vs sellers',
            paragraphs: [
              'A seller account is distinct from shopping as a customer. Use the correct portal for each role. Support can help route you if you are unsure which login to use.',
            ],
          },
        ],
        relatedSlugs: [
          'seller-orders-and-shipping',
          'selling-gst-and-compliance',
          'seller-returns-handling',
        ],
      },
      {
        slug: 'seller-orders-and-shipping',
        title: 'Seller orders and shipping',
        summary:
          'How sellers process their portion of a multi-vendor order and hand over to couriers.',
        sections: [
          {
            heading: 'Your slice of a buyer order',
            paragraphs: [
              'When a buyer’s cart includes multiple merchants, each seller sees and fulfils only their line items. Timely acceptance, packing, and dispatch protect your metrics and the buyer experience.',
            ],
          },
          {
            heading: 'Fulfilment checklist',
            bullets: [
              'Confirm stock before accepting or processing',
              'Pack securely with accurate packing slips where required',
              'Generate or attach shipment labels per portal instructions',
              'Hand over to the courier and ensure tracking syncs to the order',
            ],
          },
          {
            heading: 'Pincode and serviceability',
            paragraphs: [
              'Buyers enter destination pincodes at checkout. Configure shipping rules so rates and serviceability stay accurate; incorrect rules cause failed checkouts or delivery issues.',
            ],
          },
          {
            heading: 'Delays',
            paragraphs: [
              'If you cannot ship on time, update the order in the portal and communicate per platform guidelines. Extended silence often leads to cancellations and support escalations.',
            ],
          },
        ],
        relatedSlugs: [
          'become-a-seller',
          'seller-returns-handling',
          'how-multi-seller-orders-work',
        ],
      },
      {
        slug: 'seller-returns-handling',
        title: 'Seller returns handling',
        summary:
          'Approve or reject return requests, receive reverse pickups, and close refund loops.',
        sections: [
          {
            heading: 'Item-level requests',
            paragraphs: [
              'Buyers raise returns against specific items you sold. Review reason codes and photos promptly so eligible returns move to pickup without unnecessary delay.',
            ],
          },
          {
            heading: 'Quality checks',
            bullets: [
              'Inspect returned goods against the stated reason',
              'Document condition if you dispute a claim',
              'Follow platform timelines for approval and refund initiation',
            ],
          },
          {
            heading: 'Refunds and settlements',
            paragraphs: [
              'Refunds to buyers follow marketplace payment rules (Razorpay prepaid vs COD). Settlements with you are adjusted according to seller agreements when returns complete.',
            ],
          },
          {
            heading: 'Reduce return rates',
            paragraphs: [
              'Accurate photos, sizing charts, and honest descriptions reduce avoidable returns. Clear handling times set better buyer expectations for multi-seller deliveries.',
            ],
          },
        ],
        relatedSlugs: [
          'returns-policy-overview',
          'seller-orders-and-shipping',
          'selling-gst-and-compliance',
        ],
      },
      {
        slug: 'selling-gst-and-compliance',
        title: 'GST and seller compliance',
        summary:
          'Light-touch guidance on GST mentions, invoices, and keeping seller information current.',
        sections: [
          {
            heading: 'Tax identifiers',
            paragraphs: [
              'Provide valid GSTIN or other required identifiers during onboarding when applicable. Incorrect tax details can block invoicing or payouts.',
            ],
          },
          {
            heading: 'Invoicing buyers',
            paragraphs: [
              'Issue invoices that match fulfilled items and applicable tax. Buyers on multi-seller orders may receive separate invoices from each merchant.',
            ],
          },
          {
            heading: 'Prohibited listings',
            paragraphs: [
              'Do not list goods restricted by law or marketplace policy. Violations can lead to listing removal or account action.',
            ],
          },
          {
            heading: 'This is not tax advice',
            paragraphs: [
              'Ink & Brass help content explains marketplace mechanics only. Consult a qualified tax professional for GST registration, filing, and input credit decisions.',
            ],
          },
        ],
        relatedSlugs: [
          'become-a-seller',
          'invoices-and-gst',
          'buyer-protection-basics',
        ],
      },
    ],
  },

  {
    id: 'privacy-data',
    title: 'Privacy & data',
    description:
      'What we collect, how it is used for orders, and your export or deletion options.',
    icon: 'Shield',
    articles: [
      {
        slug: 'data-we-collect-and-why',
        title: 'Data we collect and why',
        summary:
          'Account, order, delivery, and payment-related data needed to run the marketplace.',
        sections: [
          {
            heading: 'Account data',
            paragraphs: [
              'We store profile details you provide — such as name, email, phone, and addresses — so you can sign in, checkout, and receive delivery updates.',
            ],
          },
          {
            heading: 'Order and fulfilment data',
            bullets: [
              'Items purchased, sellers involved, and order statuses',
              'Shipping addresses and phone numbers shared with fulfilment partners',
              'Return requests and related correspondence',
              'Support tickets you submit through Help',
            ],
          },
          {
            heading: 'Payments',
            paragraphs: [
              'Online payments are processed by Razorpay. We receive payment status and references needed for orders and refunds; we do not store full card numbers on Ink & Brass servers.',
            ],
          },
          {
            heading: 'Sellers and couriers',
            paragraphs: [
              'To deliver multi-seller orders, necessary address and contact details are shared with the fulfilling seller and courier partners. Limit optional data in address lines to what is required for delivery.',
            ],
          },
        ],
        relatedSlugs: [
          'export-or-delete-your-data',
          'buyer-protection-basics',
          'manage-profile-and-addresses',
        ],
      },
      {
        slug: 'export-or-delete-your-data',
        title: 'Export or delete your data',
        summary:
          'How to request an account data export or account deletion from your profile tools.',
        sections: [
          {
            heading: 'Data export',
            paragraphs: [
              'Where available in Profile privacy settings, you can request an export of your account data. Processing may take time; you will be notified when the export is ready according to the product flow.',
            ],
          },
          {
            heading: 'Account deletion',
            paragraphs: [
              'Account deletion removes or anonymises personal data that is no longer required, subject to legal and operational retention (for example, completed order records needed for tax, dispute, or fraud prevention).',
            ],
          },
          {
            heading: 'Before you delete',
            bullets: [
              'Download any invoices you may need later',
              'Complete or cancel open orders and returns',
              'Understand that seller payouts and financial records may retain necessary transaction data',
            ],
          },
          {
            heading: 'Need help',
            paragraphs: [
              'If privacy tools are unavailable or fail, contact support with Account topic and describe whether you need export or deletion. Verify your identity using the email on the account.',
            ],
          },
        ],
        relatedSlugs: [
          'data-we-collect-and-why',
          'password-and-login-security',
          'contact-support',
        ],
      },
      {
        slug: 'buyer-protection-basics',
        title: 'Buyer protection basics',
        summary:
          'Practical steps that keep payments, personal data, and deliveries safer.',
        sections: [
          {
            heading: 'Stay on-platform',
            paragraphs: [
              'Pay only through Ink & Brass checkout (Razorpay or eligible COD). Do not share OTPs or transfer money to personal UPI IDs provided in chat.',
            ],
          },
          {
            heading: 'Protect personal information',
            bullets: [
              'Do not post addresses or phone numbers in public reviews',
              'Use strong unique passwords',
              'Beware of phishing links claiming package problems',
              'Share AWB numbers only with trusted parties',
            ],
          },
          {
            heading: 'Delivery safety',
            paragraphs: [
              'Prefer OTP-based delivery confirmation when couriers offer it. If a package is marked delivered but missing, report it quickly under Shipping.',
            ],
          },
          {
            heading: 'Disputes',
            paragraphs: [
              'Use returns and support channels with clear evidence. Chargebacks may be appropriate in limited cases after platform investigation — provide order and payment references when asked.',
            ],
          },
        ],
        relatedSlugs: [
          'password-and-login-security',
          'report-a-seller-or-listing',
          'damaged-or-wrong-item',
        ],
      },
      {
        slug: 'cookies-and-communications',
        title: 'Cookies and communications',
        summary:
          'How session and preference storage supports login, cart, and essential messages.',
        sections: [
          {
            heading: 'Essential site function',
            paragraphs: [
              'We use cookies or similar storage for sign-in sessions, cart continuity, and security. Without them, checkout and account features may not work reliably.',
            ],
          },
          {
            heading: 'Communications',
            paragraphs: [
              'Transactional emails and messages about orders, shipments, returns, and security are part of operating your purchases. Marketing preferences are managed separately in Profile when offered.',
            ],
          },
          {
            heading: 'Third parties',
            paragraphs: [
              'Payment (Razorpay) and courier partners process data needed for their services under their own policies in addition to ours.',
            ],
          },
          {
            heading: 'Questions',
            paragraphs: [
              'For privacy questions not covered here, contact support with Account topic or refer to the full privacy policy linked in the site footer when published.',
            ],
          },
        ],
        relatedSlugs: [
          'notification-preferences',
          'data-we-collect-and-why',
          'export-or-delete-your-data',
        ],
      },
    ],
  },

  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description:
      'Fix common issues with login, checkout, tracking, emails, and contact support.',
    icon: 'Wrench',
    articles: [
      {
        slug: 'checkout-and-cart-problems',
        title: 'Checkout and cart problems',
        summary:
          'Cart empties, address errors, pincode blocks, and stuck payment screens.',
        sections: [
          {
            heading: 'Cart unexpected changes',
            bullets: [
              'Sign in to sync cart across devices',
              'Out-of-stock items may be removed at checkout',
              'Try refreshing once; avoid duplicate tabs competing for the same cart',
            ],
          },
          {
            heading: 'Address or pincode errors',
            paragraphs: [
              'Ensure the pincode matches the city and state. Invalid or non-serviceable pincodes block shipping calculation. Edit the address and retry.',
            ],
          },
          {
            heading: 'Stuck on Razorpay',
            paragraphs: [
              'If the payment window hangs, close it and check Orders before paying again. Use a stable network; disable VPN if bank pages fail to load.',
            ],
          },
          {
            heading: 'Mixed COD eligibility',
            paragraphs: [
              'A single non-COD item or seller in a multi-seller cart can remove COD for the whole checkout. Pay prepaid or remove the restricting item.',
            ],
          },
        ],
        relatedSlugs: [
          'payment-pending-or-failed',
          'delivery-timelines-and-pincodes',
          'account-access-issues',
        ],
      },
      {
        slug: 'emails-not-received',
        title: 'Emails not received',
        summary:
          'Missing confirmations or reset links — filters, delays, and verification steps.',
        sections: [
          {
            heading: 'Quick checks',
            bullets: [
              'Spam, junk, and promotions folders',
              'Correct email on the account profile',
              'Delay of several minutes during peak load',
              'Corporate email rules blocking marketplace senders',
            ],
          },
          {
            heading: 'Password reset specifically',
            paragraphs: [
              'Request a new reset link if the previous one expired. Links are single-use and time-limited for security.',
            ],
          },
          {
            heading: 'Orders without email',
            paragraphs: [
              'An order can still exist under Orders even if email is delayed. Use the website as the source of truth, then contact support if both email and order history are missing after a successful payment.',
            ],
          },
          {
            heading: 'Still stuck',
            paragraphs: [
              'Contact support with Account or Orders topic, the email address you expect mail on, and approximate timing of the missing message.',
            ],
          },
        ],
        relatedSlugs: [
          'notification-preferences',
          'order-confirmation-and-emails',
          'account-access-issues',
        ],
      },
      {
        slug: 'tracking-and-status-mismatches',
        title: 'Tracking and status mismatches',
        summary:
          'When order status, courier scans, and what you received do not line up.',
        sections: [
          {
            heading: 'Shipped but no AWB',
            paragraphs: [
              'Sellers may mark processing as shipped shortly before the courier scan appears. Wait a short interval, then recheck. Persistent gaps warrant a Shipping support ticket with order ID.',
            ],
          },
          {
            heading: 'Delivered but not received',
            paragraphs: [
              'Check with household or building staff, then contact support immediately with AWB and order ID. Early reports improve recovery chances.',
            ],
          },
          {
            heading: 'One seller delivered, another has not',
            paragraphs: [
              'This is expected on multi-seller orders. Track each sub-order separately rather than assuming the parent order is complete.',
            ],
          },
          {
            heading: 'Return status unclear',
            paragraphs: [
              'Open My Returns for the latest state. If a reverse pickup was missed, request reschedule via support with Returns topic and return ID.',
            ],
          },
        ],
        relatedSlugs: [
          'track-your-order',
          'failed-delivery-attempts',
          'request-a-return',
        ],
      },
      {
        slug: 'contact-support',
        title: 'Contact support',
        summary:
          'How to reach Ink & Brass Help with the right topic, order ID, and clear details.',
        sections: [
          {
            heading: 'Before you write',
            bullets: [
              'Search this Help Centre for an existing answer',
              'Note your order ID, AWB, return ID, or payment reference',
              'Gather photos for damage or wrong-item cases',
              'Use the email on your account so we can verify you',
            ],
          },
          {
            heading: 'Choose the right topic',
            paragraphs: [
              'Pick ORDERS, SHIPPING, RETURNS, PAYMENTS, ACCOUNT, PRODUCTS, SELLERS, or OTHER so your request routes correctly. Accurate topics reduce back-and-forth.',
            ],
          },
          {
            heading: 'What to include in the message',
            paragraphs: [
              'State the problem in plain language, what you already tried, and the outcome you need (refund status, address change before ship, tracking investigation, etc.). Avoid sending passwords, OTPs, or full card numbers.',
            ],
          },
          {
            heading: 'Where to submit',
            paragraphs: [
              'Use the Contact page at /contact. For policy reading, see /returns. For open return cases, monitor /my-returns while you wait for a reply.',
            ],
          },
          {
            heading: 'Response expectations',
            paragraphs: [
              'We aim to respond in a clear, calm, and practical way. Complex courier or bank investigations can take longer than simple account questions. Reply to follow-up questions promptly so your case stays unblocked.',
            ],
          },
        ],
        relatedSlugs: [
          'view-and-understand-orders',
          'buyer-protection-basics',
          'payment-pending-or-failed',
        ],
      },
      {
        slug: 'app-and-browser-issues',
        title: 'Browser and device issues',
        summary:
          'Page errors, blank screens, and tips for a stable shopping session.',
        sections: [
          {
            heading: 'Basic fixes',
            bullets: [
              'Hard-refresh the page or try another browser',
              'Update your browser to a current version',
              'Disable conflicting extensions (ad blockers on checkout)',
              'Ensure cookies are allowed for the Ink & Brass domain',
            ],
          },
          {
            heading: 'Mobile browsers',
            paragraphs: [
              'If layout or payment sheets misbehave, try desktop or another mobile browser. Keep the OS WebView components updated on Android when using in-app browsers.',
            ],
          },
          {
            heading: 'Slow performance',
            paragraphs: [
              'Large catalogues and image-heavy pages need a stable connection. On slow networks, wait for checkout totals to finish calculating before paying.',
            ],
          },
          {
            heading: 'Report a bug',
            paragraphs: [
              'Contact support with OTHER or ACCOUNT topic, device/browser details, screenshots, and steps to reproduce. Include the URL where the issue occurs.',
            ],
          },
        ],
        relatedSlugs: [
          'checkout-and-cart-problems',
          'account-access-issues',
          'contact-support',
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Contact topics & quick links                                               */
/* -------------------------------------------------------------------------- */

export const CONTACT_TOPICS: HelpTopicOption[] = [
  { value: 'ORDERS', label: 'Orders' },
  { value: 'SHIPPING', label: 'Shipping & delivery' },
  { value: 'RETURNS', label: 'Returns & refunds' },
  { value: 'PAYMENTS', label: 'Payments' },
  { value: 'ACCOUNT', label: 'Account & security' },
  { value: 'PRODUCTS', label: 'Products & listings' },
  { value: 'SELLERS', label: 'Sellers & marketplace' },
  { value: 'OTHER', label: 'Other' },
];

export const HELP_QUICK_LINKS: HelpQuickLink[] = [
  {
    label: 'My orders',
    href: PATHS.orders,
    description: 'View order history, status, and tracking for each shipment.',
  },
  {
    label: 'Profile',
    href: PATHS.profile,
    description: 'Update personal details, addresses, and account preferences.',
  },
  {
    label: 'Returns policy',
    href: PATHS.returns,
    description: 'Read eligibility windows, conditions, and item-level return rules.',
  },
  {
    label: 'My returns',
    href: PATHS.myReturns,
    description: 'Track return requests, pickups, and refund progress.',
  },
  {
    label: 'Contact support',
    href: '/contact',
    description: 'Send a help request with the right topic and order details.',
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export function getAllArticles(): HelpArticle[] {
  return HELP_CATEGORIES.flatMap((category) => category.articles);
}

export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getCategoryById(id: HelpCategoryId): HelpCategory | undefined {
  return HELP_CATEGORIES.find((category) => category.id === id);
}

function sectionMatchesQuery(section: HelpSection, normalized: string): boolean {
  if (section.heading.toLowerCase().includes(normalized)) return true;
  if (section.paragraphs?.some((p) => p.toLowerCase().includes(normalized))) {
    return true;
  }
  if (section.bullets?.some((b) => b.toLowerCase().includes(normalized))) {
    return true;
  }
  return false;
}

export function searchHelp(query: string): HelpArticle[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getAllArticles().filter((article) => {
    if (article.title.toLowerCase().includes(normalized)) return true;
    if (article.summary.toLowerCase().includes(normalized)) return true;
    return article.sections.some((section) =>
      sectionMatchesQuery(section, normalized),
    );
  });
}
