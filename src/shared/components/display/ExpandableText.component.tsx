"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { useExpandableText } from "@/shared/hooks/ui/useExpandableText.hook";
import { expandableTextStyles as styles } from "../../styles/display/displayComponents.styles";

interface ExpandableTextProps {
  text: string;
  /** Characters above which the text starts clamped. */
  threshold: number;
  lines?: 3 | 4 | 5;
  className?: string;
}

/** Paragraph that clamps long text to a few lines with a "Read more" toggle. */
export function ExpandableText({
  text,
  threshold,
  lines = 3,
  className,
}: ExpandableTextProps) {
  const textId = useId();
  const { isLong, expanded, clamped, displayText, toggle } = useExpandableText(
    text,
    threshold,
  );

  return (
    <div className={styles.root}>
      <p
        id={textId}
        className={cn(className, clamped && styles.clampByLines[lines])}
      >
        {displayText}
      </p>
      {isLong ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={toggle}
          className={styles.toggle}
        >
          {expanded ? LABELS.readLessText : LABELS.readMoreText}
          <ChevronDown
            className={cn(styles.toggleIcon, expanded && styles.toggleIconOpen)}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  );
}
