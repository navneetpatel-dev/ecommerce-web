import { create } from 'zustand'

interface CheckoutState {
  step: 1 | 2 | 3 | 4
  addressId: string | null
  shippingMethodByVendor: Record<string, 'STANDARD' | 'EXPRESS'>
  appliedCouponCode: string | null
  paymentMethod: string | null
  setStep: (step: CheckoutState['step']) => void
  setAddress: (id: string) => void
  setShippingMethod: (vendorId: string, method: 'STANDARD' | 'EXPRESS') => void
  setCouponCode: (code: string | null) => void
  setPaymentMethod: (method: string | null) => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 1,
  addressId: null,
  shippingMethodByVendor: {},
  appliedCouponCode: null,
  paymentMethod: null,
  setStep: (step) => set({ step }),
  setAddress: (addressId) => set({ addressId }),
  setShippingMethod: (vendorId, method) =>
    set((s) => ({ shippingMethodByVendor: { ...s.shippingMethodByVendor, [vendorId]: method } })),
  setCouponCode: (code) => set({ appliedCouponCode: code }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
}))
