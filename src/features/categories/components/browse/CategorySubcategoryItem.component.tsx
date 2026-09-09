import Link from "next/link";
import type { Category } from "@/shared/api/types";
import { categoryHref } from "../../utils/browse/categoryHelpers";
import { categoriesViewStyles } from "../../styles/browse/categoriesView.styles";
import { CategorySubcategoryIcon } from "./CategorySubcategoryIcon.component";

interface CategorySubcategoryItemProps {
  child: Category;
  tree: Category[];
}

export function CategorySubcategoryItem({
  child,
  tree,
}: CategorySubcategoryItemProps) {
  return (
    <li>
      <Link
        href={categoryHref(child, tree)}
        className={categoriesViewStyles.childLink}
      >
        <CategorySubcategoryIcon category={child} />
        <span className={categoriesViewStyles.childName}>{child.name}</span>
      </Link>
    </li>
  );
}
