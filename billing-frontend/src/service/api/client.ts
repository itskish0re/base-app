import axios, {
  AxiosHeaders,
  isAxiosError,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { endpoints } from '@/config/endpoints';
import { store } from '@/store/store';
import { clearAuth, setTokens } from '@/store/global/authSlice';
import type { AuthTokens } from '@/types/auth';
import { isAccessTokenExpired, normalizeAuthTokens } from '@/service/api/tokens';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getApiBase(): string {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) {
    return configured;
  }

  return '';
}

export const api = axios.create({
  baseURL: getApiBase(),
  headers: { 'Content-Type': 'application/json' },
});

let refreshPromise: Promise<boolean> | null = null;

function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token: string | null,
): void {
  const headers = AxiosHeaders.from(config.headers ?? {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers.delete('Authorization');
  }

  config.headers = headers;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = store.getState().auth.refreshToken;
  if (!refreshToken) {
    return false;
  }

  try {
    const { data } = await api.post<AuthTokens>(
      endpoints.auth.refresh(),
      { refreshToken },
      { skipAuthRetry: true },
    );
    store.dispatch(setTokens(normalizeAuthTokens(data)));
    return true;
  } catch {
    store.dispatch(clearAuth());
    return false;
  }
}

async function ensureRefreshed(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const body = error.response?.data;
  const detail =
    typeof body === 'object' && body !== null && 'detail' in body
      ? String((body as { detail: string }).detail)
      : error.message;

  return new ApiError(detail || 'Request failed', status, body);
}

api.interceptors.request.use(async (config) => {
  if (config.skipAuthRetry) {
    setAuthorizationHeader(config, null);
    return config;
  }

  if (store.getState().auth.refreshToken && isAccessTokenExpired()) {
    await ensureRefreshed();
  }

  setAuthorizationHeader(config, store.getState().auth.accessToken);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const { config, response } = error;

    if (response?.status === 401 && !config.skipAuthRetry && !config._retry) {
      config._retry = true;
      const refreshed = await ensureRefreshed();

      if (refreshed) {
        setAuthorizationHeader(config, store.getState().auth.accessToken);
        return api(config);
      }
    }

    return Promise.reject(toApiError(error));
  },
);
