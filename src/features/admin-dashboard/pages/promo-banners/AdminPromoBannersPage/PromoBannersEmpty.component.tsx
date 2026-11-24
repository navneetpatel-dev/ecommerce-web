import { ImagePlus, Plus, RotateCcw } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

interface PromoBannersNoMatchProps {
  onResetFilters: () => void;
}

export function PromoBannersNoMatch({
  onResetFilters,
}: PromoBannersNoMatchProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface p-8 text-center">
      <p className="text-body font-medium text-ink">
        No banners found matching your filters
      </p>
      <p className="mt-1 text-body-sm text-ink-muted">
        Try adjusting your search query or status filter.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onResetFilters}
        className="mt-4 gap-1.5"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Clear Filters
      </Button>
    </div>
  );
}

interface PromoBannersEmptyStateProps {
  onCreateClick: () => void;
}

export function PromoBannersEmptyState({
  onCreateClick,
}: PromoBannersEmptyStateProps) {
  return (
    <div className="space-y-4">
      <EmptyState
        icon={ImagePlus}
        heading={LABELS.noPromoBanners}
        message={LABELS.promoBannersEmptyHint}
      />
      <div className="flex justify-center">
        <Button
          type="button"
          variant="default"
          onClick={onCreateClick}
          className="gap-2"
        >
          <Plus className="size-4" />
          {LABELS.createPromoBanner}
        </Button>
      </div>
    </div>
  );
}
