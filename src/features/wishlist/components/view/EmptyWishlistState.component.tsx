import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { Heart } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";

export function EmptyWishlistState() {
  return (
    <EmptyState
      message={LABELS.wishlistEmptyMessage}
      icon={Heart}
      actionLabel={LABELS.browseProducts}
      actionTo={PATHS.products}
    />
  );
}
