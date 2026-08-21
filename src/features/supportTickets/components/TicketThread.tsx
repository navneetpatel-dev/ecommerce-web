"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowLeft, Send, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { FormError } from "@/shared/components/FormError";
import { Textarea } from "@/shared/components/ui/textarea";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { AssigneeSelect } from "@/shared/components/AssigneeSelect";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import {
  SUPPORT_TICKET_PRIORITY,
  SUPPORT_TICKET_PRIORITY_VALUES,
  SUPPORT_TICKET_STATUS,
  TICKET_ATTACHMENT_TYPE,
  TICKET_SENDER_ROLE,
  type SupportTicketPriority,
} from "@/shared/constants/statuses";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { formatOrderDate } from "@/features/orders/utils/format";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { cn } from "@/shared/utils/cn";
import {
  useCloseSupportTicket,
  useEscalateSupportTicket,
  useRateSupportTicket,
  useReassignSupportTicket,
  useReopenSupportTicket,
  useReplySupportTicket,
  useResolveSupportTicket,
  useTicketMessagesInfinite,
  useUpdateTicketPriority,
} from "../api/supportTickets.queries";
import type {
  SupportTicket,
  TicketAttachment,
  TicketMessage,
} from "../api/supportTickets.api";
import {
  TicketAttachmentUploader,
  type UploadedMediaAttachment,
} from "./TicketAttachmentUploader";
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
} from "../utils/labels";
import { TICKET_REPLY_MAX } from "../constants/fieldLimits";
import { formatLabel } from "@/shared/utils/formatLabel";
import { usePublicSettings } from "@/shared/hooks/usePublicSettings";

type RoleMode = "customer" | "vendor" | "admin";

type Props = {
  ticket: SupportTicket;
  mode: RoleMode;
};

function initials(name: string | null | undefined): string {
  if (!name?.trim()) return LABELS.ticketAvatarInitialsFallback;
  const parts = name.trim().split(/\s+/);
  return (
    ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() ||
    LABELS.ticketAvatarInitialsFallback
  );
}

function isStaffRole(role: string): boolean {
  return role !== TICKET_SENDER_ROLE.CUSTOMER;
}

function listHref(mode: RoleMode): string {
  if (mode === "admin") return PATHS.admin.supportTickets;
  if (mode === "vendor") return PATHS.vendor.supportTickets;
  return PATHS.supportTickets;
}

