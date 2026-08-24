"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { useReturn } from "../api/returns.queries";
import { ReturnRequestCard } from "../components/ReturnRequestCard.component";

export function MyReturnDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useReturn(params.id);

  return (
    <div className="storefront-container py-8 md:py-10">
      <Link
        href={PATHS.myReturns}
        className="text-body-sm font-medium text-brand underline-offset-4 hover:underline"
      >
        {LABELS.backToReturns}
      </Link>

      {isLoading ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : isError || !data ? (
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
          <ReturnRequestCard row={data} />
        </div>
      )}
    </div>
  );
}
