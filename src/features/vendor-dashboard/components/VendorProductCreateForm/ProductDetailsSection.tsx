"use client";

import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { NumberInput } from "@/shared/components/NumberInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { PRODUCT_FIELD_LIMITS } from "@/features/products";
import type {
  ProductListingFormField,
  ProductListingFormValues,
} from "@/features/products";

interface ProductDetailsSectionProps {
  values: ProductListingFormValues;
  categories: Array<{ id: string; name: string }>;
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
}

export function ProductDetailsSection({
  values,
  categories,
  disabled,
  getError,
  patchValues,
}: ProductDetailsSectionProps) {
  return (
    <FormSection
      title={LABELS.productFormSectionDetails}
      hint={LABELS.productFormSectionDetailsHint}
    >
      <FormFieldFrame
        label={LABELS.productName}
        required
        error={getError("name")}
      >
        <Input
          placeholder={LABELS.productNamePlaceholder}
          value={values.name}
          maxLength={PRODUCT_FIELD_LIMITS.NAME_MAX}
          error={Boolean(getError("name"))}
          disabled={disabled}
          onChange={(event) => patchValues({ name: event.target.value })}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.pricePlaceholder}
        required
        error={getError("price")}
      >
        <NumberInput
          prefix="₹"
          min={1}
          step={1}
          placeholder={LABELS.pricePlaceholder}
          value={values.price === "" ? undefined : Number(values.price)}
          error={Boolean(getError("price"))}
          disabled={disabled}
          onChange={(value) =>
            patchValues({ price: value == null ? "" : String(value) })
          }
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.listPrice}
        hint={LABELS.productMrpHint}
        error={getError("compareAtPrice")}
      >
        <NumberInput
          prefix="₹"
          min={1}
          step={1}
          placeholder={LABELS.listPrice}
          value={
            values.compareAtPrice === ""
              ? undefined
              : Number(values.compareAtPrice)
          }
          error={Boolean(getError("compareAtPrice"))}
          disabled={disabled}
          onChange={(value) =>
            patchValues({
              compareAtPrice: value == null ? "" : String(value),
            })
          }
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.productBrand} error={getError("brand")}>
        <Input
          placeholder={LABELS.productBrandPlaceholder}
          value={values.brand}
          maxLength={PRODUCT_FIELD_LIMITS.BRAND_MAX}
          error={Boolean(getError("brand"))}
          disabled={disabled}
          onChange={(event) => patchValues({ brand: event.target.value })}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.selectCategory}
        required
        error={getError("categoryId")}
        className="sm:col-span-2"
      >
        <Select
          value={values.categoryId || undefined}
          onValueChange={(value) => patchValues({ categoryId: value })}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn(getError("categoryId") && "border-danger")}
          >
            <SelectValue placeholder={LABELS.selectCategory} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.shortDescription}
        required
        error={getError("description")}
        className="sm:col-span-2"
      >
        <Textarea
          placeholder={LABELS.shortDescription}
          value={values.description}
          maxLength={PRODUCT_FIELD_LIMITS.DESCRIPTION_MAX}
          error={Boolean(getError("description"))}
          disabled={disabled}
          onChange={(event) => patchValues({ description: event.target.value })}
          className="min-h-[6.5rem]"
        />
      </FormFieldFrame>
    </FormSection>
  );
}
