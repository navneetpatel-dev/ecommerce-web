"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../../utils/product-editor/variantDrafts";
import { VariantCard } from "./VariantCard.component";
import { VariantFields } from "./VariantFields.component";

interface NewVariantRowProps {
  draft: VariantDraft;
  errors?: VariantDraftErrors;
  busy: boolean;
  priceLocked: boolean;
  onPatch: (key: string, patch: Partial<VariantDraft>) => void;
  onSave: (key: string) => void;
  onDiscard: (key: string) => void;
}

/** A variant not saved yet: add it, or drop the row. */
export function NewVariantRow({
  draft,
  errors,
  busy,
  priceLocked,
  onPatch,
  onSave,
  onDiscard,
}: NewVariantRowProps) {
  const handleChange = (patch: Partial<VariantDraft>) =>
    onPatch(draft.key, patch);
  const handleSave = () => onSave(draft.key);
  const handleDiscard = () => onDiscard(draft.key);
  const actions = (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-label={LABELS.removeVariant}
        disabled={busy}
        onClick={handleDiscard}
      >
        <X aria-hidden />
        <span>{LABELS.cancel}</span>
      </Button>
      <Button
        type="button"
        size="sm"
        loading={busy}
        disabled={busy || priceLocked}
        onClick={handleSave}
      >
        <Plus aria-hidden />
        <span>{LABELS.addVariant}</span>
      </Button>
    </>
  );
  return (
    <VariantCard title={LABELS.newVariant} actions={actions}>
      <VariantFields
        draft={draft}
        errors={errors}
        disabled={busy}
        priceLocked={priceLocked}
        onChange={handleChange}
      />
    </VariantCard>
  );
}
