import type { Address, CartItem, CheckoutQuote } from "@/shared/api/types";
import type { ShippingMethod } from "@/shared/constants/statuses";
import type { PaymentNotice } from "../../hooks/usePlaceOrder.hook";

export interface CheckoutPageViewProps {
  isLoading?: boolean;
  hasItems: boolean;
  step: number;
  addressId: string | null;
  shippingMethodByVendor: Record<string, ShippingMethod>;
  addresses?: Address[];
  paymentMethod?: string | null;
  walletAmountToUse?: number;
  quote?: CheckoutQuote | null;
  isQuoteLoading?: boolean;
  isQuoteError?: boolean;
  quoteErrorMessage?: string;
  isPending: boolean;
  paymentNotice?: PaymentNotice | null;
  onClearPaymentNotice?: () => void;
  isCreatingAddress?: boolean;
  groupedByVendor: Record<string, CartItem[]>;
  total: number;
  shippingReady: boolean;
  hasUnavailableItems?: boolean;
  onStepClick: (step: number) => void;
  onSelectAddress: (id: string) => void;
  onSelectShipping: (vendorId: string, method: ShippingMethod) => void;
  onContinueToShipping: () => void;
  onContinueToPayment: () => void;
  onBackToShipping: () => void;
  onBackToPayment: () => void;
  onSelectPayment: (method: string) => void;
  onWalletAmountChange: (amount: number) => void;
  onContinueToReview: () => void;
  onPlaceOrder: () => void;
  onCreateAddress: (body: Omit<Address, "id" | "userId">) => Promise<void>;
}
