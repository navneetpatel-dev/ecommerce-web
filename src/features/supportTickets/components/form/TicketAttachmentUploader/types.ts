import type { TicketAttachmentInput } from "../../../api/list/supportTickets.api";
import type { BugAttachmentType } from "@/shared/constants/statuses";
import type { UploadEntityType } from "@/shared/constants/uploads/uploads";

export type UploadedMediaAttachment = TicketAttachmentInput & {
  displayUrl?: string;
  /** Bug reports use SCREENSHOT / SCREEN_RECORDING */
  bugType?: BugAttachmentType;
};

export type Mode = "ticket" | "bug";

export type Props = {
  mode?: Mode;
  entityType?: UploadEntityType;
  entityId: string;
  value: UploadedMediaAttachment[];
  onChange: (next: UploadedMediaAttachment[]) => void;
  disabled?: boolean;
  label?: string;
  /** Attachments already on the ticket/report (reply path). */
  existingImageCount?: number;
  existingVideoCount?: number;
};
