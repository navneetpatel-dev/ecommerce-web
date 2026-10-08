"use client";

import { useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { useCopyToClipboard } from "@/shared/hooks/ui/useCopyToClipboard.hook";
import { copyTextButtonStyles as styles } from "../../styles/actions/copyTextButton.styles";

interface CopyTextButtonProps {
  /** Text copied to the clipboard. */
  value: string;
  /** Accessible name, e.g. "Copy coupon code". */
  label: string;
}

/** Icon button that copies `value` and announces the result politely. */
export function CopyTextButton({ value, label }: CopyTextButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    copy(value);
  }, [copy, value]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={handleCopy}
        aria-label={label}
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      </Button>
      <span role="status" className={styles.status}>
        {copied ? LABELS.copiedToClipboard : ""}
      </span>
    </>
  );
}
