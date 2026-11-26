"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { useUrlFilterParams } from "@/shared/hooks/navigation/useUrlFilterParams.hook";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";
import { useDiscardChangesGuard } from "@/shared/hooks/dialogs/useDiscardChangesGuard.hook";
import {
  applyApiErrorsToForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import { categoriesApi } from "@/features/categories";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { AdminEditCategoryAction } from "../../components/categories/AdminEditCategoryAction.component";
import { AdminCategoryAttributesAction } from "../../components/categories/AdminCategoryAttributesAction.component";
import { AdminArchiveCategoryAction } from "../../components/categories/AdminArchiveCategoryAction.component";
import { ArchiveDescription } from "../../components/categories/AdminArchiveCategoryAction/ArchiveDescription.component";
import { AdminReassignProductsAction } from "../../components/categories/AdminReassignProductsAction.component";
import { useAdminDataList } from "../shared/useAdminDataList.hook";
import {
  CATEGORY_FORM_DEFAULTS,
  CategoryFormSchema,
  toCategoryCreateBody,
  type CategoryFormInput,
} from "../../schemas/categories/categories.schema";
import type { Category } from "@/shared/api/types";

export function useAdminCategoriesPage() {
  const urlFilters = useUrlFilterParams<"search" | "status">({ search: ["q"] });
  const search = urlFilters.get("search");
  const status = urlFilters.get("status");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [listVersion, setListVersion] = useState(0);
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(CategoryFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: CATEGORY_FORM_DEFAULTS,
  });

  useUnsavedChanges(form.formState.isDirty);

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion;
      return categoriesApi.listPaginated({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: status || undefined,
      });
    },
    [listVersion, debouncedSearch, status],
  );

  const list = useAdminDataList(load);

  const onSubmit = useCallback(
    async (data: CategoryFormInput) => {
      setIsPending(true);
      setCreateError(null);
      try {
        await categoriesApi.create(toCategoryCreateBody(data));
        form.reset(CATEGORY_FORM_DEFAULTS);
        setOpen(false);
        setListVersion((version) => version + 1);
      } catch (err) {
        const mapped = applyApiErrorsToForm(form, err);
        setCreateError(
          mapped
            ? null
            : getFormLevelApiError(err, LABELS.couldNotSaveCategories),
        );
      } finally {
        setIsPending(false);
      }
    },
    [form],
  );

  const setDialogOpen = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        setCreateError(null);
        form.reset(CATEGORY_FORM_DEFAULTS);
      }
    },
    [form],
  );

  // Dirty dismissal asks for confirmation; the post-save close calls setOpen.
  const discard = useDiscardChangesGuard(form.formState.isDirty);
  const handleDialogOpenChange = (next: boolean) => {
    if (next) setDialogOpen(true);
    else discard.requestClose(() => setDialogOpen(false));
  };
  const deleteCategoryFor = useCallback(
    (rowId: string) => () => categoriesApi.delete(rowId).then(list.reload),
    [list.reload],
  );
  const renderActions = useCallback(
    (row: Category) => (
      <>
        <AdminEditCategoryAction category={row} onSaved={list.reload} />
        <AdminCategoryAttributesAction
          categoryId={row.id}
          categoryName={row.name}
        />
        <AdminArchiveCategoryAction category={row} onDone={list.reload} />
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          title={LABELS.confirmDeleteCategoryTitle}
          description={
            <ArchiveDescription
              categoryId={row.id}
              name={row.name}
              mode="delete"
            />
          }
          onConfirm={deleteCategoryFor(row.id)}
        />
      </>
    ),
    [deleteCategoryFor, list.reload],
  );
  return {
    open,
    setOpen: setDialogOpen,
    handleDialogOpenChange,
    discardOpen: discard.confirmOpen,
    handleDiscardOpenChange: discard.handleConfirmOpenChange,
    confirmDiscard: discard.confirmDiscard,
    cancelDiscard: discard.cancelDiscard,
    form,
    isPending,
    createError,
    onSubmit,
    title: LABELS.categories,
    permission: PERMISSIONS.CATEGORY_MANAGE,
    categories: list.rows as unknown as Category[],
    loading: list.loading,
    error: list.error,
    reload: list.reload,
    pagination: {
      page: list.page,
      totalPages: list.totalPages,
      total: list.total,
      from: list.from,
      to: list.to,
      onPageChange: list.onPageChange,
    },
    renderActions,
    filters: {
      search,
      status,
      onSearchChange: urlFilters.set("search"),
      onStatusChange: urlFilters.set("status"),
      onClear: () => urlFilters.clearAll(["search", "status"]),
    },
    reassignToolbar: <AdminReassignProductsAction onDone={list.reload} />,
  };
}
