"use client";

import type { VariantDraft } from "../../../utils/product-editor/variantDrafts";

import { ExistingVariantRow } from "./ExistingVariantRow.component";

export function ExistingVariantList(props: {
  rows: VariantDraft[];
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
