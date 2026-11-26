"use client";

import { PlatformListedBadge } from "@/features/products";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { adminProductEditorStyles } from "./adminProductEditor.styles";

interface ProductVendorReadOnlyProps {
  /** The vendor's business name; empty for the platform's own product. */
  vendorName?: string | null;
  listedByPlatform?: boolean;
}

/** Whose product this is, shown while editing (the owner cannot be changed). */
export function ProductVendorReadOnly({
  vendorName,
  listedByPlatform = false,
}: ProductVendorReadOnlyProps) {
  return (
    <FormFieldFrame label={LABELS.listForVendor}>
      <p className={adminProductEditorStyles.vendorReadOnly}>
        <span>{vendorName || LABELS.platformProductName}</span>
        {listedByPlatform ? <PlatformListedBadge /> : null}
      </p>
    </FormFieldFrame>
  );
}
