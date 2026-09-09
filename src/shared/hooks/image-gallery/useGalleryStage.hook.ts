"use client";

import { useEffect, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import type { ProductImage } from "@/shared/api/types";
import { IMAGE_GALLERY_ZOOM_SCALE } from "@/shared/constants/media/imageGallery";
import type { useImageGalleryZoom } from "@/shared/hooks/media/useImageGalleryZoom.hook";

type ZoomHandlers = ReturnType<typeof useImageGalleryZoom>["stageHandlers"];

export interface UseGalleryStageParams {
  mainImageUrl: string;
  images?: ProductImage[];
  selectedIndex: number;
  prevIndex: number;
  zooming: boolean;
  zoomOrigin: { x: number; y: number };
  zoomHandlers: ZoomHandlers;
}

export interface GalleryStageModel {
  gallery: ProductImage[];
  safeIndex: number;
  currentUrl: string;
  prevUrl: string;
  hasMultiple: boolean;
  showZoom: boolean;
  zoomOverlayStyle: CSSProperties | undefined;
  /** True when the OS requests reduced motion (disables transitions). */
  reduceMotion: boolean;
}

function cssUrl(value: string): string {
  return `url(${JSON.stringify(value)})`;
}

/**
 * Normalizes the image list (fallback to the primary image), clamps the
 * selected index, preloads the active image, and derives the hover-zoom
 * overlay style. Pure derivation — no rendering concerns (Rule 1/14).
 */
export function useGalleryStage(
  params: UseGalleryStageParams,
): GalleryStageModel {
  const {
    mainImageUrl,
    images,
    selectedIndex,
    prevIndex,
    zooming,
    zoomOrigin,
  } = params;
  const reduceMotion = useReducedMotion();

  const gallery: ProductImage[] = images?.length
    ? images
    : [{ id: "main", url: mainImageUrl, isPrimary: true }];
  const safeIndex = Math.min(
    Math.max(selectedIndex, 0),
    Math.max(gallery.length - 1, 0),
  );
  const currentUrl = gallery[safeIndex]?.url || mainImageUrl;
  const prevUrl = gallery[prevIndex]?.url || mainImageUrl;
  const hasMultiple = gallery.length > 1;
  const showZoom = Boolean(zooming && !reduceMotion && currentUrl);

  useEffect(() => {
    if (!currentUrl || typeof window === "undefined") return;
    const preload = new window.Image();
    preload.decoding = "async";
    preload.src = currentUrl;
  }, [currentUrl]);

  const zoomOverlayStyle: CSSProperties | undefined = showZoom
    ? {
        backgroundImage: cssUrl(currentUrl),
        backgroundRepeat: "no-repeat",
        backgroundSize: `${IMAGE_GALLERY_ZOOM_SCALE * 100}%`,
        backgroundPosition: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
      }
    : undefined;

  return {
    gallery,
    safeIndex,
    currentUrl,
    prevUrl,
    hasMultiple,
    showZoom,
    zoomOverlayStyle,
    reduceMotion: Boolean(reduceMotion),
  };
}
