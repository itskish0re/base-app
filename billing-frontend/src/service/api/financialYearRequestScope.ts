import type { AxiosRequestConfig } from 'axios';

/** Axios config flag for transaction APIs that need FY header filtering. */
export function withFinancialYearRequestScope(
  config: AxiosRequestConfig = {},
): AxiosRequestConfig {
  return {
    ...config,
    applyFinancialYear: true,
  };
}
