"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { VendorKycDocumentsDialog } from "./VendorKycDocumentsDialog.component";

interface VendorKycDocumentsMenuActionProps {
  vendorId: string;
  vendorName: string;
  onClose?: () => void;
}

/** Labeled KYC documents trigger + dialog for table row kebab menus. */
export function VendorKycDocumentsMenuAction({
  vendorId,
  vendorName,
  onClose,
}: VendorKycDocumentsMenuActionProps) {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) onClose?.();
  };

  return (
    <>
      <RowActionButton
        label={LABELS.viewKycDocuments}
        icon={FileText}
        className={tableMenuButtonClass("edit")}
        onClick={handleOpenDialog}
      />
      <VendorKycDocumentsDialog
        vendorId={vendorId}
        vendorName={vendorName}
        open={open}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
