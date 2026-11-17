"use client";

import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";

export interface AdminShippingZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  states: string;
  pincodePrefixes: string;
  createError?: string | null;
  onNameChange: (value: string) => void;
  onStatesChange: (value: string) => void;
  onPincodePrefixesChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function AdminShippingZoneDialog({
  open,
  onOpenChange,
  name,
  states,
  pincodePrefixes,
  createError = null,
  onNameChange,
  onStatesChange,
  onPincodePrefixesChange,
  onSubmit,
}: AdminShippingZoneDialogProps) {
  const canCreate = Boolean(name.trim());

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canCreate) return;
    onSubmit(event);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{LABELS.addShippingZone}</DialogTitle>
          <DialogDescription>
            Define a geographic shipping zone by state coverage or 3-digit
            pincode prefixes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <FormFieldFrame
            label={LABELS.zoneName}
            htmlFor="shipping-zone-dialog-name"
          >
            <Input
              id="shipping-zone-dialog-name"
              placeholder={LABELS.zoneName}
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onNameChange(e.target.value)
              }
              required
            />
          </FormFieldFrame>

          <FormFieldFrame
            label={LABELS.states}
            htmlFor="shipping-zone-dialog-states"
            hint={LABELS.zoneStatesHint}
          >
            <Input
              id="shipping-zone-dialog-states"
              placeholder="e.g. Maharashtra, Karnataka, Delhi"
              value={states}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onStatesChange(e.target.value)
              }
            />
          </FormFieldFrame>

          <FormFieldFrame
            label={LABELS.pincodePrefixes}
            htmlFor="shipping-zone-dialog-prefixes"
            hint={LABELS.zonePincodePrefixesHint}
          >
            <Input
              id="shipping-zone-dialog-prefixes"
              placeholder="e.g. 110, 400, 560"
              value={pincodePrefixes}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onPincodePrefixesChange(e.target.value)
              }
            />
          </FormFieldFrame>

          <FormError
            error={createError}
            fallback={LABELS.couldNotCreateShippingZone}
          />

          <DialogFooter className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {LABELS.cancel}
            </Button>
            <Button type="submit" disabled={!canCreate}>
              {LABELS.addShippingZone}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
