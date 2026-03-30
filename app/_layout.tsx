import 'react-native-reanimated';

import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAuth, useAuthBootstrap } from '@/hooks/useAuth';
import { useArtBudFonts } from '@/lib/fonts';
import { queryClient } from '@/lib/queryClient';
import { bindSupabaseAuthAppState } from '@/lib/supabase';
import { theme } from '@/lib/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useArtBudFonts();
  const router = useRouter();
  const segments = useSegments() as string[];
  const { isHydrating, isLoggedIn, needsOnboarding } = useAuth();

  useAuthBootstrap();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background.base);
  }, []);

  useEffect(() => bindSupabaseAuthAppState(), []);

  useEffect(() => {
    if (!fontsLoaded || isHydrating) {
      return;
    }

    const firstSegment = segments[0];
    const secondSegment = segments[1];
    const inAuthGroup = firstSegment === '(auth)';
    const inTabsGroup = firstSegment === '(tabs)';
    const isCallbackRoute = firstSegment === 'auth' && secondSegment === 'callback';
    const isOnboardingRoute = firstSegment === '(auth)' && secondSegment === 'onboarding';

    if (!isLoggedIn && !inAuthGroup && !isCallbackRoute) {
      router.replace('/(auth)/welcome');
      return;
    }

    if (isLoggedIn && needsOnboarding && !isOnboardingRoute) {
      router.replace('/(auth)/onboarding');
      return;
    }

    if (isLoggedIn && !needsOnboarding && !inTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [fontsLoaded, isHydrating, isLoggedIn, needsOnboarding, router, segments]);

  useEffect(() => {
    if (fontsLoaded && !isHydrating) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isHydrating]);

  if (!fontsLoaded || isHydrating) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.background.base,
            },
          }}
        />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
