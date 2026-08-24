import { ContentPageSkeleton } from "@/shared/components/Skeletons.component";

export default function VendorRegisterLoading() {
  return (
    <div className="min-h-screen bg-paper">
      <ContentPageSkeleton />
    </div>
  );
}
