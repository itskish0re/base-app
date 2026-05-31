import type { FinancialYearOption } from '@/types/store/global/financialYearContext';

/** Prefer persisted id, then the FY whose code matches the calendar year, then the newest option. */
export function resolveInitialFinancialYearId(
  options: FinancialYearOption[],
  preferredId: number | null | undefined,
): number | null {
  if (options.length === 0) {
    return null;
  }

  const currentYearCode = String(new Date().getFullYear());
  const candidates: (number | null | undefined)[] = [
    preferredId,
    options.find((option) => option.code === currentYearCode)?.financialYearId,
    options[0]?.financialYearId,
  ];

  for (const id of candidates) {
    if (id != null && id > 0 && options.some((option) => option.financialYearId === id)) {
      return id;
    }
  }

  return null;
}
