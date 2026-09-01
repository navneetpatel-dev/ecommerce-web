"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { PATHS } from "@/shared/constants/paths";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useReturn } from "../api/returns.queries";
import { ReturnRequestCard } from "../components/ReturnRequestCard.component";

export function MyReturnDetailPage() {
  const params = useParams<{ id: string }>();
  const returnId = params.id;
  const query = useReturn(returnId);
  const { data, isLoading, isEmpty, error } = resolveQueryDetailState(query, {
    enabled: Boolean(returnId),
  });

  return (
    <div className="storefront-container py-8 md:py-10">
      <Link
        href={PATHS.myReturns}
        className="text-body-sm font-medium text-brand underline-offset-4 hover:underline"
      >
        {LABELS.backToReturns}
      </Link>

      {isLoading ? (
        <DetailQuerySkeleton className="mt-6 space-y-3" />
      ) : isEmpty ? (
        <div className="mt-8">
          <div className="border border-line bg-surface-raised px-5 py-10 text-center">
            <QueryErrorAlert
              error={error}
              fallback={LABELS.couldNotLoadReturn}
            />
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <ReturnRequestCard row={data!} />
        </div>
      )}
    </div>
  );
}
