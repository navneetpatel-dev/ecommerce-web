"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { pushSubscriptionApi } from "@/shared/api/pushSubscription.api";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

function applicationServerKey(value: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(base64), (character) =>
    character.charCodeAt(0),
  );
  return bytes.buffer.slice(0) as unknown as Uint8Array<ArrayBuffer>;
}

async function activeSubscription(): Promise<PushSubscription | null> {
  // `serviceWorker.ready` never resolves when no worker is registered.
  // Dev explicitly unregisters the SW, so logout used to hang here forever
  // (`.catch` does not help — this is a hang, not a rejection).
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return null;
  return registration.pushManager.getSubscription();
}

export async function removeCurrentPushSubscription(): Promise<void> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  const subscription = await activeSubscription();
  if (!subscription) return;
  try {
    await pushSubscriptionApi.unsubscribe(subscription.endpoint);
  } finally {
    await subscription.unsubscribe();
  }
}

const noopSubscribe = () => () => {};

export function usePushSubscription() {
  const supported = useSyncExternalStore(
    noopSubscribe,
    () =>
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window,
    () => false,
  );
  const [enabled, setEnabled] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supported || Notification.permission === "denied") return;
    void activeSubscription().then((subscription) =>
      setEnabled(Boolean(subscription)),
    );
  }, [supported]);

  const enable = async () => {
    if (!supported) return;
    setPending(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Notifications are blocked in this browser.");
        return;
      }
      const { publicKey } = await pushSubscriptionApi.getPublicKey();
      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey(publicKey),
        }));
      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) {
        throw new Error("Browser returned an incomplete push subscription");
      }
      await pushSubscriptionApi.subscribe({
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      });
      setEnabled(true);
    } catch (enableError) {
      setError(
        getApiErrorMessage(
          enableError,
          "Could not enable browser notifications.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  const disable = async () => {
    setPending(true);
    setError(null);
    try {
      await removeCurrentPushSubscription();
      setEnabled(false);
    } catch (disableError) {
      setError(
        getApiErrorMessage(
          disableError,
          "Could not disable browser notifications.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  return {
    supported,
    enabled,
    pending,
    error,
    toggle: (next: boolean) => (next ? enable() : disable()),
  };
}
