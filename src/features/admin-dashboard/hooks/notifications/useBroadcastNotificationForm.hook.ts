"use client";

import { useState } from "react";
import { ROLE_VALUES, type RoleName } from "@/shared/constants/labels";
import { notificationsAdminLabels as LABELS } from "@/shared/constants/labels/notificationsAdmin";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notificationsApi } from "../../api/notifications/notifications.api";

export function useBroadcastNotificationForm() {
  const [role, setRole] = useState<RoleName>(ROLE_VALUES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!subject.trim() || !message.trim()) {
      setError(LABELS.broadcastMissingFields);
      return;
    }
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const outcome = await notificationsApi.broadcast({
        role,
        subject: subject.trim(),
        message: message.trim(),
      });
      setResult(
        `Queued for ${outcome.queued} of ${outcome.targeted} matching users.`,
      );
      setSubject("");
      setMessage("");
    } catch (sendError) {
      setError(getApiErrorMessage(sendError, "Could not send the broadcast."));
    } finally {
      setPending(false);
    }
  };

  return {
    role,
    setRole,
    subject,
    setSubject,
    message,
    setMessage,
    pending,
    result,
    error,
    submit,
  };
}
