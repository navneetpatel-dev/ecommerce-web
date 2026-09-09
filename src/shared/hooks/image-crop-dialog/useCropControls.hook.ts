"use client";

import { useCallback, useEffect, useState } from "react";
import type { Area } from "react-easy-crop";
import type { ImageMimeType } from "@/shared/constants/imageSpecs";
import { getCroppedImageBlob } from "@/shared/utils/media/imageProcessing";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const DEFAULT_ZOOM = 1;
const DEFAULT_ROTATION = 0;
const CROP_JPEG_QUALITY = 0.92;

export interface UseCropControlsParams {
  open: boolean;
  imageSrc: string | null;
  outputWidth: number;
  outputHeight: number;
  sourceFilename: string;
  mimeType: ImageMimeType;
  onOpenChange: (open: boolean) => void;
  onConfirm: (file: File) => void | Promise<void>;
}

/**
 * Owns crop/zoom/rotation state and the confirm/cancel flow (Rule 14:
 * processing state and async file production live in a hook, not the dialog
 * shell). Controls reset whenever the dialog opens for a (new) image.
 */
export function useCropControls(params: UseCropControlsParams) {
  const {
    open,
    imageSrc,
    outputWidth,
    outputHeight,
    sourceFilename,
    mimeType,
    onOpenChange,
    onConfirm,
  } = params;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [rotation, setRotation] = useState(DEFAULT_ROTATION);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCrop({ x: 0, y: 0 });
    setZoom(DEFAULT_ZOOM);
    setRotation(DEFAULT_ROTATION);
    setCroppedAreaPixels(null);
  }, [open, imageSrc]);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const resetControls = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(DEFAULT_ZOOM);
    setRotation(DEFAULT_ROTATION);
  };

  const rotateLeft = () => setRotation((prev) => prev - 90);
  const rotateRight = () => setRotation((prev) => prev + 90);
  const setZoomFromSlider = (value: number[]) =>
    setZoom(value[0] ?? DEFAULT_ZOOM);
  const setRotationFromSlider = (value: number[]) =>
    setRotation(value[0] ?? DEFAULT_ROTATION);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(
        imageSrc,
        croppedAreaPixels,
        outputWidth,
        outputHeight,
        mimeType,
        CROP_JPEG_QUALITY,
        rotation,
      );
      const ext =
        mimeType === "image/png"
          ? "png"
          : mimeType === "image/webp"
            ? "webp"
            : "jpg";
      const file = new File(
        [blob],
        sourceFilename.replace(/\.[^.]+$/, `.${ext}`),
        {
          type: mimeType,
        },
      );
      await onConfirm(file);
      onOpenChange(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    if (processing) return;
    onOpenChange(false);
  };

  return {
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    processing,
    croppedAreaPixels,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    defaultZoom: DEFAULT_ZOOM,
    defaultRotation: DEFAULT_ROTATION,
    onCropComplete,
    resetControls,
    rotateLeft,
    rotateRight,
    setZoomFromSlider,
    setRotationFromSlider,
    handleConfirm,
    handleCancel,
  };
}
