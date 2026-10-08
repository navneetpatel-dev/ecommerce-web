"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTicketMessagesInfinite } from "../../api/list/supportTickets.queries";

/**
 * Owns the ticket message thread: infinite query, flattened/reversed list,
 * virtualizer and scroll-to-bottom behavior (Rule 12/14).
 */
export function useTicketMessages(ticketId: string) {
  const messagesQuery = useTicketMessagesInfinite(ticketId);
  const messagesParentRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(() => {
    const pages = messagesQuery.data?.pages ?? [];
    const flat = pages.flatMap((p) => p.items);
    return [...flat].reverse();
  }, [messagesQuery.data]);

  const useVirtual = messages.length > 0;
  // TanStack Virtual returns functions the compiler cannot memoize; the
  // virtualizer is consumed directly, so no memoization is needed.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => messagesParentRef.current,
    estimateSize: () => 104,
    overscan: 8,
    enabled: useVirtual,
  });

  const scrollToBottom = useCallback(() => {
    if (messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
    }
  }, [messages.length, virtualizer]);

  const initialScrollDone = useRef(false);
  useEffect(() => {
    if (messages.length > 0 && !initialScrollDone.current) {
      initialScrollDone.current = true;
      requestAnimationFrame(scrollToBottom);
    }
  }, [messages.length, scrollToBottom]);

  const onLoadEarlier = async () => {
    const el = messagesParentRef.current;
    const prevHeight = el ? virtualizer.getTotalSize() : 0;
    await messagesQuery.fetchNextPage();
    if (el) {
      requestAnimationFrame(() => {
        const newHeight = virtualizer.getTotalSize();
        el.scrollTop += newHeight - prevHeight;
      });
    }
  };

  return {
    messagesQuery,
    messages,
    messagesParentRef,
    virtualizer,
    useVirtual,
    scrollToBottom,
    onLoadEarlier,
  };
}
