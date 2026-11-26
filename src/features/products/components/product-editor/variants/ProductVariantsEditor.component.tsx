"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../../utils/product-editor/variantDrafts";
import { useVariantDraftRows } from "../../../hooks/product-editor/useVariantDraftRows.hook";
import { variantsEditorStyles } from "../../../styles/product-editor/variantsEditor.styles";
import { VariantDraftList } from "./VariantDraftList.component";

interface ProductVariantsEditorProps {
  rows: VariantDraft[];
  errors: Record<string, VariantDraftErrors>;
  disabled: boolean;
  onChange: (rows: VariantDraft[]) => void;
}

/** Variants section of the create form: rows are saved after the product is created. */
export function ProductVariantsEditor({
  rows,
  errors,
  disabled,
  onChange,
}: ProductVariantsEditorProps) {
  const { addRow, patchRow, removeRow } = useVariantDraftRows(rows, onChange);
  return (
    <FormSection
      title={LABELS.variantsSection}
      hint={LABELS.variantsSectionHint}
      columns={1}
    >
      <div className={variantsEditorStyles.stack}>
        <VariantDraftList
          rows={rows}
          errors={errors}
          disabled={disabled}
          onPatch={patchRow}
          onRemove={removeRow}
        />
        <div className={variantsEditorStyles.actions}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={addRow}
          >
            <Plus aria-hidden />
            <span>{LABELS.addVariant}</span>
          </Button>
        </div>
      </div>
    </FormSection>
  );
}
