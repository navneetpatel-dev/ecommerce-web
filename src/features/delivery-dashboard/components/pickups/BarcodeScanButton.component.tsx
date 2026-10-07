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
import { LABELS } from "@/shared/constants/labels";

import {
  useBarcodeScanner,
  type BarcodeScannerError,
} from "../../hooks/pickups/useBarcodeScanner.hook";
import { barcodeScanButtonStyles } from "../../styles/pickups/barcodeScanButton.styles";

const SCANNER_ERROR_COPY: Record<BarcodeScannerError, string> = {
  unsupported: LABELS.scannerUnsupported,
  camera: LABELS.scannerCameraError,
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
        aria-label={LABELS.cameraPreviewAria}
      />
      {error ? (
        <p role="alert" className={barcodeScanButtonStyles.errorNotice}>
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

  const handleOpenScan = () => {
    setOpen(true);
  };

  const handleDecoded = (text: string) => {
    onDecoded(text);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpenScan}>
        <ScanLine
          className={barcodeScanButtonStyles.buttonIcon}
          aria-hidden="true"
        />
        {LABELS.scanBarcode}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={barcodeScanButtonStyles.dialogContent}>
          <DialogHeader>
            <DialogTitle>{LABELS.scanDialogTitle}</DialogTitle>
          </DialogHeader>
          <ScannerViewport onDecoded={handleDecoded} />
        </DialogContent>
      </Dialog>
    </>
  );
}
