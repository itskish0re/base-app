/** HTTP header sent on transaction-scoped API calls. Must match backend middleware. */
export const FINANCIAL_YEAR_HEADER = 'X-Financial-Year-Id';

export const FINANCIAL_YEAR_STORAGE_KEY = 'billing.selectedFinancialYearId';

/**
 * API path segments (after /api/) that receive the financial year header.
 * Add transaction controller segments here as they are introduced.
 */
export const TRANSACTION_API_SEGMENTS: readonly string[] = ['bills', 'loads'];

/** Master / shared APIs that never receive the financial year header. */
export const MASTER_API_SEGMENTS: readonly string[] = [
  'auth',
  'access',
  'health',
  'screens',
  'menus',
  'name-boards',
  'trucks',
  'locations',
  'parties',
  'goods',
  'units',
  'financial-years',
];

export const ENTITY_KIND = {
  master: 'master',
  transaction: 'transaction',
} as const;

export type EntityKind = (typeof ENTITY_KIND)[keyof typeof ENTITY_KIND];
