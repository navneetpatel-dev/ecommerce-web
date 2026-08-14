/** Product gallery zoom / swipe — used by the storefront image gallery. */
export const IMAGE_GALLERY_ZOOM_SCALE = 1.75
export const IMAGE_GALLERY_LONG_PRESS_MS = 420
export const IMAGE_GALLERY_SWIPE_PX = 48
export const IMAGE_GALLERY_MOVE_PX = 12

/** Lightbox pinch zoom bounds. */
export const IMAGE_GALLERY_LIGHTBOX_PINCH_MIN_SCALE = 1
export const IMAGE_GALLERY_LIGHTBOX_PINCH_MAX_SCALE = 3

/** Resting PDP stage — sized for the frame, not for CSS upscaling. */
export const IMAGE_GALLERY_STAGE_QUALITY = 90
export const IMAGE_GALLERY_STAGE_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 800px'

/** Stage fills the frame on every breakpoint; open lightbox for the uncropped asset. */
export const IMAGE_GALLERY_STAGE_OBJECT_FIT_CLASS = 'object-cover'

/** Fullscreen lightbox — request a sharper asset than the resting stage. */
export const IMAGE_GALLERY_LIGHTBOX_QUALITY = 92
export const IMAGE_GALLERY_LIGHTBOX_SIZES = '100vw'

/**
 * Stage height — fills most of the viewport with a small bottom gap so the
 * frame never sits flush against the fold.
 */
export const IMAGE_GALLERY_STAGE_HEIGHT_CLASS =
  'h-[min(22rem,66dvh)] sm:h-[min(26rem,68dvh)] md:h-[min(30rem,70dvh)] lg:h-[min(36rem,calc(100dvh-9.5rem))] xl:h-[min(40rem,calc(100dvh-8.5rem))]'

/** Desktop thumbnail rail — match stage height only from `lg` up. */
export const IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS =
  'lg:h-[min(36rem,calc(100dvh-9.5rem))] xl:h-[min(40rem,calc(100dvh-8.5rem))]'

/** Fullscreen lightbox — true viewport height on mobile, capped on larger screens. */
export const IMAGE_GALLERY_LIGHTBOX_HEIGHT_CLASS = 'h-[100dvh] sm:h-[min(92dvh,48rem)]'
