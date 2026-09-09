import { MediaImage } from "@/shared/components/MediaImage.component";
import { BUG_ATTACHMENT_TYPE } from "@/shared/constants/statuses";
import { cn } from "@/shared/utils/cn";
import type { BugAttachment } from "../../api/bugReports.api";
import { bugReportDetailStyles } from "./bugReportDetail.styles";

export function AttachmentGrid({
  attachments,
}: {
  attachments?: BugAttachment[];
}) {
  if (!attachments?.length) return null;
  return (
    <ul className={bugReportDetailStyles.attachmentGrid}>
      {attachments.map((item) => (
        <li
          key={item.id ?? item.url}
          className={bugReportDetailStyles.attachmentItem}
        >
          {item.type === BUG_ATTACHMENT_TYPE.SCREEN_RECORDING ? (
            <video
              src={item.url}
              className={bugReportDetailStyles.attachmentImg}
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
              imageClassName={bugReportDetailStyles.attachmentImg}
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
    <div className={bugReportDetailStyles.attachmentWrap}>
      <dt className={bugReportDetailStyles.attachmentLabel}>{label}</dt>
      <dd
        className={cn(
          bugReportDetailStyles.attachmentValue,
          mono && bugReportDetailStyles.attachmentValueMono,
        )}
      >
        {value}
      </dd>
    </div>
  );
}
