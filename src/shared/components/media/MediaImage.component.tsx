"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder.component";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

interface MediaImageProps {
  src?: string | null;
  alt: string;
  unavailableLabel?: string;
  sizes?: string;
  /** Next/Image quality 1–100. Defaults to the Next.js default when omitted. */
  quality?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  className?: string;
  imageClassName?: string;
  /** Fires when media is unavailable (missing src or load error). */
  onUnavailableChange?: (unavailable: boolean) => void;
}

type LoadStatus = "idle" | "ready" | "error";

interface ProbeState {
  src: string | null;
  status: LoadStatus;
}

function initialProbeState(src?: string | null): ProbeState {
  const normalized = src ?? null;
  return {
    src: normalized,
    status: normalized ? "idle" : "error",
  };
}

/**
 * Renders a media image, or the shared unavailable placeholder when
 * `src` is missing or the remote asset fails to load.
 */
export function MediaImage({
  src,
  alt,
  unavailableLabel = LABELS.imageNotAvailable,
  sizes,
  quality,
  priority,
  loading,
  className,
  imageClassName,
  onUnavailableChange,
}: MediaImageProps) {
  const currentSrc = src ?? null;
  // Priority/eager images must paint immediately: probing would serialize a
  // second full download and delay LCP (§7). Their failure fallback is the
  // <Image> onError handler below instead of the pre-probe.
  const skipProbe = Boolean(priority) || loading === "eager";
  const [probeState, setProbeState] = useState<ProbeState>(() =>
    initialProbeState(src),
  );

  if (currentSrc !== probeState.src) {
    setProbeState(initialProbeState(src));
  }

  useEffect(() => {
    if (!currentSrc || skipProbe || probeState.status !== "idle") return;

    let cancelled = false;
    const probe = new window.Image();
    probe.decoding = "async";
    probe.onload = () => {
      if (cancelled) return;
      setProbeState((prev) =>
        prev.src === currentSrc ? { ...prev, status: "ready" } : prev,
      );
    };
    probe.onerror = () => {
      if (cancelled) return;
      setProbeState((prev) =>
        prev.src === currentSrc ? { ...prev, status: "error" } : prev,
      );
    };
    probe.src = currentSrc;

    return () => {
      cancelled = true;
    };
  }, [currentSrc, probeState.status, skipProbe]);

  const unavailable = !currentSrc || probeState.status === "error";

  useEffect(() => {
    onUnavailableChange?.(unavailable);
  }, [unavailable, onUnavailableChange]);

  if (!skipProbe && probeState.status === "idle" && currentSrc) {
    return (
      <div
        aria-hidden
        className={cn("absolute inset-0 bg-paper", className)}
        data-image-state="loading"
      />
    );
  }

  if (unavailable) {
    return (
      <ProductImagePlaceholder
        className={cn(className)}
        label={unavailableLabel}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={loading}
      className={cn(imageClassName, className)}
      onError={() => {
        setProbeState((prev) =>
          prev.src === currentSrc ? { ...prev, status: "error" } : prev,
        );
      }}
      data-image-state="loaded"
    />
  );
}
