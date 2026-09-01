import type { HelpCategory } from "../../types/help.types";

export const ORDERS_TRACKING_CATEGORY: HelpCategory = {
  id: "orders-tracking",
  title: "Orders & tracking",
  description:
    "Find orders, understand statuses, and track multi-seller shipments.",
  icon: "Package",
  articles: [
    {
      slug: "view-and-understand-orders",
      title: "View and understand orders",
      summary:
        "Order history, statuses, and how parent orders relate to seller sub-orders.",
      sections: [
        {
          heading: "Where to find orders",
          paragraphs: [
            "Signed-in customers can open Orders from the header or account area. Each order shows the date, total in INR, payment method, and current overall status.",
          ],
        },
        {
          heading: "Typical status meanings",
          bullets: [
            "Pending / awaiting payment — payment not confirmed yet",
            "Confirmed / processing — sellers are preparing items",
            "Shipped — at least one package is with the courier",
            "Delivered — packages marked delivered (multi-seller orders may deliver at different times)",
            "Cancelled — order or a portion was cancelled before fulfilment",
          ],
        },
        {
          heading: "Order detail page",
          paragraphs: [
            "Open an order to see line items, seller names, shipping addresses, payment summary, and shipment cards. Use this page for tracking links and return requests when eligible.",
          ],
        },
        {
          heading: "Invoices and GST",
          paragraphs: [
            "Where sellers issue invoices, they may include GST details as applicable. Keep order IDs handy if you need documentation for expense or warranty purposes.",
          ],
        },
      ],
      relatedSlugs: [
        "how-multi-seller-orders-work",
        "track-your-order",
        "cancel-an-order",
      ],
    },
    {
      slug: "track-your-order",
      title: "Track your order",
      summary:
        "Follow AWB and courier updates for each seller shipment tied to your order.",
      sections: [
        {
          heading: "Tracking availability",
          paragraphs: [
            "Tracking usually appears after the seller hands the package to a courier and an AWB (air waybill) number is generated. Processing time before handover varies by seller.",
          ],
        },
        {
          heading: "Multi-seller tracking",
          bullets: [
            "Each seller shipment can have its own tracking number",
            "One item delivered does not mean the entire order is complete",
            "Refresh the order page periodically for the latest courier scan",
          ],
        },
        {
          heading: "Tracking lookup",
          paragraphs: [
            "If you have a tracking or order reference, you can also use the tracking lookup tools where provided. Always match the destination address to your order before sharing tracking details with others.",
          ],
        },
        {
          heading: "No movement for several days",
          paragraphs: [
            "Courier networks sometimes show gaps between scans, especially across cities. If there is no update for an extended period after ship confirmation, contact support with your order ID and AWB under Shipping.",
          ],
        },
      ],
      relatedSlugs: [
        "delivery-timelines-and-pincodes",
        "failed-delivery-attempts",
        "view-and-understand-orders",
      ],
    },
    {
      slug: "cancel-an-order",
      title: "Cancel an order or items",
      summary:
        "When cancellation is possible, what happens to payment, and multi-seller caveats.",
      sections: [
        {
          heading: "Before the seller ships",
          paragraphs: [
            "You can cancel a paid order from the order detail page while every seller slice is still pending or confirmed. Cancellation is not available after any item has shipped — use the returns flow after delivery if the item is eligible.",
            "On cancel, wallet points used at checkout are restored immediately. Card or UPI amounts are refunded to the original method after the bank posts the refund.",
          ],
        },
        {
          heading: "Partial cancellation",
          paragraphs: [
            "On multi-seller orders, one seller’s items may still be cancellable while another has already shipped. Review each sub-order status before requesting cancellation.",
          ],
        },
        {
          heading: "Refunds after cancellation",
          bullets: [
            "Razorpay payments: refunds are initiated to the original payment method",
            "Bank or UPI posting times vary; allow several business days after initiation",
            "COD orders that never shipped typically have no collection to reverse",
          ],
        },
        {
          heading: "How to request help",
          paragraphs: [
            "If self-serve cancel is unavailable, contact support with topic Orders, your order ID, and the items you need cancelled. Do not place a duplicate order until cancellation is confirmed.",
          ],
        },
      ],
      relatedSlugs: [
        "refunds-timelines-and-methods",
        "request-a-return",
        "payment-pending-or-failed",
      ],
    },
    {
      slug: "order-confirmation-and-emails",
      title: "Order confirmation and emails",
      summary:
        "What confirmation means, which emails to expect, and how to verify a successful order.",
      sections: [
        {
          heading: "Successful placement",
          paragraphs: [
            "A successful order shows a confirmation screen with an order ID and appears under Orders. Save the order ID for support and tracking.",
          ],
        },
        {
          heading: "Emails you may receive",
          bullets: [
            "Order confirmation with summary and total",
            "Payment success or failure notices for online payments",
            "Shipment emails when sellers dispatch packages",
            "Delivery and return status updates",
          ],
        },
        {
          heading: "Paid but no confirmation",
          paragraphs: [
            "If Razorpay deducted money but Orders does not show a paid order, wait briefly for reconciliation, then check again. If the order is still missing, contact support with Payments topic, payment reference, and approximate time — avoid paying again immediately.",
          ],
        },
        {
          heading: "Duplicate charges",
          paragraphs: [
            "Occasional double authorisations reverse automatically. Compare bank statements with Orders before disputing. Support can help match payment references to order IDs.",
          ],
        },
      ],
      relatedSlugs: [
        "payment-pending-or-failed",
        "view-and-understand-orders",
        "emails-not-received",
      ],
    },
  ],
};
