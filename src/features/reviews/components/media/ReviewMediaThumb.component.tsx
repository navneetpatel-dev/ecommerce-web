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
}

export function ReviewMediaThumb({
  item,
  index,
  onOpen,
}: ReviewMediaThumbProps) {
  const isVideo = item.type === "VIDEO";
  const handleClick = () => onOpen(index);
  const label = isVideo
    ? LABELS.reviewMediaOpenVideo
    : formatLabel(LABELS.reviewMediaOpenPhoto, { index: index + 1 });

  return (
    <li>
      <button
        type="button"
        className={styles.thumbButton}
        aria-label={label}
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
