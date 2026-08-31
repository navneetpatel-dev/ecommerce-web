import { describe, expect, it } from "vitest";
import {
  buildDatedExportFilenameFallback,
  buildTaxInvoiceFilenameFallback,
  parseContentDispositionFilename,
  resolveDownloadFilename,
} from "../downloadFilename";

describe("downloadFilename", () => {
  it("parses filenames from Content-Disposition headers", () => {
    expect(
      parseContentDispositionFilename(
        'attachment; filename="gst-tax-invoice_inv-2024-00042.pdf"',
      ),
    ).toBe("gst-tax-invoice_inv-2024-00042.pdf");
  });

  it("prefers the server filename over the fallback", () => {
    const response = new Response(null, {
      headers: {
        "content-disposition":
          'attachment; filename="admin-wallet-liability_2024-01-01_to_2024-01-31.pdf"',
      },
    });
    expect(resolveDownloadFilename(response, "fallback.pdf")).toBe(
      "admin-wallet-liability_2024-01-01_to_2024-01-31.pdf",
    );
  });

  it("builds meaningful fallback export names", () => {
    expect(
      buildDatedExportFilenameFallback(
        "admin-dashboard-summary",
        "2024-01-01",
        "2024-01-31",
        "pdf",
      ),
    ).toBe("admin-dashboard-summary_2024-01-01_to_2024-01-31.pdf");
    expect(buildTaxInvoiceFilenameFallback("abc12345-6789")).toBe(
      "gst-tax-invoice_order-abc12345.pdf",
    );
  });
});
