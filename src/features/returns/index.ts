// Returns feature — public API
//
// Owns order returns: the returns API client and React Query hooks
// (list my returns, create a return), the return timeline helper, and the
// customer-facing MyReturnsPage rendered by the storefront returns route.
// Its query hooks and API client are also consumed by the orders feature to
// let customers start a return from an order.
export { MyReturnsPage } from "./pages/list/MyReturnsPage.page";
export { MyReturnDetailPage } from "./pages/detail/MyReturnDetailPage.page";
export { returnsApi } from "./api/returns/returns.api";
export { useCreateReturn, useReturn } from "./api/returns/returns.queries";
