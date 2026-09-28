/**
 * Native `BarcodeDetector` helpers. The API ships in Chrome/Edge/Android
 * WebView and recent Safari, but not in TypeScript's DOM lib (hence the local
 * shapes) and not in Firefox — callers fall back to typing the code, which the
 * scanner is only a shortcut for.
 */

/** One decode result as the platform reports it. */
export interface DetectedBarcode {
  rawValue: string;
}

export interface BarcodeDetectorLike {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>;
}

export interface BarcodeDetectorCtor {
  new (options?: { formats?: string[] }): BarcodeDetectorLike;
  getSupportedFormats?: () => Promise<string[]>;
}

/**
 * Symbologies a shipping label can carry: 1D barcodes plus the QR and 2D codes
 * marketplaces print for hand-off. Requesting a name the platform rejects
 * throws, so this list is filtered against support before use.
 */
export const SCAN_FORMATS: readonly string[] = [
  "code_128",
  "code_39",
  "code_93",
  "codabar",
  "ean_13",
  "ean_8",
  "itf",
  "upc_a",
  "upc_e",
  "qr_code",
  "data_matrix",
  "pdf417",
];

/** The platform constructor, or null when this browser cannot scan at all. */
export function getBarcodeDetectorCtor(): BarcodeDetectorCtor | null {
  const ctor = (globalThis as { BarcodeDetector?: unknown }).BarcodeDetector;
  return typeof ctor === "function" ? (ctor as BarcodeDetectorCtor) : null;
}

/**
 * The formats to request: the ones this platform actually supports. Null when
 * it supports none of them, which means the caller should ask for manual entry.
 */
export async function resolveScanFormats(
  ctor: BarcodeDetectorCtor,
): Promise<string[] | null> {
  if (!ctor.getSupportedFormats) return [...SCAN_FORMATS];

  try {
    const supported = await ctor.getSupportedFormats();
    const usable = SCAN_FORMATS.filter((format) => supported.includes(format));
    return usable.length > 0 ? usable : null;
  } catch {
    return [...SCAN_FORMATS];
  }
}

/** Decoded text without the whitespace scanners pad codes with. */
export function normaliseScanValue(rawValue: string | null | undefined) {
  const value = rawValue?.trim();
  return value ? value : null;
}
