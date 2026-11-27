"use client";

import type { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/utils/dom/cn";
import { statusDialogStyles as styles } from "../../../styles/dialogs/dialogComponents.styles";
import type { StatusDialogVariant } from "./statusDialog.types";

const VARIANT_ICONS: Record<StatusDialogVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: TriangleAlert,
};

interface StatusDialogHeaderProps {
  title: string;
  description?: ReactNode;
  variant: StatusDialogVariant;
  icon?: LucideIcon;
}

export function StatusDialogHeader({
  title,
  description,
  variant,
  icon,
}: StatusDialogHeaderProps) {
  const Icon = icon ?? VARIANT_ICONS[variant];

  return (
    <DialogHeader className={styles.header}>
      <div
        className={cn(styles.iconWrap, styles.variants[variant].iconWrap)}
        data-status-variant={variant}
      >
        <Icon className={styles.icon} strokeWidth={1.8} aria-hidden />
      </div>
      <div className={styles.titleGroup}>
        <DialogTitle className={styles.title}>{title}</DialogTitle>
        <DialogDescription className={styles.description}>
          {description}
        </DialogDescription>
      </div>
    </DialogHeader>
  );
}
