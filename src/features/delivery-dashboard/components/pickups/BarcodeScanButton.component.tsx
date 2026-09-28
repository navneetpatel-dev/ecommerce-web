"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import {
  useBarcodeScanner,
  type BarcodeScannerError,
} from "../../hooks/pickups/useBarcodeScanner.hook";
import { barcodeScanButtonStyles } from "../../styles/pickups/barcodeScanButton.styles";

const SCANNER_ERROR_COPY: Record<BarcodeScannerError, string> = {
  unsupported:
    "This browser can't scan barcodes. Type the tracking number instead.",
  camera: "Camera unavailable. Check permissions and try again.",
};

/** Mounted only while the dialog is open, so the camera follows the dialog. */
function ScannerViewport({ onDecoded }: { onDecoded: (text: string) => void }) {
  const { videoRef, error } = useBarcodeScanner(onDecoded);

  return (
    <>
      <video
        ref={videoRef}
        className={barcodeScanButtonStyles.scannerViewport}
        autoPlay
        playsInline
        muted
        aria-label="Camera preview"
      />
      {error ? (
        <p className={barcodeScanButtonStyles.errorNotice}>
          {SCANNER_ERROR_COPY[error]}
        </p>
      ) : null}
    </>
  );
}

/**
 * Camera barcode/QR scanner for matching a package's tracking number without
 * manually reading and typing 12-digit codes. Scans against whatever the
 * caller passes in `onDecoded` — typically a lookup into the loaded task list.
 * Browsers without the native `BarcodeDetector` get the manual-entry notice.
 */
export function BarcodeScanButton({
  onDecoded,
}: {
  onDecoded: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
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
          <ScannerViewport
            onDecoded={(text) => {
              onDecoded(text);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
