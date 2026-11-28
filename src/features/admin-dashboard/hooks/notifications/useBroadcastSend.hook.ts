"use client";

import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  notificationsApi,
  type BroadcastTargetConfig,
} from "../../api/notifications/notifications.api";
import type { BroadcastBuilderState } from "../../types/notifications/broadcastBuilder.types";
import {
  broadcastResultMessage,
  buildBroadcastPayload,
} from "../../utils/notifications/broadcastPayload";

interface UseBroadcastSendParams {
  state: BroadcastBuilderState;
  targetConfig: BroadcastTargetConfig;
  setError: (message: string | null) => void;
  onSuccess?: () => void;
}

/** Sending a test to yourself, and sending (or scheduling) the broadcast. */
export function useBroadcastSend({
  state,
  targetConfig,
  setError,
  onSuccess,
}: UseBroadcastSendParams) {
  const [pending, setPending] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const sendTest = useCallback(async () => {
    setError(null);
    setTestNotice(null);
    if (!state.subject.trim() || !state.message.trim()) {
      setError("Enter a subject and message before sending a test.");
      return;
    }
    setPending(true);
    try {
      const res = await notificationsApi.sendBroadcastTest(
        buildBroadcastPayload(state, targetConfig),
      );
      setTestNotice(`Test sent to ${res.sentTo}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to send test broadcast."));
    } finally {
      setPending(false);
    }
  }, [state, targetConfig, setError]);

  const submit = useCallback(async () => {
    setError(null);
    setResultMsg(null);
    if (!state.subject.trim() || !state.message.trim()) {
      setError("Enter a subject and message before sending.");
      return;
    }
    setPending(true);
    try {
      const res = await notificationsApi.broadcast(
        buildBroadcastPayload(state, targetConfig),
      );
      setResultMsg(broadcastResultMessage(res));
      onSuccess?.();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to send broadcast."));
    } finally {
      setPending(false);
    }
  }, [state, targetConfig, setError, onSuccess]);

  const clearResult = useCallback(() => setResultMsg(null), []);
  const clearNotices = useCallback(() => {
    setResultMsg(null);
    setTestNotice(null);
  }, []);

  return {
    pending,
    testNotice,
    resultMsg,
    sendTest,
    submit,
    clearResult,
    clearNotices,
  };
}
