import type { Address, CartItem, CheckoutQuote } from "@/shared/api/types";
import type { ShippingMethod } from "@/shared/constants/statuses";
import type { PaymentNotice } from "../../hooks/usePlaceOrder.hook";
import type { CheckoutPaymentPhase } from "../../hooks/useCheckoutPaymentPhase.hook";

export interface CheckoutPageViewProps {
  isLoading?: boolean;
  hasItems: boolean;
  step: number;
  addressId: string | null;
  shippingMethodByVendor: Record<string, ShippingMethod>;
  addresses?: Address[];
  paymentMethod?: string | null;
  walletAmountToUse?: number;
  giftWrap?: boolean;
  giftMessage?: string;
  quote?: CheckoutQuote | null;
  isQuoteLoading?: boolean;
  isQuoteError?: boolean;
  quoteErrorMessage?: string;
  isPending: boolean;
  paymentPhase?: CheckoutPaymentPhase;
  isPaymentOverlayOpen?: boolean;
  paymentNotice?: PaymentNotice | null;
  onClearPaymentNotice?: () => void;
  isCreatingAddress?: boolean;
  groupedByVendor: Record<string, CartItem[]>;
  subtotal?: number;
  subtotalPending?: boolean;
  /** Cart request failed — amounts are missing for good, not mid-refresh. */
  amountsUnavailable?: boolean;
  onRetryAmounts?: () => void;
  estimatedTotal?: number;
  estimatedTotalPending?: boolean;
  cartPricingPreview?: {
    taxTotal: number;
    shippingTotal: number;
    shippingDisplayKey: "FREE" | "PAID";
  };
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
  onGiftWrapChange?: (giftWrap: boolean) => void;
  onGiftMessageChange?: (giftMessage: string) => void;
  onContinueToReview: () => void;
  onPlaceOrder: () => void;
  onCreateAddress: (body: Omit<Address, "id" | "userId">) => Promise<void>;
}
