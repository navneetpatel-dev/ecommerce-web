import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReviewMediaItem } from "@/shared/api/types";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { ReviewMediaGalleryState } from "../../hooks/media/useReviewMediaGallery.hook";
import { reviewMediaGalleryStyles as styles } from "../../styles/media/reviewMediaGallery.styles";

interface ReviewMediaViewerStageProps {
  current: ReviewMediaItem;
  gallery: ReviewMediaGalleryState;
}

/** The open photo / video, with Previous and Next over its edges. */
export function ReviewMediaViewerStage({
  current,
  gallery,
}: ReviewMediaViewerStageProps) {
  return (
    <div className={styles.stage} {...gallery.swipeHandlers}>
      {current.type === "VIDEO" ? (
        <video
          key={current.url}
          src={current.url}
          className={styles.viewerMedia}
          controls
          autoPlay
          playsInline
        />
      ) : (
        <div className={styles.viewerFrame}>
          <MediaImage
            key={current.url}
            src={current.url}
            alt=""
            sizes="(min-width: 768px) 768px, 100vw"
            imageClassName={styles.viewerImage}
          />
        </div>
      )}
      {gallery.hasMultiple ? (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={gallery.goPrev}
            disabled={!gallery.edges.canPrev}
            aria-label={LABELS.reviewMediaPrevious}
            className={styles.navPrev}
          >
            <ChevronLeft className={styles.navIcon} strokeWidth={1.75} />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={gallery.goNext}
            disabled={!gallery.edges.canNext}
            aria-label={LABELS.reviewMediaNext}
            className={styles.navNext}
          >
            <ChevronRight className={styles.navIcon} strokeWidth={1.75} />
          </Button>
        </>
      ) : null}
    </div>
  );
}
