"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { notificationsApi } from "../../api/notifications/notifications.api";

/** Re-queues one failed email from the log; `onDone` reloads the list. */
export function useResendNotification(onDone: () => void) {
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: (id: string) => notificationsApi.resend(id),
    onSuccess: () => {
      setError(null);
      setNotice(LABELS.notificationResendDone);
      onDone();
    },
    onError: (failure) => {
      setNotice(null);
      const message = getApiErrorMessage(
        failure,
        LABELS.notificationResendFailed,
      );
      setError(message);
      // The row menu has no room for inline text, so the failure shows as a toast.
      notifyError(message);
    },
  });

  return {
    notice,
    error,
    pendingId: mutation.isPending ? mutation.variables : null,
    resend: (id: string) => mutation.mutate(id),
  };
}
