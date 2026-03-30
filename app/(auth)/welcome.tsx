import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { textStyles, theme } from '@/lib/theme';

export default function WelcomeScreen() {
  const { isAppleSignInAvailable, isConfigured, signInWithApple, signInWithGoogle } = useAuth();
  const [busyAction, setBusyAction] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSocialAuth = async (provider: 'google' | 'apple') => {
    setBusyAction(provider);
    setError(null);

    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Something went wrong during sign in.');
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            contentFit="contain"
            source={require('../../assets/branding/art-bud-logo.png')}
            style={styles.logo}
            transition={200}
          />
          <Badge label="Core MVP" variant="neutral" />
          <Text style={styles.title}>Art Bud</Text>
          <Text style={styles.tagline}>Where Pros Meet Hobbyists</Text>
          <Text style={styles.copy}>
            A warm, focused community space for finished work, practice studies, and conversations
            between working artists and dedicated hobbyists.
          </Text>
        </View>

        <Card style={styles.panel}>
          {!isConfigured ? (
            <View style={styles.notice}>
              <Badge label="Supabase Setup Needed" variant="comingSoon" />
              <Text style={styles.noticeCopy}>
                Add your real Supabase keys to the local `.env` file before trying sign in.
              </Text>
            </View>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button onPress={() => router.push('/(auth)/signup')}>Create account</Button>
          <Button onPress={() => router.push('/(auth)/login')} variant="outline">
            Log in
          </Button>
          <Button
            disabled={!isConfigured}
            loading={busyAction === 'google'}
            onPress={() => void runSocialAuth('google')}
            variant="surface"
          >
            Continue with Google
          </Button>
          {isAppleSignInAvailable ? (
            <Button
              disabled={!isConfigured}
              loading={busyAction === 'apple'}
              onPress={() => void runSocialAuth('apple')}
              variant="surface"
            >
              Continue with Apple
            </Button>
          ) : null}
          <Button onPress={() => router.push('/(auth)/login?mode=phone')} variant="ghost">
            Use phone number
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background.base,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing[3],
  },
  hero: {
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3],
  },
  logo: {
    height: 136,
    width: 220,
  },
  title: {
    ...textStyles.hero,
    fontSize: 52,
    lineHeight: 56,
    textAlign: 'center',
  },
  tagline: {
    ...textStyles.editorial,
    textAlign: 'center',
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
    maxWidth: 420,
    textAlign: 'center',
  },
  panel: {
    gap: theme.spacing[2],
  },
  notice: {
    gap: 8,
  },
  noticeCopy: {
    ...textStyles.caption,
  },
  error: {
    ...textStyles.caption,
    color: theme.colors.state.danger,
  },
});
