import {
  MAX_VIDEO_BYTES,
  VIDEO_COMPRESS_THRESHOLD_BYTES,
} from '@/features/supportTickets/constants/mediaLimits'

export type VideoPrepareResult =
  | { ok: true; file: File; durationSeconds: number }
  | { ok: false; reason: 'TOO_LONG' | 'TOO_LARGE' | 'COMPRESS_FAILED' | 'INVALID'; durationSeconds?: number }

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const cleanup = () => {
      URL.revokeObjectURL(url)
      video.removeAttribute('src')
      video.load()
    }

    video.onloadedmetadata = () => {
      const duration = Number(video.duration)
      cleanup()
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error('INVALID_DURATION'))
        return
      }
      resolve(duration)
    }
    video.onerror = () => {
      cleanup()
      reject(new Error('INVALID_VIDEO'))
    }
    video.src = url
  })
}

async function compressViaMediaRecorder(file: File): Promise<File | null> {
  if (typeof MediaRecorder === 'undefined') return null

  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.src = url
  video.muted = true
  video.playsInline = true

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve()
    video.onerror = () => reject(new Error('INVALID_VIDEO'))
  })

  await video.play().catch(() => undefined)

  const stream =
    typeof (video as HTMLVideoElement & { captureStream?: () => MediaStream }).captureStream ===
    'function'
      ? (video as HTMLVideoElement & { captureStream: () => MediaStream }).captureStream()
      : null

  if (!stream) {
    URL.revokeObjectURL(url)
    video.pause()
    return null
  }

  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : ''

  if (!mimeType) {
    stream.getTracks().forEach((t) => t.stop())
    URL.revokeObjectURL(url)
    video.pause()
    return null
  }

  const chunks: BlobPart[] = []
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 1_200_000,
  })

  const recorded = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data)
    }
    recorder.onerror = () => reject(new Error('RECORDER_ERROR'))
    recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }))
  })

  recorder.start(250)
  await new Promise<void>((resolve) => {
    video.onended = () => resolve()
    // Safety: stop if metadata duration is known
    const ms = Number.isFinite(video.duration) ? Math.ceil(video.duration * 1000) + 500 : 60_000
    window.setTimeout(() => resolve(), ms)
  })

  if (recorder.state !== 'inactive') recorder.stop()
  video.pause()
  stream.getTracks().forEach((t) => t.stop())
  URL.revokeObjectURL(url)

  const blob = await recorded
  if (!blob.size) return null

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'recording'
  return new File([blob], `${baseName}-compressed.webm`, { type: 'video/webm' })
}

/**
 * Validate duration, optionally re-encode large videos, reject over max bytes.
 */
export async function compressVideoIfNeeded(
  file: File,
  maxSeconds: number,
  maxBytes: number = MAX_VIDEO_BYTES,
): Promise<VideoPrepareResult> {
  let durationSeconds: number
  try {
    durationSeconds = await getVideoDuration(file)
  } catch {
    return { ok: false, reason: 'INVALID' }
  }

  if (durationSeconds > maxSeconds) {
    return { ok: false, reason: 'TOO_LONG', durationSeconds }
  }

  let output = file
  if (file.size > VIDEO_COMPRESS_THRESHOLD_BYTES) {
    const compressed = await compressViaMediaRecorder(file).catch(() => null)
    if (compressed && compressed.size < file.size) {
      output = compressed
    }
  }

  if (output.size > maxBytes) {
    return { ok: false, reason: 'TOO_LARGE', durationSeconds }
  }

  return { ok: true, file: output, durationSeconds: Math.ceil(durationSeconds) }
}
