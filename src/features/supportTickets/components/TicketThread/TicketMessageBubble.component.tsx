import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { cn } from "@/shared/utils/cn";
import type { TicketMessage } from "../../api/supportTickets.api";
import { AttachmentThumbs } from "./TicketAttachmentThumbs.component";
import { initials, isStaffRole } from "./ticketThreadShared";

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
        "flex gap-2.5 sm:gap-3",
        isOwn ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar className="mt-1 h-8 w-8 shrink-0 border border-line sm:h-9 sm:w-9">
        <AvatarFallback
          className={cn(
            "text-[0.7rem] font-semibold sm:text-[0.75rem]",
            isOwn ? "bg-brand-subtle text-brand" : "bg-paper text-ink-muted",
          )}
        >
          {initials(isOwn ? displayName : message.senderName || displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[min(100%,32rem)] min-w-0">
        <div
          className={cn(
            "px-3.5 py-2.5 sm:px-4 sm:py-3",
            isOwn
              ? "rounded-[1.15rem] rounded-tr-md border border-brand/30 bg-brand-subtle shadow-elevation-1"
              : "rounded-[1.15rem] rounded-tl-md border border-line bg-surface shadow-card-hairline-strong",
          )}
        >
          <div
            className={cn(
              "mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
              isOwn ? "justify-end" : "justify-start",
            )}
          >
            <span className="text-[0.75rem] font-semibold text-ink sm:text-body-sm">
              {displayName}
            </span>
            <span className="text-[0.6875rem] text-ink-muted">
              {formatOrderDate(message.createdAt)}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-body leading-relaxed text-ink">
            {message.body}
          </p>
          <AttachmentThumbs attachments={message.attachments ?? []} size="sm" />
        </div>
      </div>
    </div>
  );
}
