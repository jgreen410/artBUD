export type RootRedirectHref = '/(auth)/welcome' | '/(auth)/onboarding' | '/(tabs)';

export interface RootRedirectState {
  segments: string[];
  isLoggedIn: boolean;
  needsOnboarding: boolean;
}

export interface RootRedirectDecision {
  href: RootRedirectHref;
  reason: 'guest-to-welcome' | 'needs-onboarding' | 'authed-to-app';
}

const protectedAppSegments = new Set(['(tabs)', 'post', 'community', 'artist']);

export function getRootRedirectDecision({
  segments,
  isLoggedIn,
  needsOnboarding,
}: RootRedirectState): RootRedirectDecision | null {
  const firstSegment = segments[0];
  const secondSegment = segments[1];
  const inAuthGroup = firstSegment === '(auth)';
  const isCallbackRoute = firstSegment === 'auth' && secondSegment === 'callback';
  const isOnboardingRoute = inAuthGroup && secondSegment === 'onboarding';
  const inProtectedAppRoute = firstSegment ? protectedAppSegments.has(firstSegment) : false;

  if (!isLoggedIn && !inAuthGroup && !isCallbackRoute) {
    return {
      href: '/(auth)/welcome',
      reason: 'guest-to-welcome',
    };
  }

  if (isLoggedIn && needsOnboarding && !isOnboardingRoute) {
    return {
      href: '/(auth)/onboarding',
      reason: 'needs-onboarding',
    };
  }

  if (isLoggedIn && !needsOnboarding && !inProtectedAppRoute) {
    return {
      href: '/(tabs)',
      reason: 'authed-to-app',
    };
  }

  return null;
}
