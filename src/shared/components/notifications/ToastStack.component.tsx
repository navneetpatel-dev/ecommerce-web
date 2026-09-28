import { ToastProvider, ToastViewport } from "@/shared/components/ui/toast";
import { LABELS } from "@/shared/constants/labels";
import { toastStackStyles } from "@/shared/styles/notifications/toastStack.styles";
import type { AppToast } from "@/shared/stores/notifications/toast.store";
import { ToastStackList } from "./ToastStackList.component";

interface ToastStackProps {
  toasts: AppToast[];
  onDismiss: (id: number) => void;
  onAction: (id: number) => void;
}

/**
 * Toast region (design spec §4.4): stacks up to TOAST_MAX_VISIBLE toasts,
 * bottom-centre on phones / bottom-right from md up, always clear of the
 * mobile tab bar and the iOS home indicator.
 */
export function ToastStack({ toasts, onDismiss, onAction }: ToastStackProps) {
  return (
    <ToastProvider swipeDirection="right" label={LABELS.notifications}>
      <ToastStackList
        toasts={toasts}
        onDismiss={onDismiss}
        onAction={onAction}
      />
      <ToastViewport className={toastStackStyles.viewport} />
    </ToastProvider>
  );
}
