import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import * as SecureStore from 'expo-secure-store';
import { createClient, processLock } from '@supabase/supabase-js';
import { AppState, AppStateStatus, NativeEventSubscription, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

const placeholderSupabaseUrl = 'https://placeholder.supabase.co';
const placeholderSupabaseAnonKey = 'placeholder-anon-key';

export const supabaseConfigError =
  'Missing Supabase environment variables. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env before using the backend.';

const hasUsableEnvValue = (value?: string) => Boolean(value && value !== '<SECRET>');

export const isSupabaseConfigured = hasUsableEnvValue(supabaseUrl) && hasUsableEnvValue(supabaseAnonKey);

export const storageBuckets = {
  avatars: 'avatars',
  covers: 'covers',
  postImages: 'post-images',
} as const;

if (__DEV__ && !isSupabaseConfigured) {
  console.warn(supabaseConfigError);
}

export function ensureSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(supabaseConfigError);
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

const nativeSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
  supabaseUrl ?? placeholderSupabaseUrl,
  supabaseAnonKey ?? placeholderSupabaseAnonKey,
  {
    auth: {
      ...(Platform.OS !== 'web' ? { storage: nativeSecureStoreAdapter } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
      lock: processLock,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'art-bud-mobile',
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  },
);

let appStateSubscription: NativeEventSubscription | null = null;

function handleAppStateChange(status: AppStateStatus) {
  if (status === 'active') {
    supabase.auth.startAutoRefresh();
    return;
  }

  supabase.auth.stopAutoRefresh();
}

export function bindSupabaseAuthAppState() {
  if (Platform.OS === 'web') {
    return () => undefined;
  }

  handleAppStateChange(AppState.currentState);

  if (!appStateSubscription) {
    appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
  }

  return () => {
    appStateSubscription?.remove();
    appStateSubscription = null;
  };
}
