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
  subtotal: number;
  estimatedTotal: number;
  quote?: CheckoutQuote | null;
}

export function MobileSummaryAccordion({
  summary,
  subtotal,
  estimatedTotal,
  quote,
}: MobileSummaryAccordionProps) {
  return (
    <div className="mt-6 lg:hidden">
      <Accordion type="single" collapsible>
        <AccordionItem value="summary" className="border-line">
          <AccordionTrigger className="text-body font-medium">
            Order summary · ₹{formatInrAmount(quote?.grandTotal ?? estimatedTotal)}
          </AccordionTrigger>
          <AccordionContent>{summary}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
