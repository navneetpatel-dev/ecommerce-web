"use client";

import { Button } from "@/shared/components/ui/button";
import { DialogFooter } from "@/shared/components/ui/dialog";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { statusDialogStyles as styles } from "../../../styles/dialogs/dialogComponents.styles";
import type {
  StatusDialogProps,
  StatusDialogVariant,
} from "./statusDialog.types";

type StatusDialogFooterProps = Pick<
  StatusDialogProps,
  "primaryAction" | "secondaryAction" | "extraAction"
> & { variant: StatusDialogVariant };

/** Extra, cancel, confirm: right-aligned in that order, stacked confirm-first on phones. */
export function StatusDialogFooter({
  variant,
  primaryAction,
  secondaryAction,
  extraAction,
}: StatusDialogFooterProps) {
  const tone = styles.variants[variant];

  return (
    <DialogFooter className={styles.footer}>
      {extraAction ? (
        <Button
          type="button"
          variant="ghost"
          loading={extraAction.loading}
          disabled={extraAction.disabled}
          onClick={extraAction.onClick}
        >
          {extraAction.label}
        </Button>
      ) : null}
      {secondaryAction ? (
        <Button
          type="button"
          variant="outline"
          loading={secondaryAction.loading}
          disabled={secondaryAction.disabled}
          onClick={secondaryAction.onClick}
        >
          {secondaryAction.label}
        </Button>
      ) : null}
      {primaryAction ? (
        <DisabledActionHint
          className={styles.actionHint}
          disabled={Boolean(
            primaryAction.disabled && primaryAction.disabledHint,
          )}
          message={primaryAction.disabledHint ?? ""}
        >
          <Button
            type="button"
            variant={tone.confirmVariant}
            className={tone.confirmButton}
            loading={primaryAction.loading}
            disabled={primaryAction.disabled}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </Button>
        </DisabledActionHint>
      ) : null}
    </DialogFooter>
  );
}
