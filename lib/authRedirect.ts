export type AuthRedirectPayload =
  | {
      type: 'code';
      code: string;
    }
  | {
      type: 'session';
      accessToken: string;
      refreshToken: string;
    };

export function parseAuthRedirectUrl(url: string): AuthRedirectPayload | null {
  const parsed = new URL(url);
  const hashParams = new URLSearchParams(parsed.hash.startsWith('#') ? parsed.hash.slice(1) : parsed.hash);
  const searchParams = parsed.searchParams;

  const code = searchParams.get('code') ?? hashParams.get('code');
  if (code) {
    return {
      type: 'code',
      code,
    };
  }

  const accessToken = hashParams.get('access_token') ?? searchParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token') ?? searchParams.get('refresh_token');

  if (accessToken && refreshToken) {
    return {
      type: 'session',
      accessToken,
      refreshToken,
    };
  }

  return null;
}
