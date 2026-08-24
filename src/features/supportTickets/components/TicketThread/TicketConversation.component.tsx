"use client";

import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import type { RefObject } from "react";
import type { Virtualizer } from "@tanstack/react-virtual";
import type { TicketMessage } from "../../api/supportTickets.api";
import { MessageBubble } from "./TicketMessageBubble.component";

interface TicketConversationProps {
  messages: TicketMessage[];
  currentUserId: string | null | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  useVirtual: boolean;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  messagesParentRef: RefObject<HTMLDivElement | null>;
  onLoadEarlier: () => void;
}

/** Conversation card: load-earlier, skeletons/empty state, message list. */
export function TicketConversation(props: TicketConversationProps) {
  const { messages } = props;

  return (
    <section className="relative overflow-hidden border border-line bg-surface shadow-elevation-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent"
      />
      <div className="flex items-center justify-between gap-3 border-b border-line/80 px-3 py-2.5 sm:px-4">
        <TextEyebrow>{LABELS.ticketConversation}</TextEyebrow>
        {messages.length > 0 && !props.hasNextPage ? (
          <span className="text-[0.75rem] tabular-nums text-ink-muted">
            {messages.length}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_6%,transparent),transparent_55%)] px-3 py-4 sm:px-4">
        {props.hasNextPage ? (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={props.isFetchingNextPage}
              onClick={props.onLoadEarlier}
            >
              {LABELS.ticketLoadEarlier}
            </Button>
          </div>
        ) : null}

        {props.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-3/4 rounded-[1.15rem]" />
            <Skeleton className="ml-auto h-14 w-2/3 rounded-[1.15rem]" />
          </div>
        ) : messages.length === 0 ? (
          <p className="border border-dashed border-line bg-paper/40 px-4 py-8 text-center text-[0.875rem] text-ink-muted">
            {LABELS.ticketNoMessages}
          </p>
        ) : props.useVirtual ? (
          <TicketVirtualizedMessages
            messages={messages}
            currentUserId={props.currentUserId}
            virtualizer={props.virtualizer}
            parentRef={props.messagesParentRef}
          />
        ) : (
          <ul className="space-y-3">
            {messages.map((message) => (
              <li key={message.id}>
                <MessageBubble
                  message={message}
                  isOwn={Boolean(
                    props.currentUserId &&
                    message.senderId === props.currentUserId,
                  )}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function TicketVirtualizedMessages({
  messages,
  currentUserId,
  virtualizer,
  parentRef,
}: {
  messages: TicketMessage[];
  currentUserId: string | null | undefined;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  parentRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={parentRef}
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
                  currentUserId && message.senderId === currentUserId,
                )}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
