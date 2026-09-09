import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import type { Category } from "@/shared/api/types";
import type { CategoryRootWithChildren } from "../../hooks/browse/useCategoriesPage.hook";
import { categoriesViewStyles } from "./categoriesView.styles";
import { CategorySubcategoryGroup } from "./CategorySubcategoryGroup.component";

interface CategorySubcategoriesSectionProps {
  rootsWithChildren: CategoryRootWithChildren[];
  tree: Category[];
}

export function CategorySubcategoriesSection({
  rootsWithChildren,
  tree,
}: CategorySubcategoriesSectionProps) {
  if (rootsWithChildren.length === 0) return null;

  return (
    <div className={categoriesViewStyles.subcategoriesSection}>
      <div>
        <TextEyebrow className={categoriesViewStyles.subcategoriesEyebrow}>
          {LABELS.digDeeper}
        </TextEyebrow>
        <h2 className={categoriesViewStyles.subcategoriesTitle}>
          {LABELS.subcategories}
        </h2>
      </div>
      {rootsWithChildren.map((group) => (
        <CategorySubcategoryGroup
          key={group.root.id}
          group={group}
          tree={tree}
        />
      ))}
    </div>
  );
}
