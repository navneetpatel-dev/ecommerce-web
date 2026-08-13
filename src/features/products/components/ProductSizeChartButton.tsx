'use client'

import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'

interface ProductSizeChartButtonProps {
  url: string
  productName: string
}

export function ProductSizeChartButton({ url, productName }: ProductSizeChartButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="rounded-full">
          {LABELS.sizeChart}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{LABELS.sizeChart}</DialogTitle>
        </DialogHeader>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={formatLabel(LABELS.sizeChartForProduct, { name: productName })}
          className="h-auto w-full"
        />
      </DialogContent>
    </Dialog>
  )
}