function AttachmentThumbs({
  attachments,
  size = "md",
}: {
  attachments: TicketAttachment[];
  size?: "sm" | "md";
}) {
  if (!attachments.length) return null;
  const box = size === "sm" ? "h-14 w-14" : "h-20 w-20";
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {attachments.map((item) => (
        <li
          key={item.id ?? item.url}
          className={cn(
            "overflow-hidden rounded-md border border-line bg-paper",
            box,
          )}
        >
          {item.type === TICKET_ATTACHMENT_TYPE.VIDEO ? (
            <video
              src={item.url}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: TicketMessage;
  isOwn: boolean;
}) {
  const displayName = isOwn
    ? LABELS.ticketMessageYou
    : message.senderName ||
      (isStaffRole(message.senderRole)
        ? LABELS.ticketMessageSupport
        : LABELS.ticketMessageCustomer);

  return (
    <div
      className={cn(
        "flex gap-2.5 sm:gap-3",
        isOwn ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar className="mt-1 h-8 w-8 shrink-0 border border-line sm:h-9 sm:w-9">
        <AvatarFallback
          className={cn(
            "text-[0.7rem] font-semibold sm:text-[0.75rem]",
            isOwn ? "bg-brand-subtle text-brand" : "bg-paper text-ink-muted",
          )}
        >
          {initials(isOwn ? displayName : message.senderName || displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[min(100%,32rem)] min-w-0">
        <div
          className={cn(
            "px-3.5 py-2.5 sm:px-4 sm:py-3",
            isOwn
              ? "rounded-[1.15rem] rounded-tr-md border border-brand/30 bg-brand-subtle shadow-elevation-1"
              : "rounded-[1.15rem] rounded-tl-md border border-line bg-surface shadow-[0_1px_0_rgba(15,23,42,0.04)]",
          )}
        >
          <div
            className={cn(
              "mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
              isOwn ? "justify-end" : "justify-start",
            )}
          >
            <span className="text-[0.75rem] font-semibold text-ink sm:text-[0.8125rem]">
              {displayName}
            </span>
            <span className="text-[0.6875rem] text-ink-muted">
              {formatOrderDate(message.createdAt)}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
            {message.body}
          </p>
          <AttachmentThumbs attachments={message.attachments ?? []} size="sm" />
        </div>
      </div>
    </div>
  );
}

function TicketDetailsPanel({
  ticket,
  showResolve,
  canReopen,
  canManage,
  resolvePending,
  reopenPending,
  closePending,
  onResolve,
  onReopen,
  onClose,
  assigneeId,
  onAssigneeChange,
  reassignPending,
  onReassign,
  priority,
  onPriorityChange,
  priorityPending,
  onSavePriority,
  escalatePending,
  onEscalate,
  actionError,
}: {
  ticket: SupportTicket;
  showResolve: boolean;
  canReopen: boolean;
  canManage: boolean;
  resolvePending: boolean;
  reopenPending: boolean;
  closePending: boolean;
  onResolve: () => void;
  onReopen: () => void;
  onClose: () => void;
  assigneeId: string;
  onAssigneeChange: (id: string) => void;
  reassignPending: boolean;
  onReassign: () => void;
  priority: SupportTicketPriority;
  onPriorityChange: (priority: SupportTicketPriority) => void;
  priorityPending: boolean;
  onSavePriority: () => void;
  escalatePending: boolean;
  onEscalate: () => void;
  actionError: string | null;
}) {
  return (
    <>
      <div className="border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5">
        <TextEyebrow brand>{LABELS.ticketAboutTicket}</TextEyebrow>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        <dl className="grid gap-3 text-[0.8125rem]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-muted">{LABELS.status}</dt>
            <dd>
              <StatusBadge
                status={ticket.status}
                label={TICKET_STATUS_LABEL[ticket.status]}
              />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-muted">{LABELS.priority}</dt>
            <dd>
              <StatusBadge
                status={ticket.priority}
                label={TICKET_PRIORITY_LABEL[ticket.priority]}
              />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-muted">{LABELS.category}</dt>
            <dd className="font-medium text-ink">
              {TICKET_CATEGORY_LABEL[ticket.category]}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line/60 pt-3">
            <dt className="text-ink-muted">{LABELS.createdAt}</dt>
            <dd className="text-ink">{formatOrderDate(ticket.createdAt)}</dd>
          </div>
          {ticket.assignedToName || ticket.assignedToId ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-muted">{LABELS.ticketAssignee}</dt>
              <dd className="truncate text-ink">
                {ticket.assignedToName || LABELS.ticketAssigneeNone}
              </dd>
            </div>
          ) : null}
          {ticket.relatedOrderId ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-muted">{LABELS.ticketOrderSection}</dt>
              <dd className="font-mono text-[0.75rem] text-ink">
                #{ticket.relatedOrderId.slice(0, 8)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="border-t border-line/60 pt-4">
          <TextEyebrow>{LABELS.ticketOriginalRequest}</TextEyebrow>
          <p className="mt-2 whitespace-pre-wrap text-[0.8125rem] leading-relaxed text-ink-muted">
            {ticket.description}
          </p>
          <AttachmentThumbs attachments={ticket.attachments ?? []} />
        </div>

        {canManage ? (
          <div className="space-y-3 border-t border-line/60 pt-4">
            <FormFieldFrame label={LABELS.ticketUpdatePriority}>
              <Select
                value={priority}
                onValueChange={(v) =>
                  onPriorityChange(v as SupportTicketPriority)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORT_TICKET_PRIORITY_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {TICKET_PRIORITY_LABEL[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldFrame>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={priorityPending}
                disabled={priority === ticket.priority}
                onClick={onSavePriority}
              >
                {LABELS.ticketUpdatePriority}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={escalatePending}
                disabled={ticket.priority === SUPPORT_TICKET_PRIORITY.URGENT}
                onClick={onEscalate}
              >
                {LABELS.ticketEscalate}
              </Button>
            </div>
          </div>
        ) : null}

        {canManage ? (
          <div className="space-y-3 border-t border-line/60 pt-4">
            <FormFieldFrame label={LABELS.ticketAssignee}>
              <AssigneeSelect
                permission={PERMISSIONS.TICKET_MANAGE}
                value={assigneeId}
                onChange={onAssigneeChange}
                vendorId={ticket.relatedVendorId}
                currentOption={
                  ticket.assignedToId
                    ? {
                        id: ticket.assignedToId,
                        name: ticket.assignedToName || ticket.assignedToId,
                      }
                    : null
                }
              />
            </FormFieldFrame>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              loading={reassignPending}
              disabled={
                !assigneeId.trim() || assigneeId === (ticket.assignedToId ?? "")
              }
              onClick={onReassign}
            >
              {LABELS.ticketReassign}
            </Button>
          </div>
        ) : null}

        {actionError ? (
          <FormError error={new Error(actionError)} fallback={actionError} />
        ) : null}

        {showResolve || canReopen || canManage ? (
          <div className="flex flex-wrap gap-2 border-t border-line/60 pt-4">
            {showResolve ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={resolvePending}
                onClick={onResolve}
              >
                {LABELS.ticketResolve}
              </Button>
            ) : null}
            {canReopen ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={reopenPending}
                onClick={onReopen}
              >
                {LABELS.ticketReopen}
              </Button>
            ) : null}
            {canManage ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={closePending}
                onClick={onClose}
              >
                {LABELS.ticketClose}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}

export function TicketThread({ ticket, mode }: Props) {
  const { hasPermission } = usePermissions();
  const currentUserId = useAuthStore((s) => s.currentUser?.id);
  const { data: publicSettings } = usePublicSettings();
  const messagesQuery = useTicketMessagesInfinite(ticket.id);
  const reply = useReplySupportTicket(ticket.id);
  const resolve = useResolveSupportTicket(ticket.id);
  const reopen = useReopenSupportTicket(ticket.id);
  const close = useCloseSupportTicket(ticket.id);
  const reassign = useReassignSupportTicket(ticket.id);
  const updatePriority = useUpdateTicketPriority(ticket.id);
  const escalate = useEscalateSupportTicket(ticket.id);
  const rate = useRateSupportTicket(ticket.id);
  const messagesParentRef = useRef<HTMLDivElement | null>(null);

  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>([]);
  const [assigneeId, setAssigneeId] = useState(ticket.assignedToId ?? "");
  const [priority, setPriority] = useState<SupportTicketPriority>(
    ticket.priority,
  );
  const [rating, setRating] = useState("5");
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);

  useEffect(() => {
    setAssigneeId(ticket.assignedToId ?? "");
  }, [ticket.assignedToId]);

  useEffect(() => {
    setPriority(ticket.priority);
  }, [ticket.priority]);

  const messages = useMemo(() => {
    const pages = messagesQuery.data?.pages ?? [];
    const flat = pages.flatMap((p) => p.items);
    return [...flat].reverse();
  }, [messagesQuery.data]);

  const existingImageCount = ticket.imageAttachmentCount ?? 0;
  const existingVideoCount = ticket.videoAttachmentCount ?? 0;

  const useVirtual = messages.length > 0;
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => messagesParentRef.current,
    estimateSize: () => 104,
    overscan: 8,
    enabled: useVirtual,
  });

  const scrollToBottom = () => {
    if (messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
    }
  };

  const initialScrollDone = useRef(false);
  useEffect(() => {
    if (messages.length > 0 && !initialScrollDone.current) {
      initialScrollDone.current = true;
      requestAnimationFrame(scrollToBottom);
    }
  }, [messages.length]);

  const reopenWindowDays = publicSettings?.ticketReopenWindowDays ?? 7;
  const withinReopenWindow = Boolean(
    ticket.resolvedAt &&
    Date.now() - new Date(ticket.resolvedAt).getTime() <=
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

  const onReply = async () => {
    if (!body.trim() || replyBlocked) return;
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
      setAttachments([]);
      requestAnimationFrame(scrollToBottom);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.ticketCouldNotReply));
    }
  };

  return (
    <div className="w-full min-w-0 space-y-5 md:space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Link
            href={listHref(mode)}
            className="inline-flex items-center gap-1 text-[0.8125rem] text-ink-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            {LABELS.ticketBackToList}
          </Link>
          <span className="font-mono text-[0.6875rem] tabular-nums text-ink-faint">
            {ticket.ticketNumber}
          </span>
        </div>

        <div className="min-w-0">
          <h1 className="font-display text-[1.25rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.375rem]">
            {ticket.subject}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <StatusBadge
              status={ticket.status}
              label={TICKET_STATUS_LABEL[ticket.status]}
            />
            <StatusBadge
              status={ticket.priority}
              label={TICKET_PRIORITY_LABEL[ticket.priority]}
            />
            <span className="text-[0.75rem] text-ink-muted">
              {TICKET_CATEGORY_LABEL[ticket.category]}
              {" · "}
              {formatOrderDate(ticket.createdAt)}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 space-y-4 lg:col-span-8">
          <section className="relative overflow-hidden border border-line bg-surface shadow-elevation-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent"
            />
            <div className="flex items-center justify-between gap-3 border-b border-line/80 px-3 py-2.5 sm:px-4">
              <TextEyebrow>{LABELS.ticketConversation}</TextEyebrow>
              {messages.length > 0 && !messagesQuery.hasNextPage ? (
                <span className="text-[0.75rem] tabular-nums text-ink-muted">
                  {messages.length}
                </span>
              ) : null}
            </div>

            <div className="space-y-3 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_6%,transparent),transparent_55%)] px-3 py-4 sm:px-4">
              {messagesQuery.hasNextPage ? (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    loading={messagesQuery.isFetchingNextPage}
                    onClick={async () => {
                      const el = messagesParentRef.current;
                      const prevHeight = el ? virtualizer.getTotalSize() : 0;
                      await messagesQuery.fetchNextPage();
                      if (el) {
                        requestAnimationFrame(() => {
                          const newHeight = virtualizer.getTotalSize();
                          el.scrollTop += newHeight - prevHeight;
                        });
                      }
                    }}
                  >
                    {LABELS.ticketLoadEarlier}
                  </Button>
                </div>
              ) : null}

              {messagesQuery.isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-14 w-3/4 rounded-[1.15rem]" />
                  <Skeleton className="ml-auto h-14 w-2/3 rounded-[1.15rem]" />
                </div>
              ) : messages.length === 0 ? (
                <p className="border border-dashed border-line bg-paper/40 px-4 py-8 text-center text-[0.875rem] text-ink-muted">
                  {LABELS.ticketNoMessages}
                </p>
              ) : useVirtual ? (
                <div
                  ref={messagesParentRef}
                  className="max-h-[min(70vh,36rem)] overflow-y-auto overscroll-contain"
                >
                  <ul
                    className="relative w-full"
                    style={{ height: `${virtualizer.getTotalSize()}px` }}
                  >
                    {virtualizer.getVirtualItems().map((item) => {
                      const message = messages[item.index]!;
                      return (
                        <li
                          key={message.id}
                          data-index={item.index}
                          ref={virtualizer.measureElement}
                          className="absolute left-0 top-0 w-full pb-3"
                          style={{
                            transform: `translateY(${item.start}px)`,
                          }}
                        >
                          <MessageBubble
                            message={message}
                            isOwn={Boolean(
                              currentUserId &&
                              message.senderId === currentUserId,
                            )}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <ul className="space-y-3">
                  {messages.map((message) => (
                    <li key={message.id}>
                      <MessageBubble
                        message={message}
                        isOwn={Boolean(
                          currentUserId && message.senderId === currentUserId,
                        )}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {replyBlocked ? (
              <div className="border-t border-line bg-paper/40 px-3 py-3 sm:px-4">
                <p className="text-[0.8125rem] text-ink-muted">
                  {replyClosed
                    ? LABELS.ticketClosedNotice
                    : mode === "customer"
                      ? LABELS.ticketMustReopenToReplyCustomer
                      : LABELS.ticketMustReopenToReplyStaff}
                </p>
              </div>
            ) : (
              <div className="space-y-2 border-t border-line bg-paper/30 px-3 py-3 sm:px-4">
                <Textarea
                  value={body}
                  onChange={(e) =>
                    setBody(e.target.value.slice(0, TICKET_REPLY_MAX))
                  }
                  placeholder={LABELS.ticketReplyPlaceholder}
                  rows={3}
                  className="min-h-[4.5rem] resize-y"
                  maxLength={TICKET_REPLY_MAX}
                  aria-label={LABELS.ticketSendReply}
                />
                <p className="text-[0.75rem] tabular-nums text-ink-muted">
                  {formatLabel(LABELS.ticketCharCounter, {
                    count: body.length,
                    max: TICKET_REPLY_MAX,
                  })}
                </p>
                <TicketAttachmentUploader
                  entityId={ticket.id}
                  value={attachments}
                  onChange={setAttachments}
                  disabled={reply.isPending}
                  existingImageCount={existingImageCount}
                  existingVideoCount={existingVideoCount}
                />
                <FormError
                  error={error ? new Error(error) : null}
                  fallback={LABELS.ticketCouldNotReply}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    loading={reply.isPending}
                    disabled={!body.trim()}
                    onClick={() => void onReply()}
                  >
                    <Send size={14} className="mr-1.5" aria-hidden />
                    {LABELS.ticketSendReply}
                  </Button>
                </div>
              </div>
            )}
          </section>

          {canRate ? (
            <section className="border border-line bg-surface p-3 shadow-elevation-1 sm:p-4">
              <TextEyebrow>{LABELS.ticketRate}</TextEyebrow>
              <p className="mt-1 text-[0.75rem] text-ink-muted">
                {LABELS.ticketRateHint}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div
                  className="flex gap-0.5"
                  role="radiogroup"
                  aria-label={LABELS.ticketRate}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={Number(rating) >= n}
                      className="rounded-sm p-0.5 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                      onClick={() => setRating(String(n))}
                    >
                      <Star
                        size={22}
                        className={cn(
                          "transition-colors",
                          Number(rating) >= n
                            ? "fill-brand text-brand"
                            : "fill-transparent text-ink-muted/50",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  size="sm"
                  loading={rate.isPending}
                  onClick={async () => {
                    setRatingError(null);
                    try {
                      await rate.mutateAsync(Number(rating));
                    } catch (err) {
                      setRatingError(
                        getApiErrorMessage(err, LABELS.ticketCouldNotRate),
                      );
                    }
                  }}
                >
                  {LABELS.ticketRateSubmit}
                </Button>
              </div>
              {ratingError ? (
                <FormError
                  error={new Error(ratingError)}
                  fallback={LABELS.ticketCouldNotRate}
                />
              ) : null}
            </section>
          ) : null}

          {ticket.customerSatisfactionRating != null ? (
            <div className="flex items-center gap-2 border border-brand/25 bg-brand-subtle/50 px-3 py-2">
              <span className="text-[0.8125rem] text-ink">
                {LABELS.ticketRatedThanks}
              </span>
              <span className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={14}
                    className={cn(
                      n <= ticket.customerSatisfactionRating!
                        ? "fill-brand text-brand"
                        : "fill-transparent text-ink-muted/40",
                    )}
                  />
                ))}
              </span>
            </div>
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
