"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { DetailQuerySkeleton } from "@/shared/components/Skeletons/DetailQuerySkeleton.component";
import { VisuallyHiddenHeading } from "@/shared/components/a11y/VisuallyHiddenHeading.component";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/notices/QueryErrorAlert.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useReturn } from "../../api/returns/returns.queries";
import { ReturnRequestCard } from "../../components/list/ReturnRequestCard.component";
import { CancelReturnAction } from "../../components/detail/CancelReturnAction.component";
import { useCancelReturnAction } from "../../hooks/detail/useCancelReturnAction.hook";
import { returnsPageStyles as styles } from "../list/returnsPage.styles";

export function MyReturnDetailPage() {
  const params = useParams<{ id: string }>();
  const returnId = params.id;
  const query = useReturn(returnId);
  const { data, isLoading, isEmpty, error } = resolveQueryDetailState(query, {
    enabled: Boolean(returnId),
  });
  const cancel = useCancelReturnAction(data ?? undefined);

  return (
    <div className={styles.container}>
      <VisuallyHiddenHeading>
        {LABELS.returnDetailHeading}
      </VisuallyHiddenHeading>
      <Link href={PATHS.myReturns} className={styles.backLink}>
        {LABELS.backToReturns}
      </Link>

      {isLoading ? (
        <DetailQuerySkeleton className={styles.detailSkeleton} />
      ) : isEmpty ? (
        <div className={styles.detailEmptyWrapper}>
          <div className={styles.errorBox}>
            <QueryErrorAlert
              error={error}
              fallback={LABELS.couldNotLoadReturn}
              onRetry={query.refetch}
            />
          </div>
        </div>
      ) : (
        <div className={styles.detailCardWrapper}>
          <ReturnRequestCard row={data!} />
          {cancel.canCancel ? (
            <CancelReturnAction
              confirmOpen={cancel.confirmOpen}
              isPending={cancel.isPending}
              error={cancel.error}
              onOpen={cancel.handleOpen}
              onClose={cancel.handleClose}
              onConfirm={cancel.handleConfirm}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
