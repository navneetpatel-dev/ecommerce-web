import type { CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { VendorBreakdownCard } from "./ReviewStep/VendorBreakdownCard.component";
import { PayableSummary } from "./ReviewStep/PayableSummary.component";

interface ReviewStepProps {
  quote: CheckoutQuote | null;
  isPending: boolean;
  hasUnavailableItems?: boolean;
  onPlaceOrder: () => void;
  onBack: () => void;
}

/** Order review step: vendor breakdowns + payable summary + actions. */
export function ReviewStep(props: ReviewStepProps) {
  const { quote, isPending, hasUnavailableItems, onPlaceOrder, onBack } = props;

  if (!quote) {
    return (
      <div className="space-y-5">
        <div className="border border-line bg-paper/60 px-5 py-8">
          <p className="font-display text-[1.125rem] text-ink">
            {LABELS.preparingSummary}
          </p>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            {LABELS.calculatingShippingTaxes}
          </p>
        </div>
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToPayment}
        </Button>
      </div>
    );
  }

  const payable = quote.amountDue ?? quote.grandTotal;
  const showsUnavailableWarning = Boolean(hasUnavailableItems);

  const renderBreakdown = (
    breakdown: (typeof quote.vendorBreakdowns)[number],
  ) => <VendorBreakdownCard key={breakdown.vendorId} breakdown={breakdown} />;

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {quote.vendorBreakdowns.map(renderBreakdown)}
      </div>

      <PayableSummary quote={quote} payable={payable} />

      {showsUnavailableWarning ? <UnavailableItemsWarning /> : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToPayment}
        </Button>
        <Button
          size="lg"
          fullWidth="mobile"
          className="gap-2"
          onClick={onPlaceOrder}
          loading={isPending}
          disabled={showsUnavailableWarning}
        >
          {LABELS.placeOrder}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function UnavailableItemsWarning() {
  return (
    <div className="flex items-start gap-2 rounded-sm border border-warning bg-warning-subtle px-4 py-3">
      <AlertTriangle
        size={16}
        className="mt-0.5 shrink-0 text-warning"
        aria-hidden
      />
      <p className="text-[0.875rem] text-warning-foreground">
        {LABELS.removeUnavailableToCheckout}
      </p>
    </div>
  );
}
