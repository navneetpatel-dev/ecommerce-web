"use client";

import { Save, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { VariantDraft } from "../../../utils/product-editor/variantDrafts";
import { VariantCard } from "./VariantCard.component";
import { VariantFields } from "./VariantFields.component";

interface ExistingVariantRowProps {
  draft: VariantDraft;
  busy: boolean;
  priceLocked: boolean;
  canDelete: boolean;
  onPatch: (key: string, patch: Partial<VariantDraft>) => void;
  onSave: (key: string) => void;
  onRemove: (key: string) => void;
}

/** A saved variant: SKU fixed, everything else editable, saved row by row. */
export function ExistingVariantRow({
  draft,
  busy,
  priceLocked,
  canDelete,
  onPatch,
  onSave,
  onRemove,
}: ExistingVariantRowProps) {
  const handleChange = (patch: Partial<VariantDraft>) =>
    onPatch(draft.key, patch);
  const handleSave = () => onSave(draft.key);
  const handleRemove = () => onRemove(draft.key);
  const actions = (
    <>
      {canDelete ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={LABELS.removeVariant}
          disabled={busy}
          onClick={handleRemove}
        >
          <Trash2 aria-hidden />
          <span>{LABELS.removeVariant}</span>
        </Button>
      ) : null}
      <Button
        type="button"
        size="sm"
        loading={busy}
        disabled={busy}
        onClick={handleSave}
      >
        <Save aria-hidden />
        <span>{LABELS.saveVariant}</span>
      </Button>
    </>
  );
  return (
    <VariantCard title={draft.sku} actions={actions}>
      <VariantFields
        draft={draft}
        disabled={busy}
        skuLocked
        priceLocked={priceLocked}
        onChange={handleChange}
      />
    </VariantCard>
  );
}
