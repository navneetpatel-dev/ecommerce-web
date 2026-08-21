"use client";

import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CategoryFormInput } from "../../schemas/categories.schema";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
import { CheckboxField } from "@/shared/components/CheckboxField";

interface AdminCategoryPolicyFieldsProps {
  form: UseFormReturn<CategoryFormInput>;
  showError: (name: keyof CategoryFormInput) => string | undefined;
  idPrefix: string;
}

export function AdminCategoryPolicyFields({
  form,
  showError,
  idPrefix,
}: AdminCategoryPolicyFieldsProps) {
  const { register, control } = form;

  return (
    <FormSection
      title={LABELS.categoryFormSectionPolicies}
      hint={LABELS.categoryFormSectionPoliciesHint}
    >
      <FormFieldFrame
        label={LABELS.categoryReturnWindowDays}
        htmlFor={`${idPrefix}-return-window`}
        hint={LABELS.categoryReturnWindowHint}
        error={showError("returnWindowDays")}
      >
        <Input
          id={`${idPrefix}-return-window`}
          inputMode="numeric"
          error={Boolean(showError("returnWindowDays"))}
          {...register("returnWindowDays")}
        />
      </FormFieldFrame>

      <FormFieldFrame label={LABELS.categoryCodEnabled}>
        <Controller
          name="codEnabled"
          control={control}
          render={({ field }) => (
            <CheckboxField
              id={`${idPrefix}-cod`}
              checked={field.value}
              onCheckedChange={field.onChange}
              label={LABELS.categoryCodEnabled}
            />
          )}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.categoryDefaultWarrantyMonths}
        htmlFor={`${idPrefix}-warranty-months`}
        error={showError("defaultWarrantyMonths")}
      >
        <Input
          id={`${idPrefix}-warranty-months`}
          inputMode="numeric"
          error={Boolean(showError("defaultWarrantyMonths"))}
          {...register("defaultWarrantyMonths")}
        />
      </FormFieldFrame>

      <FormFieldFrame label={LABELS.categoryDefaultWarrantyType}>
        <Controller
          name="defaultWarrantyType"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? field.value : "__inherit__"}
              onValueChange={(value) =>
                field.onChange(value === "__inherit__" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={LABELS.inheritDefault} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__inherit__">
                  {LABELS.inheritDefault}
                </SelectItem>
                <SelectItem value={WARRANTY_TYPE.MANUFACTURER}>
                  {LABELS.warrantyManufacturer}
                </SelectItem>
                <SelectItem value={WARRANTY_TYPE.SELLER}>
                  {LABELS.warrantySeller}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
