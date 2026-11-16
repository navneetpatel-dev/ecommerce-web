export type PaginationItem = number | "ellipsis";

/**
 * Builds a compact page list like: 1 … 4 5 6 … 90
 * Always includes at least page 1 when there is a page of results.
 */
export function getPaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  if (!Number.isFinite(totalPages) || totalPages < 1) return [];
  const safePage = Number.isFinite(currentPage)
    ? Math.max(1, Math.floor(currentPage))
    : 1;
  const safeTotalPages = Math.floor(totalPages);
  if (safeTotalPages === 1) return [1];

  const totalNumbers = siblingCount * 2 + 5;

  if (safeTotalPages <= totalNumbers) {
    return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(safePage - siblingCount, 1);
  const rightSibling = Math.min(safePage + siblingCount, safeTotalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < safeTotalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + siblingCount * 2;
    const leftRange = Array.from(
      { length: leftCount },
      (_, index) => index + 1,
    );
    return [...leftRange, "ellipsis", safeTotalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + siblingCount * 2;
    const rightRange = Array.from(
      { length: rightCount },
      (_, index) => safeTotalPages - rightCount + index + 1,
    );
    return [1, "ellipsis", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, index) => leftSibling + index,
  );

  return [1, "ellipsis", ...middleRange, "ellipsis", safeTotalPages];
}
