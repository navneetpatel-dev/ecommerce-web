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
import { resolveCategoryIconName } from "../utils/categoryHelpers";
import { categoriesViewStyles } from "./categoriesView.styles";

interface CategorySubcategoryIconProps {
  category: Category;
}

export function CategorySubcategoryIcon({
  category,
}: CategorySubcategoryIconProps) {
  const iconName = resolveCategoryIconName(category);
  const props = { className: categoriesViewStyles.childIcon, strokeWidth: 1.5 };

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
