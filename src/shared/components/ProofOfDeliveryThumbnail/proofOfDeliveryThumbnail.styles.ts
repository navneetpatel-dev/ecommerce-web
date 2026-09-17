export const proofOfDeliveryThumbnailStyles = {
  root: "mt-2",
  rootCompact: "",
  button:
    "group block max-w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  thumb:
    "relative h-20 w-20 overflow-hidden rounded-md border border-line bg-paper transition-colors group-hover:border-brand/40",
  thumbCompact:
    "relative h-10 w-10 overflow-hidden rounded-md border border-line bg-paper transition-colors group-hover:border-brand/40",
  image: "object-cover",
  caption: "mt-1 text-body-sm font-medium text-brand group-hover:underline",
} as const;
