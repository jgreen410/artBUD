import 'react-native-reanimated';

import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAuth, useAuthBootstrap } from '@/hooks/useAuth';
import { useArtBudFonts } from '@/lib/fonts';
import { getRootRedirectDecision } from '@/lib/navigation';
import { queryClient } from '@/lib/queryClient';
import { bindSupabaseAuthAppState } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { KeyboardDismissAccessory } from '@/components/ui';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useArtBudFonts();
  const router = useRouter();
  const segments = useSegments() as string[];
  const { isHydrating, isLoggedIn, needsOnboarding } = useAuth();

  useAuthBootstrap();

  useEffect(() => bindSupabaseAuthAppState(), []);

  useEffect(() => {
    if (!fontsLoaded || isHydrating) {
      return;
    }

    const redirectDecision = getRootRedirectDecision({
      segments,
      isLoggedIn,
      needsOnboarding,
    });

    if (redirectDecision) {
      if (__DEV__) {
        console.info(
          `[nav-guard] ${redirectDecision.reason} -> ${redirectDecision.href} from /${segments.join('/')}`,
        );
      }

      router.replace(redirectDecision.href);
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
        <KeyboardDismissAccessory />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
