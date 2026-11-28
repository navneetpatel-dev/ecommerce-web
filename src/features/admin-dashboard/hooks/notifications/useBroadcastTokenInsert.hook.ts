"use client";

import { useRef } from "react";
import type { BroadcastBuilderState } from "../../types/notifications/broadcastBuilder.types";

/** Puts a personalization variable at the cursor of the field being typed in. */
export function useBroadcastTokenInsert(
  state: Pick<BroadcastBuilderState, "subject" | "message">,
  patch: (partial: Partial<BroadcastBuilderState>) => void,
) {
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const activeFieldRef = useRef<"subject" | "message">("message");

  const focusSubject = () => {
    activeFieldRef.current = "subject";
  };
  const focusMessage = () => {
    activeFieldRef.current = "message";
  };

  const insertToken = (tok: string) => {
    const target = activeFieldRef.current;
    const el = target === "subject" ? subjectRef.current : messageRef.current;
    const current = target === "subject" ? state.subject : state.message;

    if (el && document.activeElement === el) {
      const start = el.selectionStart ?? current.length;
      const end = el.selectionEnd ?? current.length;
      const nextValue = current.slice(0, start) + tok + current.slice(end);
      patch(
        target === "subject" ? { subject: nextValue } : { message: nextValue },
      );
      const nextCaret = start + tok.length;
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(nextCaret, nextCaret);
      });
      return;
    }

    patch({ message: `${state.message}${tok}` });
  };

  return { subjectRef, messageRef, focusSubject, focusMessage, insertToken };
}
