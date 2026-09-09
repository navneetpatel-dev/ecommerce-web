import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { resolveCategoryImageUrl } from "../utils/categoryHelpers";
import type { Category } from "@/shared/api/types";

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

export function useCategoryMoreCardPresentation(
  overflowCategories: Category[],
  moreCount: number,
) {
  const mosaicUrls = useMemo(
    () => pickMosaicUrls(overflowCategories),
    [overflowCategories],
  );
  const hasMosaic = mosaicUrls.length > 0;
  const countBadgeLabel = useMemo(
    () =>
      formatLabel(LABELS.moreCategoriesCount, {
        count: String(moreCount),
      }),
    [moreCount],
  );

  return {
    mosaicUrls,
    hasMosaic,
    countBadgeLabel,
  };
}
