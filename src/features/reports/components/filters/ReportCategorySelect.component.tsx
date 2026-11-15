"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { useCategories } from "@/features/categories";

interface ReportCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ReportCategorySelect({
  value,
  onChange,
  disabled = false,
}: ReportCategorySelectProps) {
  const { data: categories = [] } = useCategories();

  const handleSelect = (nextValue: string) => {
    onChange(nextValue === "all" ? "" : nextValue);
  };

  return (
    <FormFieldFrame label={LABELS.reportCategory} htmlFor="report-category">
      <Select
        value={value || "all"}
        onValueChange={handleSelect}
        disabled={disabled}
      >
        <SelectTrigger id="report-category">
          <SelectValue placeholder={LABELS.allCategories} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{LABELS.allCategories}</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
