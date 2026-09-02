import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { cn } from "@/shared/utils/cn";

interface ContinueShoppingLinkProps {
  className?: string;
}

export function ContinueShoppingLink({ className }: ContinueShoppingLinkProps) {
  return (
    <Link
      href={PATHS.products}
      className={cn(
        "inline-flex items-center gap-2 text-[0.875rem] font-medium leading-none text-brand transition-colors hover:text-brand-hover",
        className,
      )}
    >
      {LABELS.continueShopping}
      <ArrowRight className="relative top-px h-4 w-4 shrink-0" aria-hidden />
    </Link>
  );
}
