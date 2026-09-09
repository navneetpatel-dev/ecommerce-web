import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import type { ReactNode } from "react";
import type { CheckoutQuote } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { MOBILE_SUMMARY_ACCORDION_STYLES } from "./mobileSummaryAccordion.styles";

interface MobileSummaryAccordionProps {
  summary: ReactNode;
  subtotal?: number;
  estimatedTotal?: number;
  estimatedTotalPending?: boolean;
  quote?: CheckoutQuote | null;
}

export function MobileSummaryAccordion({
  summary,
  estimatedTotal,
  estimatedTotalPending = false,
  quote,
}: MobileSummaryAccordionProps) {
  const headerTotal = quote?.grandTotal ?? estimatedTotal;
  const isUpdating = headerTotal == null || estimatedTotalPending;

  return (
    <div className={MOBILE_SUMMARY_ACCORDION_STYLES.root}>
      <Accordion type="single" collapsible>
        <AccordionItem
          value="summary"
          className={MOBILE_SUMMARY_ACCORDION_STYLES.item}
        >
          <AccordionTrigger className={MOBILE_SUMMARY_ACCORDION_STYLES.trigger}>
            Order summary ·{" "}
            {isUpdating ? (
              <span className={MOBILE_SUMMARY_ACCORDION_STYLES.pendingText}>
                Updating…
              </span>
            ) : (
              <>₹{formatInrAmount(headerTotal)}</>
            )}
          </AccordionTrigger>
          <AccordionContent>{summary}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
