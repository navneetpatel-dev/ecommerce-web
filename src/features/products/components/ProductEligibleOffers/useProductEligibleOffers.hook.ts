import { useState, useCallback, useMemo } from "react";
import { PDP_OFFERS_PREVIEW_COUNT } from "../../constants/pdpOffers";
import { useEligibleOffers } from "../../hooks/useEligibleOffers.hook";

export function useProductEligibleOffers(productId: string, enabled: boolean) {
  const [expanded, setExpanded] = useState(false);
  const offersQuery = useEligibleOffers(productId, enabled);

  const offers = useMemo(() => offersQuery.data ?? [], [offersQuery.data]);
  const canExpand = offers.length > PDP_OFFERS_PREVIEW_COUNT;
  const visibleOffers = useMemo(
    () => (expanded ? offers : offers.slice(0, PDP_OFFERS_PREVIEW_COUNT)),
    [expanded, offers],
  );
  const hiddenCount = offers.length - PDP_OFFERS_PREVIEW_COUNT;
  const isScrollable = expanded && canExpand;

  const toggleExpanded = useCallback(() => {
    setExpanded((current) => !current);
  }, []);

  return {
    expanded,
    offersQuery,
    offers,
    canExpand,
    visibleOffers,
    hiddenCount,
    isScrollable,
    toggleExpanded,
  };
}
