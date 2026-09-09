import { useCallback, useState } from "react";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { resolveCategoryImageUrl } from "../utils/categoryHelpers";
import type { Category } from "@/shared/api/types";

interface UseCategoryCardPresentationParams {
  category: Category;
  href?: string;
}

export function useCategoryCardPresentation({
  category,
  href,
}: UseCategoryCardPresentationParams) {
  const imageUrl = resolveCategoryImageUrl(category);
  const [unavailable, setUnavailable] = useState(!imageUrl);
  const hasImage = !unavailable;
  const linkHref = href ?? PATHS.category(category.slug);

  const handleUnavailableChange = useCallback((next: boolean) => {
    setUnavailable(next);
  }, []);

  const unavailableLabel = formatLabel(LABELS.categoryImageUnavailable, {
    name: category.name,
  });

  return {
    imageUrl,
    hasImage,
    linkHref,
    unavailableLabel,
    handleUnavailableChange,
  };
}
