"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import type { SupportTicketPriority } from "@/shared/constants/statuses";
import type { TicketAttachmentInput } from "../../api/list/supportTickets.api";
import {
  useCloseSupportTicket,
  useEscalateSupportTicket,
  useRateSupportTicket,
  useReassignSupportTicket,
  useReopenSupportTicket,
  useReplySupportTicket,
  useResolveSupportTicket,
  useUpdateTicketPriority,
} from "../../api/list/supportTickets.queries";

/**
 * Owns the ticket mutations (reply/resolve/reopen/close/reassign/priority/
 * escalate/rate) with a shared action-error channel (Rule 12).
 */
export function useTicketActions(ticketId: string) {
  const reply = useReplySupportTicket(ticketId);
  const resolve = useResolveSupportTicket(ticketId);
  const reopen = useReopenSupportTicket(ticketId);
  const close = useCloseSupportTicket(ticketId);
  const reassign = useReassignSupportTicket(ticketId);
  const updatePriority = useUpdateTicketPriority(ticketId);
  const escalate = useEscalateSupportTicket(ticketId);
  const rate = useRateSupportTicket(ticketId);

  const [actionError, setActionError] = useState<string | null>(null);

  const runAction = async (
    action: () => Promise<unknown>,
    fallback: string,
  ) => {
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(getApiErrorMessage(err, fallback));
    }
  };

  return {
    reply,
    resolve,
    reopen,
    close,
    reassign,
    updatePriority,
    escalate,
    rate,
    actionError,
    runAction,
  };
}

export type TicketComposerState = {
  body: string;
  setBody: (body: string) => void;
  error: string | null;
};

/** Reply-composer local state + send handler (kept beside the actions). */
export function useTicketReply(
  ticketId: string,
  reply: ReturnType<typeof useReplySupportTicket>,
  scrollToBottom: () => void,
) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSend = async (
    attachments: TicketAttachmentInput[],
    blocked: boolean,
  ) => {
    if (!body.trim() || blocked) return false;
    setError(null);
    try {
      await reply.mutateAsync({
        body: body.trim(),
        attachmentUrls: attachments.map(({ url, type, durationSeconds }) => ({
          url,
          type,
          durationSeconds,
        })),
      });
      setBody("");
      requestAnimationFrame(scrollToBottom);
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.ticketCouldNotReply));
      return false;
    }
  };

  return { body, setBody, error, onSend };
}

export function useTicketRating(rate: ReturnType<typeof useRateSupportTicket>) {
  const [rating, setRating] = useState("5");
  const [ratingError, setRatingError] = useState<string | null>(null);

  const onRateSubmit = async () => {
    setRatingError(null);
    try {
      await rate.mutateAsync(Number(rating));
    } catch (err) {
      setRatingError(getApiErrorMessage(err, LABELS.ticketCouldNotRate));
    }
  };

  return { rating, setRating, ratingError, onRateSubmit };
}

export type { SupportTicketPriority };
