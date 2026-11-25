"use client";

import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { extractImageUrls } from "@/shared/utils/media/imageField";
import { recordDetailImageStyles } from "../../styles/dialogs/dialogComponents.styles";

const stopLinkPropagation = (event: { stopPropagation: () => void }) =>
  event.stopPropagation();

interface RecordDetailImageProps {
  value: unknown;
  alt: string;
  fieldKey?: string;
}

/** Adaptive detail-view media preview: wide banner for single banner/hero images, responsive square grid for multi-image arrays. */
export function RecordDetailImage({
  value,
  alt,
  fieldKey = "",
}: RecordDetailImageProps) {
  const urls = extractImageUrls(value);

  if (urls.length === 0) {
    return <span className={recordDetailImageStyles.dash}>—</span>;
  }

  const isBanner =
    urls.length === 1 &&
    (fieldKey.toLowerCase().includes("banner") ||
      fieldKey.toLowerCase().includes("cover"));

  if (isBanner) {
    return (
      <div className={recordDetailImageStyles.singleBannerContainer}>
        <a
          href={urls[0]}
          target="_blank"
          rel="noopener noreferrer"
          className={recordDetailImageStyles.singleBannerLink}
          onClick={stopLinkPropagation}
        >
          <div className={recordDetailImageStyles.singleBannerThumb}>
            <MediaImage
              src={urls[0]}
              alt={alt}
              unavailableLabel={LABELS.imageNotAvailable}
              sizes="(max-width: 768px) 100vw, 720px"
              imageClassName={recordDetailImageStyles.image}
            />
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className={recordDetailImageStyles.container}>
      {urls.map((url) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={recordDetailImageStyles.link}
          onClick={stopLinkPropagation}
        >
          <div className={recordDetailImageStyles.thumb}>
            <MediaImage
              src={url}
              alt={alt}
              unavailableLabel={LABELS.imageNotAvailable}
              sizes="(max-width: 640px) 140px, 160px"
              imageClassName={recordDetailImageStyles.image}
            />
          </div>
        </a>
      ))}
    </div>
  );
}
