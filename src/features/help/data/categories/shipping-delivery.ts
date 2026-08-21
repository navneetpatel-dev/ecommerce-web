import type { HelpCategory } from "../help-types";
import { SHIPPING_DELIVERY_RATES_ARTICLES } from "./shipping-delivery-rates";
import { SHIPPING_DELIVERY_ISSUES_ARTICLES } from "./shipping-delivery-issues";

export const SHIPPING_DELIVERY_CATEGORY: HelpCategory = {
  id: "shipping-delivery",
  title: "Shipping & delivery",
  description:
    "Pincodes, timelines, split shipments, and what to do when delivery fails.",
  icon: "Truck",
  articles: [
    ...SHIPPING_DELIVERY_RATES_ARTICLES,
    ...SHIPPING_DELIVERY_ISSUES_ARTICLES,
  ],
};
