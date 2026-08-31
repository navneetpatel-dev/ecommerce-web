/** Reads `filename="..."` from a Content-Disposition header. */
export function parseContentDispositionFilename(
  disposition: string | null | undefined,
): string | undefined {
  if (!disposition) return undefined;
  const match = /filename="([^"]+)"/i.exec(disposition);
  return match?.[1];
}

/** Prefer the server-provided download name; otherwise use the caller fallback. */
export function resolveDownloadFilename(
  response: Response,
  fallbackFilename: string,
): string {
  return (
    parseContentDispositionFilename(response.headers.get('content-disposition')) ??
    fallbackFilename
  );
}

/** Fallback dated export name when the server omits Content-Disposition. */
export function buildDatedExportFilenameFallback(
  documentKey: string,
  from: string,
  to: string,
  extension: 'csv' | 'pdf' | 'xlsx',
): string {
  const fromDate = from.slice(0, 10);
  const toDate = to.slice(0, 10);
  return `${documentKey}_${fromDate}_to_${toDate}.${extension}`;
}

/** Fallback GST tax invoice filename when the server omits Content-Disposition. */
export function buildTaxInvoiceFilenameFallback(orderId: string): string {
  return `gst-tax-invoice_order-${orderId.slice(0, 8)}.pdf`;
}

/** Fallback report-engine export name when the server omits Content-Disposition. */
export function buildReportExportFilenameFallback(
  reportType: string,
  from: string,
  to: string,
): string {
  return buildDatedExportFilenameFallback(reportType, from, to, 'xlsx');
}
