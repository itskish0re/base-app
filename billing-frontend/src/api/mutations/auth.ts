import { mutationOptions } from '@tanstack/react-query';
import { api } from '@/api/client';
import { normalizeAuthTokens } from '@/api/tokens';
import type { AuthTokens } from '@/types/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export const authMutationKeys = {
  login: ['auth', 'login'] as const,
  revoke: ['auth', 'revoke'] as const,
};

async function loginFn(request: LoginRequest): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/api/auth/login', request, {
    skipAuthRetry: true,
  });
  return normalizeAuthTokens(data);
}

async function revokeFn(): Promise<void> {
  await api.post('/api/auth/revoke');
}

export const loginMutationOptions = mutationOptions({
  mutationKey: authMutationKeys.login,
  mutationFn: loginFn,
});

export const revokeMutationOptions = mutationOptions({
  mutationKey: authMutationKeys.revoke,
  mutationFn: revokeFn,
});
