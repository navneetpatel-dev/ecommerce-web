"use client";

import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import type { RefObject } from "react";
import type { Virtualizer } from "@tanstack/react-virtual";
import type { TicketMessage } from "../../../api/list/supportTickets.api";
import { MessageBubble } from "./TicketMessageBubble.component";
import { ticketThreadStyles } from "./ticketThread.styles";

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
    <section className={ticketThreadStyles.convSection}>
      <div aria-hidden className={ticketThreadStyles.convBar} />
      <div className={ticketThreadStyles.convHeader}>
        <TextEyebrow>{LABELS.ticketConversation}</TextEyebrow>
        {messages.length > 0 && !props.hasNextPage ? (
          <span className={ticketThreadStyles.convCount}>
            {messages.length}
          </span>
        ) : null}
      </div>

      <div className={ticketThreadStyles.convBody}>
        {props.hasNextPage ? (
          <div className={ticketThreadStyles.convLoadMoreWrap}>
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
          <div className={ticketThreadStyles.convSkeletonList}>
            <Skeleton className={ticketThreadStyles.convSkeletonLeft} />
            <Skeleton className={ticketThreadStyles.convSkeletonRight} />
          </div>
        ) : messages.length === 0 ? (
          <p className={ticketThreadStyles.convEmpty}>
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
          <ul className={ticketThreadStyles.convList}>
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
    <div ref={parentRef} className={ticketThreadStyles.convContainer}>
      <ul
        className={ticketThreadStyles.convViewport}
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          const message = messages[item.index]!;
          return (
            <li
              key={message.id}
              data-index={item.index}
              ref={virtualizer.measureElement}
              className={ticketThreadStyles.convItemWrapper}
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
