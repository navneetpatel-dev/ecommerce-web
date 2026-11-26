import type { Category } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { categoriesTableStyles as styles } from "../../../styles/categories/categoriesTable.styles";

/** The category name, indented by its level in the tree (a search shows where it sits instead). */
export function CategoryNameCell({ category }: { category: Category }) {
  const indent = { paddingLeft: `${(category.depth ?? 0) * 1.25}rem` };
  return (
    <span style={indent} className={styles.nameCell}>
      <span>{category.name}</span>
      {category.path ? (
        <span className={styles.pathHint}>{category.path}</span>
      ) : null}
    </span>
  );
}

const SOURCE_LABEL = {
  own: () => LABELS.taxSourceOwn,
  inherited: (name: string) => formatLabel(LABELS.taxSourceInherited, { name }),
  default: () => LABELS.taxSourceDefault,
  fallback: () => LABELS.taxSourceFallback,
} as const;

/** The GST this category gets, with where it comes from as a tooltip. */
export function CategoryGstCell({ category }: { category: Category }) {
  const gst = category.gst;
  if (!gst) return null;
  const source = SOURCE_LABEL[gst.source](gst.fromCategoryName ?? "");
  return (
    <span title={source} className={styles.gstCell}>
      {gst.percent}%
    </span>
  );
}
