/** Product gallery zoom / swipe — used by the storefront image gallery. */
export const IMAGE_GALLERY_ZOOM_SCALE = 1.75
export const IMAGE_GALLERY_LONG_PRESS_MS = 420
export const IMAGE_GALLERY_SWIPE_PX = 48
export const IMAGE_GALLERY_MOVE_PX = 12

/** Resting PDP stage — sized for the frame, not for CSS upscaling. */
export const IMAGE_GALLERY_STAGE_QUALITY = 90
export const IMAGE_GALLERY_STAGE_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 800px'

/**
 * Stage height — fills most of the viewport with a small bottom gap so the
 * frame never sits flush against the fold.
 */
export const IMAGE_GALLERY_STAGE_HEIGHT_CLASS =
  'h-[min(22rem,66dvh)] sm:h-[min(26rem,68dvh)] md:h-[min(30rem,70dvh)] lg:h-[min(36rem,calc(100dvh-9.5rem))] xl:h-[min(40rem,calc(100dvh-8.5rem))]'

/** Desktop thumbnail rail — match stage height only from `lg` up. */
export const IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS =
  'lg:h-[min(36rem,calc(100dvh-9.5rem))] xl:h-[min(40rem,calc(100dvh-8.5rem))]'

/** Fullscreen lightbox stage — edge-to-edge image with a small viewport inset. */
export const IMAGE_GALLERY_LIGHTBOX_HEIGHT_CLASS =
  'h-[min(82dvh,calc(100dvh-3.5rem))] sm:h-[min(78dvh,calc(100dvh-4rem))] lg:h-[min(76dvh,48rem)]'
