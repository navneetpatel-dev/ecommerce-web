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
export { CreateCouponForm } from "./components/CreateCouponForm";
export { AdminConfirmAction } from "./components/AdminConfirmAction";
export { AdminHomePage } from "./pages/AdminHomePage";
export { AdminAnalyticsPage } from "./pages/AdminAnalyticsPage";
export { AdminAuditPage } from "./pages/AdminAuditPage";
export { AdminCategoriesPage } from "./pages/AdminCategoriesPage";
export { AdminCouponsPage } from "./pages/AdminCouponsPage";
export { AdminFinancePage } from "./pages/AdminFinancePage";
export { AdminOrdersPage } from "./pages/AdminOrdersPage";
export { AdminProductsPage } from "./pages/AdminProductsPage";
export { AdminPromoBannersPage } from "./pages/AdminPromoBannersPage";
export { AdminReturnsPage } from "./pages/AdminReturnsPage";
export { AdminReviewsPage } from "./pages/AdminReviewsPage";
export { AdminShippingPage } from "./pages/AdminShippingPage";
export { AdminTaxPage } from "./pages/AdminTaxPage";
export { AdminUsersPage } from "./pages/AdminUsersPage";
export { AdminVendorsPage } from "./pages/AdminVendorsPage";
export { PlatformSettingsPage } from "./pages/PlatformSettingsPage";
