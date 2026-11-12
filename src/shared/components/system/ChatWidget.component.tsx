import type { RefObject } from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { chatWidgetStyles } from "@/shared/styles/display/displayComponents.styles";

interface ChatWidgetProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  supportHours: string | null;
}

/**
 * Help bubble: ways to reach support (ticket, contact, help centre) and the
 * hours. It used to promise a chat that does not exist.
 */
export function ChatWidget({
  open,
  onToggle,
  onClose,
  triggerRef,
  supportHours,
}: ChatWidgetProps) {
  const panelId = "help-widget-panel";
  const panelElement = open && (
    <div
      id={panelId}
      role="dialog"
      aria-label={LABELS.chatNeedHelpTitle}
      className={chatWidgetStyles.panel}
    >
      <h2 className={chatWidgetStyles.title}>{LABELS.chatNeedHelpTitle}</h2>
      <p className={chatWidgetStyles.message}>{LABELS.chatSupportMessage}</p>
      <div className={chatWidgetStyles.links}>
        <Link
          href={PATHS.supportTicketNew}
          onClick={onClose}
          className={chatWidgetStyles.primaryLink}
        >
          {LABELS.helpRaiseTicket}
        </Link>
        <Link
          href={PATHS.help}
          onClick={onClose}
          className={chatWidgetStyles.link}
        >
          {LABELS.helpCentre}
        </Link>
        <Link
          href={PATHS.contact}
          onClick={onClose}
          className={chatWidgetStyles.link}
        >
          {LABELS.helpContactUs}
        </Link>
      </div>
      {supportHours ? (
        <p className={chatWidgetStyles.hours}>
          {formatLabel(LABELS.helpHours, { hours: supportHours })}
        </p>
      ) : null}
      <Button
        type="button"
        variant="link"
        size="sm"
        className={chatWidgetStyles.closeBtn}
        onClick={onClose}
      >
        {LABELS.close}
      </Button>
    </div>
  );

  return (
    <div className={chatWidgetStyles.container}>
      {panelElement}
      <Button
        ref={triggerRef}
        type="button"
        variant="secondary"
        size="icon"
        aria-label={LABELS.openChatSupport}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={onToggle}
        className={chatWidgetStyles.triggerBtn}
      >
        <HelpCircle className={chatWidgetStyles.icon} aria-hidden />
      </Button>
    </div>
  );
}
