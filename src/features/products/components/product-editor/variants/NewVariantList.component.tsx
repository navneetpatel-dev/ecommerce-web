"use client";

import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../../utils/product-editor/variantDrafts";

import { NewVariantRow } from "./NewVariantRow.component";

export function NewVariantList(props: {
  rows: VariantDraft[];
  errors: Record<string, VariantDraftErrors>;
  busyKey: string | null;
  priceLocked: boolean;
  onPatch: (key: string, patch: Partial<VariantDraft>) => void;
  onSave: (key: string) => void;
  onDiscard: (key: string) => void;
}) {
  return (
    <>
      {props.rows.map((row) => (
        <NewVariantRow
          key={row.key}
          draft={row}
          errors={props.errors[row.key]}
          busy={props.busyKey === row.key}
          priceLocked={props.priceLocked}
          onPatch={props.onPatch}
          onSave={props.onSave}
          onDiscard={props.onDiscard}
        />
      ))}
    </>
  );
}
