import { MediaImage } from "@/shared/components/MediaImage.component";
import { BUG_ATTACHMENT_TYPE } from "@/shared/constants/statuses";
import { cn } from "@/shared/utils/cn";
import type { BugAttachment } from "../../api/bugReports.api";

export function AttachmentGrid({
  attachments,
}: {
  attachments?: BugAttachment[];
}) {
  if (!attachments?.length) return null;
  return (
    <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
      {attachments.map((item) => (
        <li
          key={item.id ?? item.url}
          className="relative aspect-square overflow-hidden rounded-md border border-line bg-paper"
        >
          {item.type === BUG_ATTACHMENT_TYPE.SCREEN_RECORDING ? (
            <video
              src={item.url}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
              controls
            />
          ) : (
            <MediaImage
              src={item.url}
              alt=""
              sizes="(min-width: 640px) 25vw, 33vw"
              imageClassName="object-cover"
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export function ContextRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.6875rem] uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-0.5 break-all text-body-sm text-ink",
          mono && "font-mono text-[0.75rem]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
