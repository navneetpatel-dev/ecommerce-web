import { FormFieldFrame } from "@/shared/components/forms";
import {
  InfiniteSingleSelect,
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect.component";
import { LABELS } from "@/shared/constants/labels";

interface TicketVendorFilterSelectProps {
  value: string;
  onChange: (value: string | null) => void;
  fetchPage: (
    query: InfiniteSingleSelectPageQuery,
  ) => Promise<InfiniteSingleSelectPageResult>;
}

export function TicketVendorFilterSelect({
  value,
  onChange,
  fetchPage,
}: TicketVendorFilterSelectProps) {
  return (
    <FormFieldFrame label={LABELS.ticketFilterVendorId}>
      <InfiniteSingleSelect
        value={value}
        onChange={onChange}
        fetchPage={fetchPage}
        allowNone
        searchable
        noneLabel={LABELS.ticketFilterAllVendors}
        placeholder={LABELS.ticketFilterAllVendors}
        searchPlaceholder={LABELS.searchVendors}
        emptyMessage={LABELS.noVendorsFound}
      />
    </FormFieldFrame>
  );
}
