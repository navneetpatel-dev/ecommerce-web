// Admin Dashboard feature — public API
export {
  useAdminDashboard,
  usePendingVendors,
  usePendingProducts,
  useAdminCoupons,
  useAdminAnalytics,
} from "./api/admin.queries";
export { adminApi } from "./api/admin.api";
export { reportsApi, type VendorReportSummary } from "./api/reports.api";
export {
  CouponSchema,
  VENDOR_COUPON_FORM_DEFAULTS,
  toCouponCreateBody,
  type CouponFormInput,
} from "./schemas/coupons.schema";
export { CreateCouponForm } from "./components/CreateCouponForm.component";
export { AdminConfirmAction } from "./components/AdminConfirmAction.component";
export { AdminHomePage } from "./pages/AdminHomePage.page";
export { AdminAnalyticsPage } from "./pages/AdminAnalyticsPage.page";
export { AdminAuditPage } from "./pages/AdminAuditPage.page";
export { AdminCategoriesPage } from "./pages/AdminCategoriesPage.page";
export { AdminCouponsPage } from "./pages/AdminCouponsPage.page";
export { AdminFinancePage } from "./pages/AdminFinancePage.page";
export { AdminOrdersPage } from "./pages/AdminOrdersPage.page";
export { AdminProductsPage } from "./pages/AdminProductsPage.page";
export { AdminInventoryPage } from "./pages/AdminInventoryPage.page";
export { AdminDeliveryAgentsPage } from "./pages/AdminDeliveryAgentsPage.page";
export { AdminNotificationsPage } from "./pages/AdminNotificationsPage.page";
export { AdminPromoBannersPage } from "./pages/AdminPromoBannersPage.page";
export { AdminReturnsPage } from "./pages/AdminReturnsPage.page";
export { AdminReviewsPage } from "./pages/AdminReviewsPage.page";
export { AdminShippingPage } from "./pages/AdminShippingPage.page";
export { AdminTaxPage } from "./pages/AdminTaxPage.page";
export { AdminUsersPage } from "./pages/AdminUsersPage.page";
export { AdminUserDetailPage } from "./pages/AdminUserDetailPage.page";
export { AdminVendorsPage } from "./pages/AdminVendorsPage.page";
export { AdminVendorDetailPage } from "./pages/AdminVendorDetailPage.page";
export { PlatformSettingsPage } from "./pages/PlatformSettingsPage.page";
export { AdminWebVitalsPage } from "./pages/AdminWebVitalsPage.page";
export { AdminRolesPage } from "./pages/AdminRolesPage.page";
