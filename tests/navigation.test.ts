import { describe, expect, it } from 'vitest';

import { getRootRedirectDecision } from '../lib/navigation';

describe('getRootRedirectDecision', () => {
  it('redirects guests to welcome when they hit protected routes', () => {
    expect(
      getRootRedirectDecision({
        segments: ['post', 'abc'],
        isLoggedIn: false,
        needsOnboarding: false,
      }),
    ).toEqual({
      href: '/(auth)/welcome',
      reason: 'guest-to-welcome',
    });
  });

  it('keeps logged-in users on protected stack routes like post detail', () => {
    expect(
      getRootRedirectDecision({
        segments: ['post', 'abc'],
        isLoggedIn: true,
        needsOnboarding: false,
      }),
    ).toBeNull();
  });

  it('keeps logged-in users on protected stack routes like community detail', () => {
    expect(
      getRootRedirectDecision({
        segments: ['community', 'abc'],
        isLoggedIn: true,
        needsOnboarding: false,
      }),
    ).toBeNull();
  });

  it('redirects logged-in users who still need onboarding to onboarding', () => {
    expect(
      getRootRedirectDecision({
        segments: ['post', 'abc'],
        isLoggedIn: true,
        needsOnboarding: true,
      }),
    ).toEqual({
      href: '/(auth)/onboarding',
      reason: 'needs-onboarding',
    });
  });

  it('redirects logged-in users away from auth screens once onboarding is done', () => {
    expect(
      getRootRedirectDecision({
        segments: ['(auth)', 'login'],
        isLoggedIn: true,
        needsOnboarding: false,
      }),
    ).toEqual({
      href: '/(tabs)',
      reason: 'authed-to-app',
    });
  });
});
