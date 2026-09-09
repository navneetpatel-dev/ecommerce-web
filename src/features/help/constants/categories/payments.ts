import type { HelpCategory } from "../../types/help/help.types";
import { PAYMENTS_CHECKOUT_ARTICLES } from "./payments-checkout";
import { PAYMENTS_BILLING_ARTICLES } from "./payments-billing";

export const PAYMENTS_CATEGORY: HelpCategory = {
  id: "payments",
  title: "Payments",
  description:
    "Razorpay checkout, Cash on Delivery, payment failures, and refunds to source.",
  icon: "CreditCard",
  articles: [...PAYMENTS_CHECKOUT_ARTICLES, ...PAYMENTS_BILLING_ARTICLES],
};
