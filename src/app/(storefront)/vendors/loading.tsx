import { SkeletonCard } from "@/shared/components/Skeletons.component";

export default function VendorsLoading() {
  return (
    <div className="storefront-container space-y-4 py-6">
      <SkeletonCard count={6} />
    </div>
  );
}
