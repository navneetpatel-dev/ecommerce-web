import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import type { VendorDocumentType } from "@/shared/constants/statuses";
import { vendorDocumentTypeLabel } from "@/shared/utils/vendorDocumentTypeLabel";
import { cn } from "@/shared/utils/cn";
import type { Category } from "@/shared/api/types";

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
            "max-h-48 space-y-2 overflow-y-auto rounded-md border p-3",
            errorMessage ? "border-danger" : "border-line",
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
        <div className="space-y-2 rounded-md border border-line bg-paper/40 p-3">
          <p className="text-[0.875rem] font-medium text-ink">
            {LABELS.requiredDocuments}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-body-sm text-ink-muted">
            {requiredDocs.map((type) => (
              <li key={type}>{vendorDocumentTypeLabel(type)}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </FormSection>
  );
}
