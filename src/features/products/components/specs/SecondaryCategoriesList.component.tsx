import { memo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_SPECIFICATIONS_STYLES } from "./productSpecifications.styles";
import { SecondaryCategoryChip } from "./SecondaryCategoryChip.component";

interface SecondaryCategory {
  id: string;
  name: string;
  slug: string;
}

interface SecondaryCategoriesListProps {
  categories: SecondaryCategory[];
}

export const SecondaryCategoriesList = memo(function SecondaryCategoriesList({
  categories,
}: SecondaryCategoriesListProps) {
  if (categories.length === 0) return null;

  return (
    <div className={PRODUCT_SPECIFICATIONS_STYLES.categoriesContainer}>
      <p className={PRODUCT_SPECIFICATIONS_STYLES.categoriesTitle}>
        {LABELS.alsoInCategories}
      </p>
      <div className={PRODUCT_SPECIFICATIONS_STYLES.categoriesList}>
        {categories.map((category) => (
          <SecondaryCategoryChip key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
});
