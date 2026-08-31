"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { LABELS } from "@/shared/constants/labels";
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
          <EmptyState
            icon={RotateCcw}
            heading={LABELS.returnNotFound}
            message={
              (error as Error | null)?.message || LABELS.returnNotFoundMessage
            }
            actionLabel={LABELS.backToReturns}
            actionTo={PATHS.myReturns}
          />
        </div>
      ) : (
        <div className="mt-6">
          <ReturnRequestCard row={data!} />
        </div>
      )}
    </div>
  );
}
