import { Play } from "lucide-react";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { TICKET_ATTACHMENT_TYPE } from "@/shared/constants/statuses";
import { cn } from "@/shared/utils/dom/cn";
import type { TicketAttachment } from "../../../api/list/supportTickets.api";
import { ticketThreadStyles } from "../../../styles/detail/ticketThread.styles";

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
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={ticketThreadStyles.thumbLink}
            aria-label={
              item.type === TICKET_ATTACHMENT_TYPE.VIDEO
                ? LABELS.ticketOpenVideoAttachment
                : LABELS.ticketOpenImageAttachment
            }
          >
            {item.type === TICKET_ATTACHMENT_TYPE.VIDEO ? (
              <>
                <video
                  src={item.url}
                  className={ticketThreadStyles.thumbImg}
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
                <span
                  className={ticketThreadStyles.thumbPlayBadge}
                  aria-hidden="true"
                >
                  <Play className={ticketThreadStyles.thumbPlayIcon} />
                </span>
              </>
            ) : (
              <MediaImage
                src={item.url}
                alt=""
                sizes={size === "sm" ? "56px" : "80px"}
                imageClassName={ticketThreadStyles.thumbObjectCover}
              />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
