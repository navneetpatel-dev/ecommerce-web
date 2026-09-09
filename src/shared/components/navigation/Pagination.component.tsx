import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { PaginationItem } from "@/shared/utils/pagination/pagination";
import { paginationStyles } from "./navigationComponents.styles";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isMobile: boolean;
  items: PaginationItem[];
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  isMobile,
  items,
  onPageChange,
}: PaginationProps) {
  if (totalPages < 1) return null;

  if (isMobile) {
    return (
      <div className={paginationStyles.mobileContainer}>
        <DisabledActionHint
          disabled={currentPage <= 1}
          message={LABELS.firstPageHint}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label={LABELS.previousPage}
          >
            <ChevronLeft size={16} />
          </Button>
        </DisabledActionHint>
        <span className={paginationStyles.mobileText}>
          {formatLabel(LABELS.pageOf, {
            current: currentPage,
            total: totalPages,
          })}
        </span>
        <DisabledActionHint
          disabled={currentPage >= totalPages}
          message={LABELS.lastPageHint}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label={LABELS.nextPage}
          >
            <ChevronRight size={16} />
          </Button>
        </DisabledActionHint>
      </div>
    );
  }

  return (
    <div className={paginationStyles.desktopContainer}>
      <DisabledActionHint
        disabled={currentPage <= 1}
        message={LABELS.firstPageHint}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label={LABELS.previousPage}
        >
          <ChevronLeft size={16} />
        </Button>
      </DisabledActionHint>
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className={paginationStyles.ellipsis}
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={currentPage === item ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(item)}
            aria-current={currentPage === item ? "page" : undefined}
            className={currentPage === item ? paginationStyles.activePage : ""}
          >
            {item}
          </Button>
        ),
      )}
      <DisabledActionHint
        disabled={currentPage >= totalPages}
        message={LABELS.lastPageHint}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label={LABELS.nextPage}
        >
          <ChevronRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  );
}
