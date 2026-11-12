"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useRedeliverySlotPicker } from "@/shared/hooks/orders/useRedeliverySlotPicker.hook";
import {
  REDELIVERY_WINDOW_OPTIONS,
  type RedeliveryChoice,
} from "@/shared/utils/orders/redeliveryOptions";
import { RedeliveryOptionItems } from "./RedeliveryOptionItems.component";
import { redeliverySlotPickerStyles as styles } from "../../styles/orders/vendorOrderComponents.styles";

/** Shared picker for rescheduling a failed delivery attempt: a day and a window (B-45). */
export function RedeliverySlotPicker({
  currentSlot,
  onSubmit,
  isPending,
  prompt = LABELS.redeliveryPrompt,
}: {
  currentSlot?: string | null;
  onSubmit: (choice: RedeliveryChoice) => void;
  isPending?: boolean;
  prompt?: string;
}) {
  const picker = useRedeliverySlotPicker(onSubmit);
  const promptText = currentSlot
    ? formatLabel(LABELS.redeliveryRequested, { slot: currentSlot })
    : prompt;

  return (
    <div className={styles.container}>
      <p className={styles.prompt}>{promptText}</p>
      <div className={styles.controlsRow}>
        <Select value={picker.date} onValueChange={picker.handleDateChange}>
          <SelectTrigger
            className={styles.selectTrigger}
            aria-label={LABELS.redeliveryDay}
          >
            <SelectValue placeholder={LABELS.redeliveryDayPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <RedeliveryOptionItems options={picker.dayOptions} />
          </SelectContent>
        </Select>
        <Select value={picker.window} onValueChange={picker.handleWindowChange}>
          <SelectTrigger
            className={styles.selectTrigger}
            aria-label={LABELS.redeliveryWindow}
          >
            <SelectValue placeholder={LABELS.redeliveryWindowPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <RedeliveryOptionItems options={REDELIVERY_WINDOW_OPTIONS} />
          </SelectContent>
        </Select>
        <Button
          disabled={picker.confirmDisabled}
          loading={isPending}
          onClick={picker.handleConfirm}
        >
          {LABELS.redeliveryConfirm}
        </Button>
      </div>
    </div>
  );
}
