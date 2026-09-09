import Link from "next/link";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import type { Order } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { OrderPaymentSummary } from "./OrderPaymentSummary.component";
import { OrderMoneyBreakdown } from "./OrderMoneyBreakdown.component";
import { OrderCancelAction } from "./OrderCancelAction.component";
import { ShippingAddressBlock } from "./ShippingAddressBlock.component";
import { SubOrderInvoicesList } from "./SubOrderInvoicesList.component";
import { useOrderSummaryAside } from "./useOrderSummaryAside.hook";
import { ORDER_SUMMARY_ASIDE_STYLES } from "./orderSummaryAside.styles";

interface OrderSummaryAsideProps {
  order: Order;
  itemCount: number;
  invoicePending: boolean;
  pendingSubOrderId: string | null;
  invoiceError: string | null;
  onDownloadAllInvoices: () => void;
  onDownloadSubOrderInvoice: (subOrderId: string) => void;
}

/** Sticky order-summary sidebar for the order detail screen (Rule 3 split). */
export function OrderSummaryAside(props: OrderSummaryAsideProps) {
  const {
    order,
    itemCount,
    invoicePending,
    pendingSubOrderId,
    invoiceError,
    onDownloadAllInvoices,
    onDownloadSubOrderInvoice,
  } = props;

  const {
    address,
    subOrders,
    hasMultipleSellers,
    itemCopy,
    formattedTotalAmount,
    allInvoicesDisabled,
    singleInvoiceDisabled,
  } = useOrderSummaryAside({
    order,
    itemCount,
    invoicePending,
  });

  return (
    <div className={ORDER_SUMMARY_ASIDE_STYLES.root}>
      <div aria-hidden className={ORDER_SUMMARY_ASIDE_STYLES.accentBorder} />

      <p className={ORDER_SUMMARY_ASIDE_STYLES.itemCountText}>
        {itemCopy}
        <span className={ORDER_SUMMARY_ASIDE_STYLES.dotSeparator}>·</span>
        <span className={ORDER_SUMMARY_ASIDE_STYLES.totalAmount}>
          {formattedTotalAmount}
        </span>
      </p>

      <TextEyebrow className={ORDER_SUMMARY_ASIDE_STYLES.eyebrow}>
        {LABELS.orderSummary}
      </TextEyebrow>
      <h2 className={ORDER_SUMMARY_ASIDE_STYLES.title}>{LABELS.whatYouPaid}</h2>

      <div className={ORDER_SUMMARY_ASIDE_STYLES.itemsRow}>
        <dl className={ORDER_SUMMARY_ASIDE_STYLES.itemsDl}>
          <dt className={ORDER_SUMMARY_ASIDE_STYLES.itemsLabel}>
            {LABELS.itemsLine}
          </dt>
          <dd className={ORDER_SUMMARY_ASIDE_STYLES.itemsValue}>{itemCount}</dd>
        </dl>
        <OrderMoneyBreakdown order={order} />
      </div>

      <OrderPaymentSummary
        order={order}
        className={ORDER_SUMMARY_ASIDE_STYLES.paymentSummary}
      />

      {address ? <ShippingAddressBlock address={address} /> : null}

      <div className={ORDER_SUMMARY_ASIDE_STYLES.actionsContainer}>
        {hasMultipleSellers ? (
          <div className={ORDER_SUMMARY_ASIDE_STYLES.multiSellersContainer}>
            <p className={ORDER_SUMMARY_ASIDE_STYLES.downloadTitle}>
              {LABELS.downloadTaxInvoice}
            </p>
            <SubOrderInvoicesList
              subOrders={subOrders}
              invoicePending={invoicePending}
              pendingSubOrderId={pendingSubOrderId}
              onDownloadSubOrderInvoice={onDownloadSubOrderInvoice}
            />
            <Button
              type="button"
              variant="secondary"
              className={ORDER_SUMMARY_ASIDE_STYLES.fullWidthButton}
              onClick={onDownloadAllInvoices}
              loading={invoicePending && pendingSubOrderId == null}
              disabled={allInvoicesDisabled}
            >
              {LABELS.downloadAllTaxInvoices}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className={ORDER_SUMMARY_ASIDE_STYLES.fullWidthButton}
            onClick={onDownloadAllInvoices}
            loading={invoicePending}
            disabled={singleInvoiceDisabled}
          >
            {LABELS.downloadTaxInvoice}
          </Button>
        )}

        {invoiceError ? (
          <p role="alert" className={ORDER_SUMMARY_ASIDE_STYLES.invoiceError}>
            {invoiceError}
          </p>
        ) : null}

        <OrderCancelAction order={order} />

        <Button className={ORDER_SUMMARY_ASIDE_STYLES.fullWidthButton} asChild>
          <Link href={PATHS.orders}>{LABELS.allOrders}</Link>
        </Button>
      </div>
    </div>
  );
}
