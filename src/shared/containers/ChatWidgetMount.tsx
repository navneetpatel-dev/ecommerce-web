"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/** Chat is a non-critical island: load only after the page goes idle (§9). */
const ChatWidgetContainer = dynamic(
  () =>
    import("@/shared/containers/ChatWidgetContainer").then(
      (mod) => mod.ChatWidgetContainer,
    ),
  { ssr: false, loading: () => null },
);

function scheduleIdle(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const idleWindow = window as Window & {
    requestIdleCallback?: (
      cb: () => void,
      opts?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (typeof idleWindow.requestIdleCallback === "function") {
    const id = idleWindow.requestIdleCallback(callback, { timeout: 4000 });
    return () => idleWindow.cancelIdleCallback?.(id);
  }
  const timer = window.setTimeout(callback, 2000);
  return () => window.clearTimeout(timer);
}

/**
 * Defers the chat widget bundle until the main thread is idle so it never
 * delays TTI on the storefront critical path.
 */
export function ChatWidgetMount() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return scheduleIdle(() => setReady(true));
  }, []);

  if (!ready) return null;
  return <ChatWidgetContainer />;
}
