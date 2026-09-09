"use client";

import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { CategoryOptionsList } from "./AdminReassignProductsAction/CategoryOptionsList.component";
import { useAdminReassignProductsAction } from "./AdminReassignProductsAction/useAdminReassignProductsAction.hook";
import { adminReassignProductsActionStyles as styles } from "./AdminReassignProductsAction/adminReassignProductsAction.styles";

interface AdminReassignProductsActionProps {
  onDone: () => void;
}

export function AdminReassignProductsAction({
  onDone,
}: AdminReassignProductsActionProps) {
  const {
    open,
    categories,
    fromId,
    setFromId,
    toId,
    setToId,
    error,
    message,
    loading,
    canSubmit,
    beginReassign,
    handleOpenChange,
    handleSubmit,
  } = useAdminReassignProductsAction({ onDone });

  const errorMessage = error ? (
    <p className={styles.errorMessage}>{error}</p>
  ) : null;

  const successMessage = message ? (
    <p className={styles.successMessage}>{message}</p>
  ) : null;

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        fullWidth="mobile"
        onClick={beginReassign}
      >
        <ArrowRightLeft aria-hidden />
        {LABELS.reassignProducts}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>{LABELS.reassignProductsTitle}</DialogTitle>
          </DialogHeader>
          <p className={styles.dialogDescription}>
            {LABELS.reassignProductsBody}
          </p>
          <FormSection
            title={LABELS.reassignProducts}
            columns={1}
            className={styles.formSection}
          >
            <FormFieldFrame label={LABELS.reassignFrom}>
              <Select value={fromId} onValueChange={setFromId}>
                <SelectTrigger>
                  <SelectValue placeholder={LABELS.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  <CategoryOptionsList categories={categories} />
                </SelectContent>
              </Select>
            </FormFieldFrame>
            <FormFieldFrame label={LABELS.reassignTo}>
              <Select value={toId} onValueChange={setToId}>
                <SelectTrigger>
                  <SelectValue placeholder={LABELS.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  <CategoryOptionsList categories={categories} />
                </SelectContent>
              </Select>
            </FormFieldFrame>
            {errorMessage}
            {successMessage}
            <FormActions>
              <Button disabled={!canSubmit || loading} onClick={handleSubmit}>
                {LABELS.reassignConfirm}
              </Button>
            </FormActions>
          </FormSection>
        </DialogContent>
      </Dialog>
    </>
  );
}
