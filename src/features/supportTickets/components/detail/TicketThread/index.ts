// Barrel for the folder's subparts. The entry component lives beside
// this folder as "../TicketThread.component" — do not re-export it here, it
// imports subparts from this barrel (would be a circular module).
export { AttachmentThumbs } from "./TicketAttachmentThumbs.component";
export { TicketConversation } from "./TicketConversation.component";
export { TicketDetailsPanel } from "./TicketDetailsPanel.component";
export { TicketManageControls } from "./TicketManageControls.component";
export { MessageBubble } from "./TicketMessageBubble.component";
export { TicketRatedBanner } from "./TicketRatingSection.component";
export { TicketRatingError } from "./TicketRatingSection.component";
export { TicketRatingSection } from "./TicketRatingSection.component";
export { buildRatingErrorMessage } from "./TicketRatingSection.component";
export { TicketReplyBlockedNotice } from "./TicketReplyComposer.component";
export { TicketReplyComposer } from "./TicketReplyComposer.component";
export { TicketThreadHeader } from "./TicketThreadHeader.component";
export { initials } from "../../../utils/detail/ticketThreadShared";
export { isStaffRole } from "../../../utils/detail/ticketThreadShared";
export { listHref } from "../../../utils/detail/ticketThreadShared";
export type { RoleMode } from "../../../utils/detail/ticketThreadShared";
export { useTicketActions } from "../../../hooks/detail/useTicketActions.hook";
export { useTicketRating } from "../../../hooks/detail/useTicketActions.hook";
export { useTicketReply } from "../../../hooks/detail/useTicketActions.hook";
export type { TicketComposerState } from "../../../hooks/detail/useTicketActions.hook";
export { useTicketMessages } from "../../../hooks/detail/useTicketMessages.hook";
export { useTicketThreadState } from "../../../hooks/detail/useTicketThreadState.hook";
