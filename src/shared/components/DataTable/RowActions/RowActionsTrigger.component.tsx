"use client";

import { forwardRef } from "react";
import { LoaderCircle, MoreHorizontal } from "lucide-react";
import { Button, type ButtonProps } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { tableRowActionsStyles } from "../../../styles/data-table/dataTableComponents.styles";
import { rowActionsStyles } from "../../../styles/data-table/rowActions.styles";

type RowActionsTriggerProps = ButtonProps & { busy: boolean };

/** The ⋮ button; shows a spinner while one of its actions is running. */
export const RowActionsTrigger = forwardRef<
  HTMLButtonElement,
  RowActionsTriggerProps
>(function RowActionsTrigger({ busy, ...props }, ref) {
  return (
    <Button
      ref={ref}
      type="button"
      size="sm"
      variant="ghost"
      className={tableRowActionsStyles.triggerBtn}
      aria-label={LABELS.moreActions}
      aria-busy={busy || undefined}
      data-row-actions-trigger=""
      {...props}
    >
      {busy ? (
        <LoaderCircle className={rowActionsStyles.spinner} aria-hidden />
      ) : (
        <MoreHorizontal aria-hidden />
      )}
    </Button>
  );
});
