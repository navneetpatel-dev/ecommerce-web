import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { categoriesViewStyles } from "./categoriesView.styles";

export function CategoriesEmptyState() {
  return (
    <div className={categoriesViewStyles.emptyContainer}>
      <LayoutGrid
        className={categoriesViewStyles.emptyIcon}
        strokeWidth={1.25}
      />
      <p className={categoriesViewStyles.emptyTitle}>
        {LABELS.noCategoriesYet}
      </p>
      <Link href={PATHS.products} className={categoriesViewStyles.emptyLink}>
        {LABELS.browseProducts} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
