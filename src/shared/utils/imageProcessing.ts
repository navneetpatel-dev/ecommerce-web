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

/** Crop and resize to the target output dimensions. */
export async function getCroppedImageBlob(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number,
  outputHeight: number,
  mimeType: ImageMimeType = 'image/jpeg',
  quality = 0.92,
): Promise<Blob> {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = outputHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported')

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
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
