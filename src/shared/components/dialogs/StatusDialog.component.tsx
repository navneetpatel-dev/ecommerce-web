"use client";

import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { statusDialogStyles as styles } from "../../styles/dialogs/dialogComponents.styles";
import { StatusDialogHeader } from "./StatusDialog/StatusDialogHeader.component";
import { StatusDialogFooter } from "./StatusDialog/StatusDialogFooter.component";
import type { StatusDialogProps } from "./StatusDialog/statusDialog.types";

export type {
  StatusDialogAction,
  StatusDialogProps,
  StatusDialogVariant,
} from "./StatusDialog/statusDialog.types";

/** The one confirmation dialog of the app. */
export function StatusDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = "info",
  icon,
  primaryAction,
  secondaryAction,
  extraAction,
  size = "default",
  onCloseAutoFocus,
  children,
}: StatusDialogProps) {
  const isWide = size === "wide";
  const hasActions = Boolean(primaryAction || secondaryAction || extraAction);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={isWide ? styles.contentWide : styles.content}
        bodyClassName={styles.body}
        closeButtonPlacement="corner"
        closeButtonClassName={styles.closeButton}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <StatusDialogHeader
          title={title}
          description={description}
          variant={variant}
          icon={icon}
        />

        {children ? (
          <div
            className={
              isWide ? styles.childrenWrapperWide : styles.childrenWrapper
            }
          >
            {children}
          </div>
        ) : null}

        {hasActions ? (
          <StatusDialogFooter
            variant={variant}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            extraAction={extraAction}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
