import { EmptyState } from "@/shared/components/EmptyState.component";
import { Heart } from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";

export function EmptyWishlistState() {
  return (
    <EmptyState
      message="Your wishlist is empty"
      icon={Heart}
      actionLabel="Browse products"
      actionTo={PATHS.home}
    />
  );
}
