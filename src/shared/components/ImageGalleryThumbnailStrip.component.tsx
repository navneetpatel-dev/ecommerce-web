"use client";

import { useEffect, useRef } from "react";
import type { ProductImage } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";

interface ImageGalleryThumbnailStripProps {
  images: ProductImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  productName: string;
  orientation?: "horizontal" | "vertical" | "responsive";
  className?: string;
  thumbClassName?: string;
}

export function ImageGalleryThumbnailStrip({
  images,
  selectedIndex,
  onSelect,
  productName,
  orientation = "horizontal",
  className,
  thumbClassName,
}: ImageGalleryThumbnailStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const selected = strip.querySelector<HTMLElement>('[aria-selected="true"]');
    selected?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedIndex]);

  if (images.length <= 1) return null;

  const isHorizontal =
    orientation === "horizontal" || orientation === "responsive";

  return (
    <div
      ref={stripRef}
      role="tablist"
      aria-label={LABELS.imageGalleryThumbnails}
      className={cn(
        "flex w-full min-w-0 gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        isHorizontal &&
          "flex-nowrap overflow-x-auto overscroll-x-contain touch-pan-x",
        orientation === "vertical" &&
          "min-h-0 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain",
        orientation === "responsive" &&
          "lg:min-h-0 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:touch-auto",
        className,
      )}
    >
      {images.map((img, index) => (
        <Button
          key={img.id}
          type="button"
          role="tab"
          variant="outline"
          size="icon-sm"
          aria-selected={index === selectedIndex}
          onClick={() => onSelect(index)}
          className={cn(
            "relative shrink-0 overflow-hidden rounded-lg border p-0",
            thumbClassName,
            index === selectedIndex
              ? "border-brand ring-1 ring-brand/40"
              : "border-line hover:border-ink/30",
          )}
          aria-label={formatLabel(LABELS.productImageView, {
            name: productName,
            index: index + 1,
          })}
        >
          <MediaImage
            src={img.url}
            alt={formatLabel(LABELS.productImageView, {
              name: productName,
              index: index + 1,
            })}
            unavailableLabel={LABELS.imageNotAvailable}
            sizes="72px"
            imageClassName="object-cover"
          />
        </Button>
      ))}
    </div>
  );
}
