import { Play } from "lucide-react";
import type { ReviewMediaItem } from "@/shared/api/types";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { reviewMediaGalleryStyles as styles } from "../../styles/media/reviewMediaGallery.styles";

interface ReviewMediaThumbProps {
  item: ReviewMediaItem;
  index: number;
  onOpen: (index: number) => void;
  /** Inside the viewer: the strip marks the item on screen. */
  selection?: { selected: boolean; total: number };
}

export function ReviewMediaThumb({
  item,
  index,
  onOpen,
  selection,
}: ReviewMediaThumbProps) {
  const isVideo = item.type === "VIDEO";
  const handleClick = () => onOpen(index);
  const label = selection
    ? formatLabel(LABELS.reviewMediaShow, {
        index: index + 1,
        total: selection.total,
      })
    : isVideo
      ? LABELS.reviewMediaOpenVideo
      : formatLabel(LABELS.reviewMediaOpenPhoto, { index: index + 1 });
  const className = selection
    ? selection.selected
      ? styles.stripThumbSelected
      : styles.stripThumb
    : styles.thumbButton;

  return (
    <li>
      <button
        type="button"
        className={className}
        aria-label={label}
        aria-current={selection?.selected ? "true" : undefined}
        onClick={handleClick}
      >
        {isVideo ? (
          <>
            <video
              src={item.url}
              className={styles.thumbMedia}
              preload="metadata"
              muted
              playsInline
            />
            <span className={styles.playBadge} aria-hidden>
              <Play className={styles.playIcon} />
            </span>
          </>
        ) : (
          <MediaImage
            src={item.url}
            alt=""
            sizes="80px"
            imageClassName={styles.thumbMedia}
          />
        )}
      </button>
    </li>
  );
}
