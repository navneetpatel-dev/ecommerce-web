"use client";

import { IconCloseButton } from "@/shared/components/ui/icon-close-button";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import {
  fileUploadCardStyles,
  fileUploadStyles,
} from "@/shared/styles/file-upload/fileUploadComponents.styles";
import type { PreviewEntry } from "../../types/file-upload/types";
import { isPdfUrl, isVideoUrl } from "../../utils/file-upload/utils";

interface FileUploadPreviewListProps {
  entries: PreviewEntry[];
  /** `card`: large tiles; otherwise the compact thumbnails. */
  card: boolean;
  markFirstAsMain: boolean;
  onRemove?: (storedUrl: string) => void;
}

interface PreviewTileProps {
  entry: PreviewEntry;
  card: boolean;
  isMain: boolean;
  onRemove?: (storedUrl: string) => void;
}

function PreviewTile({ entry, card, isMain, onRemove }: PreviewTileProps) {
  const handleRemove = () => onRemove?.(entry.storedUrl);
  const isPdf = isPdfUrl(entry.displayUrl);
  const isVideo = isVideoUrl(entry.displayUrl);

  const media = isPdf ? (
    LABELS.pdfPreview
  ) : isVideo ? (
    <video
      src={entry.displayUrl}
      className={fileUploadStyles.videoElement}
      muted
      playsInline
      controls={card}
      aria-label={LABELS.videoPreview}
    />
  ) : (
    <MediaImage
      src={entry.displayUrl}
      alt=""
      sizes={card ? "200px" : "64px"}
      imageClassName={
        card ? fileUploadCardStyles.tileImage : fileUploadStyles.imageElement
      }
    />
  );

  const tileClass = !card
    ? isPdf
      ? fileUploadStyles.pdfPreview
      : isVideo
        ? fileUploadStyles.videoItem
        : fileUploadStyles.imageItem
    : isPdf
      ? fileUploadCardStyles.tilePdf
      : isVideo
        ? fileUploadCardStyles.tileVideo
        : fileUploadCardStyles.tile;

  return (
    <li className={tileClass}>
      {media}
      {isMain ? (
        <span className={fileUploadCardStyles.mainBadge}>
          {LABELS.mainImage}
        </span>
      ) : null}
      {onRemove ? (
        <IconCloseButton
          variant="overlay"
          label={LABELS.removeFile}
          onClick={handleRemove}
        />
      ) : null}
    </li>
  );
}

export function FileUploadPreviewList({
  entries,
  card,
  markFirstAsMain,
  onRemove,
}: FileUploadPreviewListProps) {
  if (entries.length === 0) return null;
  return (
    <ul
      className={
        card ? fileUploadCardStyles.grid : fileUploadStyles.previewList
      }
    >
      {entries.map((entry, index) => (
        <PreviewTile
          key={entry.storedUrl}
          entry={entry}
          card={card}
          isMain={markFirstAsMain && index === 0}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
