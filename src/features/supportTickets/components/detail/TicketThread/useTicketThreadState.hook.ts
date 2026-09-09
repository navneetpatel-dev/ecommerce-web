"use client";

import { useEffect, useState } from "react";
import {
  SUPPORT_TICKET_STATUS,
  type SupportTicketPriority,
} from "@/shared/constants/statuses";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { usePublicSettings } from "@/shared/hooks/usePublicSettings.hook";
import type { SupportTicket } from "../../../api/list/supportTickets.api";
import type { UploadedMediaAttachment } from "../../form/TicketAttachmentUploader/index";
import {
  useTicketActions,
  useTicketRating,
  useTicketReply,
} from "./useTicketActions.hook";
import { useTicketMessages } from "./useTicketMessages.hook";
import type { RoleMode } from "./ticketThreadShared";

/**
 * Composes the ticket-thread concerns: messages thread, mutations, composer
 * and rating state, plus derived permission/visibility flags (Rule 3).
 */
export function useTicketThreadState(ticket: SupportTicket, mode: RoleMode) {
  const { hasPermission } = usePermissions();
  const currentUserId = useAuthStore((s) => s.currentUser?.id);
  const { data: publicSettings } = usePublicSettings();
  const thread = useTicketMessages(ticket.id);
  const actions = useTicketActions(ticket.id);
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>([]);
  const [assigneeId, setAssigneeId] = useState(ticket.assignedToId ?? "");
  const [priority, setPriority] = useState<SupportTicketPriority>(
    ticket.priority,
  );
  const replyState = useTicketReply(
    ticket.id,
    actions.reply,
    thread.scrollToBottom,
  );
  const ratingState = useTicketRating(actions.rate);

  useEffect(() => {
    setAssigneeId(ticket.assignedToId ?? "");
  }, [ticket.assignedToId]);

  useEffect(() => {
    setPriority(ticket.priority);
  }, [ticket.priority]);

  const existingImageCount = ticket.imageAttachmentCount ?? 0;
  const existingVideoCount = ticket.videoAttachmentCount ?? 0;

  const [mountedAt] = useState(() => Date.now());
  const reopenWindowDays = publicSettings?.ticketReopenWindowDays ?? 7;
  const withinReopenWindow = Boolean(
    ticket.resolvedAt &&
    mountedAt - new Date(ticket.resolvedAt).getTime() <=
      reopenWindowDays * 24 * 60 * 60 * 1000,
  );

  const canManage =
    mode === "admin" && hasPermission(PERMISSIONS.TICKET_MANAGE);
  const canResolve = mode === "admin" || mode === "vendor";
  const canReopen =
    ticket.status === SUPPORT_TICKET_STATUS.RESOLVED &&
    mode === "customer" &&
    withinReopenWindow;
  const canRate =
    mode === "customer" &&
    ticket.customerSatisfactionRating == null &&
    (ticket.status === SUPPORT_TICKET_STATUS.RESOLVED ||
      (ticket.status === SUPPORT_TICKET_STATUS.CLOSED &&
        Boolean(ticket.resolvedAt)));
  const replyClosed = ticket.status === SUPPORT_TICKET_STATUS.CLOSED;
  const replyNeedsReopen = ticket.status === SUPPORT_TICKET_STATUS.RESOLVED;
  const replyBlocked = replyClosed || replyNeedsReopen;
  const showResolve =
    canResolve &&
    (ticket.status === SUPPORT_TICKET_STATUS.OPEN ||
      ticket.status === SUPPORT_TICKET_STATUS.IN_PROGRESS ||
      ticket.status === SUPPORT_TICKET_STATUS.REOPENED);

  const onSendReply = async () => {
    const sent = await replyState.onSend(attachments, replyBlocked);
    if (sent) setAttachments([]);
  };

  return {
    currentUserId,
    ratePending: actions.rate.isPending,
    ...thread,
    ...actions,
    ...replyState,
    attachments,
    setAttachments,
    assigneeId,
    setAssigneeId,
    priority,
    setPriority,
    ...ratingState,
    existingImageCount,
    existingVideoCount,
    canManage,
    canReopen,
    canRate,
    replyBlocked,
    replyClosed,
    showResolve,
    onSendReply,
  };
}
