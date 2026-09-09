import { MessageCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

interface ChatWidgetProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function ChatWidget({ open, onToggle, onClose }: ChatWidgetProps) {
  const panelElement = open && (
    <div className="mb-4 w-80 rounded-lg border border-line bg-surface-raised p-4 shadow-elevation-3">
      <h3 className="text-[1.125rem] font-semibold text-ink">
        {LABELS.chatNeedHelpTitle}
      </h3>
      <p className="mt-2 text-body text-ink-muted">
        {LABELS.chatSupportMessage}
      </p>
      <Button
        type="button"
        variant="link"
        size="sm"
        className="mt-4 h-auto min-h-0 max-h-none px-0 py-0 text-body-sm font-medium text-brand"
        onClick={onClose}
      >
        {LABELS.close}
      </Button>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {panelElement}
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label={LABELS.openChatSupport}
        onClick={onToggle}
        className="h-14 w-14 min-h-14 max-h-14 rounded-full shadow-elevation-2 hover:shadow-elevation-3"
      >
        <MessageCircle className="h-6 w-6 text-ink" />
      </Button>
    </div>
  );
}
