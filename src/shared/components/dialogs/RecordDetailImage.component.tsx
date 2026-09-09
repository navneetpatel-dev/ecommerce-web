"use client";

import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { extractImageUrls } from "@/shared/utils/media/imageField";
import { recordDetailImageStyles } from "./dialogComponents.styles";

interface RecordDetailImageProps {
  value: unknown;
  alt: string;
}

/** Detail-view image preview — larger than table thumbnails; click to open full size. */
export function RecordDetailImage({ value, alt }: RecordDetailImageProps) {
  const urls = extractImageUrls(value);

  if (urls.length === 0) {
    return <span className={recordDetailImageStyles.dash}>—</span>;
  }

  const imageLinks = urls.map((url) => (
    <a
      key={url}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={recordDetailImageStyles.link}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={recordDetailImageStyles.thumb}>
        <MediaImage
          src={url}
          alt={alt}
          unavailableLabel={LABELS.imageNotAvailable}
          sizes="(max-width: 640px) 112px, 128px"
          imageClassName={recordDetailImageStyles.image}
        />
      </div>
    </a>
  ));

  return <div className={recordDetailImageStyles.container}>{imageLinks}</div>;
}
