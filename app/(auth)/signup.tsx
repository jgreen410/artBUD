import { Link, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { Button, Card, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { textStyles, theme } from '@/lib/theme';

export default function SignupScreen() {
  const { isAppleSignInAvailable, isConfigured, signInWithApple, signInWithGoogle, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const captureError = (authError: unknown) => {
    setError(authError instanceof Error ? authError.message : 'Something went wrong. Please try again.');
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords must match before you continue.');
      return;
    }

    setBusyAction('email');
    setError(null);
    setNotice(null);

    try {
      const { session, user } = await signUpWithEmail({ email, password });

      if (!session && user) {
        setNotice('Account created. Check your email if confirmation is enabled for this project.');
      }
    } catch (authError) {
      captureError(authError);
    } finally {
      setBusyAction(null);
    }
  };

  const handleSocial = async (provider: 'google' | 'apple') => {
    setBusyAction(provider);
    setError(null);
    setNotice(null);

    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
    } catch (authError) {
      captureError(authError);
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Button onPress={() => router.back()} size="sm" variant="ghost">
          Back
        </Button>
        <Text style={textStyles.screenTitle}>Create your account</Text>
        <Text style={styles.copy}>
          Start with email and password now. You’ll set up your public artist profile and join
          communities right after.
        </Text>

        <Card style={styles.card}>
          {!isConfigured ? <Text style={styles.notice}>Add valid Supabase keys in `.env` before testing sign up.</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}

          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            label="Email"
            onChangeText={setEmail}
            placeholder="artist@example.com"
            value={email}
          />
          <Input
            autoCapitalize="none"
            label="Password"
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
            value={password}
          />
          <Input
            autoCapitalize="none"
            label="Confirm password"
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your password"
            secureTextEntry
            value={confirmPassword}
          />
          <Button disabled={!isConfigured} loading={busyAction === 'email'} onPress={() => void handleSignup()}>
            Create account
          </Button>
          <Button disabled={!isConfigured} loading={busyAction === 'google'} onPress={() => void handleSocial('google')} variant="surface">
            Sign up with Google
          </Button>
          {isAppleSignInAvailable ? (
            <Button disabled={!isConfigured} loading={busyAction === 'apple'} onPress={() => void handleSocial('apple')} variant="surface">
              Sign up with Apple
            </Button>
          ) : null}
        </Card>

        <Text style={styles.footer}>
          Already have an account? <Link href="/(auth)/login" style={styles.link}>Log in</Link>
        </Text>
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
    gap: theme.spacing[2],
    padding: theme.spacing[3],
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  card: {
    gap: theme.spacing[2],
  },
  notice: {
    ...textStyles.caption,
  },
  error: {
    ...textStyles.caption,
    color: theme.colors.state.danger,
  },
  footer: {
    ...textStyles.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  link: {
    color: theme.colors.action.primary,
  },
});
