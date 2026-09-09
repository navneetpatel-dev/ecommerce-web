"use client";

import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

interface TableCellImageProps {
  src?: string | null;
  alt: string;
  /** Tailwind size class for the frame (default 2.5rem / 40px — matches category tables). */
  sizeClass?: string;
  className?: string;
}

/** Compact thumbnail for image columns in dashboard tables and mobile cards. */
export function TableCellImage({
  src,
  alt,
  sizeClass = "h-10 w-10",
  className,
}: TableCellImageProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded bg-paper",
        sizeClass,
        className,
      )}
    >
      <MediaImage
        src={src}
        alt={alt}
        unavailableLabel={LABELS.imageNotAvailable}
        sizes="40px"
        imageClassName="object-cover"
      />
    </div>
  );
}
