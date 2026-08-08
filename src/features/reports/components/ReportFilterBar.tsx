'use client'

import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import type { ReportCatalogItem } from '../api/reportsEngine.api'

interface ReportFilterBarProps {
  catalog: ReportCatalogItem[]
  reportType: string
  onReportTypeChange: (type: string) => void
  labelForKey: (key: string) => string
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  vendorId: string
  onVendorIdChange: (value: string) => void
  showVendorFilter: boolean
  categoryId: string
  onCategoryIdChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  onLoad: () => void
  onExport: () => void
  loading: boolean
  exporting: boolean
}

export function ReportFilterBar({
  catalog,
  reportType,
  onReportTypeChange,
  labelForKey,
  from,
  to,
  onFromChange,
  onToChange,
  vendorId,
  onVendorIdChange,
  showVendorFilter,
  categoryId,
  onCategoryIdChange,
  status,
  onStatusChange,
  onLoad,
  onExport,
  loading,
  exporting,
}: ReportFilterBarProps) {
  return (
    <div className="space-y-4 border border-line bg-surface-raised p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="report-type">{LABELS.reportSelect}</Label>
          <select
            id="report-type"
            className="flex h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
          >
            {catalog.map((item) => (
              <option key={item.type} value={item.type}>
                {labelForKey(item.labelKey)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="report-from">{LABELS.reportDateFrom}</Label>
          <Input
            id="report-from"
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="report-to">{LABELS.reportDateTo}</Label>
          <Input id="report-to" type="date" value={to} onChange={(e) => onToChange(e.target.value)} />
        </div>
        {showVendorFilter ? (
          <div className="space-y-2">
            <Label htmlFor="report-vendor">{LABELS.reportVendor}</Label>
            <Input
              id="report-vendor"
              value={vendorId}
              placeholder={LABELS.uuidPlaceholder}
              onChange={(e) => onVendorIdChange(e.target.value)}
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="report-category">{LABELS.reportCategory}</Label>
          <Input
            id="report-category"
            value={categoryId}
            placeholder={LABELS.uuidPlaceholder}
            onChange={(e) => onCategoryIdChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="report-status">{LABELS.reportStatus}</Label>
          <Input
            id="report-status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onLoad} disabled={loading || !reportType}>
          {LABELS.reportLoad}
        </Button>
        <Button type="button" variant="outline" onClick={onExport} disabled={exporting || !reportType}>
          {LABELS.exportExcel}
        </Button>
      </div>
    </div>
  )
}
