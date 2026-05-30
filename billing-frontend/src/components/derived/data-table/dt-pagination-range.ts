export type PaginationRangeItem = number | 'ellipsis-start' | 'ellipsis-end';

export type BuildPaginationRangeOptions = {
  /** Pages always shown from the start (default 3). */
  leadingCount?: number;
  /** Pages pinned at the end when the range is compressed (default 1). */
  trailingCount?: number;
  /** @deprecated Use `leadingCount`. */
  boundaryCount?: number;
  /** @deprecated Ignored; kept for backward compatibility. */
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
  const leadingCount = Math.max(1, options.leadingCount ?? 3);
  const trailingCount = Math.max(1, options.trailingCount ?? options.boundaryCount ?? 1);

  if (pageCount <= 0) {
    return [];
  }

  if (pageCount <= leadingCount + trailingCount + 1) {
    return range(1, pageCount);
  }

  const trailingStart = pageCount - trailingCount + 1;
  const items: PaginationRangeItem[] = [...range(1, leadingCount)];

  if (currentPage <= leadingCount) {
    if (trailingStart > leadingCount + 1) {
      items.push('ellipsis-end');
      items.push(...range(trailingStart, pageCount));
    } else {
      items.push(...range(leadingCount + 1, pageCount));
    }

    return items;
  }

  if (currentPage >= trailingStart) {
    if (trailingStart > leadingCount + 1) {
      items.push('ellipsis-end');
    }

    items.push(...range(trailingStart, pageCount));
    return items;
  }

  items.push('ellipsis-start');
  items.push(currentPage);

  if (currentPage + 1 < trailingStart) {
    items.push('ellipsis-end');
  }

  items.push(...range(trailingStart, pageCount));
  return items;
}
