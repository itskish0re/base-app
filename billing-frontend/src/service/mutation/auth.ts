import { mutationOptions } from '@tanstack/react-query';
import { login, revoke } from '@/service/api/functions/auth';
import type { LoginRequest } from '@/types/auth';

export const authMutationKeys = {
  all: ['auth'] as const,
  login: () => [...authMutationKeys.all, 'login'] as const,
  revoke: () => [...authMutationKeys.all, 'revoke'] as const,
};

export const loginMutationOptions = mutationOptions({
  mutationKey: authMutationKeys.login(),
  mutationFn: (request: LoginRequest) => login(request),
});

export const revokeMutationOptions = mutationOptions({
  mutationKey: authMutationKeys.revoke(),
  mutationFn: () => revoke(),
});
