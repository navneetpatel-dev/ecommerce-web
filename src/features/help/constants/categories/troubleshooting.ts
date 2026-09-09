import type { HelpCategory } from "../../types/help/help.types";
import { TROUBLESHOOTING_CHECKOUT_ARTICLES } from "./troubleshooting-checkout";
import { TROUBLESHOOTING_SUPPORT_ARTICLES } from "./troubleshooting-support";

export const TROUBLESHOOTING_CATEGORY: HelpCategory = {
  id: "troubleshooting",
  title: "Troubleshooting",
  description:
    "Fix common issues with login, checkout, tracking, emails, and contact support.",
  icon: "Wrench",
  articles: [
    ...TROUBLESHOOTING_CHECKOUT_ARTICLES,
    ...TROUBLESHOOTING_SUPPORT_ARTICLES,
  ],
};
