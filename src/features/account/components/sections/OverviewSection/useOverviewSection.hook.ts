import { useMemo } from "react";
import { Heart, LifeBuoy, Package } from "lucide-react";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { useAccountOverview } from "../../../hooks/useAccountOverview.hook";
import { useAvatarUpload } from "../../../hooks/useAvatarUpload.hook";
import type { AccountSectionId } from "../../../types";
import type { GlanceItem } from "./GlanceList.component";

interface UseOverviewSectionParams {
  onNavigate: (id: AccountSectionId) => void;
}

export function useOverviewSection({ onNavigate }: UseOverviewSectionParams) {
  const {
    profile,
    isLoadingProfile,
    profileError,
    ordersCount,
    wishlistCount,
    isLoadingStats,
  } = useAccountOverview();

  const {
    fileRef,
    localError,
    cropSrc,
    cropFilename,
    cropMimeType,
    avatarSpec,
    uploadPending,
    uploadError,
    onPickFile,
    onAvatarCropped,
    onAvatarCropCancelled,
  } = useAvatarUpload(profile?.id ?? "");

  const memberSince = profile?.createdAt
    ? formatOrderDate(profile.createdAt)
    : null;

  const avatarSrc = profile?.avatarUrl || undefined;

  const showCropDialog = Boolean(avatarSpec && cropSrc);

  const handleCropOpenChange = (open: boolean) => {
    if (!open) onAvatarCropCancelled();
  };

  const handleOrdersNavigate = () => {
    onNavigate("orders");
  };

  const ordersCountLabel = isLoadingStats ? "—" : String(ordersCount);
  const wishlistCountLabel = isLoadingStats ? "—" : String(wishlistCount);

  const glanceItems = useMemo<GlanceItem[]>(
    () => [
      {
        id: "orders",
        icon: Package,
        label: "Orders",
        value: ordersCountLabel,
        onDetails: handleOrdersNavigate,
      },
      {
        id: "wishlist",
        icon: Heart,
        label: "Wishlist",
        value: wishlistCountLabel,
        href: PATHS.wishlist,
      },
      {
        id: "supportTickets",
        icon: LifeBuoy,
        label: LABELS.overviewSupportTickets,
        value: LABELS.view,
        href: PATHS.supportTickets,
      },
      {
        id: "bugReports",
        icon: LifeBuoy,
        label: LABELS.overviewBugReports,
        value: LABELS.reportABug,
        href: PATHS.bugReports,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ordersCountLabel, wishlistCountLabel],
  );

  return {
    profile,
    isLoadingProfile,
    profileError,
    memberSince,
    avatarSrc,
    uploadPending,
    uploadError,
    localError,
    fileRef,
    onPickFile,
    showCropDialog,
    cropSrc,
    avatarSpec,
    cropFilename,
    cropMimeType,
    handleCropOpenChange,
    onAvatarCropped,
    glanceItems,
  };
}
