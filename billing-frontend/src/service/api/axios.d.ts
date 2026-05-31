import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Skip 401 refresh + retry (login, refresh). */
    skipAuthRetry?: boolean;
    _retry?: boolean;
    /** Force X-Financial-Year-Id header when a year is selected. */
    applyFinancialYear?: boolean;
    /** Never send X-Financial-Year-Id on this request. */
    skipFinancialYear?: boolean;
  }
}
