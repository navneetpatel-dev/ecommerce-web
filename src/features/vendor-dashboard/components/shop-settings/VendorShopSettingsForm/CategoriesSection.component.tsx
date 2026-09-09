"use client";

import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { VendorEntityType } from "@/shared/constants/statuses";
import { vendorShopSettingsFormStyles } from "../../../styles/shop-settings/vendorShopSettingsForm.styles";
import { useVendorShopCategories } from "../../../hooks/shop-settings/useVendorShopCategories.hook";
import { VendorCategoryCheckboxList } from "./VendorCategoryCheckboxList.component";
import { VendorEntityTypeOptions } from "./VendorEntityTypeOptions.component";

interface CategoriesSectionProps {
  entityType: VendorEntityType | null;
  categoryIds: string[];
  saving: boolean;
  onEntityTypeChange: (value: VendorEntityType) => void;
  onCategoryIdsChange: (ids: string[]) => void;
  onSaveCategories: () => void;
}

export function CategoriesSection({
  entityType,
  categoryIds,
  saving,
  onEntityTypeChange,
  onCategoryIdsChange,
  onSaveCategories,
}: CategoriesSectionProps) {
  const { categories, selectedSet, toggleCategory, canSave } =
    useVendorShopCategories(categoryIds, onCategoryIdsChange);

  return (
    <FormSection
      title={LABELS.vendorCategories}
      hint={LABELS.vendorCategoriesHint}
    >
      <FormFieldFrame
        label={LABELS.entityType}
        className={vendorShopSettingsFormStyles.inputCol}
      >
        <Select
          value={entityType ?? undefined}
          onValueChange={(value) =>
            onEntityTypeChange(value as VendorEntityType)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.entityType} />
          </SelectTrigger>
          <SelectContent>
            <VendorEntityTypeOptions />
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <VendorCategoryCheckboxList
        categories={categories}
        selectedSet={selectedSet}
        onToggle={toggleCategory}
      />
      <div className={vendorShopSettingsFormStyles.fullWidthCol}>
        <Button
          type="button"
          disabled={saving || !entityType || !canSave}
          onClick={onSaveCategories}
        >
          {LABELS.saveCategories}
        </Button>
      </div>
    </FormSection>
  );
}
