"use client";

import Cropper from "react-easy-crop";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import type { ImageMimeType } from "@/shared/constants/imageSpecs";
import { useCropControls } from "./useCropControls.hook";
import { CropControlSliders } from "./CropControlSliders.component";
import { cropDialogStyles as styles } from "./cropDialog.styles";
import type { ImageCropDialogProps } from "./types";

export function ImageCropDialog(props: ImageCropDialogProps) {
  const {
    open,
    imageSrc,
    aspectRatio,
    outputWidth,
    outputHeight,
    sourceFilename = "upload.jpg",
    mimeType = "image/jpeg" as ImageMimeType,
    onOpenChange,
    onConfirm,
  } = props;

  const controls = useCropControls({
    open,
    imageSrc,
    outputWidth,
    outputHeight,
    sourceFilename,
    mimeType,
    onOpenChange,
    onConfirm,
  });

  const handleDialogOpenChange = (next: boolean) => {
    if (!next && !controls.processing) onOpenChange(false);
  };

  const handleConfirmClick = () => void controls.handleConfirm();

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>{LABELS.imageCropTitle}</DialogTitle>
          <DialogDescription>{LABELS.imageCropHint}</DialogDescription>
        </DialogHeader>

        <div className={styles.cropStage}>
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={controls.crop}
              zoom={controls.zoom}
              rotation={controls.rotation}
              minZoom={controls.minZoom}
              maxZoom={controls.maxZoom}
              aspect={aspectRatio}
              zoomWithScroll
              onCropChange={controls.setCrop}
              onZoomChange={controls.setZoom}
              onRotationChange={controls.setRotation}
              onCropComplete={controls.onCropComplete}
            />
          ) : null}
        </div>

        <CropControlSliders
          zoom={controls.zoom}
          rotation={controls.rotation}
          processing={controls.processing}
          minZoom={controls.minZoom}
          maxZoom={controls.maxZoom}
          onZoomChange={controls.setZoomFromSlider}
          onRotationChange={controls.setRotationFromSlider}
          onRotateLeft={controls.rotateLeft}
          onRotateRight={controls.rotateRight}
          onReset={controls.resetControls}
        />

        <div className={styles.dialogFooter}>
          <Button
            type="button"
            variant="secondary"
            disabled={controls.processing}
            onClick={controls.handleCancel}
          >
            {LABELS.cancel}
          </Button>
          <Button
            type="button"
            disabled={controls.processing || !controls.croppedAreaPixels}
            onClick={handleConfirmClick}
          >
            {controls.processing
              ? LABELS.imageCropProcessing
              : LABELS.imageCropConfirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { ImageCropDialogProps } from "./types";
