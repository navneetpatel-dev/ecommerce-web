"use client";

import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import {
  InfiniteSingleSelect,
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";

type Props = {
  relatedOrderId: string;
  onRelatedOrderIdChange: (value: string) => void;
  fetchOrdersPage: (
    query: InfiniteSingleSelectPageQuery,
  ) => Promise<InfiniteSingleSelectPageResult>;
};

export function TicketOrderSection({
  relatedOrderId,
  onRelatedOrderIdChange,
  fetchOrdersPage,
}: Props) {
  return (
    <FormSection
      title={LABELS.ticketOrderSection}
      hint={LABELS.ticketOrderSectionHint}
      columns={1}
    >
      <FormFieldFrame label={LABELS.ticketSelectOrder}>
        <InfiniteSingleSelect
          value={relatedOrderId}
          onChange={onRelatedOrderIdChange}
          fetchPage={fetchOrdersPage}
          allowNone
          noneLabel={LABELS.ticketNoOrder}
          placeholder={LABELS.ticketSelectOrder}
          searchable={false}
          emptyMessage={LABELS.ticketNoOrdersYet}
          pageSize={DEFAULT_PAGE_LIMIT}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
