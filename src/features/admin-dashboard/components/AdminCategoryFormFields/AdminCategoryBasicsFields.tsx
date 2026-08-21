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
import { CATEGORY_STATUS } from "@/shared/constants/statuses";
import type { Category } from "@/shared/api/types";
import { NONE_PARENT } from "./useCategoryParentOptions";

interface AdminCategoryBasicsFieldsProps {
  form: UseFormReturn<CategoryFormInput>;
  showError: (name: keyof CategoryFormInput) => string | undefined;
  parentOptions: Category[];
  idPrefix: string;
}

export function AdminCategoryBasicsFields({
  form,
  showError,
  parentOptions,
  idPrefix,
}: AdminCategoryBasicsFieldsProps) {
  const { register, control } = form;

  return (
    <FormSection
      title={LABELS.categoryFormSectionBasics}
      hint={LABELS.categoryFormSectionBasicsHint}
    >
      <FormFieldFrame
        label={LABELS.categoryName}
        htmlFor={`${idPrefix}-name`}
        required
        error={showError("name")}
        className="sm:col-span-2"
      >
        <Input
          id={`${idPrefix}-name`}
          error={Boolean(showError("name"))}
          placeholder={LABELS.categoryName}
          {...register("name")}
        />
      </FormFieldFrame>

      <FormFieldFrame label={LABELS.parentCategory}>
        <Controller
          name="parentId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? field.value : NONE_PARENT}
              onValueChange={(value) =>
                field.onChange(value === NONE_PARENT ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={LABELS.selectParentCategory} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_PARENT}>
                  {LABELS.parentCategoryNone}
                </SelectItem>
                {parentOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldFrame>

      <FormFieldFrame label={LABELS.categoryStatus}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CATEGORY_STATUS.ACTIVE}>
                  {LABELS.categoryStatusActive}
                </SelectItem>
                <SelectItem value={CATEGORY_STATUS.ARCHIVED}>
                  {LABELS.categoryStatusArchived}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
