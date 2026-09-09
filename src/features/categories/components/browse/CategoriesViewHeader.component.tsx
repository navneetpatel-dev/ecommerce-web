import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { categoriesViewStyles } from "../../styles/browse/categoriesView.styles";

export function CategoriesViewHeader() {
  return (
    <div className={categoriesViewStyles.headerWrapper}>
      <TextEyebrow className={categoriesViewStyles.headerEyebrow}>
        {LABELS.browse}
      </TextEyebrow>
      <h1 className={categoriesViewStyles.headerTitle}>
        {LABELS.allCategories}
      </h1>
      <p className={categoriesViewStyles.headerHint}>
        {formatLabel(LABELS.categoriesIndexHint, { site: LABELS.brandName })}
      </p>
    </div>
  );
}
