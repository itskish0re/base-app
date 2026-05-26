import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import { normalizeAuthTokens } from '@/service/api/tokens';
import type { AuthTokens, LoginRequest } from '@/types/auth';

export type { LoginRequest };

export async function login(request: LoginRequest): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>(endpoints.auth.login(), request, {
    skipAuthRetry: true,
  });
  return normalizeAuthTokens(data);
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>(
    endpoints.auth.refresh(),
    { refreshToken },
    { skipAuthRetry: true },
  );
  return normalizeAuthTokens(data);
}

export async function revoke(): Promise<void> {
  await api.post(endpoints.auth.revoke());
}
