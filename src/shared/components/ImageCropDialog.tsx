'use client'

import { useCallback, useState } from 'react'
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
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

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
      <DialogContent className="max-w-lg gap-4">
        <DialogHeader>
          <DialogTitle>{LABELS.imageCropTitle}</DialogTitle>
          <DialogDescription>{LABELS.imageCropHint}</DialogDescription>
        </DialogHeader>

        <div className="relative h-[min(50vh,20rem)] w-full overflow-hidden rounded-md border border-line bg-paper">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
            {LABELS.imageCropZoom}
          </p>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.05}
            onValueChange={(value) => setZoom(value[0] ?? 1)}
            aria-label={LABELS.imageCropZoom}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" disabled={processing} onClick={handleCancel}>
            {LABELS.cancel}
          </Button>
          <Button type="button" disabled={processing || !croppedAreaPixels} onClick={() => void handleConfirm()}>
            {processing ? LABELS.imageCropProcessing : LABELS.imageCropConfirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
