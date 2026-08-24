"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
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

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        type="button"
        className={tableMenuButtonClass("edit")}
        onClick={() => setOpen(true)}
      >
        <FileText strokeWidth={2.25} aria-hidden />
        <span>{LABELS.viewKycDocuments}</span>
      </Button>
      <VendorKycDocumentsDialog
        vendorId={vendorId}
        vendorName={vendorName}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) onClose?.();
        }}
      />
    </>
  );
}
