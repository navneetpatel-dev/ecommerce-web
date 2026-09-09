import { ChevronUp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { scrollToTopStyles } from "./navigationComponents.styles";

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
      className={scrollToTopStyles.button}
      aria-label={LABELS.backToTop}
    >
      <ChevronUp size={24} className={scrollToTopStyles.icon} />
    </Button>
  );
}
