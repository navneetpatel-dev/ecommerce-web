import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { cn } from "@/shared/utils/dom/cn";
import { continueShoppingStyles } from "../../styles/navigation/navigationComponents.styles";

interface ContinueShoppingLinkProps {
  className?: string;
}

export function ContinueShoppingLink({ className }: ContinueShoppingLinkProps) {
  return (
    <Link
      href={PATHS.products}
      className={cn(continueShoppingStyles.link, className)}
    >
      {LABELS.continueShopping}
      <ArrowRight className={continueShoppingStyles.arrowIcon} aria-hidden />
    </Link>
  );
}
