import { describe, expect, it } from 'vitest';

import { parseAuthRedirectUrl } from '@/lib/authRedirect';

describe('parseAuthRedirectUrl', () => {
  it('extracts a PKCE auth code from the query string', () => {
    expect(parseAuthRedirectUrl('artbud://auth/callback?code=abc123&state=xyz')).toEqual({
      type: 'code',
      code: 'abc123',
    });
  });

  it('extracts access and refresh tokens from a hash redirect', () => {
    expect(
      parseAuthRedirectUrl(
        'artbud://auth/callback#access_token=token123&refresh_token=refresh456&expires_in=3600',
      ),
    ).toEqual({
      type: 'session',
      accessToken: 'token123',
      refreshToken: 'refresh456',
    });
  });

  it('returns null when the redirect has no auth payload', () => {
    expect(parseAuthRedirectUrl('artbud://auth/callback?state=xyz')).toBeNull();
  });
});
