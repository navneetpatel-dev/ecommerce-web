import { useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { stockAlertsLabels } from "@/shared/constants/labels/stockAlerts";
import { useCreateStockAlert } from "../api/stockAlerts.queries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NotifyMeStatus = "idle" | "awaiting-email" | "subscribed" | "error";

export function useNotifyMe(variantId: string | null | undefined) {
  const isAuthenticated = Boolean(useAuthStore((s) => s.accessToken));
  const createStockAlert = useCreateStockAlert();
  const [status, setStatus] = useState<NotifyMeStatus>("idle");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const subscribe = (guestEmail?: string) => {
    if (!variantId) return;
    createStockAlert.mutate(
      { variantId, guestEmail },
      {
        onSuccess: () => setStatus("subscribed"),
        onError: () => setStatus("error"),
      },
    );
  };

  const onNotifyClick = () => {
    if (!variantId) return;
    if (isAuthenticated) {
      subscribe();
      return;
    }
    setStatus("awaiting-email");
  };

  const onSubmitEmail = () => {
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError(stockAlertsLabels.notifyMeInvalidEmail);
      return;
    }
    setEmailError(null);
    subscribe(email.trim());
  };

  const onCancel = () => {
    setStatus("idle");
    setEmailError(null);
  };

  return {
    status,
    email,
    setEmail,
    emailError,
    isPending: createStockAlert.isPending,
    errorMessage: createStockAlert.isError
      ? getApiErrorMessage(
          createStockAlert.error,
          stockAlertsLabels.notifyMeError,
        )
      : null,
    onNotifyClick,
    onSubmitEmail,
    onCancel,
  };
}
