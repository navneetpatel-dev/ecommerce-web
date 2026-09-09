import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/shared/utils/cn";
import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { statCardStyles } from "./displayComponents.styles";

interface StatCardProps {
  title: string;
  value: number | string | ReactNode;
  icon?: LucideIcon;
  valueClassName?: string;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  valueClassName,
  isLoading,
  size = "md",
}: StatCardProps) {
  const headerLayout = cn(Icon && statCardStyles.headerLayout);
  const titleTone = cn(Icon ? statCardStyles.titleTone : "");
  const iconElement = Icon && <Icon className={statCardStyles.icon} />;
  const valueElement = isLoading ? (
    <Skeleton className={statCardStyles.skeleton} />
  ) : (
    <p
      className={cn(
        statCardStyles.value,
        statCardStyles.sizes[size],
        valueClassName,
      )}
    >
      {value}
    </p>
  );

  return (
    <Card>
      <CardHeader className={headerLayout}>
        <CardTitle className={titleTone}>{title}</CardTitle>
        {iconElement}
      </CardHeader>
      <CardContent>{valueElement}</CardContent>
    </Card>
  );
}
