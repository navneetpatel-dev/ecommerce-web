/** Mirrors CONTACT_TOPICS in the API (backend/src/modules/contact/contact.dto.ts). */
export const CONTACT_TOPICS = [
  { value: "ORDER", label: "Order help" },
  { value: "RETURNS", label: "Returns & refunds" },
  { value: "PAYMENT", label: "Payments" },
  { value: "ACCOUNT", label: "My account" },
  { value: "SELLER", label: "Selling on Marketplace" },
  { value: "FEEDBACK", label: "Feedback" },
  { value: "OTHER", label: "Something else" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

/** Length limits the API enforces. */
export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 120,
  subjectMin: 3,
  subjectMax: 200,
  messageMin: 10,
  messageMax: 5000,
} as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
