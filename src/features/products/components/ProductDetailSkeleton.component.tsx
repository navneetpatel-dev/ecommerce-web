import { Skeleton } from "@/shared/components/ui/skeleton";
import { IMAGE_GALLERY_STAGE_HEIGHT_CLASS } from "@/shared/constants/imageGallery";

export function ProductDetailSkeleton() {
  return (
    <div className="storefront-container pb-10 pt-4 sm:pt-6 md:pb-14 md:pt-8">
      <Skeleton className="mb-6 h-4 w-48" />
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 lg:gap-10">
        <div className="md:col-span-6 lg:col-span-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">
            <div className="order-2 flex gap-2 lg:order-1 lg:w-[4.25rem] lg:flex-col">
              <Skeleton className="h-14 w-14 shrink-0 rounded-lg sm:h-16 sm:w-16 lg:h-[4.25rem] lg:w-[4.25rem]" />
              <Skeleton className="h-14 w-14 shrink-0 rounded-lg sm:h-16 sm:w-16 lg:h-[4.25rem] lg:w-[4.25rem]" />
              <Skeleton className="hidden h-14 w-14 shrink-0 rounded-lg sm:h-16 sm:w-16 lg:block lg:h-[4.25rem] lg:w-[4.25rem]" />
            </div>
            <Skeleton
              className={`order-1 w-full rounded-2xl lg:order-2 ${IMAGE_GALLERY_STAGE_HEIGHT_CLASS}`}
            />
          </div>
        </div>
        <div className="space-y-5 md:col-span-6 lg:col-span-5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
