// Barrel for the folder's subparts. The entry component lives beside
// this folder as "../CreateTicketForm.component" — do not re-export it here, it
// imports subparts from this barrel (would be a circular module).
export { FormHeader } from "./FormHeader.component";
export { SubmitArea } from "./SubmitArea.component";
export { TicketAttachmentsSection } from "./SubmitArea.component";
export { TicketBasicsSection } from "./TicketBasicsSection.component";
export { TicketDescriptionSection } from "./TicketDescriptionSection.component";
export { TicketOrderSection } from "./TicketOrderSection.component";
export { TicketVendorSection } from "./TicketVendorSection.component";
export type { OrderVendorOption } from "./types";
export type { TicketField } from "./types";
export { useOrderVendors } from "./useOrderVendors.hook";
export { useSubmitTicket } from "./useSubmitTicket.hook";
export type { SubmitTicketOptions } from "./useSubmitTicket.hook";
export { useFetchOrdersPage } from "./useTicketPickerPages.hook";
export { useFetchVendorsPage } from "./useTicketPickerPages.hook";
export { buildTicketFieldErrors } from "./utils";
export { collectOrderVendors } from "./utils";
export { formatOrderOption } from "./utils";
