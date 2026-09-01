/** Frontend API path builders — must stay aligned with backend mounts under `/api`. */
import { authRoutes } from "./auth.routes";
import { usersMeRoutes, usersRoutes } from "./users.routes.hook";
import { categoriesRoutes, productsRoutes } from "./catalog.routes";
import { vendorDocsRoutes, vendorsRoutes } from "./vendors.routes";
import {
  cartRoutes,
  checkoutRoutes,
  wishlistRoutes,
} from "./cartCheckout.routes";
import {
  ordersRoutes,
  returnsRoutes,
  reviewsRoutes,
  shippingRoutes,
  subordersRoutes,
  taxRoutes,
} from "./orders.routes";
import {
  commissionsRoutes,
  couponsRoutes,
  payoutsRoutes,
  walletRoutes,
  walletAdminRoutes,
} from "./finance.routes";
import {
  adminRoutes,
  auditRoutes,
  homepageRoutes,
  inventoryRoutes,
  notificationsRoutes,
  reportsRoutes,
  settingsRoutes,
  uploadsRoutes,
} from "./admin.routes";
import { newsletterRoutes, searchRoutes } from "./discovery.routes";
import { bugReportsRoutes, supportTicketsRoutes } from "./support.routes";

export const API = {
  auth: authRoutes,
  users: usersRoutes,
  usersMe: usersMeRoutes,
  products: productsRoutes,
  categories: categoriesRoutes,
  vendors: vendorsRoutes,
  vendorDocs: vendorDocsRoutes,
  cart: cartRoutes,
  checkout: checkoutRoutes,
  wishlist: wishlistRoutes,
  orders: ordersRoutes,
  suborders: subordersRoutes,
  returns: returnsRoutes,
  reviews: reviewsRoutes,
  shipping: shippingRoutes,
  tax: taxRoutes,
  wallet: walletRoutes,
  walletAdmin: walletAdminRoutes,
  commissions: commissionsRoutes,
  payouts: payoutsRoutes,
  coupons: couponsRoutes,
  admin: adminRoutes,
  audit: auditRoutes,
  reports: reportsRoutes,
  settings: settingsRoutes,
  homepage: homepageRoutes,
  notifications: notificationsRoutes,
  inventory: inventoryRoutes,
  uploads: uploadsRoutes,
  search: searchRoutes,
  newsletter: newsletterRoutes,
  supportTickets: supportTicketsRoutes,
  bugReports: bugReportsRoutes,
} as const;
