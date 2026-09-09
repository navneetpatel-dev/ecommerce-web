"use client";

import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { AdminCategoryCreateForm } from "../AdminCategoryCreateForm.component";
import type { CategoryFormInput } from "../../schemas/categories.schema";
import { categoriesPageHeaderStyles } from "./categoriesPageHeader.styles";
import { useCategoriesPageHeader } from "./useCategoriesPageHeader.hook";

export interface CategoriesPageHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<CategoryFormInput>;
  onSubmit: (data: CategoryFormInput) => void;
  isPending: boolean;
  error?: string | null;
  toolbar?: ReactNode;
}

export function CategoriesPageHeader({
  open,
  setOpen,
  form,
  onSubmit,
  isPending,
  error = null,
  toolbar,
}: CategoriesPageHeaderProps) {
  const { handleSubmit } = useCategoriesPageHeader({ form, onSubmit });

  return (
    <div className={categoriesPageHeaderStyles.root}>
      <div className={categoriesPageHeaderStyles.headingWrapper}>
        <h2 className={categoriesPageHeaderStyles.title}>
          {LABELS.categories}
        </h2>
        <p className={categoriesPageHeaderStyles.hint}>
          {LABELS.createCategoryHint}
        </p>
      </div>
      <ButtonGroup className={categoriesPageHeaderStyles.buttonGroup}>
        {toolbar}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" size="sm" fullWidth="mobile">
              <Plus aria-hidden />
              {LABELS.createCategory}
            </Button>
          </DialogTrigger>
          <DialogContent className={categoriesPageHeaderStyles.dialogContent}>
            <DialogHeader>
              <DialogTitle>{LABELS.createCategory}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className={categoriesPageHeaderStyles.form}
            >
              <AdminCategoryCreateForm
                form={form}
                isPending={isPending}
                error={error}
              />
            </form>
          </DialogContent>
        </Dialog>
      </ButtonGroup>
    </div>
  );
}
