import Link from "next/link";
import { AlertCircle, CheckCircle2, Info, type LucideIcon } from "lucide-react";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/shared/components/ui/toast";
import { LABELS } from "@/shared/constants/labels";
import { TOAST_DURATION_MS } from "@/shared/constants/timing/timing";
import { cn } from "@/shared/utils/dom/cn";
import { toastStackStyles } from "@/shared/styles/notifications/toastStack.styles";
import type {
  AppToast,
  ToastKind,
} from "@/shared/stores/notifications/toast.store";

const TOAST_ICONS: Record<ToastKind, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
};

const TOAST_TITLES: Record<ToastKind, string> = {
  success: LABELS.toastSuccessTitle,
  info: LABELS.toastInfoTitle,
  error: LABELS.toastErrorTitle,
};

interface ToastStackItemProps {
  toast: AppToast;
  onOpenChange: (open: boolean) => void;
  onAction: () => void;
}

/** One toast — presentation only; state lives in the toast store. */
export function ToastStackItem({
  toast,
  onOpenChange,
  onAction,
}: ToastStackItemProps) {
  const Icon = TOAST_ICONS[toast.kind];
  const actionLabel = toast.actionLabel;
  const actionHref = toast.actionHref;

  // Callback actions (undo) are buttons; navigation actions stay links.
  const actionElement =
    actionLabel && toast.action ? (
      <ToastAction
        altText={actionLabel}
        asChild
        className={toastStackStyles.action}
      >
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      </ToastAction>
    ) : actionLabel && actionHref ? (
      <ToastAction
        altText={actionLabel}
        asChild
        className={toastStackStyles.action}
      >
        <Link href={actionHref} onClick={onAction}>
          {actionLabel}
        </Link>
      </ToastAction>
    ) : null;

  return (
    <Toast
      /* foreground ⇒ Radix emits role="status" + aria-live="assertive" for
         errors; background ⇒ polite for success/info (design spec §6.3). */
      type={toast.kind === "error" ? "foreground" : "background"}
      duration={TOAST_DURATION_MS[toast.kind]}
      onOpenChange={onOpenChange}
      className={cn(
        toastStackStyles.item,
        toastStackStyles.variants[toast.kind],
      )}
    >
      <Icon
        aria-hidden
        className={cn(
          toastStackStyles.iconBase,
          toastStackStyles.icon[toast.kind],
        )}
      />
      <div className={toastStackStyles.body}>
        <ToastTitle className={toastStackStyles.title}>
          {TOAST_TITLES[toast.kind]}
        </ToastTitle>
        <ToastDescription className={toastStackStyles.message}>
          {toast.message}
        </ToastDescription>
        {actionElement}
      </div>
      <ToastClose aria-label={LABELS.dismiss} />
    </Toast>
  );
}
