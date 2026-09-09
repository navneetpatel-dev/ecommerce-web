// Support Tickets feature — public API
//
// Owns the customer/vendor/admin support-ticket workflow: data access
// (supportTickets.api, supportTickets.queries), ticket lists, filters,
// threads, creation forms, attachment uploading, the auth gate that protects
// support surfaces, field limits and label helpers, and the role-specific
// pages (customer list/new/detail, vendor list/detail, admin list/detail)
// rendered by the storefront support and workspace dashboard ticket routes.
export { CustomerTicketsPage } from "./pages/customer/CustomerTicketsPage.page";
export { CustomerNewTicketPage } from "./pages/customer/CustomerNewTicketPage.page";
export { CustomerTicketDetailPage } from "./pages/customer/CustomerTicketDetailPage.page";
export { VendorTicketsPage } from "./pages/vendor/VendorTicketsPage.page";
export { VendorTicketDetailPage } from "./pages/vendor/VendorTicketDetailPage.page";
export { AdminTicketsPage } from "./pages/admin/AdminTicketsPage.page";
export { AdminTicketDetailPage } from "./pages/admin/AdminTicketDetailPage.page";
export { SupportAuthGate } from "./components/list/SupportAuthGate.component";
export { TicketAttachmentUploader } from "./components/form/TicketAttachmentUploader/index";
export { BugAttachmentUploader } from "./components/form/TicketAttachmentUploader/index";
export type { UploadedMediaAttachment } from "./components/form/TicketAttachmentUploader/index";
