import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import type { VendorDocumentType } from "@/shared/constants/statuses";
import { vendorDocumentTypeLabel } from "@/shared/utils/formatting/vendorDocumentTypeLabel";
import { cn } from "@/shared/utils/dom/cn";
import type { Category } from "@/shared/api/types";
import { vendorRegisterFormStyles as styles } from "../../../styles/register/vendorRegisterForm.styles";

interface VendorRegisterCategoriesSectionProps {
  categories: Category[];
  selectedSet: Set<string>;
  onToggleCategory: (id: string) => void;
  requiredDocs: VendorDocumentType[];
  errorMessage?: string;
}

export function VendorRegisterCategoriesSection({
  categories,
  selectedSet,
  onToggleCategory,
  requiredDocs,
  errorMessage,
}: VendorRegisterCategoriesSectionProps) {
  return (
    <FormSection
      title={LABELS.vendorRegisterSectionCategories}
      hint={LABELS.vendorRegisterSectionCategoriesHint}
      columns={1}
    >
      <FormFieldFrame
        label={LABELS.vendorCategories}
        hint={LABELS.vendorCategoriesHint}
        error={errorMessage}
      >
        <div
          className={cn(
            styles.categoryList,
            errorMessage ? styles.borderDanger : styles.borderLine,
          )}
        >
          {categories.map((category) => (
            <CheckboxField
              key={category.id}
              id={`vendor-register-category-${category.id}`}
              checked={selectedSet.has(category.id)}
              onCheckedChange={() => onToggleCategory(category.id)}
              label={category.name}
            />
          ))}
        </div>
      </FormFieldFrame>

      {requiredDocs.length > 0 ? (
        <div className={styles.requiredDocsCard}>
          <p className={styles.requiredDocsTitle}>{LABELS.requiredDocuments}</p>
          <ul className={styles.requiredDocsList}>
            {requiredDocs.map((type) => (
              <li key={type}>{vendorDocumentTypeLabel(type)}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </FormSection>
  );
}
