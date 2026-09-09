import { MAX_VIDEO_BYTES } from "@/shared/constants/media/mediaLimits";

export async function compressViaFfmpegWasm(file: File): Promise<File | null> {
  if (typeof window === "undefined") return null;

  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

  const ffmpeg = new FFmpeg();
  const base = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
  });

  const inputName = "input";
  const outputName = "output.webm";
  const ext = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "mp4";
  const inputFile = `${inputName}.${ext}`;

  await ffmpeg.writeFile(inputFile, await fetchFile(file));
  await ffmpeg.exec([
    "-i",
    inputFile,
    "-vf",
    "scale=min(1280\\,iw):-2",
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    "1M",
    "-c:a",
    "libopus",
    "-b:a",
    "96k",
    "-deadline",
    "realtime",
    "-cpu-used",
    "4",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);
  await ffmpeg.deleteFile(inputFile).catch(() => undefined);
  await ffmpeg.deleteFile(outputName).catch(() => undefined);
  ffmpeg.terminate();

  const bytes =
    typeof data === "string"
      ? new TextEncoder().encode(data)
      : new Uint8Array(data);
  if (!bytes.byteLength) return null;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "recording";
  return new File([bytes], `${baseName}-compressed.webm`, {
    type: "video/webm",
  });
}

export async function compressViaMediaRecorder(
  file: File,
): Promise<File | null> {
  if (typeof MediaRecorder === "undefined") return null;

  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = url;
  video.muted = true;
  video.playsInline = true;

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error("INVALID_VIDEO"));
  });

  await video.play().catch(() => undefined);

  const stream =
    typeof (video as HTMLVideoElement & { captureStream?: () => MediaStream })
      .captureStream === "function"
      ? (
          video as HTMLVideoElement & { captureStream: () => MediaStream }
        ).captureStream()
      : null;

  if (!stream) {
    URL.revokeObjectURL(url);
    video.pause();
    return null;
  }

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "";

  if (!mimeType) {
    stream.getTracks().forEach((t) => t.stop());
    URL.revokeObjectURL(url);
    video.pause();
    return null;
  }

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 1_200_000,
  });

  const recorded = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onerror = () => reject(new Error("RECORDER_ERROR"));
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
  });

  recorder.start(250);
  await new Promise<void>((resolve) => {
    video.onended = () => resolve();
    const ms = Number.isFinite(video.duration)
      ? Math.ceil(video.duration * 1000) + 500
      : 60_000;
    window.setTimeout(() => resolve(), ms);
  });

  if (recorder.state !== "inactive") recorder.stop();
  video.pause();
  stream.getTracks().forEach((t) => t.stop());
  URL.revokeObjectURL(url);

  const blob = await recorded;
  if (!blob.size) return null;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "recording";
  return new File([blob], `${baseName}-compressed.webm`, {
    type: "video/webm",
  });
}

export async function compressVideo(file: File): Promise<File | null> {
  const wasm = await compressViaFfmpegWasm(file).catch(() => null);
  if (wasm && wasm.size > 0 && wasm.size < file.size) return wasm;

  const fallback = await compressViaMediaRecorder(file).catch(() => null);
  if (fallback && fallback.size > 0 && fallback.size < file.size)
    return fallback;

  // Prefer WASM output even if not smaller (re-encode still helps container/codec).
  if (wasm && wasm.size > 0 && wasm.size <= MAX_VIDEO_BYTES) return wasm;
  return fallback && fallback.size > 0 ? fallback : null;
}
