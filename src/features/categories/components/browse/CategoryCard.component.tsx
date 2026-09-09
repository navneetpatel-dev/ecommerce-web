"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaImage } from "@/shared/components/MediaImage.component";
import type { Category } from "@/shared/api/types";
import { categoryCardStyles } from "./categoryCard.styles";
import { useCategoryCardPresentation } from "./useCategoryCardPresentation.hook";

interface CategoryCardProps {
  category: Category;
  className?: string;
  href?: string;
}

export function CategoryCard({ category, className, href }: CategoryCardProps) {
  const {
    imageUrl,
    hasImage,
    linkHref,
    unavailableLabel,
    handleUnavailableChange,
  } = useCategoryCardPresentation({ category, href });

  return (
    <Link
      href={linkHref}
      className={categoryCardStyles.cardLink(hasImage, className)}
    >
      <MediaImage
        src={imageUrl}
        alt=""
        unavailableLabel={unavailableLabel}
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
        imageClassName={categoryCardStyles.image}
        onUnavailableChange={handleUnavailableChange}
      />

      <div
        className={
          hasImage
            ? categoryCardStyles.overlayWithImage
            : categoryCardStyles.overlayWithoutImage
        }
        aria-hidden
      />

      <div className={categoryCardStyles.labelRow}>
        <h3 className={categoryCardStyles.title(hasImage)}>{category.name}</h3>
        <ArrowUpRight
          className={categoryCardStyles.icon(hasImage)}
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
    </Link>
  );
}
