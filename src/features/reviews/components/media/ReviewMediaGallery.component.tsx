"use client";

import type { ReviewMediaItem } from "@/shared/api/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { useReviewMediaGallery } from "../../hooks/media/useReviewMediaGallery.hook";
import { reviewMediaGalleryStyles as styles } from "../../styles/media/reviewMediaGallery.styles";
import { ReviewMediaThumbList } from "./ReviewMediaThumbList.component";
import { ReviewMediaViewerStage } from "./ReviewMediaViewerStage.component";

interface ReviewMediaGalleryProps {
  media?: readonly ReviewMediaItem[] | null;
}

/**
 * A review's photos and video as thumbnails; one opens full size in a viewer
 * that steps through the rest (buttons, ← / →, swipe), stopping at both ends.
 */
export function ReviewMediaGallery({ media }: ReviewMediaGalleryProps) {
  const items = media ?? [];
  const gallery = useReviewMediaGallery(items);
  if (items.length === 0) return null;

  return (
    <>
      <ReviewMediaThumbList
        items={items}
        onOpen={gallery.handleOpen}
        className={styles.list}
        label={LABELS.reviewMediaGalleryAria}
      />
      <Dialog open={gallery.open} onOpenChange={gallery.handleOpenChange}>
        <DialogContent
          className={styles.viewerContent}
          aria-describedby={undefined}
          onKeyDown={gallery.handleKeyDown}
        >
          <DialogHeader className={styles.viewerHeader}>
            <DialogTitle className={styles.viewerTitle}>
              {LABELS.reviewMediaViewerTitle}
            </DialogTitle>
            {gallery.hasMultiple ? (
              <p className={styles.counter} aria-live="polite">
                {gallery.positionLabel}
              </p>
            ) : null}
          </DialogHeader>
          {gallery.current ? (
            <ReviewMediaViewerStage
              current={gallery.current}
              gallery={gallery}
            />
          ) : null}
          {gallery.hasMultiple ? (
            <ReviewMediaThumbList
              items={items}
              onOpen={gallery.handleOpen}
              className={styles.strip}
              label={LABELS.reviewMediaViewerThumbs}
              selectedIndex={gallery.index}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
