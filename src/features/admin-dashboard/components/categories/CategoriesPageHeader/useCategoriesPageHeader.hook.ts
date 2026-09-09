import { useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CategoryFormInput } from "../../../schemas/categories/categories.schema";

interface UseCategoriesPageHeaderProps {
  form: UseFormReturn<CategoryFormInput>;
  onSubmit: (data: CategoryFormInput) => void;
}

export function useCategoriesPageHeader({
  form,
  onSubmit,
}: UseCategoriesPageHeaderProps) {
  const onInvalid = useCallback(() => {
    void form.trigger();
  }, [form]);

  const handleSubmit = form.handleSubmit(onSubmit, onInvalid);

  return {
    handleSubmit,
  };
}
