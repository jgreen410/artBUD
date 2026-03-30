import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthVideoHero } from '@/components/auth';
import { LogoMark } from '@/components/icons';
import { Button, Input, KeyboardAwareScrollView } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/lib/theme';

export default function LoginScreen() {
  const { isConfigured, signInWithEmail } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const captureError = (authError: unknown) => {
    setError(authError instanceof Error ? authError.message : 'Something went wrong. Please try again.');
  };

  const handleEmailLogin = async () => {
    setBusyAction('email');
    setError(null);

    try {
      await signInWithEmail({ email, password });
    } catch (authError) {
      captureError(authError);
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" translucent />

      <AuthVideoHero />

      {/* Back button floating over video */}
      <View style={[styles.backWrap, { top: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <Text style={styles.backLabel}>← Back</Text>
        </Pressable>
      </View>

      {/* Keyboard-aware scroll to push panel above keyboard */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        extraBottomPadding={insets.bottom + 24}
        keyboardVerticalOffset={insets.top}
        showsVerticalScrollIndicator={false}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={[styles.panel, { paddingBottom: insets.bottom + 24 }]}>
          {/* Logo + wordmark */}
          <View style={styles.logoWrap}>
            <LogoMark size={110} />
            <View style={styles.wordmark}>
              <Text style={styles.wordmarkScript}>Art</Text>
              <Text style={styles.wordmarkBold}>bud</Text>
            </View>
          </View>

          {!isConfigured ? (
            <Text style={styles.notice}>Add valid Supabase keys in `.env` before testing sign in.</Text>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.form}>
            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              onSubmitEditing={() => passwordRef.current?.focus()}
              placeholder="artist@example.com"
              returnKeyType="next"
              value={email}
            />
            <Input
              autoCapitalize="none"
              label="Password"
              onChangeText={setPassword}
              onSubmitEditing={() => void handleEmailLogin()}
              placeholder="Enter your password"
              ref={passwordRef}
              returnKeyType="done"
              secureTextEntry
              value={password}
            />
            <Button
              disabled={!isConfigured}
              loading={busyAction === 'email'}
              onPress={() => void handleEmailLogin()}
            >
              Log in with email
            </Button>
          </View>

          <Text style={styles.footer}>
            Need an account?{' '}
            <Link href="/(auth)/signup" style={styles.footerLink}>Create one</Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#18120D',
    flex: 1,
  },
  backWrap: {
    left: 16,
    position: 'absolute',
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(24, 18, 13, 0.6)',
    borderColor: 'rgba(245, 237, 224, 0.2)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backLabel: {
    color: '#F5EDE0',
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: 14,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: 'rgba(24, 18, 13, 0.9)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 6,
  },
  wordmark: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  wordmarkScript: {
    color: '#F5EDE0',
    fontFamily: theme.typography.fontFamily.script,
    fontSize: 36,
    lineHeight: 38,
  },
  wordmarkBold: {
    color: '#F5EDE0',
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: 22,
    letterSpacing: 2,
    lineHeight: 38,
  },
  notice: {
    color: 'rgba(245, 237, 224, 0.5)',
    fontSize: 12,
    textAlign: 'center',
  },
  error: {
    color: theme.colors.state.danger,
    fontSize: 13,
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  footer: {
    color: 'rgba(245, 237, 224, 0.5)',
    fontSize: 13,
    paddingBottom: 4,
    textAlign: 'center',
  },
  footerLink: {
    color: 'rgba(245, 237, 224, 0.85)',
    fontFamily: theme.typography.fontFamily.bodyMedium,
  },
});
