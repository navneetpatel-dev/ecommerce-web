'use client'

import { DateRangeFields } from '@/shared/components/DateRangeFields'
import { FormFieldFrame, FormSection } from '@/shared/components/forms'
import { Button } from '@/shared/components/ui/button'
import { ButtonGroup } from '@/shared/components/ui/button-group'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
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
    <FormSection
      title={LABELS.reportFilters}
      hint={LABELS.reportFiltersHint}
      columns={3}
    >
      <FormFieldFrame label={LABELS.reportSelect} htmlFor="report-type" className="sm:col-span-2 xl:col-span-3">
        <Select value={reportType || undefined} onValueChange={onReportTypeChange}>
          <SelectTrigger id="report-type">
            <SelectValue placeholder={LABELS.reportSelect} />
          </SelectTrigger>
          <SelectContent>
            {catalog.map((item) => (
              <SelectItem key={item.type} value={item.type}>
                {labelForKey(item.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>

      <DateRangeFields
        from={from}
        to={to}
        onFromChange={onFromChange}
        onToChange={onToChange}
        fromId="report-from"
        toId="report-to"
      />

      {showVendorFilter ? (
        <FormFieldFrame label={LABELS.reportVendor} htmlFor="report-vendor">
          <Input
            id="report-vendor"
            value={vendorId}
            placeholder={LABELS.uuidPlaceholder}
            onChange={(e) => onVendorIdChange(e.target.value)}
          />
        </FormFieldFrame>
      ) : null}

      <FormFieldFrame label={LABELS.reportCategory} htmlFor="report-category">
        <Input
          id="report-category"
          value={categoryId}
          placeholder={LABELS.uuidPlaceholder}
          onChange={(e) => onCategoryIdChange(e.target.value)}
        />
      </FormFieldFrame>

      <FormFieldFrame label={LABELS.reportStatus} htmlFor="report-status">
        <Input id="report-status" value={status} onChange={(e) => onStatusChange(e.target.value)} />
      </FormFieldFrame>

      <div className="sm:col-span-2 xl:col-span-3">
        <ButtonGroup align="start">
          <Button type="button" fullWidth="mobile" onClick={onLoad} disabled={loading || !reportType}>
            {LABELS.reportLoad}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            onClick={onExport}
            disabled={exporting || !reportType}
          >
            {LABELS.exportExcel}
          </Button>
        </ButtonGroup>
      </div>
    </FormSection>
  )
}
