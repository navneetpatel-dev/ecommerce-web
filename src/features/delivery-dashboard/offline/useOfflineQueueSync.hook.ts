"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deliveryKeys } from "../api/deliveryAgent.queries";
import {
  flushOfflineQueue,
  pendingOfflineActionCount,
} from "./deliveryOfflineQueue";

/** Replays queued status updates whenever the agent app regains connectivity. */
export function useOfflineQueueSync() {
  const queryClient = useQueryClient();
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" || navigator.onLine,
  );

  useEffect(() => {
    let cancelled = false;
    const refreshCount = () => {
      void pendingOfflineActionCount().then((count) => {
        if (!cancelled) setPendingCount(count);
      });
    };
    const flush = () => {
      setIsOnline(true);
      void flushOfflineQueue().then((flushed) => {
        if (cancelled) return;
        if (flushed > 0)
          queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
        refreshCount();
      });
    };
    const goOffline = () => setIsOnline(false);

    const onSwMessage = (event: MessageEvent) => {
      if (event.data?.type === "DELIVERY_FLUSH_QUEUE") flush();
    };

    refreshCount();
    if (typeof navigator !== "undefined" && navigator.onLine) flush();
    window.addEventListener("online", flush);
    window.addEventListener("offline", goOffline);
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", onSwMessage);
    }
    return () => {
      cancelled = true;
      window.removeEventListener("online", flush);
      window.removeEventListener("offline", goOffline);
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", onSwMessage);
      }
    };
  }, [queryClient]);

  return { isOnline, pendingCount };
}
