import { ArrowRight } from "lucide-react";
import type { CartItem } from "@/shared/api/types";
import type { ShippingMethod } from "@/shared/constants/statuses";
import { ShippingCardContainer } from "../containers/ShippingCardContainer.container";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";

interface ShippingStepProps {
  groupedByVendor: Record<string, CartItem[]>;
  selectedMethods: Record<string, string>;
  pincode: string;
  canContinue: boolean;
  onSelect: (vendorId: string, method: ShippingMethod) => void;
  onContinue: () => void;
}

function estimateWeightGrams(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const unitWeight = Number(item.variant?.weightGrams ?? 500);
    return sum + Number(item.quantity || 1) * unitWeight;
  }, 0);
}

export function ShippingStep({
  groupedByVendor,
  selectedMethods,
  pincode,
  canContinue,
  onSelect,
  onContinue,
}: ShippingStepProps) {
  const vendors = Object.entries(groupedByVendor);

  return (
    <div className="space-y-5">
      <p className="text-[0.875rem] text-ink-muted">
        {vendors.length} {vendors.length === 1 ? "vendor" : "vendors"} in this
        order
      </p>

      {!pincode && (
        <p className="text-[0.875rem] text-ink-muted">
          Select a delivery address to load shipping rates.
        </p>
      )}

      <div className="space-y-4">
        {vendors.map(([vid, items]) => (
          <ShippingCardContainer
            key={vid}
            vendorId={vid}
            vendor={items[0].product.vendor}
            pincode={pincode}
            weightGrams={estimateWeightGrams(items)}
            selected={selectedMethods[vid]}
            onSelect={(m) => onSelect(vid, m)}
          />
        ))}
      </div>

      <DisabledActionHint
        disabled={!canContinue}
        message="Select a shipping method for each vendor to continue."
        className="w-full sm:w-auto"
      >
        <Button
          size="lg"
          onClick={onContinue}
          disabled={!canContinue}
          fullWidth="mobile"
          className="gap-2"
        >
          Continue to payment
          <ArrowRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  );
}
