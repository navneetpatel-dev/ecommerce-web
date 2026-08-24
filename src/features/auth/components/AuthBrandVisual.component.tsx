import Image from "next/image";
import { cn } from "@/shared/utils/cn";

const COLLAGE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80",
    alt: "",
    className: "right-[4%] top-[12%] w-[min(42%,16rem)] rotate-[4deg]",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    alt: "",
    className: "right-[28%] top-[38%] w-[min(36%,13rem)] -rotate-[5deg]",
  },
  {
    src: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=800&q=80",
    alt: "",
    className: "right-[8%] bottom-[14%] w-[min(38%,14rem)] rotate-[2deg]",
  },
] as const;

/** Decorative product collage for the auth brand panel (desktop). */
export function AuthBrandVisual({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-y-0 right-0 w-[58%]">
        {COLLAGE_IMAGES.map(({ src, alt, className: frameClassName }) => (
          <div
            key={src}
            className={cn(
              "absolute aspect-[4/5] overflow-hidden rounded-2xl border border-line/50 shadow-elevation-3",
              frameClassName,
            )}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 240px, 0px"
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-paper/55 via-transparent to-paper/10" />
          </div>
        ))}

        {/* Fade collage into page bg — scoped to collage column only (no full-height seam). */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-paper/20 to-paper/75" />
      </div>
    </div>
  );
}
