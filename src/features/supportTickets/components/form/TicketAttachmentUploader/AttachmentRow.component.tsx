"use client";

import { useCallback } from "react";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import type { UploadedMediaAttachment } from "../../../types/form/TicketAttachmentUploader-types";
import { isVideoAttachment } from "../../../utils/form/TicketAttachmentUploader-utils";
import { ticketAttachmentUploaderStyles } from "../../../styles/form/ticketAttachmentUploader.styles";

interface AttachmentRowProps {
  item: UploadedMediaAttachment;
  index: number;
  onRemove: (index: number) => void;
}

/** One attachment tile with its own remove handler. */
export function AttachmentRow({ item, index, onRemove }: AttachmentRowProps) {
  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <li className={ticketAttachmentUploaderStyles.item}>
      {isVideoAttachment(item) ? (
        <video
          src={item.displayUrl ?? item.url}
          className={ticketAttachmentUploaderStyles.video}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
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
        onClick={handleRemove}
      >
        {LABELS.ticketRemoveAttachment}
      </button>
    </li>
  );
}
