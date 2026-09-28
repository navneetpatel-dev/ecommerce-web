"use client";

import { ToastStack } from "@/shared/components/notifications/ToastStack.component";
import { useToastStore } from "@/shared/stores/notifications/toast.store";

export function ToastStackContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return <ToastStack toasts={toasts} onDismiss={dismiss} onAction={dismiss} />;
}
