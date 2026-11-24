"use client";

import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { MediaImage } from "@/shared/components/media/MediaImage.component";

interface ProductGalleryCardProps {
  product: Record<string, unknown>;
}

interface ResolvedImage {
  url: string;
  isPrimary: boolean;
}

function extractAllProductImages(
  product: Record<string, unknown>,
): ResolvedImage[] {
  const images: ResolvedImage[] = [];
  const seen = new Set<string>();

  const add = (url: unknown, isPrimary = false) => {
    if (typeof url === "string" && url.trim() && !seen.has(url.trim())) {
      seen.add(url.trim());
      images.push({ url: url.trim(), isPrimary });
    }
  };

  if (typeof product.imageUrl === "string") {
    add(product.imageUrl, true);
  }

  if (Array.isArray(product.images)) {
    for (const it of product.images) {
      if (typeof it === "string") {
        add(it, false);
      } else if (typeof it?.url === "string") {
        add(it.url, Boolean(it.isPrimary));
      }
    }
  }

  return images;
}

export function ProductGalleryCard({ product }: ProductGalleryCardProps) {
  const images = extractAllProductImages(product);
  if (images.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-line/60">
        <div className="flex items-center gap-2 text-ink font-semibold text-body-sm">
          <ImageIcon className="size-4 text-brand" aria-hidden />
          <span>Product Gallery</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-paper border border-line text-ink-muted">
          {images.length} {images.length === 1 ? "photo" : "photos"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <a
            key={i}
            href={img.url}
            target="_blank"
            rel="noopener noreferrer"
            title="View full image in new tab"
            className="group relative size-24 sm:size-28 rounded-xl overflow-hidden border border-line bg-paper hover:border-brand/40 transition-all shadow-xs shrink-0"
          >
            <MediaImage
              src={img.url}
              alt={`Product photo ${i + 1}`}
              sizes="112px"
              imageClassName="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {img.isPrimary && (
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-brand/90 backdrop-blur-xs text-[9px] font-bold text-white shadow-xs">
                Primary
              </span>
            )}
            <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <ExternalLink className="size-4 drop-shadow" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
