"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder.component";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";

interface MediaImageProps {
  src?: string | null;
  alt: string;
  unavailableLabel?: string;
  sizes?: string;
  /** Next/Image quality 1–100. Defaults to the Next.js default when omitted. */
  quality?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  className?: string;
  imageClassName?: string;
  /** Fires when media is unavailable (missing src or load error). */
  onUnavailableChange?: (unavailable: boolean) => void;
}

interface ImageState {
  src: string | null;
  failed: boolean;
}

function initialImageState(src?: string | null): ImageState {
  const normalized = src ?? null;
  return { src: normalized, failed: !normalized };
}

/**
 * Renders a media image, or the shared unavailable placeholder when `src` is
 * missing or the asset fails to load. Failure detection lives on the <Image>
 * onError handler itself, so every image is fetched exactly once — no
 * pre-flight probe that would download lazy media twice.
 */
export function MediaImage({
  src,
  alt,
  unavailableLabel = LABELS.imageNotAvailable,
  sizes,
  quality,
  priority,
  loading,
  className,
  imageClassName,
  onUnavailableChange,
}: MediaImageProps) {
  const currentSrc = src ?? null;
  const [state, setState] = useState<ImageState>(() => initialImageState(src));

  if (currentSrc !== state.src) {
    setState(initialImageState(src));
  }

  const unavailable = !currentSrc || (state.src === currentSrc && state.failed);

  const handleError = () => {
    setState((prev) =>
      prev.src === currentSrc ? { ...prev, failed: true } : prev,
    );
  };

  useEffect(() => {
    onUnavailableChange?.(unavailable);
  }, [unavailable, onUnavailableChange]);

  if (unavailable) {
    return (
      <ProductImagePlaceholder
        className={cn(className)}
        label={unavailableLabel}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={loading}
      className={cn(imageClassName, className)}
      onError={handleError}
      data-image-state="loaded"
    />
  );
}
