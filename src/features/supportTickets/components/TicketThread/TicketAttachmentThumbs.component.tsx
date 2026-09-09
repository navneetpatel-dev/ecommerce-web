import { MediaImage } from "@/shared/components/MediaImage.component";
import { TICKET_ATTACHMENT_TYPE } from "@/shared/constants/statuses";
import { cn } from "@/shared/utils/cn";
import type { TicketAttachment } from "../../api/supportTickets.api";
import { ticketThreadStyles } from "./ticketThread.styles";

export function AttachmentThumbs({
  attachments,
  size = "md",
}: {
  attachments: TicketAttachment[];
  size?: "sm" | "md";
}) {
  if (!attachments.length) return null;
  const box =
    size === "sm"
      ? ticketThreadStyles.thumbBoxSm
      : ticketThreadStyles.thumbBoxMd;
  return (
    <ul className={ticketThreadStyles.thumbsList}>
      {attachments.map((item) => (
        <li
          key={item.id ?? item.url}
          className={cn(ticketThreadStyles.thumbBoxBase, box)}
        >
          {item.type === TICKET_ATTACHMENT_TYPE.VIDEO ? (
            <video
              src={item.url}
              className={ticketThreadStyles.thumbImg}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <MediaImage
              src={item.url}
              alt=""
              sizes={size === "sm" ? "56px" : "80px"}
              imageClassName={ticketThreadStyles.thumbObjectCover}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
