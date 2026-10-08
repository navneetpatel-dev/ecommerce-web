"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
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
      <Button
        size="sm"
        variant="outline"
        type="button"
        className={tableMenuButtonClass("edit")}
        onClick={handleOpenDialog}
      >
        <FileText strokeWidth={2.25} aria-hidden />
        <span>{LABELS.viewKycDocuments}</span>
      </Button>
      <VendorKycDocumentsDialog
        vendorId={vendorId}
        vendorName={vendorName}
        open={open}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
