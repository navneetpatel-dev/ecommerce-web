"use client";

import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { cn } from "@/shared/utils/dom/cn";
import type { CategoryOptionData } from "../../types/product-editor/types";
import { productEditorFormStyles as styles } from "../../styles/product-editor/productEditorForm.styles";

const levelOf = (depth: number) =>
  Math.min(depth, styles.categoryThumbSize.length - 1);

/** The tree guide in front of a nested category: one line per level, the last one bending into the row. */
function CategoryGuides({ depth }: { depth: number }) {
  return (
    <>
      {Array.from({ length: depth }, (_, index) => (
        <span
          key={index}
          aria-hidden
          className={cn(
            styles.categoryGuide,
            index === depth - 1 && styles.categoryGuideElbow,
          )}
        />
      ))}
    </>
  );
}

/**
 * One category in the picker as part of a tree: top-level categories are larger and bold, each level
 * below is smaller and softer, joined by guide lines. Shows its picture, or the shared no-image graphic.
 */
export function ProductCategoryOption({
  name,
  depth = 0,
  imageUrl,
}: Omit<CategoryOptionData, "id">) {
  const level = levelOf(depth);
  return (
    <span className={styles.categoryOption}>
      <CategoryGuides depth={level} />
      <span
        className={cn(styles.categoryThumb, styles.categoryThumbSize[level])}
      >
        <MediaImage src={imageUrl} alt="" sizes="36px" />
      </span>
      <span className={styles.categoryName[level]}>{name}</span>
    </span>
  );
}
