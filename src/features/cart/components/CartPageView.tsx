"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { motion } from "motion/react";
import { EmptyState } from "@/shared/components/EmptyState";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { Button } from "@/shared/components/ui/button";
import { CartPageSkeleton } from "@/shared/components/Skeletons";
import { CartLineItem } from "./CartLineItem";
import { CartCouponSection } from "./CartCouponSection";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice";
import type { CartItem, EligibleCoupon } from "@/shared/api/types";

interface CartPageViewProps {
  isLoading?: boolean;
  hasItems: boolean;
  itemCount: number;
  groupedByVendor: Record<string, CartItem[]>;
  subtotal: number;
  total: number;
  hasUnavailableItems: boolean;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  couponInput: string;
  couponMessage: string | null;
  couponError: string | null;
  couponPending: boolean;
  appliedCouponCode: string | null;
  appliedDiscount: number;
  appliedCashbackAmount?: number;
  appliedCouponType?: string | null;
  vendorDiscountBreakdown?: Array<{
    vendorId: string;
    name: string;
    amount: number;
  }>;
  eligible: EligibleCoupon[];
  eligibleLoading?: boolean;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onApplyEligible: (code: string) => void;
}

export function CartPageView({
  isLoading,
  hasItems,
  itemCount,
  groupedByVendor,
  subtotal,
  total,
  hasUnavailableItems,
  onUpdateQuantity,
  onRemoveItem,
  couponInput,
  couponMessage,
  couponError,
  couponPending,
  appliedCouponCode,
  appliedDiscount,
  appliedCashbackAmount = 0,
  appliedCouponType,
  vendorDiscountBreakdown = [],
  eligible,
  eligibleLoading,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  onApplyEligible,
}: CartPageViewProps) {
  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (!hasItems) {
    return (
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
        />
        <div className="storefront-container relative py-16 md:py-20">
          <EmptyState
            icon={ShoppingBag}
            heading={LABELS.cartEmptyHeading}
            message={LABELS.cartEmptyMessage}
            actionLabel={LABELS.continueShopping}
            actionTo={PATHS.products}
          />
        </div>
      </div>
    );
  }

  const vendorEntries = Object.entries(groupedByVendor);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-6 md:py-8">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
        >
          <TextEyebrow brand>Shopping bag</TextEyebrow>
          <h1
            className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            {LABELS.yourCart}
          </h1>
        </motion.header>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-8">
              {vendorEntries.map(([vendorId, items], vendorIndex) => {
                const vendor = items[0]?.product?.vendor;
                return (
                  <motion.section
                    key={vendorId}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.04 * vendorIndex,
                      ease: [0.2, 0, 0, 1],
                    }}
                  >
                    {vendor && (
                      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2">
                        <div className="flex items-baseline gap-2">
                          <TextEyebrow className="!mb-0">Sold by</TextEyebrow>
                          <Link
                            href={`${PATHS.products}?vendorId=${vendor.id}`}
                            className="font-display text-[1.125rem] text-ink transition-colors hover:text-brand"
                          >
                            {vendor.businessName}
                          </Link>
                        </div>
                        <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
                          {items.reduce(
                            (sum, item) => sum + Number(item.quantity || 0),
                            0,
                          )}{" "}
                          items
                        </span>
                      </div>
                    )}

                    <ul className="divide-y divide-line">
                      {items.map((item) => (
                        <CartLineItem
                          key={item.id}
                          item={item}
                          onUpdateQuantity={onUpdateQuantity}
                          onRemoveItem={onRemoveItem}
                        />
                      ))}
                    </ul>
                  </motion.section>
                );
              })}
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <Link
                href={PATHS.products}
                className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-brand transition-colors hover:text-brand-hover"
              >
                {LABELS.continueShopping}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[88px] lg:self-start lg:z-10">
            <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
              />

              <p className="text-[0.875rem] text-ink-muted">
                {itemCount} {itemCount === 1 ? "item" : "items"}
                <span className="mx-2 text-line">·</span>
                <span className="font-medium text-ink">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </p>

              <TextEyebrow className="mt-4">Order summary</TextEyebrow>
              <h2 className="mt-1 font-display text-[1.25rem] text-ink">
                Ready to checkout
              </h2>

              <dl className="mt-5 space-y-2.5 text-[0.875rem]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-muted">{LABELS.subtotal}</dt>
                  <dd className="tabular-nums text-ink">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </dd>
                </div>
                {appliedDiscount > 0 ? (
                  <div className="flex items-center justify-between gap-4 text-success">
                    <dt>{LABELS.couponDiscount}</dt>
                    <dd className="tabular-nums">
                      −₹{appliedDiscount.toLocaleString("en-IN")}
                    </dd>
                  </div>
                ) : null}
                {vendorDiscountBreakdown.length > 1
                  ? vendorDiscountBreakdown.map((row) => (
                      <div
                        key={row.vendorId}
                        className="flex items-center justify-between gap-4 pl-2 text-[0.8125rem] text-success"
                      >
                        <dt className="text-ink-muted">
                          {LABELS.vendorDiscountBreakdown}: {row.name}
                        </dt>
                        <dd className="tabular-nums">
                          −₹{row.amount.toLocaleString("en-IN")}
                        </dd>
                      </div>
                    ))
                  : null}
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-muted">{LABELS.shipping}</dt>
                  <dd className="text-right text-ink-muted">
                    {LABELS.calculatingShippingTaxes}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 border-t border-line pt-4">
                <CartCouponSection
                  couponInput={couponInput}
                  couponMessage={couponMessage}
                  couponError={couponError}
                  couponPending={couponPending}
                  appliedCouponCode={appliedCouponCode}
                  appliedDiscount={appliedDiscount}
                  appliedCashbackAmount={appliedCashbackAmount}
                  orderTotal={total}
                  eligible={eligible}
                  eligibleLoading={eligibleLoading}
                  onCouponInputChange={onCouponInputChange}
                  onApplyCoupon={onApplyCoupon}
                  onRemoveCoupon={onRemoveCoupon}
                  onApplyEligible={onApplyEligible}
                />
              </div>

              <div className="mt-4 border-t border-line pt-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-[0.875rem] font-medium text-ink">
                    {LABELS.total}
                  </span>
                  <span className="font-display text-[1.5rem] leading-none tabular-nums text-brand">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                {(appliedCashbackAmount > 0 ||
                  appliedCouponType === "CASHBACK") && (
                  <CashbackCouponNotice
                    className="mt-3 text-[0.8125rem] text-brand"
                    payNow={total}
                    cashbackAmount={appliedCashbackAmount}
                    code={appliedCouponCode}
                  />
                )}
              </div>

              {hasUnavailableItems ? (
                <p className="mt-4 rounded-sm bg-warning-subtle px-3 py-2 text-[0.8125rem] text-warning-foreground">
                  {LABELS.removeUnavailableToCheckout}
                </p>
              ) : (
                <Button asChild className="mt-5 w-full" size="lg">
                  <Link
                    href={PATHS.checkout}
                    className="inline-flex items-center justify-center gap-2"
                  >
                    {LABELS.checkout}
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              )}

              <p className="mt-3 text-center text-[0.75rem] text-ink-muted">
                Secure checkout · Easy returns
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
