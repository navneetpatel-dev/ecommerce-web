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
export type { OrderVendorOption } from "../../../types/form/types";
export type { TicketField } from "../../../types/form/types";
export { useOrderVendors } from "../../../hooks/form/useOrderVendors.hook";
export { useSubmitTicket } from "../../../hooks/form/useSubmitTicket.hook";
export type { SubmitTicketOptions } from "../../../hooks/form/useSubmitTicket.hook";
export { useFetchOrdersPage } from "../../../hooks/form/useTicketPickerPages.hook";
export { useFetchVendorsPage } from "../../../hooks/form/useTicketPickerPages.hook";
export { buildTicketFieldErrors } from "../../../utils/form/utils";
export { collectOrderVendors } from "../../../utils/form/utils";
export { formatOrderOption } from "../../../utils/form/utils";
