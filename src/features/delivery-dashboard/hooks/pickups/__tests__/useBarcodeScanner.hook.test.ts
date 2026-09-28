import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBarcodeScanner } from "../useBarcodeScanner.hook";

/** A camera stream whose tracks report whether they were stopped. */
function fakeStream() {
  const stop = vi.fn();
  return { stream: { getTracks: () => [{ stop }] }, stop };
}

function stubCamera(stream: unknown) {
  const getUserMedia = vi.fn().mockResolvedValue(stream);
  vi.stubGlobal("navigator", { ...navigator, mediaDevices: { getUserMedia } });
  return getUserMedia;
}

/** A detector that always decodes `rawValue`, and what it supports. */
function stubDetector(rawValue: string | null, formats = ["qr_code"]) {
  const detect = vi
    .fn()
    .mockResolvedValue(rawValue == null ? [] : [{ rawValue }]);
  class FakeDetector {
    detect = detect;
    static getSupportedFormats = async () => formats;
  }
  vi.stubGlobal("BarcodeDetector", FakeDetector);
  return detect;
}

beforeEach(() => {
  // jsdom has no media stack: playback needs a stub.
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("useBarcodeScanner", () => {
  it("reports the decoded code once and stops scanning", async () => {
    stubCamera(fakeStream().stream);
    const detect = stubDetector("  PKG-4021 \n");
    const onDecoded = vi.fn();

    const { result } = renderHook(() => useBarcodeScanner(onDecoded));
    result.current.videoRef.current = document.createElement("video");

    await waitFor(() => expect(onDecoded).toHaveBeenCalledWith("PKG-4021"));
    expect(onDecoded).toHaveBeenCalledTimes(1);
    expect(detect).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it("asks for manual entry when the browser cannot scan", () => {
    stubCamera(fakeStream().stream);
    vi.stubGlobal("BarcodeDetector", undefined);

    const { result } = renderHook(() => useBarcodeScanner(vi.fn()));

    expect(result.current.error).toBe("unsupported");
  });

  it("flags the camera when permission or the stream fails", async () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      mediaDevices: {
        getUserMedia: vi.fn().mockRejectedValue(new Error("no")),
      },
    });
    stubDetector("PKG-1");

    const { result } = renderHook(() => useBarcodeScanner(vi.fn()));

    await waitFor(() => expect(result.current.error).toBe("camera"));
  });

  it("keeps scanning while frames yield no code", async () => {
    stubCamera(fakeStream().stream);
    stubDetector(null);
    const onDecoded = vi.fn();

    const { result } = renderHook(() => useBarcodeScanner(onDecoded));
    result.current.videoRef.current = document.createElement("video");

    await waitFor(() =>
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled(),
    );
    expect(onDecoded).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it("releases the camera when the dialog unmounts", async () => {
    const { stream, stop } = fakeStream();
    stubCamera(stream);
    stubDetector("PKG-1");

    const { result, unmount } = renderHook(() => useBarcodeScanner(vi.fn()));
    result.current.videoRef.current = document.createElement("video");
    await waitFor(() =>
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled(),
    );

    unmount();

    expect(stop).toHaveBeenCalled();
  });

  it("never opens the camera when unmounted before scanning starts", async () => {
    const getUserMedia = stubCamera(fakeStream().stream);
    stubDetector("PKG-1");

    const { unmount } = renderHook(() => useBarcodeScanner(vi.fn()));
    unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getUserMedia).not.toHaveBeenCalled();
  });
});
