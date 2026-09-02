"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

interface ClearCartActionProps {
  onClear: () => void;
  isClearing?: boolean;
}

export function ClearCartAction({
  onClear,
  isClearing = false,
}: ClearCartActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="shrink-0 text-danger hover:bg-danger-subtle hover:text-danger"
        disabled={isClearing}
        onClick={() => setOpen(true)}
      >
        <Trash2 size={16} aria-hidden />
        {LABELS.clearAll}
      </Button>

      <StatusDialog
        open={open}
        onOpenChange={setOpen}
        title={LABELS.clearCartTitle}
        description={LABELS.clearCartDescription}
        variant="danger"
        secondaryAction={{
          label: LABELS.cancel,
          variant: "outline",
          onClick: () => setOpen(false),
        }}
        primaryAction={{
          label: LABELS.clearAll,
          variant: "destructive",
          loading: isClearing,
          onClick: () => {
            setOpen(false);
            onClear();
          },
        }}
      />
    </>
  );
}
