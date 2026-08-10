import type { OrderItem, SubOrder } from '@/shared/api/types'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Timeline } from '@/shared/components/Timeline'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { FormError } from '@/shared/components/FormError'
import { FileUpload } from '@/shared/components/FileUpload'
import { FormFieldFrame, FormSection } from '@/shared/components/forms'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { cn } from '@/shared/utils/cn'
import { formatInr } from '../utils/format'
import { buildSubOrderTimeline } from '../utils/timeline'
import { ORDER_STATUS } from '@/shared/constants/statuses'
import { LABELS } from '@/shared/constants/labels'
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from '@/shared/constants/uploads'
import { formatLabel } from '@/shared/utils/formatLabel'
import { REASON_CODES, type ReturnReasonCode } from '../hooks/useSubOrderReturn'

interface SubOrderCardProps {
  subOrder: SubOrder
  returnTarget: OrderItem | null
  reasonCode: ReturnReasonCode
  reason: string
  photoUrls: string[]
  draftUploadId: string
  isPending: boolean
  isSuccess: boolean
  error: Error | null
  onOpenReturn: (item: OrderItem) => void
  onCloseReturn: () => void
  onReasonCodeChange: (code: ReturnReasonCode) => void
  onReasonChange: (value: string) => void
  onPhotoUrlsChange: (urls: string[]) => void
  onSubmitReturn: () => void
}

export function SubOrderCard({
  subOrder,
  returnTarget,
  reasonCode,
  reason,
  photoUrls,
  draftUploadId,
  isPending,
  isSuccess,
  error,
  onOpenReturn,
  onCloseReturn,
  onReasonCodeChange,
  onReasonChange,
  onPhotoUrlsChange,
  onSubmitReturn,
}: SubOrderCardProps) {
  const timeline = buildSubOrderTimeline(subOrder)
  const showTimeline = subOrder.status !== ORDER_STATUS.PENDING
  const shippingCost = Number(subOrder.shippingCost ?? 0)
  const taxAmount = Number(subOrder.taxAmount ?? 0)
  const sellerTotal = Number(subOrder.subtotal) + shippingCost + taxAmount
  const showBreakdown = shippingCost > 0 || taxAmount > 0
  const vendorName = subOrder.vendor?.businessName || 'Seller'
  const itemCount = subOrder.items?.length ?? 0
  const canReturn = subOrder.status === ORDER_STATUS.DELIVERED

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <TextEyebrow className="!mb-0">Sold by</TextEyebrow>
          <h2 className="font-display text-[1.125rem] text-ink">{vendorName}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
            {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
          </span>
          <div className="inline-flex items-center gap-1.5">
            <span className="text-[0.6875rem] font-medium text-ink-faint">Shipment</span>
            <StatusBadge status={subOrder.status} />
          </div>
        </div>
      </div>

      <ul className="divide-y divide-line">
        {subOrder.items?.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-4 py-3.5 text-[0.875rem]"
          >
            <div className="min-w-0">
              <p className="font-medium text-ink">{item.productName}</p>
              <p className="mt-0.5 text-[0.8125rem] text-ink-muted">Qty {item.quantity}</p>
              {canReturn ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-auto px-0 text-brand hover:text-brand-hover"
                  onClick={() => onOpenReturn(item)}
                >
                  {LABELS.requestReturn}
                </Button>
              ) : null}
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-[1.0625rem] tabular-nums text-ink">
                {formatInr(Number(item.unitPrice) * Number(item.quantity))}
              </p>
              {item.quantity > 1 && (
                <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                  {formatInr(Number(item.unitPrice))} each
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-1 space-y-2 border-t border-line pt-4 text-[0.875rem]">
        <div className="flex justify-between gap-4">
          <dt className={showBreakdown ? 'text-ink-muted' : 'font-medium text-ink'}>
            {showBreakdown ? 'Subtotal' : 'Seller total'}
          </dt>
          <dd
            className={cn(
              'tabular-nums',
              showBreakdown ? 'text-ink' : 'font-medium text-ink'
            )}
          >
            {formatInr(subOrder.subtotal)}
          </dd>
        </div>
        {showBreakdown && (
          <>
            {shippingCost > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Shipping</dt>
                <dd className="tabular-nums text-ink">{formatInr(shippingCost)}</dd>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Tax</dt>
                <dd className="tabular-nums text-ink">{formatInr(taxAmount)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t border-line pt-3 font-medium">
              <dt className="text-ink">Seller total</dt>
              <dd className="tabular-nums text-ink">{formatInr(sellerTotal)}</dd>
            </div>
          </>
        )}
      </dl>

      {showTimeline && (
        <div className="mt-5 border-t border-line pt-5">
          <TextEyebrow className="mb-3">Progress</TextEyebrow>
          <Timeline steps={timeline} />
        </div>
      )}

      {subOrder.shipment && (
        <div className="mt-4 border-t border-dashed border-line pt-4">
          <TextEyebrow className="mb-2">Tracking</TextEyebrow>
          <p className="text-[0.9375rem] text-ink">{subOrder.shipment.carrier}</p>
          <p className="mt-0.5 font-mono text-[0.8125rem] text-ink-muted">
            {subOrder.shipment.trackingNumber}
          </p>
          <div className="mt-2">
            <StatusBadge status={subOrder.shipment.status} />
          </div>
        </div>
      )}

      <Dialog open={Boolean(returnTarget)} onOpenChange={(open) => !open && onCloseReturn()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{LABELS.requestReturnTitle}</DialogTitle>
            <DialogDescription>
              {returnTarget?.productName
                ? formatLabel(LABELS.requestReturnDescriptionItem, {
                    product: returnTarget.productName,
                  })
                : LABELS.requestReturnDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <FormSection
              title={LABELS.returnRequestFormSection}
              hint={LABELS.returnRequestFormSectionHint}
              columns={1}
            >
              <FormFieldFrame label={LABELS.returnReasonLabel} htmlFor="return-reason-code">
                <Select
                  value={reasonCode}
                  onValueChange={(value) => onReasonCodeChange(value as ReturnReasonCode)}
                >
                  <SelectTrigger id="return-reason-code">
                    <SelectValue placeholder={LABELS.returnReasonLabel} />
                  </SelectTrigger>
                  <SelectContent>
                    {REASON_CODES.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldFrame>
              <FormFieldFrame label={LABELS.returnDetailsLabel} htmlFor="return-reason">
                <Input
                  id="return-reason"
                  value={reason}
                  onChange={(e) => onReasonChange(e.target.value)}
                  placeholder={LABELS.returnDetailsPlaceholder}
                />
              </FormFieldFrame>
              <FileUpload
                mode="multiple"
                entityType={UPLOAD_ENTITY.RETURNS}
                entityId={draftUploadId}
                purpose={UPLOAD_PURPOSE.PHOTOS}
                accept="image/png,image/jpeg,image/webp"
                valueUrls={photoUrls}
                onUploaded={onPhotoUrlsChange}
                label={LABELS.returnPhotosLabel}
              />
            </FormSection>
            <FormError error={error} fallback={LABELS.couldNotSubmitReturn} />
            {isSuccess ? (
              <p className="text-[0.875rem] text-success">{LABELS.returnRequestedSuccess}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCloseReturn}>
              {LABELS.cancelReturn}
            </Button>
            <Button
              type="button"
              loading={isPending}
              disabled={!reason.trim() || !returnTarget}
              onClick={onSubmitReturn}
            >
              {LABELS.submitReturn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
