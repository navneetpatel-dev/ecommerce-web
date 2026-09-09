import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { cn } from "@/shared/utils/cn";
import type { TicketMessage } from "../../api/supportTickets.api";
import { AttachmentThumbs } from "./TicketAttachmentThumbs.component";
import { initials, isStaffRole } from "./ticketThreadShared";
import { ticketThreadStyles } from "./ticketThread.styles";

export function MessageBubble({
  message,
  isOwn,
}: {
  message: TicketMessage;
  isOwn: boolean;
}) {
  const displayName = isOwn
    ? LABELS.ticketMessageYou
    : message.senderName ||
      (isStaffRole(message.senderRole)
        ? LABELS.ticketMessageSupport
        : LABELS.ticketMessageCustomer);

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
