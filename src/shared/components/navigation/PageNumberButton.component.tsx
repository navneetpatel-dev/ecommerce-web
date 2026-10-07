"use client";

import { useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { paginationStyles } from "../../styles/navigation/navigationComponents.styles";

interface PageNumberButtonProps {
  page: number;
  isActive: boolean;
  onPageChange: (page: number) => void;
}

/** One numbered page button in the desktop pagination strip. */
export function PageNumberButton({
  page,
  isActive,
  onPageChange,
}: PageNumberButtonProps) {
  const handleClick = useCallback(() => {
    onPageChange(page);
  }, [onPageChange, page]);

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      className={isActive ? paginationStyles.activePage : ""}
    >
      {page}
    </Button>
  );
}
