"use client";

import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import type { UploadedMediaAttachment } from "./types";
import { isVideoAttachment } from "./utils";

type Props = {
  items: UploadedMediaAttachment[];
  onRemove: (index: number) => void;
};

export function AttachmentList({ items, onRemove }: Props) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <li
          key={`${item.url}-${index}`}
          className="relative h-20 w-20 overflow-hidden border border-line bg-paper"
        >
          {isVideoAttachment(item) ? (
            <video
              src={item.displayUrl ?? item.url}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <MediaImage
              src={item.displayUrl ?? item.url}
              alt=""
              sizes="80px"
              imageClassName="object-cover"
            />
          )}
          <button
            type="button"
            className="absolute inset-x-0 bottom-0 bg-ink/70 px-1 py-0.5 text-[0.625rem] text-paper"
            onClick={() => onRemove(index)}
          >
            {LABELS.ticketRemoveAttachment}
          </button>
        </li>
      ))}
    </ul>
  );
}
