"use client";

import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { Send } from "lucide-react";
import { TICKET_REPLY_MAX } from "../../constants/fieldLimits";
import { TicketAttachmentUploader } from "../TicketAttachmentUploader";
import type { UploadedMediaAttachment } from "../TicketAttachmentUploader";

interface TicketReplyComposerProps {
  ticketId: string;
  body: string;
  onBodyChange: (body: string) => void;
  attachments: UploadedMediaAttachment[];
  onAttachmentsChange: (attachments: UploadedMediaAttachment[]) => void;
  replyPending: boolean;
  existingImageCount: number;
  existingVideoCount: number;
  error: string | null;
  onSend: () => void;
}

export function TicketReplyBlockedNotice({ message }: { message: string }) {
  return (
    <div className="border-t border-line bg-paper/40 px-3 py-3 sm:px-4">
      <p className="text-[0.8125rem] text-ink-muted">{message}</p>
    </div>
  );
}

/** Reply textarea, attachment uploader and send button. */
export function TicketReplyComposer(props: TicketReplyComposerProps) {
  return (
    <div className="space-y-2 border-t border-line bg-paper/30 px-3 py-3 sm:px-4">
      <Textarea
        value={props.body}
        onChange={(e) =>
          props.onBodyChange(e.target.value.slice(0, TICKET_REPLY_MAX))
        }
        placeholder={LABELS.ticketReplyPlaceholder}
        rows={3}
        className="min-h-[4.5rem] resize-y"
        maxLength={TICKET_REPLY_MAX}
        aria-label={LABELS.ticketSendReply}
      />
      <p className="text-[0.75rem] tabular-nums text-ink-muted">
        {formatLabel(LABELS.ticketCharCounter, {
          count: props.body.length,
          max: TICKET_REPLY_MAX,
        })}
      </p>
      <TicketAttachmentUploader
        entityId={props.ticketId}
        value={props.attachments}
        onChange={props.onAttachmentsChange}
        disabled={props.replyPending}
        existingImageCount={props.existingImageCount}
        existingVideoCount={props.existingVideoCount}
      />
      <FormError
        error={props.error ? new Error(props.error) : null}
        fallback={LABELS.ticketCouldNotReply}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          loading={props.replyPending}
          disabled={!props.body.trim()}
          onClick={props.onSend}
        >
          <Send size={14} className="mr-1.5" aria-hidden />
          {LABELS.ticketSendReply}
        </Button>
      </div>
    </div>
  );
}
