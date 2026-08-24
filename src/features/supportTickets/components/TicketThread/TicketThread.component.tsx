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
    <div className="w-full min-w-0 space-y-5 md:space-y-6">
      <TicketThreadHeader ticket={ticket} mode={mode} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 space-y-4 lg:col-span-8">
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

        <aside className="min-w-0 space-y-4 lg:col-span-4">
          <section className="relative overflow-hidden border border-line bg-surface shadow-elevation-1 lg:sticky lg:top-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent"
            />
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
