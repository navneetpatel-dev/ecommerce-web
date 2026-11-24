"use client";

import Image from "next/image";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ProductModerationGalleryProps {
  images: string[];
  activeIdx: number;
  productName: string;
  loading: boolean;
  onSelectIdx: (idx: number) => void;
}

export function ProductModerationGallery({
  images,
  activeIdx,
  productName,
  loading,
  onSelectIdx,
}: ProductModerationGalleryProps) {
  if (loading && images.length === 0) {
    return (
      <div className="space-y-2" data-testid="product-preview-skeleton">
        <Skeleton className="aspect-video w-full rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-14 w-14 rounded" />
          <Skeleton className="h-14 w-14 rounded" />
        </div>
      </div>
    );
  }

  const currentImage = images[activeIdx] || images[0];
  if (!currentImage) return null;

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-line bg-paper">
        <Image
          src={currentImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {images.map((imgUrl, idx) => (
            <button
              key={imgUrl}
              type="button"
              onClick={() => onSelectIdx(idx)}
              className={`relative h-14 w-14 overflow-hidden rounded border transition-all ${
                activeIdx === idx
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-line opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={imgUrl}
                alt={`Photo ${idx + 1}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
