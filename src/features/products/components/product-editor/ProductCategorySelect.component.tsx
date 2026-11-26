"use client";

import { useCallback, useMemo } from "react";
import { InfiniteSingleSelect } from "@/shared/components/InfiniteSingleSelect";
import type { InfiniteSingleSelectOption } from "@/shared/components/InfiniteSingleSelect";
import { LABELS } from "@/shared/constants/labels";
import { useProductCategoryPicker } from "../../hooks/product-editor/useProductCategoryPicker.hook";
import type { CategoryOptionData } from "../../types/product-editor/types";
import { categoryFieldLabel } from "../../utils/product-editor/categoryGst";
import { ProductCategoryOption } from "./ProductCategoryOption.component";

const PAGE_SIZE = 25;

interface ProductCategorySelectProps {
  value: string;
  selected: CategoryOptionData | null;
  onSelect: (category: CategoryOptionData) => void;
  /** Offers an empty choice (for example "platform default") and calls this when it is chosen. */
  onClear?: () => void;
  noneLabel?: string;
  error?: boolean;
  disabled?: boolean;
}

/**
 * The category dropdown: a paginated, searchable tree loaded a page at a time as the list is
 * scrolled, and only once it is opened. Each row shows the category's picture, its place in the
 * tree and its GST.
 */
export function ProductCategorySelect({
  value,
  selected,
  onSelect,
  onClear,
  noneLabel,
  error = false,
  disabled = false,
}: ProductCategorySelectProps) {
  const fetchPage = useProductCategoryPicker();

  // Labels the closed field when the category was chosen earlier (editing) without loading a page.
  const pinnedOption = useMemo<InfiniteSingleSelectOption | null>(
    () =>
      selected
        ? {
            id: selected.id,
            label: categoryFieldLabel(selected),
            data: selected,
          }
        : null,
    [selected],
  );

  const handleSelectOption = useCallback(
    (option: InfiniteSingleSelectOption) => {
      if (option.data) onSelect(option.data as CategoryOptionData);
    },
    [onSelect],
  );
  const renderOption = useCallback((option: InfiniteSingleSelectOption) => {
    const category = option.data as CategoryOptionData;
    return <ProductCategoryOption {...category} />;
  }, []);
  // The chosen category arrives through `onSelect`; an empty choice (when offered) through `onClear`.
  const handleChange = useCallback(
    (id: string) => {
      if (!id) onClear?.();
    },
    [onClear],
  );

  return (
    <InfiniteSingleSelect
      value={value}
      onChange={handleChange}
      onSelectOption={handleSelectOption}
      renderOption={renderOption}
      fetchPage={fetchPage}
      pinnedOption={pinnedOption}
      pinnedInList={false}
      allowNone={Boolean(onClear)}
      noneLabel={noneLabel}
      placeholder={noneLabel ?? LABELS.selectCategory}
      searchPlaceholder={LABELS.searchCategories}
      emptyMessage={LABELS.noCategoriesFound}
      pageSize={PAGE_SIZE}
      error={error}
      disabled={disabled}
    />
  );
}
