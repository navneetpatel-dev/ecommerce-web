"use client";

import type { ReviewMediaItem } from "@/shared/api/types";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { useReviewMediaGallery } from "../../hooks/media/useReviewMediaGallery.hook";
import { reviewMediaGalleryStyles as styles } from "../../styles/media/reviewMediaGallery.styles";
import { ReviewMediaThumb } from "./ReviewMediaThumb.component";

interface ReviewMediaGalleryProps {
  media?: readonly ReviewMediaItem[] | null;
}

/** A review's photos and video as thumbnails; one opens full size in a viewer. */
export function ReviewMediaGallery({ media }: ReviewMediaGalleryProps) {
  const items = media ?? [];
  const gallery = useReviewMediaGallery(items);
  if (items.length === 0) return null;

  return (
    <>
      <ul className={styles.list} aria-label={LABELS.reviewMediaGalleryAria}>
        {items.map((item, index) => (
          <ReviewMediaThumb
            key={item.url}
            item={item}
            index={index}
            onOpen={gallery.handleOpen}
          />
        ))}
      </ul>
      <Dialog open={gallery.open} onOpenChange={gallery.handleOpenChange}>
        <DialogContent
          className={styles.viewerContent}
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>{LABELS.reviewMediaViewerTitle}</DialogTitle>
          </DialogHeader>
          {gallery.current?.type === "VIDEO" ? (
            <video
              src={gallery.current.url}
              className={styles.viewerMedia}
              controls
              autoPlay
              playsInline
            />
          ) : gallery.current ? (
            <div className={styles.viewerFrame}>
              <MediaImage
                src={gallery.current.url}
                alt=""
                sizes="(min-width: 768px) 768px, 100vw"
                imageClassName={styles.viewerImage}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
