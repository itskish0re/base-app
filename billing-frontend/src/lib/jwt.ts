export type JwtUserClaims = {
  email?: string;
  sub?: string;
};

export function parseJwtClaims(accessToken: string | null): JwtUserClaims {
  if (!accessToken) {
    return {};
  }

  const parts = accessToken.split('.');
  if (parts.length < 2) {
    return {};
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64)) as Record<string, unknown>;
    const email =
      typeof json.email === 'string'
        ? json.email
        : typeof json.Email === 'string'
          ? json.Email
          : undefined;
    const sub =
      typeof json.sub === 'string'
        ? json.sub
        : typeof json.Sub === 'string'
          ? json.Sub
          : undefined;

    return { email, sub };
  } catch {
    return {};
  }
}

export function userDisplayFromClaims(claims: JwtUserClaims): { name: string; email: string } {
  const email = claims.email?.trim() || 'user@billing.local';
  const localPart = email.split('@')[0] ?? 'User';
  const name = localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return { name: name || 'User', email };
}
