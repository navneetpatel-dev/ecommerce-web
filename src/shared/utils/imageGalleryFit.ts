export type ImageFitMode = 'cover' | 'contain'

export function resolveImageFitMode(
  naturalWidth: number,
  naturalHeight: number,
  containerWidth: number,
  containerHeight: number,
  ratioThreshold: number,
): ImageFitMode {
  if (
    naturalWidth <= 0 ||
    naturalHeight <= 0 ||
    containerWidth <= 0 ||
    containerHeight <= 0
  ) {
    return 'contain'
  }

  const imageRatio = naturalWidth / naturalHeight
  const containerRatio = containerWidth / containerHeight
  const ratioDelta = Math.abs(imageRatio - containerRatio) / containerRatio

  return ratioDelta <= ratioThreshold ? 'cover' : 'contain'
}

export function fitModeToObjectClass(mode: ImageFitMode): 'object-cover' | 'object-contain' {
  return mode === 'cover' ? 'object-cover' : 'object-contain'
}
