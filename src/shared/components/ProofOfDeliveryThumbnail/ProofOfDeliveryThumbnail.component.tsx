"use client";

import { ImageGalleryLightbox } from "@/shared/components/ImageGalleryLightbox.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { useProofOfDeliveryThumbnail } from "./useProofOfDeliveryThumbnail.hook";
import { proofOfDeliveryThumbnailStyles as styles } from "./proofOfDeliveryThumbnail.styles";

interface ProofOfDeliveryThumbnailProps {
  url: string | null | undefined;
  compact?: boolean;
}

export function ProofOfDeliveryThumbnail({
  url,
  compact = false,
}: ProofOfDeliveryThumbnailProps) {
  const photos = useProofOfDeliveryThumbnail(url);

  if (!photos.hasProof) {
    return null;
  }

  const thumbClass = compact ? styles.thumbCompact : styles.thumb;
  const rootClass = compact ? styles.rootCompact : styles.root;

  return (
    <div className={rootClass}>
      <button
        type="button"
        className={styles.button}
        onClick={photos.handleOpen}
        aria-label={LABELS.viewProofOfDelivery}
      >
        <div className={thumbClass}>
          <MediaImage
            src={url}
            alt={LABELS.proofOfDeliveryPhoto}
            unavailableLabel={LABELS.imageNotAvailable}
            sizes={compact ? "40px" : "80px"}
            imageClassName={styles.image}
          />
        </div>
        {compact ? null : (
          <span className={styles.caption}>{LABELS.viewProofOfDelivery}</span>
        )}
      </button>
      <ImageGalleryLightbox
        open={photos.open}
        onOpenChange={photos.handleOpenChange}
        images={photos.images}
        selectedIndex={photos.selectedIndex}
        onSelect={photos.handleSelect}
        productName={LABELS.proofOfDeliveryPhoto}
      />
    </div>
  );
}
