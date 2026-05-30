export type PaginationRangeItem = number | 'ellipsis-start' | 'ellipsis-end';

export type BuildPaginationRangeOptions = {
  /** Pages always shown at the start/end (default 1). */
  boundaryCount?: number;
  /** Pages shown on each side of the active page (default 1). */
  siblingCount?: number;
};

function range(start: number, end: number): number[] {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/** Builds page numbers and ellipsis markers for segmented pagination controls. */
export function buildPaginationRange(
  currentPage: number,
  pageCount: number,
  options: BuildPaginationRangeOptions = {},
): PaginationRangeItem[] {
  const boundaryCount = Math.max(0, options.boundaryCount ?? 1);
  const siblingCount = Math.max(0, options.siblingCount ?? 1);

  if (pageCount <= 0) {
    return [];
  }

  if (pageCount === 1) {
    return [1];
  }

  const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3;
  if (pageCount <= totalPageNumbers) {
    return range(1, pageCount);
  }

  const siblingsStart = Math.max(
    Math.min(currentPage - siblingCount, pageCount - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
    pageCount - boundaryCount - 1,
  );

  const showLeftEllipsis = siblingsStart > boundaryCount + 2;
  const showRightEllipsis = siblingsEnd < pageCount - boundaryCount - 1;

  const items: PaginationRangeItem[] = [];

  items.push(...range(1, boundaryCount));

  if (showLeftEllipsis) {
    items.push('ellipsis-start');
  } else {
    items.push(...range(boundaryCount + 1, siblingsStart - 1));
  }

  items.push(...range(siblingsStart, siblingsEnd));

  if (showRightEllipsis) {
    items.push('ellipsis-end');
  } else {
    items.push(...range(siblingsEnd + 1, pageCount - boundaryCount));
  }

  items.push(...range(pageCount - boundaryCount + 1, pageCount));

  return items;
}
