// Admin Dashboard feature — public API
export {
  useAdminDashboard,
  usePendingVendors,
  usePendingProducts,
  useAdminCoupons,
  useAdminAnalytics,
} from "./api/analytics/admin.queries";
export { adminApi } from "./api/analytics/admin.api";
export { commissionsApi, type CommissionInvoiceEntry } from "./api/finance/finance.api";
export { reportsApi, type VendorReportSummary } from "./api/finance/reports.api";
export {
  CouponSchema,
  VENDOR_COUPON_FORM_DEFAULTS,
  toCouponCreateBody,
  type CouponFormInput,
} from "./schemas/coupons/coupons.schema";
export { CreateCouponForm } from "./components/coupons/CreateCouponForm.component";
export { AdminConfirmAction } from "./components/shared/AdminConfirmAction.component";
export { AdminHomePage } from "./pages/analytics/AdminHomePage.page";
export { AdminAnalyticsPage } from "./pages/analytics/AdminAnalyticsPage.page";
export { AdminAuditPage } from "./pages/audit/AdminAuditPage.page";
export { AdminCategoriesPage } from "./pages/categories/AdminCategoriesPage.page";
export { AdminCouponsPage } from "./pages/coupons/AdminCouponsPage.page";
export { AdminFinancePage } from "./pages/finance/AdminFinancePage.page";
export { AdminOrdersPage } from "./pages/orders/AdminOrdersPage.page";
export { AdminProductsPage } from "./pages/vendors/AdminProductsPage.page";
export { AdminInventoryPage } from "./pages/inventory/AdminInventoryPage.page";
export { AdminDeliveryAgentsPage } from "./pages/delivery-agents/AdminDeliveryAgentsPage.page";
export { AdminNotificationsPage } from "./pages/notifications/AdminNotificationsPage.page";
export { AdminPromoBannersPage } from "./pages/promo-banners/AdminPromoBannersPage.page";
export { AdminReturnsPage } from "./pages/returns/AdminReturnsPage.page";
export { AdminReviewsPage } from "./pages/reviews/AdminReviewsPage.page";
export { AdminShippingPage } from "./pages/shipping/AdminShippingPage.page";
export { AdminTaxPage } from "./pages/tax/AdminTaxPage.page";
export { AdminUsersPage } from "./pages/users/AdminUsersPage.page";
export { AdminUserDetailPage } from "./pages/users/AdminUserDetailPage.page";
export { AdminVendorsPage } from "./pages/vendors/AdminVendorsPage.page";
export { AdminVendorDetailPage } from "./pages/vendors/AdminVendorDetailPage.page";
export { PlatformSettingsPage } from "./pages/settings/PlatformSettingsPage.page";
export { AdminWebVitalsPage } from "./pages/web-vitals/AdminWebVitalsPage.page";
export { AdminRolesPage } from "./pages/roles/AdminRolesPage.page";
