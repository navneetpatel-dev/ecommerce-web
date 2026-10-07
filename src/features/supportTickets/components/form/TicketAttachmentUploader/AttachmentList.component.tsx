"use client";

import type { UploadedMediaAttachment } from "../../../types/form/TicketAttachmentUploader-types";
import { AttachmentRow } from "./AttachmentRow.component";
import { ticketAttachmentUploaderStyles } from "../../../styles/form/ticketAttachmentUploader.styles";

type Props = {
  items: UploadedMediaAttachment[];
  onRemove: (index: number) => void;
};

export function AttachmentList({ items, onRemove }: Props) {
  if (items.length === 0) return null;

  return (
    <ul className={ticketAttachmentUploaderStyles.list}>
      {items.map((item, index) => (
        <AttachmentRow
          key={`${item.url}-${index}`}
          item={item}
          index={index}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
