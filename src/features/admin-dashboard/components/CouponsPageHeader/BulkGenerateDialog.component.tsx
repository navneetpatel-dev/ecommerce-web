"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { CreateCouponForm } from "../CreateCouponForm.component";
import { LABELS } from "@/shared/constants/labels";
import { useBulkCouponGeneration } from "../../hooks/useBulkCouponGeneration.hook";
import { bulkGenerateDialogStyles as styles } from "./bulkGenerateDialog.styles";

interface BulkGenerateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function BulkGenerateDialog({ open, setOpen }: BulkGenerateDialogProps) {
  const bulk = useBulkCouponGeneration(() => setOpen(false));

  const close = () => {
    if (bulk.isPending) return;
    bulk.closeAndReset();
    setOpen(false);
  };

  const countFieldChange = (value: number | undefined) => {
    bulk.bulkMetaForm.setValue("count", value ?? 1, {
      shouldValidate: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>{LABELS.bulkGenerateTitle}</DialogTitle>
        </DialogHeader>
        <FormStack>
          <FormSection
            title={LABELS.bulkCouponMetaSection}
            hint={LABELS.bulkCouponMetaSectionHint}
          >
            <FormFieldFrame
              label={LABELS.bulkBatchName}
              htmlFor="bulk-name"
              className={styles.metaNameField}
              error={bulk.bulkMetaForm.formState.errors.name?.message}
            >
              <Input id="bulk-name" {...bulk.bulkMetaForm.register("name")} />
            </FormFieldFrame>
            <FormFieldFrame label={LABELS.bulkCount}>
              <Controller
                name="count"
                control={bulk.bulkMetaForm.control}
                render={({ field }) => (
                  <NumberInput
                    value={field.value}
                    min={1}
                    max={500}
                    step={1}
                    onChange={countFieldChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormFieldFrame>
            <FormFieldFrame
              label={LABELS.bulkPrefix}
              htmlFor="bulk-prefix"
              error={bulk.bulkMetaForm.formState.errors.prefix?.message}
            >
              <Input
                id="bulk-prefix"
                {...bulk.bulkMetaForm.register("prefix")}
              />
            </FormFieldFrame>
          </FormSection>
          <CreateCouponForm
            form={bulk.templateForm}
            isPending={false}
            hideSubmit
            hideCodeField
          />
          {bulk.errorMessage ? (
            <p className={styles.errorMessage} role="alert">
              {bulk.errorMessage}
            </p>
          ) : null}
          <FormActions>
            <DisabledActionHint
              disabled={!bulk.canBulk}
              message={LABELS.bulkGenerateHint}
              className={styles.actionsWrapper}
            >
              <Button
                type="button"
                className={styles.submitButton}
                loading={bulk.isPending}
                disabled={!bulk.canBulk || bulk.isPending}
                onClick={bulk.submit}
              >
                {LABELS.bulkGenerate}
              </Button>
            </DisabledActionHint>
          </FormActions>
        </FormStack>
      </DialogContent>
    </Dialog>
  );
}
