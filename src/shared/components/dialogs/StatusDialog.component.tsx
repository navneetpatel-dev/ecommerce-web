"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { cn } from "@/shared/utils/dom/cn";
import { statusDialogStyles } from "../../styles/dialogs/dialogComponents.styles";

export type StatusDialogVariant = "info" | "success" | "warning" | "danger";

interface StatusDialogAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  loading?: boolean;
  disabled?: boolean;
  /** Shown on hover when the action is disabled (cursor popover). */
  disabledHint?: string;
}

interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  variant?: StatusDialogVariant;
  icon?: LucideIcon;
  primaryAction?: StatusDialogAction;
  secondaryAction?: StatusDialogAction;
  children?: ReactNode;
}

const VARIANT_ICONS: Record<StatusDialogVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
};

export function StatusDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = "info",
  icon,
  primaryAction,
  secondaryAction,
  children,
}: StatusDialogProps) {
  const variantStyle = statusDialogStyles.variants[variant];
  const Icon = icon ?? VARIANT_ICONS[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={statusDialogStyles.content}>
        <DialogHeader className={statusDialogStyles.header}>
          <div
            className={cn(statusDialogStyles.iconWrap, variantStyle.iconWrap)}
          >
            <Icon
              size={22}
              strokeWidth={1.5}
              className={variantStyle.icon}
              aria-hidden
            />
          </div>
          <div className={statusDialogStyles.titleGroup}>
            <DialogTitle className={statusDialogStyles.title}>
              {title}
            </DialogTitle>
            <DialogDescription className={statusDialogStyles.description}>
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {children ? (
          <div className={statusDialogStyles.childrenWrapper}>{children}</div>
        ) : null}

        {(primaryAction || secondaryAction) && (
          <DialogFooter className={statusDialogStyles.footer}>
            {secondaryAction ? (
              <Button
                type="button"
                fullWidth="mobile"
                variant={secondaryAction.variant ?? "outline"}
                loading={secondaryAction.loading}
                disabled={secondaryAction.disabled}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
            {primaryAction ? (
              <DisabledActionHint
                className={statusDialogStyles.actionHint}
                disabled={Boolean(
                  primaryAction.disabled && primaryAction.disabledHint,
                )}
                message={primaryAction.disabledHint ?? ""}
              >
                <Button
                  type="button"
                  fullWidth="mobile"
                  variant={primaryAction.variant ?? "default"}
                  loading={primaryAction.loading}
                  disabled={primaryAction.disabled}
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.label}
                </Button>
              </DisabledActionHint>
            ) : null}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
