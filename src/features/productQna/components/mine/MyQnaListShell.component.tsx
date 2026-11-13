import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { QueryErrorAlert } from "@/shared/components/notices/QueryErrorAlert.component";
import { InfiniteLoadMore } from "@/shared/components/DataTable/InfiniteLoadMore.component";
import { myQnaPagesStyles as styles } from "../../styles/mine/myQnaPages.styles";

export interface MyQnaListState {
  count: number;
  countLabel: string;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  retry: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMore: () => void;
}

interface MyQnaListShellProps {
  title: string;
  subtitle: string;
  state: MyQnaListState;
  errorFallback: string;
  empty: { icon: LucideIcon; heading: string; message: string };
  children: ReactNode;
}

function Body({
  state,
  errorFallback,
  empty,
  children,
}: Omit<MyQnaListShellProps, "title" | "subtitle">) {
  if (state.isLoading) {
    return (
      <div className={styles.skeletonStack}>
        <Skeleton className={styles.skeleton} />
        <Skeleton className={styles.skeleton} />
      </div>
    );
  }
  if (state.isError) {
    return (
      <div className={styles.stateBox}>
        <QueryErrorAlert
          error={state.error}
          fallback={errorFallback}
          onRetry={state.retry}
        />
      </div>
    );
  }
  if (!state.count) {
    return (
      <div className={styles.stateBox}>
        <EmptyState
          icon={empty.icon}
          heading={empty.heading}
          message={empty.message}
          className={styles.emptyState}
        />
      </div>
    );
  }
  return (
    <>
      <p role="status" className={styles.countText}>
        {state.countLabel}
      </p>
      {children}
    </>
  );
}

/** Shared shell for "My questions" / "My answers": header, states, infinite scroll. */
export function MyQnaListShell(props: MyQnaListShellProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{props.title}</h1>
        <p className={styles.subtitle}>{props.subtitle}</p>
      </header>
      <Body {...props} />
      <InfiniteLoadMore
        hasNextPage={props.state.hasNextPage}
        isFetchingNextPage={props.state.isFetchingNextPage}
        onLoadMore={props.state.loadMore}
      />
    </div>
  );
}
