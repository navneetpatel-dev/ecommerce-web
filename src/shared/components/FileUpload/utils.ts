import { isVideoMimeType } from "@/shared/constants/imageSpecs";

export function isPdfUrl(url: string): boolean {
  return /\.pdf($|\?)/i.test(url);
}

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm)($|\?)/i.test(url);
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export function isVideoFile(file: File): boolean {
  return isVideoMimeType(file.type) || /\.(mp4|webm)$/i.test(file.name);
}

export function mbLabel(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb % 1 === 0 ? String(mb) : mb.toFixed(1);
}
