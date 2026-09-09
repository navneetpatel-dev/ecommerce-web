"use client";

import { Button } from "@/shared/components/ui/button";
import { Slider } from "@/shared/components/ui/slider";
import { LABELS } from "@/shared/constants/labels";
import { cropDialogStyles as styles } from "../../styles/image-crop-dialog/cropDialog.styles";
import type { CropControlSlidersProps } from "../../types/image-crop-dialog/types";

/** Zoom + rotation sliders with quick-rotate/reset actions. */
export function CropControlSliders(props: CropControlSlidersProps) {
  const {
    zoom,
    rotation,
    processing,
    minZoom,
    maxZoom,
    onZoomChange,
    onRotationChange,
    onRotateLeft,
    onRotateRight,
    onReset,
  } = props;

  return (
    <div className={styles.controlsStack}>
      <div className={styles.sliderGroup}>
        <p className={styles.controlLabel}>{LABELS.imageCropZoom}</p>
        <Slider
          value={[zoom]}
          min={minZoom}
          max={maxZoom}
          step={0.05}
          onValueChange={onZoomChange}
          aria-label={LABELS.imageCropZoom}
        />
      </div>

      <div className={styles.sliderGroup}>
        <p className={styles.controlLabel}>{LABELS.imageCropRotation}</p>
        <Slider
          value={[rotation]}
          min={-180}
          max={180}
          step={1}
          onValueChange={onRotationChange}
          aria-label={LABELS.imageCropRotation}
        />
        <div className={styles.buttonRow}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={processing}
            onClick={onRotateLeft}
          >
            {LABELS.imageCropRotateLeft}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={processing}
            onClick={onRotateRight}
          >
            {LABELS.imageCropRotateRight}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={processing}
            onClick={onReset}
          >
            {LABELS.imageCropReset}
          </Button>
        </div>
      </div>
    </div>
  );
}
