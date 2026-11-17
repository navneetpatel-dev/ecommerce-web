export type SocialPlatform =
  | "whatsapp"
  | "facebook"
  | "twitter"
  | "telegram"
  | "pinterest"
  | "linkedin"
  | "email";

export interface SocialShareData {
  url: string;
  title: string;
  imageUrl?: string;
  description?: string;
}

export function getSocialShareUrl(
  platform: SocialPlatform,
  data: SocialShareData,
): string {
  const encUrl = encodeURIComponent(data.url);
  const encTitle = encodeURIComponent(data.title);
  const shareText = encodeURIComponent(
    `Check out ${data.title} on Marketplace: ${data.url}`,
  );

  switch (platform) {
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${shareText}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encUrl}&text=${encodeURIComponent(`Check out ${data.title}`)}`;
    case "telegram":
      return `https://t.me/share/url?url=${encUrl}&text=${encTitle}`;
    case "pinterest":
      return `https://pinterest.com/pin/create/button/?url=${encUrl}&media=${encodeURIComponent(data.imageUrl || "")}&description=${encTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;
    case "email":
      return `mailto:?subject=${encTitle}&body=${encodeURIComponent(`Check out this product:\n\n${data.title}\n\n${data.url}`)}`;
    default:
      return data.url;
  }
}

export function openSocialShare(
  platform: SocialPlatform,
  data: SocialShareData,
): void {
  const url = getSocialShareUrl(platform, data);
  if (platform === "email") {
    window.location.href = url;
    return;
  }
  const width = 640;
  const height = 560;
  const left =
    typeof window !== "undefined"
      ? Math.max(0, (window.innerWidth - width) / 2)
      : 0;
  const top =
    typeof window !== "undefined"
      ? Math.max(0, (window.innerHeight - height) / 2)
      : 0;
  window.open(
    url,
    "_blank",
    `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`,
  );
}
