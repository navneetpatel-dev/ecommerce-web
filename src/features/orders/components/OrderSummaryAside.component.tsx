import Link from "next/link";
import { MapPin } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import type { Order } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { formatInr } from "../utils/format";
import { OrderPaymentSummary } from "./OrderPaymentSummary.component";

interface OrderSummaryAsideProps {
  order: Order;
  itemCount: number;
  invoicePending: boolean;
  invoiceError: string | null;
  onDownloadInvoice: () => void;
}

/** Sticky order-summary sidebar for the order detail screen (Rule 3 split). */
export function OrderSummaryAside(props: OrderSummaryAsideProps) {
  const { order, itemCount, invoicePending, invoiceError, onDownloadInvoice } =
    props;
  const address = order.shippingAddress;

  const itemCopy = `${itemCount} ${
    itemCount === 1 ? LABELS.itemSingular : LABELS.itemPlural
  }`;

  const merchandiseSubtotal = order.merchandiseSubtotal;
  const taxTotal = order.taxTotal;
  const shippingTotal = order.shippingTotal;
  const showMoneyBreakdown =
    merchandiseSubtotal != null ||
    taxTotal != null ||
    shippingTotal != null;

  const renderDiscountRow = () => (
    <div className="flex items-center justify-between gap-4 text-success">
      <dt>{LABELS.discount}</dt>
      <dd className="tabular-nums">−{formatInr(order.discountTotal)}</dd>
    </div>
  );

  return (
    <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
      />

      <p className="text-[0.875rem] text-ink-muted">
        {itemCopy}
        <span className="mx-2 text-line">·</span>
        <span className="font-medium text-ink">
          {formatInr(order.totalAmount)}
        </span>
      </p>

      <TextEyebrow className="mt-4">{LABELS.orderSummary}</TextEyebrow>
      <h2 className="mt-1 font-display text-[1.25rem] text-ink">
        {LABELS.whatYouPaid}
      </h2>

      <dl className="mt-5 space-y-2.5 text-[0.875rem]">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-ink-muted">{LABELS.itemsLine}</dt>
          <dd className="tabular-nums text-ink">{itemCount}</dd>
        </div>
        {showMoneyBreakdown && merchandiseSubtotal != null ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">{LABELS.subtotal}</dt>
            <dd className="tabular-nums text-ink">
              {formatInr(merchandiseSubtotal)}
            </dd>
          </div>
        ) : null}
        {showMoneyBreakdown && Number(shippingTotal) > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">Shipping</dt>
            <dd className="tabular-nums text-ink">{formatInr(shippingTotal!)}</dd>
          </div>
        ) : null}
        {showMoneyBreakdown && Number(taxTotal) > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">{LABELS.taxTotal}</dt>
            <dd className="tabular-nums text-ink">{formatInr(taxTotal!)}</dd>
          </div>
        ) : null}
        {Number(order.discountTotal) > 0 ? renderDiscountRow() : null}
        <div className="flex items-end justify-between gap-4 border-t border-line pt-3">
          <dt className="text-body-sm font-semibold uppercase tracking-[0.08em] text-brand">
            {LABELS.total}
          </dt>
          <dd className="font-display text-[1.5rem] leading-none tabular-nums text-brand">
            {formatInr(order.totalAmount)}
          </dd>
        </div>
      </dl>

      <OrderPaymentSummary
        order={order}
        className="mt-5 border-t border-line pt-5"
      />

      {address ? <ShippingAddressBlock address={address} /> : null}

      <div className="mt-5 border-t border-line pt-5 space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onDownloadInvoice}
          loading={invoicePending}
        >
          {LABELS.downloadTaxInvoice}
        </Button>
        {invoiceError ? (
          <p role="alert" className="text-body-sm text-danger">
            {invoiceError}
          </p>
        ) : null}
        <Button className="w-full" asChild>
          <Link href={PATHS.orders}>{LABELS.allOrders}</Link>
        </Button>
      </div>
    </div>
  );
}

interface ShippingAddressBlockProps {
  address: NonNullable<Order["shippingAddress"]>;
}

function ShippingAddressBlock({ address }: ShippingAddressBlockProps) {
  return (
    <div className="mt-5 border-t border-line pt-5">
      <div className="flex items-center gap-2">
        <MapPin className="h-3.5 w-3.5 text-ink-muted" strokeWidth={1.5} />
        <TextEyebrow className="!mb-0">{LABELS.shippingTo}</TextEyebrow>
      </div>
      <address className="mt-2 not-italic text-[0.875rem] leading-relaxed text-ink">
        <span className="block">{address.line1}</span>
        {address.line2 ? <span className="block">{address.line2}</span> : null}
        <span className="block text-ink-muted">
          {address.city}, {address.state} {address.pincode}
        </span>
        <span className="block text-ink-muted">{address.country}</span>
      </address>
    </div>
  );
}
