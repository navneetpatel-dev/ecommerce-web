"use client";

import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { Send } from "lucide-react";
import { TICKET_REPLY_MAX } from "../../../constants/form/fieldLimits";
import { TicketAttachmentUploader } from "../../form/TicketAttachmentUploader/index";
import type { UploadedMediaAttachment } from "../../form/TicketAttachmentUploader/index";
import { ticketThreadStyles } from "./ticketThread.styles";

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
    <div className={ticketThreadStyles.composerBlockedBox}>
      <p className={ticketThreadStyles.composerBlockedText}>{message}</p>
    </div>
  );
}

/** Reply textarea, attachment uploader and send button. */
export function TicketReplyComposer(props: TicketReplyComposerProps) {
  return (
    <div className={ticketThreadStyles.composerBox}>
      <Textarea
        value={props.body}
        onChange={(e) =>
          props.onBodyChange(e.target.value.slice(0, TICKET_REPLY_MAX))
        }
        placeholder={LABELS.ticketReplyPlaceholder}
        rows={3}
        className={ticketThreadStyles.composerTextarea}
        maxLength={TICKET_REPLY_MAX}
        aria-label={LABELS.ticketSendReply}
      />
      <p className={ticketThreadStyles.composerCounterText}>
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
      <div className={ticketThreadStyles.composerActionsRow}>
        <Button
          type="button"
          size="sm"
          loading={props.replyPending}
          disabled={!props.body.trim()}
          onClick={props.onSend}
        >
          <Send
            size={14}
            className={ticketThreadStyles.composerSendIcon}
            aria-hidden
          />
          {LABELS.ticketSendReply}
        </Button>
      </div>
    </div>
  );
}
