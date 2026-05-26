import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Skip 401 refresh + retry (login, refresh). */
    skipAuthRetry?: boolean;
    _retry?: boolean;
  }
}
