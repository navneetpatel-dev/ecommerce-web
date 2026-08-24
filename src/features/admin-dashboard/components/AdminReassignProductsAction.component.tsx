"use client";

import { useState } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { useReassignProducts } from "../hooks/useReassignProducts.hook";

interface AdminReassignProductsActionProps {
  onDone: () => void;
}

export function AdminReassignProductsAction({
  onDone,
}: AdminReassignProductsActionProps) {
  const [open, setOpen] = useState(false);
  const reassign = useReassignProducts(open, onDone);
  const {
    categories,
    fromId,
    setFromId,
    toId,
    setToId,
    error,
    message,
    loading,
    onSubmit,
    clearFeedback,
  } = reassign;

  const beginReassign = () => {
    setOpen(true);
    clearFeedback();
  };

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{LABELS.reassignProductsTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-[0.875rem] text-ink-muted">
            {LABELS.reassignProductsBody}
          </p>
          <FormSection
            title={LABELS.reassignProducts}
            columns={1}
            className="mt-2"
          >
            <FormFieldFrame label={LABELS.reassignFrom}>
              <Select value={fromId} onValueChange={setFromId}>
                <SelectTrigger>
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
            <FormFieldFrame label={LABELS.reassignTo}>
              <Select value={toId} onValueChange={setToId}>
                <SelectTrigger>
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
            {error ? <p className="text-body-sm text-danger">{error}</p> : null}
            {message ? (
              <p className="text-body-sm text-success">{message}</p>
            ) : null}
            <FormActions>
              <Button
                disabled={loading || !fromId || !toId || fromId === toId}
                onClick={() => void onSubmit()}
              >
                {LABELS.reassignConfirm}
              </Button>
            </FormActions>
          </FormSection>
        </DialogContent>
      </Dialog>
    </>
  );
}
