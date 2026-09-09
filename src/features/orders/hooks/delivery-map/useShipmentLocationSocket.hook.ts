"use client";

import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/shared/config/appConfig";
import { getApiSessionAdapter } from "@/shared/api/client/sessionAdapter";

export type LiveLocation = { lat: number; lng: number; updatedAt: string };

/**
 * Subscribes to real-time agent location pings for one shipment. Mirrors the
 * REST tracking lookup's authorization (guests may subscribe too — the
 * server only ever sends lat/lng over this channel, never shipment/customer
 * data, so there's nothing sensitive to leak).
 */
export function useShipmentLocationSocket(
  trackingNumber: string | null,
  enabled: boolean,
) {
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled || !trackingNumber) return;
    let cancelled = false;
    setSubscribed(false);

    void import("socket.io-client").then(({ io }) => {
      if (cancelled) return;
      const token = getApiSessionAdapter().getAccessToken();
      const socket = io(SOCKET_BASE_URL, {
        path: "/socket.io",
        auth: token ? { token } : {},
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit(
          "subscribe:shipment",
          { trackingNumber },
          (res?: { ok: boolean }) => {
            if (!cancelled) setSubscribed(Boolean(res?.ok));
          },
        );
      });
      socket.on("location:update", (payload: LiveLocation) => {
        if (!cancelled) setLocation(payload);
      });
    });

    return () => {
      cancelled = true;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [trackingNumber, enabled]);

  return { location, subscribed };
}
