"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../../utils/product-editor/variantDrafts";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { VariantCard } from "./VariantCard.component";
import { VariantFields } from "./VariantFields.component";

interface VariantDraftRowProps {
  draft: VariantDraft;
  errors?: VariantDraftErrors;
  disabled: boolean;
  onPatch: (key: string, patch: Partial<VariantDraft>) => void;
  onRemove: (key: string) => void;
  index: number;
}

export function VariantDraftRow({
  draft,
  errors,
  disabled,
  onPatch,
  onRemove,
  index,
}: VariantDraftRowProps) {
  const handleChange = (patch: Partial<VariantDraft>) =>
    onPatch(draft.key, patch);
  const handleRemove = () => onRemove(draft.key);
  const actions = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={LABELS.removeVariant}
      disabled={disabled}
      onClick={handleRemove}
    >
      <Trash2 aria-hidden />
      <span>{LABELS.removeVariant}</span>
    </Button>
  );
  return (
    <VariantCard
      title={formatLabel(LABELS.variantNumber, { number: index + 1 })}
      actions={actions}
    >
      <VariantFields
        draft={draft}
        errors={errors}
        disabled={disabled}
        onChange={handleChange}
      />
    </VariantCard>
  );
}
