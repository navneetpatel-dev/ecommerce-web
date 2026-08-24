import { cn } from "@/shared/utils/cn";

interface WalletIconProps {
  size?: number;
  className?: string;
}

/** Outline billfold — same 24 viewBox, 20px size, and stroke as Heart / Cart. */
export function WalletIcon({ size = 20, className }: WalletIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path d="M8 7.5 7 3h4l1.2 4.5" />
      <path d="M12 7.5 11.2 3h6.3L19 7.5" />
      <rect x="3" y="7.5" width="18" height="13" rx="2" />
      <path d="M16 13h3.2a1.6 1.6 0 0 1 0 3.2H16" />
      <circle cx="18.2" cy="14.6" r="0.7" />
    </svg>
  );
}
