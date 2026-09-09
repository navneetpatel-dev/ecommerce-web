import type { HelpCategory } from "../../types/help/help.types";

export const ACCOUNT_SECURITY_CATEGORY: HelpCategory = {
  id: "account-security",
  title: "Account & security",
  description:
    "Profile details, addresses, passwords, and keeping your Ink & Brass account safe.",
  icon: "UserRound",
  articles: [
    {
      slug: "manage-profile-and-addresses",
      title: "Manage profile and addresses",
      summary:
        "Update personal details, phone number, and saved delivery addresses with valid pincodes.",
      sections: [
        {
          heading: "Profile information",
          paragraphs: [
            "Open Profile to update your display name, contact email (where editable), and phone number. Keep these accurate so order and delivery communications reach you.",
          ],
        },
        {
          heading: "Saved addresses",
          bullets: [
            "Add home, work, or other addresses you use often",
            "Each address needs name, phone, line details, city, state, and pincode",
            "Set a default address for faster checkout",
            "Edit or remove outdated addresses so couriers are not sent to the wrong place",
          ],
        },
        {
          heading: "Pincode accuracy",
          paragraphs: [
            "An incorrect pincode can delay shipping, cause failed delivery attempts, or show wrong shipping charges. Double-check the pincode against your area before saving.",
          ],
        },
        {
          heading: "Avatar and preferences",
          paragraphs: [
            "Where available, you can upload a profile photo and adjust notification preferences for order updates and marketing. Transactional order emails are still sent for purchases and returns.",
          ],
        },
      ],
      relatedSlugs: [
        "password-and-login-security",
        "placing-your-first-order",
        "data-we-collect-and-why",
      ],
    },
    {
      slug: "password-and-login-security",
      title: "Password and login security",
      summary:
        "Protect your account with a strong password, careful login habits, and timely resets.",
      sections: [
        {
          heading: "Strong passwords",
          paragraphs: [
            "Use a long password that is unique to Ink & Brass. Prefer a passphrase or a password manager. Avoid names, birthdays, or reused credentials.",
          ],
        },
        {
          heading: "Signing in safely",
          bullets: [
            "Only sign in on the official Ink & Brass website",
            "Do not share your password or OTP with anyone, including people claiming to be support",
            "Sign out on shared or public devices after you finish",
            "Be cautious of phishing emails that mimic order alerts",
          ],
        },
        {
          heading: "Forgot password",
          paragraphs: [
            "Use Forgot password on the login page. We send a reset link or code to your registered email. Complete the reset promptly and then sign in with the new password.",
          ],
        },
        {
          heading: "Suspicious activity",
          paragraphs: [
            "If you notice orders you did not place or login alerts you do not recognise, change your password immediately and contact support under the Account topic with details.",
          ],
        },
      ],
      relatedSlugs: [
        "manage-profile-and-addresses",
        "export-or-delete-your-data",
        "contact-support",
      ],
    },
    {
      slug: "notification-preferences",
      title: "Notification preferences",
      summary:
        "Control which updates you receive while still getting essential order and return messages.",
      sections: [
        {
          heading: "Types of messages",
          bullets: [
            "Order and payment confirmations",
            "Shipment and delivery updates",
            "Return and refund status changes",
            "Optional promotional or product updates, when enabled",
          ],
        },
        {
          heading: "What you can turn off",
          paragraphs: [
            "Marketing and non-essential notifications can usually be disabled in Profile. Transactional messages required to complete purchases, deliveries, and refunds remain enabled.",
          ],
        },
        {
          heading: "SMS and calls from couriers",
          paragraphs: [
            "Courier partners may SMS or call the phone number on your shipping label. That contact is for delivery coordination and is separate from Ink & Brass marketing preferences.",
          ],
        },
        {
          heading: "Email not arriving",
          paragraphs: [
            "Check spam or promotions folders and ensure your profile email is correct. Corporate filters sometimes block marketplace mail; whitelist our domain if needed.",
          ],
        },
      ],
      relatedSlugs: [
        "manage-profile-and-addresses",
        "track-your-order",
        "emails-not-received",
      ],
    },
    {
      slug: "account-access-issues",
      title: "Account access issues",
      summary:
        "Cannot sign in, locked out, or email already registered — practical next steps.",
      sections: [
        {
          heading: "Login fails",
          bullets: [
            "Confirm you are using the email you registered with",
            "Check Caps Lock and try resetting the password",
            "Clear cached session data or try a private browser window",
            "Disable aggressive blockers that may interfere with login forms",
          ],
        },
        {
          heading: "Email already in use",
          paragraphs: [
            "If sign-up says the email is taken, try logging in or use password reset. You cannot create a second buyer account with the same email.",
          ],
        },
        {
          heading: "Session expired mid-checkout",
          paragraphs: [
            "Sign in again and reopen your cart. Payment that did not complete will not create a paid order; verify under Orders before paying twice.",
          ],
        },
        {
          heading: "When to contact support",
          paragraphs: [
            "If reset emails never arrive or you believe your account was compromised, contact us with the Account topic. Include the email on the account and a clear description — never send passwords.",
          ],
        },
      ],
      relatedSlugs: [
        "password-and-login-security",
        "payment-pending-or-failed",
        "contact-support",
      ],
    },
  ],
};
