"use client";

import { LABELS } from "@/shared/constants/labels";
import type { SupportTicket } from "../../api/supportTickets.api";
import { TicketConversation } from "./TicketConversation.component";
import { TicketDetailsPanel } from "./TicketDetailsPanel.component";
import {
  TicketRatingError,
  TicketRatingSection,
  TicketRatedBanner,
} from "./TicketRatingSection.component";
import {
  TicketReplyBlockedNotice,
  TicketReplyComposer,
} from "./TicketReplyComposer.component";
import { TicketThreadHeader } from "./TicketThreadHeader.component";
import { useTicketThreadState } from "./useTicketThreadState.hook";
import { ticketThreadStyles } from "./ticketThread.styles";
import type { RoleMode } from "./ticketThreadShared";

type Props = {
  ticket: SupportTicket;
  mode: RoleMode;
};

export function TicketThread({ ticket, mode }: Props) {
  const state = useTicketThreadState(ticket, mode);
  const {
    ratePending,
    currentUserId,
    messagesQuery,
    messages,
    virtualizer,
    messagesParentRef,
    body,
    setBody,
    attachments,
    setAttachments,
    assigneeId,
    setAssigneeId,
    priority,
    setPriority,
    rating,
    setRating,
    error,
    actionError,
    ratingError,
    existingImageCount,
    existingVideoCount,
    useVirtual,
    canManage,
    canReopen,
    canRate,
    replyBlocked,
    replyClosed,
    showResolve,
    onSendReply,
    onLoadEarlier,
    onRateSubmit,
    runAction,
    resolve,
    reopen,
    close,
    reassign,
    updatePriority,
    escalate,
    reply,
  } = state;

  const blockedNoticeText = replyClosed
    ? LABELS.ticketClosedNotice
    : mode === "customer"
      ? LABELS.ticketMustReopenToReplyCustomer
      : LABELS.ticketMustReopenToReplyStaff;

  return (
    <div className={ticketThreadStyles.root}>
      <TicketThreadHeader ticket={ticket} mode={mode} />

      <div className={ticketThreadStyles.grid}>
        <div className={ticketThreadStyles.mainCol}>
          <TicketConversation
            messages={messages}
            currentUserId={currentUserId}
            isLoading={messagesQuery.isLoading}
            hasNextPage={messagesQuery.hasNextPage}
            isFetchingNextPage={messagesQuery.isFetchingNextPage}
            useVirtual={useVirtual}
            virtualizer={virtualizer}
            messagesParentRef={messagesParentRef}
            onLoadEarlier={() => void onLoadEarlier()}
          />

          {replyBlocked ? (
            <TicketReplyBlockedNotice message={blockedNoticeText} />
          ) : (
            <TicketReplyComposer
              ticketId={ticket.id}
              body={body}
              onBodyChange={setBody}
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              replyPending={reply.isPending}
              existingImageCount={existingImageCount}
              existingVideoCount={existingVideoCount}
              error={error}
              onSend={() => void onSendReply()}
            />
          )}

          {canRate ? (
            <TicketRatingSection
              rating={rating}
              onRatingChange={setRating}
              ratePending={ratePending}
              onSubmit={onRateSubmit}
            />
          ) : null}

          {ratingError ? <TicketRatingError message={ratingError} /> : null}

          {ticket.customerSatisfactionRating != null ? (
            <TicketRatedBanner rating={ticket.customerSatisfactionRating} />
          ) : null}
        </div>

        <aside className={ticketThreadStyles.aside}>
          <section className={ticketThreadStyles.panelCard}>
            <div aria-hidden className={ticketThreadStyles.accentBar} />
            <TicketDetailsPanel
              ticket={ticket}
              showResolve={showResolve}
              canReopen={canReopen}
              canManage={canManage}
              resolvePending={resolve.isPending}
              reopenPending={reopen.isPending}
              closePending={close.isPending}
              onResolve={() =>
                void runAction(
                  () => resolve.mutateAsync(),
                  LABELS.ticketCouldNotResolve,
                )
              }
              onReopen={() =>
                void runAction(
                  () => reopen.mutateAsync(),
                  LABELS.ticketCouldNotReopen,
                )
              }
              onClose={() =>
                void runAction(
                  () => close.mutateAsync(),
                  LABELS.ticketCouldNotClose,
                )
              }
              assigneeId={assigneeId}
              onAssigneeChange={setAssigneeId}
              reassignPending={reassign.isPending}
              onReassign={() =>
                void runAction(
                  () => reassign.mutateAsync(assigneeId.trim()),
                  LABELS.ticketCouldNotReassign,
                )
              }
              priority={priority}
              onPriorityChange={setPriority}
              priorityPending={updatePriority.isPending}
              onSavePriority={() =>
                void runAction(
                  () => updatePriority.mutateAsync(priority),
                  LABELS.ticketCouldNotUpdatePriority,
                )
              }
              escalatePending={escalate.isPending}
              onEscalate={() =>
                void runAction(
                  () => escalate.mutateAsync(),
                  LABELS.ticketCouldNotEscalate,
                )
              }
              actionError={actionError}
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
