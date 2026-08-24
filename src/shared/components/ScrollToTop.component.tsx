import { ChevronUp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

interface ScrollToTopProps {
  visible: boolean;
  onScrollToTop: () => void;
}

export function ScrollToTop({ visible, onScrollToTop }: ScrollToTopProps) {
  if (!visible) return null;

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      onClick={onScrollToTop}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 min-h-14 max-h-14 rounded-full shadow-elevation-2 hover:shadow-elevation-3 animate-scale-in"
      aria-label={LABELS.backToTop}
    >
      <ChevronUp size={24} className="text-ink" />
    </Button>
  );
}
