"use client";

import { ErrorToast } from "@/shared/components/notifications/ErrorToast.component";
import { useErrorToastStore } from "@/shared/stores/notifications/errorToast.store";

export function ErrorToastContainer() {
  const open = useErrorToastStore((s) => s.open);
  const message = useErrorToastStore((s) => s.message);
  const id = useErrorToastStore((s) => s.id);
  const dismiss = useErrorToastStore((s) => s.dismiss);

  return (
    <ErrorToast
      toastKey={id}
      open={open}
      message={message}
      onOpenChange={(next) => {
        if (!next) dismiss();
      }}
    />
  );
}
