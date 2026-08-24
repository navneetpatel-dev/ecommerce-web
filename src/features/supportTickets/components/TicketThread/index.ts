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
export { initials } from "./ticketThreadShared";
export { isStaffRole } from "./ticketThreadShared";
export { listHref } from "./ticketThreadShared";
export type { RoleMode } from "./ticketThreadShared";
export { useTicketActions } from "./useTicketActions.hook";
export { useTicketRating } from "./useTicketActions.hook";
export { useTicketReply } from "./useTicketActions.hook";
export type { TicketComposerState } from "./useTicketActions.hook";
export { useTicketMessages } from "./useTicketMessages.hook";
export { useTicketThreadState } from "./useTicketThreadState.hook";
