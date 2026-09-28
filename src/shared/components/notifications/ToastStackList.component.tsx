import type { AppToast } from "@/shared/stores/notifications/toast.store";
import { ToastStackItem } from "./ToastStackItem.component";

interface ToastStackListProps {
  toasts: AppToast[];
  onDismiss: (id: number) => void;
  onAction: (id: number) => void;
}

/** Owns the collection rendering; the wrapper stays free of `.map()`. */
export function ToastStackList({
  toasts,
  onDismiss,
  onAction,
}: ToastStackListProps) {
  return (
    <>
      {toasts.map((toast) => (
        <ToastStackItem
          key={toast.id}
          toast={toast}
          onOpenChange={(open) => {
            if (!open) onDismiss(toast.id);
          }}
          onAction={() => onAction(toast.id)}
        />
      ))}
    </>
  );
}
