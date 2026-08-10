'use client'

import { useCallback, useEffect, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Slider } from '@/shared/components/ui/slider'
import { LABELS } from '@/shared/constants/labels'
import type { ImageMimeType } from '@/shared/constants/imageSpecs'
import { getCroppedImageBlob } from '@/shared/utils/imageProcessing'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const DEFAULT_ZOOM = 1
const DEFAULT_ROTATION = 0

interface ImageCropDialogProps {
  open: boolean
  imageSrc: string | null
  aspectRatio: number
  outputWidth: number
  outputHeight: number
  sourceFilename?: string
  mimeType?: ImageMimeType
  onOpenChange: (open: boolean) => void
  onConfirm: (file: File) => void | Promise<void>
}

export function ImageCropDialog({
  open,
  imageSrc,
  aspectRatio,
  outputWidth,
  outputHeight,
  sourceFilename = 'upload.jpg',
  mimeType = 'image/jpeg',
  onOpenChange,
  onConfirm,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [rotation, setRotation] = useState(DEFAULT_ROTATION)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!open) return
    setCrop({ x: 0, y: 0 })
    setZoom(DEFAULT_ZOOM)
    setRotation(DEFAULT_ROTATION)
    setCroppedAreaPixels(null)
  }, [open, imageSrc])

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const resetControls = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(DEFAULT_ZOOM)
    setRotation(DEFAULT_ROTATION)
  }

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setProcessing(true)
    try {
      const blob = await getCroppedImageBlob(
        imageSrc,
        croppedAreaPixels,
        outputWidth,
        outputHeight,
        mimeType,
        0.92,
        rotation,
      )
      const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'
      const file = new File([blob], sourceFilename.replace(/\.[^.]+$/, `.${ext}`), {
        type: mimeType,
      })
      await onConfirm(file)
      onOpenChange(false)
    } finally {
      setProcessing(false)
    }
  }

  const handleCancel = () => {
    if (processing) return
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !processing) onOpenChange(false)
      }}
    >
      <DialogContent className="max-h-[min(92vh,44rem)] max-w-2xl gap-4 overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{LABELS.imageCropTitle}</DialogTitle>
          <DialogDescription>{LABELS.imageCropHint}</DialogDescription>
        </DialogHeader>

        <div className="relative h-[min(52vh,24rem)] w-full overflow-hidden rounded-md border border-line bg-paper">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              aspect={aspectRatio}
              zoomWithScroll
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
              {LABELS.imageCropZoom}
            </p>
            <Slider
              value={[zoom]}
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.05}
              onValueChange={(value) => setZoom(value[0] ?? DEFAULT_ZOOM)}
              aria-label={LABELS.imageCropZoom}
            />
          </div>

          <div className="space-y-2">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
              {LABELS.imageCropRotation}
            </p>
            <Slider
              value={[rotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={(value) => setRotation(value[0] ?? DEFAULT_ROTATION)}
              aria-label={LABELS.imageCropRotation}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={processing}
                onClick={() => setRotation((prev) => prev - 90)}
              >
                {LABELS.imageCropRotateLeft}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={processing}
                onClick={() => setRotation((prev) => prev + 90)}
              >
                {LABELS.imageCropRotateRight}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={processing}
                onClick={resetControls}
              >
                {LABELS.imageCropReset}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" disabled={processing} onClick={handleCancel}>
            {LABELS.cancel}
          </Button>
          <Button
            type="button"
            disabled={processing || !croppedAreaPixels}
            onClick={() => void handleConfirm()}
          >
            {processing ? LABELS.imageCropProcessing : LABELS.imageCropConfirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
