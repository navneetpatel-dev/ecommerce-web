"use client";

import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  InfiniteSingleSelect,
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect.component";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { cn } from "@/shared/utils/dom/cn";
import type { OrderVendorOption, TicketField } from "../../../types/form/types";

type Props = {
  showDirectoryVendorPicker: boolean;
  showOrderVendorPicker: boolean;
  hasSingleOrderVendor: boolean;
  orderVendors: OrderVendorOption[];
  relatedVendorId: string;
  onRelatedVendorIdChange: (value: string) => void;
  getError: (field: TicketField) => string | undefined;
  hasError: (field: TicketField) => boolean;
  fetchVendorsPage: (
    query: InfiniteSingleSelectPageQuery,
  ) => Promise<InfiniteSingleSelectPageResult>;
};

export function TicketVendorSection({
  showDirectoryVendorPicker,
  showOrderVendorPicker,
  hasSingleOrderVendor,
  orderVendors,
  relatedVendorId,
  onRelatedVendorIdChange,
  getError,
  hasError,
  fetchVendorsPage,
}: Props) {
  if (
    !showDirectoryVendorPicker &&
    !showOrderVendorPicker &&
    !hasSingleOrderVendor
  ) {
    return null;
  }

  return (
    <FormSection
      title={LABELS.ticketRelatedVendor}
      hint={LABELS.ticketRelatedVendorHint}
      columns={1}
    >
      {showOrderVendorPicker ? (
        <FormFieldFrame
          label={LABELS.ticketSelectVendor}
          required
          error={getError("relatedVendorId")}
        >
          <Select
            value={relatedVendorId}
            onValueChange={onRelatedVendorIdChange}
          >
            <SelectTrigger
              className={cn(hasError("relatedVendorId") && "border-danger")}
            >
              <SelectValue placeholder={LABELS.ticketSelectVendor} />
            </SelectTrigger>
            <SelectContent>
              {orderVendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.businessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>
      ) : null}

      {hasSingleOrderVendor ? (
        <FormFieldFrame label={LABELS.ticketRelatedVendor}>
          <Input value={orderVendors[0]!.businessName} disabled readOnly />
        </FormFieldFrame>
      ) : null}

      {showDirectoryVendorPicker ? (
        <FormFieldFrame
          label={LABELS.ticketSelectVendor}
          required
          error={getError("relatedVendorId")}
        >
          <InfiniteSingleSelect
            value={relatedVendorId}
            onChange={onRelatedVendorIdChange}
            fetchPage={fetchVendorsPage}
            placeholder={LABELS.ticketSelectVendor}
            searchPlaceholder={LABELS.ticketSearchVendors}
            emptyMessage={LABELS.noVendorsFound}
            pageSize={DEFAULT_PAGE_LIMIT}
            error={hasError("relatedVendorId")}
          />
        </FormFieldFrame>
      ) : null}
    </FormSection>
  );
}
