import { TRANSACTION_API_SEGMENTS, MASTER_API_SEGMENTS } from '@/constants/financialYearContext';

export { loadSelectedFinancialYearId, saveSelectedFinancialYearId, clearSelectedFinancialYearId } from '@/lib/storage';

function extractApiSegment(url: string): string | null {
  const normalized = url.split('?')[0] ?? url;
  const match = normalized.match(/\/api\/([^/]+)/);
  return match?.[1] ?? null;
}

/** True when the request should carry X-Financial-Year-Id. */
export function shouldApplyFinancialYearHeader(
  url: string | undefined,
  options?: { applyFinancialYear?: boolean; skipFinancialYear?: boolean },
): boolean {
  if (options?.skipFinancialYear) {
    return false;
  }

  if (options?.applyFinancialYear) {
    return true;
  }

  if (!url) {
    return false;
  }

  const segment = extractApiSegment(url);
  if (!segment) {
    return false;
  }

  if (MASTER_API_SEGMENTS.includes(segment)) {
    return false;
  }

  if (TRANSACTION_API_SEGMENTS.includes(segment)) {
    return true;
  }

  return false;
}

export function isTransactionEntityKind(entityKind: string | null | undefined): boolean {
  return entityKind === 'transaction';
}
