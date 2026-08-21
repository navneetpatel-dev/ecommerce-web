import { MediaImage } from "@/shared/components/MediaImage";
import { TICKET_ATTACHMENT_TYPE } from "@/shared/constants/statuses";
import { cn } from "@/shared/utils/cn";
import type { TicketAttachment } from "../../api/supportTickets.api";

export function AttachmentThumbs({
  attachments,
  size = "md",
}: {
  attachments: TicketAttachment[];
  size?: "sm" | "md";
}) {
  if (!attachments.length) return null;
  const box = size === "sm" ? "h-14 w-14" : "h-20 w-20";
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {attachments.map((item) => (
        <li
          key={item.id ?? item.url}
          className={cn(
            "relative overflow-hidden rounded-md border border-line bg-paper",
            box,
          )}
        >
          {item.type === TICKET_ATTACHMENT_TYPE.VIDEO ? (
            <video
              src={item.url}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <MediaImage
              src={item.url}
              alt=""
              sizes={size === "sm" ? "56px" : "80px"}
              imageClassName="object-cover"
            />
          )}
        </li>
      ))}
    </ul>
  );
}
