const REFRESH_TOKEN_KEY = 'billing.refreshToken';
const ACCESS_TOKEN_KEY = 'billing.accessToken';
const ACCESS_EXPIRES_KEY = 'billing.accessTokenExpiresAt';
const SELECTED_FINANCIAL_YEAR_ID_KEY = 'billing.selectedFinancialYearId';

function readToken(key: string): string | null {
  const value = localStorage.getItem(key)?.trim();
  if (!value || value === 'undefined' || value === 'null') {
    return null;
  }

  return value;
}

export function loadRefreshToken(): string | null {
  return readToken(REFRESH_TOKEN_KEY);
}

export function saveTokens(accessToken: string, refreshToken: string, accessTokenExpiresAt: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken.trim());
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken.trim());
  localStorage.setItem(ACCESS_EXPIRES_KEY, accessTokenExpiresAt);
}

export function loadAccessToken(): string | null {
  return readToken(ACCESS_TOKEN_KEY);
}

export function loadAccessExpiresAt(): string | null {
  const value = localStorage.getItem(ACCESS_EXPIRES_KEY)?.trim();
  return value && value !== 'undefined' ? value : null;
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_EXPIRES_KEY);
}

export function loadSelectedFinancialYearId(): number | null {
  const raw = localStorage.getItem(SELECTED_FINANCIAL_YEAR_ID_KEY)?.trim();
  if (!raw) {
    return null;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
}

export function saveSelectedFinancialYearId(financialYearId: number) {
  localStorage.setItem(SELECTED_FINANCIAL_YEAR_ID_KEY, String(financialYearId));
}

export function clearSelectedFinancialYearId() {
  localStorage.removeItem(SELECTED_FINANCIAL_YEAR_ID_KEY);
}
