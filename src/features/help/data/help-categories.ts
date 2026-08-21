/**
 * Ink & Brass Help Centre — category registry.
 */

import type { HelpCategory } from "./help-types";
import { GETTING_STARTED_CATEGORY } from "./categories/getting-started";
import { ACCOUNT_SECURITY_CATEGORY } from "./categories/account-security";
import { ORDERS_TRACKING_CATEGORY } from "./categories/orders-tracking";
import { SHIPPING_DELIVERY_CATEGORY } from "./categories/shipping-delivery";
import { RETURNS_REFUNDS_CATEGORY } from "./categories/returns-refunds";
import { PAYMENTS_CATEGORY } from "./categories/payments";
import { PRODUCTS_REVIEWS_CATEGORY } from "./categories/products-reviews";
import { SELLING_CATEGORY } from "./categories/selling";
import { PRIVACY_DATA_CATEGORY } from "./categories/privacy-data";
import { TROUBLESHOOTING_CATEGORY } from "./categories/troubleshooting";

export const HELP_CATEGORIES: HelpCategory[] = [
  GETTING_STARTED_CATEGORY,
  ACCOUNT_SECURITY_CATEGORY,
  ORDERS_TRACKING_CATEGORY,
  SHIPPING_DELIVERY_CATEGORY,
  RETURNS_REFUNDS_CATEGORY,
  PAYMENTS_CATEGORY,
  PRODUCTS_REVIEWS_CATEGORY,
  SELLING_CATEGORY,
  PRIVACY_DATA_CATEGORY,
  TROUBLESHOOTING_CATEGORY,
];
