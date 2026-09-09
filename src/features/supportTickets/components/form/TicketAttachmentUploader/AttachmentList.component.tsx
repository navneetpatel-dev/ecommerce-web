"use client";

import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import type { UploadedMediaAttachment } from "./types";
import { isVideoAttachment } from "./utils";
import { ticketAttachmentUploaderStyles } from "./ticketAttachmentUploader.styles";

type Props = {
  items: UploadedMediaAttachment[];
  onRemove: (index: number) => void;
};

export function AttachmentList({ items, onRemove }: Props) {
  if (items.length === 0) return null;

  return (
    <ul className={ticketAttachmentUploaderStyles.list}>
      {items.map((item, index) => (
        <li
          key={`${item.url}-${index}`}
          className={ticketAttachmentUploaderStyles.item}
        >
          {isVideoAttachment(item) ? (
            <video
              src={item.displayUrl ?? item.url}
              className={ticketAttachmentUploaderStyles.video}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <MediaImage
              src={item.displayUrl ?? item.url}
              alt=""
              sizes="80px"
              imageClassName={ticketAttachmentUploaderStyles.img}
            />
          )}
          <button
            type="button"
            className={ticketAttachmentUploaderStyles.removeBtn}
            onClick={() => onRemove(index)}
          >
            {LABELS.ticketRemoveAttachment}
          </button>
        </li>
      ))}
    </ul>
  );
}
