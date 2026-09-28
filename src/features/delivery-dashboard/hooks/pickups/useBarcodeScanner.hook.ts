"use client";

import { useEffect, useRef, useState } from "react";
import {
  getBarcodeDetectorCtor,
  normaliseScanValue,
  resolveScanFormats,
  type BarcodeDetectorLike,
} from "../../utils/pickups/barcodeDetection";

/** Why the camera is not scanning, or null while it is. */
export type BarcodeScannerError = "unsupported" | "camera";

/** Roughly ten decodes a second: faster than a hand can move a label. */
const SCAN_INTERVAL_MS = 120;

/**
 * Rear-camera barcode scanning through the platform's `BarcodeDetector`, for as
 * long as the caller stays mounted: mounting opens the camera, unmounting (the
 * scan dialog closing) releases it. A decode hands the text to `onDecoded`; the
 * caller closes the dialog, which unmounts this and stops the loop.
 */
export function useBarcodeScanner(onDecoded: (text: string) => void) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const detectorCtor = getBarcodeDetectorCtor();
  const [error, setError] = useState<BarcodeScannerError | null>(() =>
    getBarcodeDetectorCtor() ? null : "unsupported",
  );
  // Held in a ref so a re-rendered callback never restarts the camera.
  const onDecodedRef = useRef(onDecoded);

  useEffect(() => {
    onDecodedRef.current = onDecoded;
  }, [onDecoded]);

  useEffect(() => {
    if (!detectorCtor) return;

    let cancelled = false;
    let timer = 0;
    let video: HTMLVideoElement | null = null;
    let detector: BarcodeDetectorLike | null = null;
    let stream: MediaStream | null = null;

    const stopCamera = () => {
      stream?.getTracks().forEach((track) => track.stop());
      stream = null;
    };

    const scanNextFrame = async () => {
      if (cancelled || !video || !detector) return;

      try {
        const codes = await detector.detect(video);
        const text = normaliseScanValue(codes[0]?.rawValue);
        if (text) {
          onDecodedRef.current(text);
          return;
        }
      } catch {
        // A frame captured mid-draw throws; the next tick tries again.
      }

      if (!cancelled) {
        timer = window.setTimeout(() => void scanNextFrame(), SCAN_INTERVAL_MS);
      }
    };

    const startCamera = async () => {
      const formats = await resolveScanFormats(detectorCtor);
      if (cancelled) return;
      if (!formats) {
        setError("unsupported");
        return;
      }

      try {
        detector = new detectorCtor({ formats });
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stopCamera();
          return;
        }

        video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        if (!cancelled) void scanNextFrame();
      } catch {
        if (!cancelled) setError("camera");
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      stopCamera();
      if (video) video.srcObject = null;
    };
  }, [detectorCtor]);

  return { videoRef, error };
}
