"use client";

import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import {
  useAdminGiftCards,
  useCancelGiftCard,
  useGiftCardLiability,
  type GiftCardStatus,
} from "@/features/giftCards";
import { LABELS } from "@/shared/constants/labels";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { buildAdminGiftCardColumns } from "../../utils/gift-cards/adminGiftCardColumns";
import { ALL_GIFT_CARD_STATUSES } from "../../constants/gift-cards/giftCardStatuses";

const PAGE_SIZE = 20;

/** The admin gift card list: filters, paging, liability totals and deactivation. */
export function useAdminGiftCardsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<GiftCardStatus | "">("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const list = useAdminGiftCards({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: status || undefined,
  });
  const liability = useGiftCardLiability();
  const cancel = useCancelGiftCard();

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setPage(1);
    },
    [],
  );

  const handleStatusChange = useCallback((value: string) => {
    setStatus(
      value === ALL_GIFT_CARD_STATUSES ? "" : (value as GiftCardStatus),
    );
    setPage(1);
  }, []);

  const handleDeactivate = useCallback(
    async (id: string, reason?: string) => {
      await cancel.mutateAsync({ id, reason: reason ?? "" });
      notifySuccess(LABELS.giftCardDeactivated);
    },
    [cancel],
  );

  const columns = useMemo(() => buildAdminGiftCardColumns(), []);
  const totals = liability.data;
  const data = list.data;

  return {
    columns,
    rows: data?.items ?? [],
    loading: list.isLoading,
    refreshing: list.isFetching && !list.isLoading,
    error: list.error
      ? getApiErrorMessage(list.error, LABELS.genericActionFailed)
      : null,
    pagination: data
      ? {
          page: data.page,
          totalPages: data.totalPages,
          total: data.total,
          onPageChange: setPage,
        }
      : undefined,
    filters: {
      search,
      status: status || ALL_GIFT_CARD_STATUSES,
      onSearchChange: handleSearchChange,
      onStatusChange: handleStatusChange,
    },
    metrics: totals
      ? {
          outstanding: formatInr(totals.outstanding),
          outstandingCount: String(totals.outstandingCount),
          issued: formatInr(totals.issued),
          redeemed: formatInr(totals.redeemed),
          expired: formatInr(totals.expired),
          cancelled: formatInr(totals.cancelled),
        }
      : null,
    handleDeactivate,
  };
}
