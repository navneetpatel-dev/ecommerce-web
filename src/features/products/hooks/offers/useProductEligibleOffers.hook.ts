import { useMemo } from "react";
import { useExpandableList } from "@/shared/hooks/lists/useExpandableList.hook";
import { PDP_OFFERS_PREVIEW_COUNT } from "../../constants/offers/pdpOffers";
import { useEligibleOffers } from "./useEligibleOffers.hook";

export function useProductEligibleOffers(
  productId: string,
  enabled: boolean,
  variantId?: string | null,
) {
  const offersQuery = useEligibleOffers(productId, enabled, variantId);
  const offers = useMemo(() => offersQuery.data ?? [], [offersQuery.data]);
  const list = useExpandableList(offers, PDP_OFFERS_PREVIEW_COUNT);

  return {
    expanded: list.expanded,
    offersQuery,
    offers,
    canExpand: list.canExpand,
    visibleOffers: list.visibleItems,
    hiddenCount: list.hiddenCount,
    toggleExpanded: list.toggleExpanded,
  };
}
