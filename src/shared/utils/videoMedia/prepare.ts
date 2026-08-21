import {
  MAX_VIDEO_BYTES,
  VIDEO_COMPRESS_THRESHOLD_BYTES,
} from "@/shared/constants/mediaLimits";
import { compressVideo } from "./compress";

export type VideoPrepareResult =
  | { ok: true; file: File; durationSeconds: number }
  | {
      ok: false;
      reason: "TOO_LONG" | "TOO_LARGE" | "COMPRESS_FAILED" | "INVALID";
      durationSeconds?: number;
    };

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      video.load();
    };

    video.onloadedmetadata = () => {
      const duration = Number(video.duration);
      cleanup();
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error("INVALID_DURATION"));
        return;
      }
      resolve(duration);
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("INVALID_VIDEO"));
    };
    video.src = url;
  });
}

/**
 * Validate duration, compress via WASM (MediaRecorder fallback), reject over max bytes.
 */
export async function compressVideoIfNeeded(
  file: File,
  maxSeconds: number,
  maxBytes: number = MAX_VIDEO_BYTES,
): Promise<VideoPrepareResult> {
  let durationSeconds: number;
  try {
    durationSeconds = await getVideoDuration(file);
  } catch {
    return { ok: false, reason: "INVALID" };
  }

  if (durationSeconds > maxSeconds) {
    return { ok: false, reason: "TOO_LONG", durationSeconds };
  }

  let output = file;
  const shouldCompress = file.size > VIDEO_COMPRESS_THRESHOLD_BYTES;
  if (shouldCompress) {
    const compressed = await compressVideo(file);
    if (!compressed) {
      // Allow original only when already under the hard size cap.
      if (file.size > maxBytes) {
        return { ok: false, reason: "COMPRESS_FAILED", durationSeconds };
      }
    } else {
      output = compressed;
    }
  }

  if (output.size > maxBytes) {
    return {
      ok: false,
      reason: shouldCompress ? "COMPRESS_FAILED" : "TOO_LARGE",
      durationSeconds,
    };
  }

  return {
    ok: true,
    file: output,
    durationSeconds: Math.ceil(durationSeconds),
  };
}
