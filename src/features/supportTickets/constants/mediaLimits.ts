/** Mirrors backend `supportTickets/mediaLimits.ts`. */

export const TICKET_MAX_IMAGES = 5
export const TICKET_MAX_VIDEOS = 1
export const TICKET_MAX_VIDEO_SECONDS = 60

export const BUG_MAX_SCREENSHOTS = 5
export const BUG_MAX_RECORDINGS = 1
export const BUG_MAX_RECORDING_SECONDS = 120

export const MAX_VIDEO_BYTES = 50 * 1024 * 1024
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/** Attempt MediaRecorder re-encode when file exceeds this size. */
export const VIDEO_COMPRESS_THRESHOLD_BYTES = 15 * 1024 * 1024
