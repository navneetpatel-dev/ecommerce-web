"use client";

import { Images } from "lucide-react";
import type { ReviewMediaItem } from "@/shared/api/types";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { reviewMediaGalleryStyles as styles } from "../../styles/media/reviewMediaGallery.styles";

interface ReviewMediaModerationActionProps {
  media?: readonly ReviewMediaItem[] | null;
}

/** Moderation row action: every photo and the video of a pending review, full size. */
export function ReviewMediaModerationAction({
  media,
}: ReviewMediaModerationActionProps) {
  const items = media ?? [];
  if (items.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("neutral")}
        >
          <Images strokeWidth={2.25} aria-hidden />
          <span>
            {formatLabel(LABELS.reviewMediaModerate, { count: items.length })}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={styles.moderationContent}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{LABELS.reviewMediaViewerTitle}</DialogTitle>
        </DialogHeader>
        <ul className={styles.moderationList}>
          {items.map((item) => (
            <li key={item.url}>
              {item.type === "VIDEO" ? (
                <video
                  src={item.url}
                  className={styles.viewerMedia}
                  controls
                  preload="metadata"
                  playsInline
                />
              ) : (
                <div className={styles.viewerFrame}>
                  <MediaImage
                    src={item.url}
                    alt=""
                    sizes="(min-width: 768px) 768px, 100vw"
                    imageClassName={styles.viewerImage}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
