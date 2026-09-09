import {
  BUG_ATTACHMENT_TYPE,
  TICKET_ATTACHMENT_TYPE,
  type BugAttachmentType,
  type TicketAttachmentType,
} from "@/shared/constants/statuses";
import { isVideoMimeType } from "@/shared/constants/imageSpecs";
import type { UploadedMediaAttachment } from "../../types/form/TicketAttachmentUploader-types";

export function mbLabel(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb % 1 === 0 ? String(mb) : mb.toFixed(1);
}

export function mapTicketType(file: File): TicketAttachmentType {
  return isVideoMimeType(file.type)
    ? TICKET_ATTACHMENT_TYPE.VIDEO
    : TICKET_ATTACHMENT_TYPE.IMAGE;
}

export function mapBugType(file: File): BugAttachmentType {
  return isVideoMimeType(file.type)
    ? BUG_ATTACHMENT_TYPE.SCREEN_RECORDING
    : BUG_ATTACHMENT_TYPE.SCREENSHOT;
}

export function isVideoAttachment(item: UploadedMediaAttachment): boolean {
  if (item.bugType)
    return item.bugType === BUG_ATTACHMENT_TYPE.SCREEN_RECORDING;
  return item.type === TICKET_ATTACHMENT_TYPE.VIDEO;
}
