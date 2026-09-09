"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import {
  VENDOR_ENTITY_TYPE_VALUES,
  type VendorEntityType,
} from "@/shared/constants/statuses";
import { categoriesApi } from "@/features/categories";
import { vendorEntityTypeLabel } from "@/shared/utils/formatting/vendorEntityTypeLabel";
import type { Category } from "@/shared/api/types";
import { vendorShopSettingsFormStyles } from "./vendorShopSettingsForm.styles";

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
  const [categories, setCategories] = useState<Category[]>([]);

  const selectedSet = useMemo(() => new Set(categoryIds), [categoryIds]);

  useEffect(() => {
    void categoriesApi
      .list()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const toggleCategory = (id: string) => {
    const next = selectedSet.has(id)
      ? categoryIds.filter((value) => value !== id)
      : [...categoryIds, id];
    onCategoryIdsChange(next);
  };

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
            {VENDOR_ENTITY_TYPE_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {vendorEntityTypeLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <div className={vendorShopSettingsFormStyles.categoriesScrollBox}>
        {categories.map((category) => (
          <CheckboxField
            key={category.id}
            id={`vendor-shop-category-${category.id}`}
            checked={selectedSet.has(category.id)}
            onCheckedChange={() => toggleCategory(category.id)}
            label={category.name}
          />
        ))}
      </div>
      <div className={vendorShopSettingsFormStyles.fullWidthCol}>
        <Button
          type="button"
          disabled={saving || !entityType || categoryIds.length === 0}
          onClick={onSaveCategories}
        >
          {LABELS.saveCategories}
        </Button>
      </div>
    </FormSection>
  );
}
