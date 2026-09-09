"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import type { Category } from "@/shared/api/types";
import { categoryCardStyles } from "../../styles/browse/categoryCard.styles";
import { CategoryMosaic } from "./CategoryMosaic.component";
import { useCategoryMoreCardPresentation } from "../../hooks/browse/useCategoryMoreCardPresentation.hook";

/** Fallback when overflow categories have no cover images. */
const BROWSE_MORE_FALLBACK = "/images/category-browse-more.jpg";

interface CategoryMoreCardProps {
  href: string;
  moreCount: number;
  overflowCategories: Category[];
  className?: string;
}

export function CategoryMoreCard({
  href,
  moreCount,
  overflowCategories,
  className,
}: CategoryMoreCardProps) {
  const { mosaicUrls, hasMosaic, countBadgeLabel } =
    useCategoryMoreCardPresentation(overflowCategories, moreCount);

  return (
    <Link
      href={href}
      className={categoryCardStyles.cardLink(hasMosaic, className)}
    >
      {hasMosaic ? (
        <CategoryMosaic urls={mosaicUrls} />
      ) : (
        <Image
          src={BROWSE_MORE_FALLBACK}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className={categoryCardStyles.image}
        />
      )}

      <div className={categoryCardStyles.moreOverlayBottom} aria-hidden />
      <div className={categoryCardStyles.moreOverlayTop} aria-hidden />

      <span className={categoryCardStyles.moreBadge}>{countBadgeLabel}</span>

      <div className={categoryCardStyles.labelRow}>
        <span className={categoryCardStyles.moreTitle}>
          {LABELS.browseCategories}
        </span>
        <ArrowUpRight
          className={categoryCardStyles.moreIcon}
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
    </Link>
  );
}
