import { IMAGE_GALLERY_STAGE_HEIGHT_CLASS } from "@/shared/constants/imageGallery";

export const productDetailSkeletonStyles = {
  container: "storefront-container pb-10 pt-4 sm:pt-6 md:pb-14 md:pt-8",
  breadcrumb: "mb-6 h-4 w-48",
  grid: "grid grid-cols-1 items-start gap-8 md:grid-cols-12 lg:gap-10",
  galleryCol: "md:col-span-6 lg:col-span-7",
  galleryFlex: "flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-4",
  thumbnailStrip: "order-2 flex gap-2 lg:order-1 lg:w-[4.25rem] lg:flex-col",
  thumbnail:
    "h-14 w-14 shrink-0 rounded-lg sm:h-16 sm:w-16 lg:h-[4.25rem] lg:w-[4.25rem]",
  thumbnailHiddenMobile:
    "hidden h-14 w-14 shrink-0 rounded-lg sm:h-16 sm:w-16 lg:block lg:h-[4.25rem] lg:w-[4.25rem]",
  stageImage: `order-1 w-full rounded-2xl lg:order-2 ${IMAGE_GALLERY_STAGE_HEIGHT_CLASS}`,
  detailsCol: "space-y-5 md:col-span-6 lg:col-span-5",
  skelH5W28: "h-5 w-28",
  skelH3W20: "h-3 w-20",
  skelH10Full: "h-10 w-full",
  skelH5W32: "h-5 w-32",
  skelH14Full: "h-14 w-full",
  skelH24RoundedXl: "h-24 w-full rounded-xl",
  skelH28RoundedXl: "h-28 w-full rounded-xl",
} as const;
