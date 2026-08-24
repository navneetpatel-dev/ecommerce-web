// Support Tickets feature — public API
//
// Owns the customer/vendor/admin support-ticket workflow: data access
// (supportTickets.api, supportTickets.queries), ticket lists, filters,
// threads, creation forms, attachment uploading, the auth gate that protects
// support surfaces, field limits and label helpers, and the role-specific
// pages (customer list/new/detail, vendor list/detail, admin list/detail)
// rendered by the storefront support and workspace dashboard ticket routes.
export { CustomerTicketsPage } from "./pages/CustomerTicketsPage.page";
export { CustomerNewTicketPage } from "./pages/CustomerNewTicketPage.page";
export { CustomerTicketDetailPage } from "./pages/CustomerTicketDetailPage.page";
export { VendorTicketsPage } from "./pages/VendorTicketsPage.page";
export { VendorTicketDetailPage } from "./pages/VendorTicketDetailPage.page";
export { AdminTicketsPage } from "./pages/AdminTicketsPage.page";
export { AdminTicketDetailPage } from "./pages/AdminTicketDetailPage.page";
export { SupportAuthGate } from "./components/SupportAuthGate.component";
export { TicketAttachmentUploader } from "./components/TicketAttachmentUploader";
export { BugAttachmentUploader } from "./components/TicketAttachmentUploader";
export type { UploadedMediaAttachment } from "./components/TicketAttachmentUploader";
