import type { Category } from "@/shared/api/types";
import { categoriesViewStyles } from "../../styles/browse/categoriesView.styles";
import { CategoryIcon } from "./CategoryIcon.component";

interface CategorySubcategoryIconProps {
  category: Category;
}

export function CategorySubcategoryIcon({
  category,
}: CategorySubcategoryIconProps) {
  return (
    <CategoryIcon
      category={category}
      className={categoriesViewStyles.childIcon}
    />
  );
}
