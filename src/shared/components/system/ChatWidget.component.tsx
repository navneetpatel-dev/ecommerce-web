import { MessageCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { chatWidgetStyles } from "@/shared/components/display/displayComponents.styles";

interface ChatWidgetProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function ChatWidget({ open, onToggle, onClose }: ChatWidgetProps) {
  const panelElement = open && (
    <div className={chatWidgetStyles.panel}>
      <h3 className={chatWidgetStyles.title}>{LABELS.chatNeedHelpTitle}</h3>
      <p className={chatWidgetStyles.message}>{LABELS.chatSupportMessage}</p>
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
        type="button"
        variant="secondary"
        size="icon"
        aria-label={LABELS.openChatSupport}
        onClick={onToggle}
        className={chatWidgetStyles.triggerBtn}
      >
        <MessageCircle className={chatWidgetStyles.icon} />
      </Button>
    </div>
  );
}
