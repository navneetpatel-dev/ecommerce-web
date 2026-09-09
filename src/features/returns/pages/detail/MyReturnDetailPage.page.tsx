"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useReturn } from "../../api/returns/returns.queries";
import { ReturnRequestCard } from "../../components/list/ReturnRequestCard.component";
import { returnsPageStyles as styles } from "../list/returnsPage.styles";

export function MyReturnDetailPage() {
  const params = useParams<{ id: string }>();
  const returnId = params.id;
  const query = useReturn(returnId);
  const { data, isLoading, isEmpty, error } = resolveQueryDetailState(query, {
    enabled: Boolean(returnId),
  });

  return (
    <div className={styles.container}>
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
            />
          </div>
        </div>
      ) : (
        <div className={styles.detailCardWrapper}>
          <ReturnRequestCard row={data!} />
        </div>
      )}
    </div>
  );
}
