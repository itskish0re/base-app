import { store } from '@/store/store';
import type { AuthTokens } from '@/types/auth';

/** API may return camelCase or PascalCase depending on serializer settings. */
type AuthTokensPayload = AuthTokens & {
  AccessToken?: string;
  RefreshToken?: string;
  AccessTokenExpiresAt?: string | Date;
  RefreshTokenExpiresAt?: string | Date;
};

export function normalizeAuthTokens(data: AuthTokensPayload): AuthTokens {
  const accessToken = data.accessToken ?? data.AccessToken;
  const refreshToken = data.refreshToken ?? data.RefreshToken;

  if (!accessToken || !refreshToken) {
    throw new Error('Auth response did not include access and refresh tokens.');
  }

  const accessTokenExpiresAt = data.accessTokenExpiresAt ?? data.AccessTokenExpiresAt;
  const refreshTokenExpiresAt = data.refreshTokenExpiresAt ?? data.RefreshTokenExpiresAt;

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt: String(accessTokenExpiresAt ?? ''),
    refreshTokenExpiresAt: String(refreshTokenExpiresAt ?? ''),
  };
}

export function isAccessTokenExpired(skewMs = 30_000): boolean {
  const expiresAt = store.getState().auth.accessTokenExpiresAt;
  if (!expiresAt) {
    return false;
  }

  const expiresMs = new Date(expiresAt).getTime();
  if (Number.isNaN(expiresMs)) {
    return false;
  }

  return expiresMs <= Date.now() + skewMs;
}
