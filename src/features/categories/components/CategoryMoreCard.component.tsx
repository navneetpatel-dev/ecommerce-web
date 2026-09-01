"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { resolveCategoryImageUrl } from "../utils/categoryHelpers";
import type { Category } from "@/shared/api/types";

/** Fallback when overflow categories have no cover images. */
const BROWSE_MORE_FALLBACK = "/images/category-browse-more.jpg";

interface CategoryMoreCardProps {
  href: string;
  moreCount: number;
  overflowCategories: Category[];
  className?: string;
}

function pickMosaicUrls(categories: Category[], max = 4): string[] {
  const urls: string[] = [];
  for (const category of categories) {
    const url = resolveCategoryImageUrl(category);
    if (!url || urls.includes(url)) continue;
    urls.push(url);
    if (urls.length >= max) break;
  }
  return urls;
}

function CategoryMosaic({ urls }: { urls: string[] }) {
  if (urls.length === 1) {
    return (
      <MediaImage
        src={urls[0]}
        alt=""
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
        imageClassName="object-cover"
      />
    );
  }

  const cells = [...urls];
  while (cells.length < 4) {
    cells.push(cells[cells.length % urls.length]!);
  }

  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-line">
      {cells.slice(0, 4).map((url, index) => (
        <div key={`${url}-${index}`} className="relative min-h-0 min-w-0">
          <MediaImage
            src={url}
            alt=""
            sizes="(max-width: 640px) 25vw, (max-width: 1280px) 12vw, 10vw"
            imageClassName="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function CategoryMoreCard({
  href,
  moreCount,
  overflowCategories,
  className,
}: CategoryMoreCardProps) {
  const mosaicUrls = pickMosaicUrls(overflowCategories);
  const hasMosaic = mosaicUrls.length > 0;

  return (
    <Link
      href={href}
      className={cn(
        "group relative block aspect-[4/3] overflow-hidden rounded-md border border-line bg-paper",
        "transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        "outline-none",
        className,
      )}
    >
      {hasMosaic ? (
        <CategoryMosaic urls={mosaicUrls} />
      ) : (
        <Image
          src={BROWSE_MORE_FALLBACK}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/55 to-transparent"
        aria-hidden
      />

      <span className="absolute left-3 top-3 z-10 rounded-full bg-black/65 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-[2px] md:left-3.5 md:top-3.5">
        {formatLabel(LABELS.moreCategoriesCount, {
          count: String(moreCount),
        })}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 p-3 md:p-3.5">
        <span className="text-body font-medium leading-snug text-white">
          {LABELS.browseCategories}
        </span>
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 text-white/80 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
    </Link>
  );
}
