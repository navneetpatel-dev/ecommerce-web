import { SkeletonCard } from "@/shared/components/Skeletons.component";

export default function SupportTicketsLoading() {
  return (
    <div className="space-y-4 p-6">
      <SkeletonCard count={4} />
    </div>
  );
}
