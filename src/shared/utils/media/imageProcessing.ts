import type { Area } from 'react-easy-crop'
import type { ImageMimeType } from '@/shared/constants/imageSpecs'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error('Failed to load image')))
    image.crossOrigin = 'anonymous'
    image.src = src
  })
}

function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180
}

/** Bounding box size after rotating a rectangle by `rotation` degrees. */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * Crop (and optionally rotate) then resize to the target output dimensions.
 * Rotation follows the react-easy-crop canvas pattern so pixelCrop matches the preview.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number,
  outputHeight: number,
  mimeType: ImageMimeType = 'image/jpeg',
  quality = 0.92,
  rotation = 0,
): Promise<Blob> {
  const image = await loadImage(imageSrc)
  const rotRad = getRadianAngle(rotation)
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation)

  const rotatedCanvas = document.createElement('canvas')
  rotatedCanvas.width = Math.max(1, Math.round(bBoxWidth))
  rotatedCanvas.height = Math.max(1, Math.round(bBoxHeight))

  const rotatedCtx = rotatedCanvas.getContext('2d')
  if (!rotatedCtx) throw new Error('Canvas is not supported')

  rotatedCtx.translate(bBoxWidth / 2, bBoxHeight / 2)
  rotatedCtx.rotate(rotRad)
  rotatedCtx.translate(-image.width / 2, -image.height / 2)
  rotatedCtx.drawImage(image, 0, 0)

  const cropCanvas = document.createElement('canvas')
  cropCanvas.width = Math.max(1, Math.round(pixelCrop.width))
  cropCanvas.height = Math.max(1, Math.round(pixelCrop.height))

  const cropCtx = cropCanvas.getContext('2d')
  if (!cropCtx) throw new Error('Canvas is not supported')

  cropCtx.drawImage(
    rotatedCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    cropCanvas.width,
    cropCanvas.height,
  )

  const outputCanvas = document.createElement('canvas')
  outputCanvas.width = outputWidth
  outputCanvas.height = outputHeight

  const outputCtx = outputCanvas.getContext('2d')
  if (!outputCtx) throw new Error('Canvas is not supported')

  outputCtx.drawImage(cropCanvas, 0, 0, outputWidth, outputHeight)

  return new Promise((resolve, reject) => {
    outputCanvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to export image'))),
      mimeType,
      quality,
    )
  })
}

export function normalizeImageMimeType(file: File): ImageMimeType {
  const type = file.type.toLowerCase()
  if (type === 'image/png') return 'image/png'
  if (type === 'image/webp') return 'image/webp'
  return 'image/jpeg'
}

export function extensionForMime(mime: string): string {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'application/pdf') return 'pdf'
  return 'jpg'
}

export function fileFromBlob(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type })
}

export function replaceFileExtension(filename: string, ext: string): string {
  const base = filename.replace(/\.[^.]+$/, '') || 'upload'
  return `${base}.${ext}`
}
