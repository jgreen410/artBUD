import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { parseAuthRedirectUrl } from '@/lib/authRedirect';
import { UserProfile } from '@/lib/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

WebBrowser.maybeCompleteAuthSession();

const oauthRedirectTo = makeRedirectUri({
  scheme: 'artbud',
  path: 'auth/callback',
});

async function completeSessionFromRedirectUrl(url: string) {
  const payload = parseAuthRedirectUrl(url);

  if (!payload) {
    return null;
  }

  if (payload.type === 'code') {
    const { data, error } = await supabase.auth.exchangeCodeForSession(payload.code);

    if (error) {
      throw error;
    }

    return data.session;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: payload.accessToken,
    refresh_token: payload.refreshToken,
  });

  if (error) {
    throw error;
  }

  return data.session;
}

async function getProfileSnapshot(userId: string) {
  const [{ data: profile, error: profileError }, { count, error: membershipError }] = await Promise.all([
    supabase.from('users_profile').select('*').eq('id', userId).maybeSingle<UserProfile>(),
    supabase.from('community_members').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ]);

  if (profileError) {
    throw profileError;
  }

  if (membershipError) {
    throw membershipError;
  }

  return {
    profile: profile ?? null,
    joinedCommunityCount: count ?? 0,
  };
}

async function syncAuthSnapshot(session: ReturnType<typeof useAuthStore.getState>['session']) {
  const store = useAuthStore.getState();

  if (!session?.user) {
    store.setSnapshot({
      session: null,
      user: null,
      profile: null,
      joinedCommunityCount: 0,
    });
    return;
  }

  const { profile, joinedCommunityCount } = await getProfileSnapshot(session.user.id);

  store.setSnapshot({
    session,
    user: session.user,
    profile,
    joinedCommunityCount,
  });
}

export function useAuthBootstrap() {
  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      useAuthStore.getState().finishHydration();
      return () => undefined;
    }

    const bootstrap = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        if (isMounted) {
          useAuthStore.getState().finishHydration();
        }
        return;
      }

      if (isMounted) {
        await syncAuthSnapshot(session);
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      void syncAuthSnapshot(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
}

interface EmailCredentials {
  email: string;
  password: string;
}

interface PhoneOtpVerification {
  phone: string;
  token: string;
}

interface OnboardingPayload {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  joinedCommunityIds: string[];
}

export function useAuth() {
  const [appleAvailable, setAppleAvailable] = useState(Platform.OS === 'ios');
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const joinedCommunityCount = useAuthStore((state) => state.joinedCommunityCount);
  const isHydrating = useAuthStore((state) => state.isHydrating);

  const isLoggedIn = Boolean(session?.user);
  const needsOnboarding = isLoggedIn && (!profile || joinedCommunityCount < 1);
  const isAppleSignInAvailable = appleAvailable;

  useEffect(() => {
    let mounted = true;

    const resolveAppleAvailability = async () => {
      if (Platform.OS !== 'ios') {
        if (mounted) {
          setAppleAvailable(false);
        }
        return;
      }

      try {
        const available = await AppleAuthentication.isAvailableAsync();
        if (mounted) {
          setAppleAvailable(available);
        }
      } catch {
        if (mounted) {
          setAppleAvailable(false);
        }
      }
    };

    void resolveAppleAvailability();

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithEmail = async ({ email, password }: EmailCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const signUpWithEmail = async ({ email, password }: EmailCredentials) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const sendPhoneOtp = async (phone: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone.trim(),
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const verifyPhoneOtp = async ({ phone, token }: PhoneOtpVerification) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token: token.trim(),
      type: 'sms',
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: oauthRedirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      throw error;
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, oauthRedirectTo);

    if (result.type === 'success') {
      return completeSessionFromRedirectUrl(result.url);
    }

    if (result.type === 'cancel' || result.type === 'dismiss') {
      if (Constants.appOwnership === 'expo') {
        throw new Error(
          'Google sign-in needs a development build or production build. Expo Go does not reliably complete the OAuth return flow.',
        );
      }

      throw new Error('Google sign-in was cancelled before it finished.');
    }

    throw new Error('Google sign-in did not complete successfully.');
  };

  const signInWithApple = async () => {
    const nonce = Crypto.randomUUID();
    const state = Crypto.randomUUID();
    const credential = await AppleAuthentication.signInAsync({
      nonce,
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      ],
      state,
    });

    if (!credential.identityToken || !credential.authorizationCode) {
      throw new Error('Apple sign-in did not return an identity token.');
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      access_token: credential.authorizationCode,
      nonce,
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const completeOnboarding = async ({
    username,
    displayName,
    bio,
    avatarUrl,
    joinedCommunityIds,
  }: OnboardingPayload) => {
    if (!user) {
      throw new Error('No authenticated user is available.');
    }

    if (joinedCommunityIds.length < 1) {
      throw new Error('Join at least one community before continuing.');
    }

    const sanitizedUsername = username.trim().toLowerCase();

    const { error: profileError } = await supabase.from('users_profile').upsert(
      {
        id: user.id,
        username: sanitizedUsername,
        display_name: displayName.trim(),
        avatar_url: avatarUrl?.trim() || null,
        bio: bio?.trim() || null,
      },
      {
        onConflict: 'id',
      },
    );

    if (profileError) {
      throw profileError;
    }

    const { error: deleteMembershipsError } = await supabase
      .from('community_members')
      .delete()
      .eq('user_id', user.id);

    if (deleteMembershipsError) {
      throw deleteMembershipsError;
    }

    const { error: membershipError } = await supabase.from('community_members').insert(
      joinedCommunityIds.map((communityId) => ({
        community_id: communityId,
        user_id: user.id,
      })),
    );

    if (membershipError) {
      throw membershipError;
    }

    const { data: refreshedSession } = await supabase.auth.getSession();
    await syncAuthSnapshot(refreshedSession.session);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  return {
    isAppleSignInAvailable,
    isConfigured: isSupabaseConfigured,
    isHydrating,
    isLoggedIn,
    joinedCommunityCount,
    needsOnboarding,
    oauthRedirectTo,
    profile,
    session,
    user,
    completeOnboarding,
    sendPhoneOtp,
    signInWithApple,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    signUpWithEmail,
    verifyPhoneOtp,
  };
}
