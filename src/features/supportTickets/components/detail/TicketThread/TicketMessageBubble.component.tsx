import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { cn } from "@/shared/utils/dom/cn";
import { TICKET_SENDER_ROLE } from "@/shared/constants/statuses";
import type { TicketMessage } from "../../../api/list/supportTickets.api";
import { AttachmentThumbs } from "./TicketAttachmentThumbs.component";
import { initials } from "../../../utils/detail/ticketThreadShared";
import { ticketThreadStyles } from "../../../styles/detail/ticketThread.styles";

export function MessageBubble({
  message,
  isOwn,
}: {
  message: TicketMessage;
  isOwn: boolean;
}) {
  const isVendorRole =
    message.senderRole === TICKET_SENDER_ROLE.VENDOR ||
    message.senderRole === TICKET_SENDER_ROLE.VENDOR_STAFF;
  const isAdminRole =
    !isVendorRole && message.senderRole !== TICKET_SENDER_ROLE.CUSTOMER;

  const roleLabel = isVendorRole
    ? "Seller"
    : isAdminRole
      ? "Platform Support"
      : LABELS.ticketMessageCustomer;

  const displayName = isOwn
    ? LABELS.ticketMessageYou
    : message.senderName
      ? `${message.senderName} (${roleLabel})`
      : roleLabel;

  return (
    <div
      className={cn(
        ticketThreadStyles.bubbleRow,
        isOwn
          ? ticketThreadStyles.bubbleRowOwn
          : ticketThreadStyles.bubbleRowOther,
      )}
    >
      <Avatar className={ticketThreadStyles.bubbleAvatar}>
        <AvatarFallback
          className={cn(
            ticketThreadStyles.bubbleFallback,
            isOwn
              ? ticketThreadStyles.bubbleFallbackOwn
              : ticketThreadStyles.bubbleFallbackOther,
          )}
        >
          {initials(isOwn ? displayName : message.senderName || displayName)}
        </AvatarFallback>
      </Avatar>
      <div className={ticketThreadStyles.bubbleBodyWrap}>
        <div
          className={cn(
            ticketThreadStyles.bubbleContent,
            isOwn
              ? ticketThreadStyles.bubbleContentOwn
              : ticketThreadStyles.bubbleContentOther,
          )}
        >
          <div
            className={cn(
              ticketThreadStyles.bubbleMeta,
              isOwn
                ? ticketThreadStyles.bubbleMetaOwn
                : ticketThreadStyles.bubbleMetaOther,
            )}
          >
            <span className={ticketThreadStyles.bubbleSenderName}>
              {displayName}
            </span>
            <span className={ticketThreadStyles.bubbleTimestamp}>
              {formatOrderDate(message.createdAt)}
            </span>
          </div>
          <p className={ticketThreadStyles.bubbleText}>{message.body}</p>
          <AttachmentThumbs attachments={message.attachments ?? []} size="sm" />
        </div>
      </div>
    </div>
  );
}
