import type { ImageMimeType } from "@/shared/constants/imageSpecs";

export interface ImageCropDialogProps {
  open: boolean;
  imageSrc: string | null;
  aspectRatio: number;
  outputWidth: number;
  outputHeight: number;
  sourceFilename?: string;
  mimeType?: ImageMimeType;
  onOpenChange: (open: boolean) => void;
  onConfirm: (file: File) => void | Promise<void>;
}

export interface CropControlSlidersProps {
  zoom: number;
  rotation: number;
  processing: boolean;
  minZoom: number;
  maxZoom: number;
  onZoomChange: (value: number[]) => void;
  onRotationChange: (value: number[]) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
}
