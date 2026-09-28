"use client";

import { ToastStack } from "@/shared/components/notifications/ToastStack.component";
import { useToastStore } from "@/shared/stores/notifications/toast.store";

export function ToastStackContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const runAction = useToastStore((s) => s.runAction);

  return (
    <ToastStack toasts={toasts} onDismiss={dismiss} onAction={runAction} />
  );
}
