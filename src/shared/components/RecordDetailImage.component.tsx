"use client";

import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { extractImageUrls } from "@/shared/utils/imageField";

interface RecordDetailImageProps {
  value: unknown;
  alt: string;
}

/** Detail-view image preview — larger than table thumbnails; click to open full size. */
export function RecordDetailImage({ value, alt }: RecordDetailImageProps) {
  const urls = extractImageUrls(value);

  if (urls.length === 0) {
    return <span className="text-ink-faint">—</span>;
  }

  const imageLinks = urls.map((url) => (
    <a
      key={url}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block shrink-0"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative h-28 w-28 overflow-hidden rounded-md border border-line bg-paper transition-colors group-hover:border-brand/40 sm:h-32 sm:w-32">
        <MediaImage
          src={url}
          alt={alt}
          unavailableLabel={LABELS.imageNotAvailable}
          sizes="(max-width: 640px) 112px, 128px"
          imageClassName="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>
    </a>
  ));

  return <div className="flex flex-wrap gap-3">{imageLinks}</div>;
}
