import { SearchX, Store } from "lucide-react";
import type { ChangeEvent } from "react";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Input } from "@/shared/components/ui/input";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { InfiniteLoadMore } from "@/shared/components/DataTable/InfiniteLoadMore.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { StorefrontVendor } from "../../api/directory/vendors.api";
import { VendorTilesList } from "./VendorTilesList.component";
import { vendorsIndexViewStyles as styles } from "../../styles/index/vendorsIndexView.styles";

interface VendorsIndexViewProps {
  vendors: StorefrontVendor[];
  total: number;
  term: string;
  search: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  noMatches?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onTermChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onLoadMore: () => void;
}

const SKELETON_COUNT = 6;

export function VendorsIndexView(props: VendorsIndexViewProps) {
  const { vendors, total, term, search, isLoading, isEmpty, noMatches } = props;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TextEyebrow className={styles.eyebrow}>
          {LABELS.vendorsIndexEyebrow}
        </TextEyebrow>
        <h1 className={styles.title}>{LABELS.allVendors}</h1>
        <p className={styles.subtitle}>
          {formatLabel(LABELS.vendorsIndexHint, { site: LABELS.brandName })}
        </p>
      </div>

      {isEmpty ? null : (
        <div className={styles.searchRow}>
          <label htmlFor="shops-search" className={styles.srOnly}>
            {LABELS.searchShops}
          </label>
          <Input
            id="shops-search"
            type="search"
            value={term}
            placeholder={LABELS.searchShopsPlaceholder}
            onChange={props.onTermChange}
            className={styles.searchInput}
          />
          <p role="status" className={styles.resultCount}>
            {isLoading ? "" : formatLabel(LABELS.shopsCount, { count: total })}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonRow}>
                <Skeleton className={styles.skeletonAvatar} />
                <div className={styles.skeletonContent}>
                  <Skeleton className={styles.skeletonTitle} />
                  <Skeleton className={styles.skeletonSubtitle} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState
          icon={Store}
          heading={LABELS.noVendorsYet}
          message={LABELS.noVendorsYetHint}
          actionLabel={LABELS.browseProducts}
          actionTo={PATHS.products}
        />
      ) : noMatches ? (
        <EmptyState
          icon={SearchX}
          heading={formatLabel(LABELS.noShopsMatch, { term: search })}
          message={LABELS.noShopsMatchHint}
          actionLabel={LABELS.clearSearch}
          onAction={props.onClearSearch}
        />
      ) : (
        <>
          <VendorTilesList vendors={vendors} />
          <InfiniteLoadMore
            hasNextPage={props.hasNextPage}
            isFetchingNextPage={props.isFetchingNextPage}
            onLoadMore={props.onLoadMore}
          />
        </>
      )}
    </div>
  );
}
