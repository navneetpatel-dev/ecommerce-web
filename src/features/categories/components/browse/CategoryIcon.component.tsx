import {
  Baby,
  BookOpen,
  Car,
  Cpu,
  Gem,
  Home,
  Shirt,
  Sparkles,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import type { Category } from "@/shared/api/types";
import { resolveCategoryIconName } from "../../utils/browse/categoryHelpers";

interface CategoryIconProps {
  category: Category;
  className?: string;
  strokeWidth?: number;
}

/**
 * Renders the category's lucide icon. Concrete components are returned from
 * static imports (the `CategorySubcategoryIcon` pattern) so the JSX element
 * type never changes identity between renders — a dynamic
 * `CATEGORY_ICONS[name]` lookup assigned during render trips
 * `react-hooks/static-components` and remounts the icon on every render.
 */
export function CategoryIcon({
  category,
  className,
  strokeWidth = 1.5,
}: CategoryIconProps) {
  const iconName = resolveCategoryIconName(category);
  const props = { className, strokeWidth, "aria-hidden": true } as const;

  if (iconName === "electronics") return <Cpu {...props} />;
  if (iconName === "fashion") return <Shirt {...props} />;
  if (iconName === "home") return <Home {...props} />;
  if (iconName === "sports") return <Trophy {...props} />;
  if (iconName === "beauty") return <Sparkles {...props} />;
  if (iconName === "books") return <BookOpen {...props} />;
  if (iconName === "toys") return <Baby {...props} />;
  if (iconName === "food") return <UtensilsCrossed {...props} />;
  if (iconName === "automotive") return <Car {...props} />;
  if (iconName === "jewelry") return <Gem {...props} />;
  return <Sparkles {...props} />;
}
