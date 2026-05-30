/**
 * Temporary mock data for layout/scroll testing. Remove when done.
 * Toggle `USE_TEMP_NAME_BOARD_DATA` in name-boards/index.tsx.
 */
import type { ListQueryParams, PagedResponse } from '@/types/common';
import type { NameBoardDto } from '@/types/entity';

export const USE_TEMP_NAME_BOARD_DATA = true;

export const TEMP_NAME_BOARD_ROW_COUNT = 50;

export const TEMP_NAME_BOARD_ROWS: NameBoardDto[] = Array.from(
  { length: TEMP_NAME_BOARD_ROW_COUNT },
  (_, index) => {
    const id = index + 1;
    return {
      nameBoardId: id,
      name: `Test Name Board ${id}`,
      code: `TNB-${String(id).padStart(3, '0')}`,
      ownerName: `Owner ${id}`,
      ownerPhone: id % 3 === 0 ? null : `98765${String(id).padStart(5, '0')}`,
      isEnabled: id % 4 !== 0,
      isActive: id % 5 !== 0,
      createdAt: new Date(2024, index % 12, (index % 28) + 1).toISOString(),
      updatedAt: new Date(2025, index % 12, (index % 28) + 1).toISOString(),
    };
  },
);

function applyFilter(rows: NameBoardDto[], filter?: string): NameBoardDto[] {
  const term = filter?.trim().toLowerCase();
  if (!term) {
    return rows;
  }

  return rows.filter(
    (row) =>
      row.name.toLowerCase().includes(term) ||
      row.code.toLowerCase().includes(term) ||
      row.ownerName.toLowerCase().includes(term) ||
      (row.ownerPhone?.toLowerCase().includes(term) ?? false),
  );
}

function applySort(rows: NameBoardDto[], orderBy?: string): NameBoardDto[] {
  if (!orderBy) {
    return rows;
  }

  const [field, direction = 'asc'] = orderBy.split(/\s+/);
  const sorted = [...rows].sort((left, right) => {
    const leftValue = left[field as keyof NameBoardDto];
    const rightValue = right[field as keyof NameBoardDto];

    if (leftValue == null && rightValue == null) {
      return 0;
    }

    if (leftValue == null) {
      return 1;
    }

    if (rightValue == null) {
      return -1;
    }

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue - rightValue;
    }

    if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
      return Number(leftValue) - Number(rightValue);
    }

    return String(leftValue).localeCompare(String(rightValue));
  });

  return direction.toLowerCase() === 'desc' ? sorted.reverse() : sorted;
}

export function paginateTempNameBoards(params?: ListQueryParams): PagedResponse<NameBoardDto> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;

  const filtered = applySort(applyFilter(TEMP_NAME_BOARD_ROWS, params?.filter), params?.orderBy);

  // Temp mode: return the full filtered list so all 50 rows render for scroll/layout testing.
  return {
    items: filtered,
    page,
    pageSize,
    totalCount: filtered.length,
  };
}
