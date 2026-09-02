import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import type { ReactNode } from "react";
import type { CheckoutQuote } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";

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
  return (
    <div className="mt-6 lg:hidden">
      <Accordion type="single" collapsible>
        <AccordionItem value="summary" className="border-line">
          <AccordionTrigger className="text-body font-medium">
            Order summary ·{" "}
            {headerTotal == null || estimatedTotalPending ? (
              <span className="text-ink-muted">Updating…</span>
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
