"use client";

import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../../utils/product-editor/variantDrafts";

import type { ProductVariant } from "@/shared/api/types";
import { ExistingVariantRow } from "./ExistingVariantRow.component";

export function ExistingVariantList(props: {
  rows: VariantDraft[];
  errors: Record<string, VariantDraftErrors>;
  /** The saved variants, to flag the ones that are above the MRP. */
  variants?: ProductVariant[];
  busyKey: string | null;
  priceLocked: boolean;
  canDelete: boolean;
  onPatch: (key: string, patch: Partial<VariantDraft>) => void;
  onSave: (key: string) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <>
      {props.rows.map((row) => (
        <ExistingVariantRow
          key={row.key}
          draft={row}
          errors={props.errors[row.key]}
          aboveMrp={
            props.variants?.find((variant) => variant.id === row.key)?.aboveMrp
          }
          busy={props.busyKey === row.key}
          priceLocked={props.priceLocked}
          canDelete={props.canDelete}
          onPatch={props.onPatch}
          onSave={props.onSave}
          onRemove={props.onRemove}
        />
      ))}
    </>
  );
}
