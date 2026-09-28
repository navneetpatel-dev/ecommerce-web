import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getBarcodeDetectorCtor,
  normaliseScanValue,
  resolveScanFormats,
  SCAN_FORMATS,
  type BarcodeDetectorCtor,
} from "../barcodeDetection";

function stubDetectorCtor(
  getSupportedFormats?: () => Promise<string[]>,
): BarcodeDetectorCtor {
  class FakeDetector {
    detect = vi.fn().mockResolvedValue([]);
    static getSupportedFormats = getSupportedFormats;
  }
  return FakeDetector as unknown as BarcodeDetectorCtor;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getBarcodeDetectorCtor", () => {
  it("returns null when the platform has no BarcodeDetector", () => {
    vi.stubGlobal("BarcodeDetector", undefined);
    expect(getBarcodeDetectorCtor()).toBeNull();
  });

  it("returns the platform constructor when it exists", () => {
    const ctor = stubDetectorCtor();
    vi.stubGlobal("BarcodeDetector", ctor);
    expect(getBarcodeDetectorCtor()).toBe(ctor);
  });
});

describe("resolveScanFormats", () => {
  it("asks for every known format when support cannot be probed", async () => {
    await expect(resolveScanFormats(stubDetectorCtor())).resolves.toEqual([
      ...SCAN_FORMATS,
    ]);
  });

  it("requests only the formats the platform supports", async () => {
    const ctor = stubDetectorCtor(async () => ["qr_code", "code_128", "face"]);
    await expect(resolveScanFormats(ctor)).resolves.toEqual([
      "code_128",
      "qr_code",
    ]);
  });

  it("reports no usable formats when none of ours are supported", async () => {
    const ctor = stubDetectorCtor(async () => ["face", "aztec"]);
    await expect(resolveScanFormats(ctor)).resolves.toBeNull();
  });

  it("falls back to the known formats when the probe throws", async () => {
    const ctor = stubDetectorCtor(async () => {
      throw new Error("not allowed");
    });
    await expect(resolveScanFormats(ctor)).resolves.toEqual([...SCAN_FORMATS]);
  });
});

describe("normaliseScanValue", () => {
  it("trims the padding scanners add to a code", () => {
    expect(normaliseScanValue("  PKG-4021 \n")).toBe("PKG-4021");
  });

  it("returns null for empty or missing decodes", () => {
    expect(normaliseScanValue("   ")).toBeNull();
    expect(normaliseScanValue(null)).toBeNull();
    expect(normaliseScanValue(undefined)).toBeNull();
  });
});
