"use client";

import { useEffect, useRef, useState } from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { barcodeScanButtonStyles } from "../../styles/pickups/barcodeScanButton.styles";

const SCANNER_ELEMENT_ID = "delivery-barcode-scanner";

/**
 * Camera barcode/QR scanner for matching a package's tracking number without
 * manually reading and typing 12-digit codes. Scans against whatever the
 * caller passes in `onDecoded` — typically a lookup into the loaded task list.
 */
export function BarcodeScanButton({
  onDecoded,
}: {
  onDecoded: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    void import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (cancelled) return;
      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scannerRef.current = scanner;
      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            onDecoded(decodedText.trim());
            setOpen(false);
          },
          undefined,
        )
        .catch(() =>
          setError("Camera unavailable. Check permissions and try again."),
        );
    });

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .catch(() => undefined)
          .finally(() => scanner.clear());
      }
      scannerRef.current = null;
    };
  }, [open, onDecoded]);

  const errorNotice = error ? (
    <p className={barcodeScanButtonStyles.errorNotice}>{error}</p>
  ) : null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        <ScanLine
          className={barcodeScanButtonStyles.buttonIcon}
          aria-hidden="true"
        />
        Scan barcode
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={barcodeScanButtonStyles.dialogContent}>
          <DialogHeader>
            <DialogTitle>Scan package barcode</DialogTitle>
          </DialogHeader>
          <div
            id={SCANNER_ELEMENT_ID}
            className={barcodeScanButtonStyles.scannerViewport}
          />
          {errorNotice}
        </DialogContent>
      </Dialog>
    </>
  );
}
