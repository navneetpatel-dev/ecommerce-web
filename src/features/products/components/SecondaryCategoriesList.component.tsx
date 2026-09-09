import { memo } from "react";
import Link from "next/link";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { PRODUCT_SPECIFICATIONS_STYLES } from "./productSpecifications.styles";

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
          <Link
            key={category.id}
            href={PATHS.category(category.slug)}
            className={PRODUCT_SPECIFICATIONS_STYLES.categoryChip}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
});
