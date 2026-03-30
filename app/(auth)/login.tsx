import { Link, useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Input, Tag } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { textStyles, theme } from '@/lib/theme';

type LoginMode = 'email' | 'phone';

export default function LoginScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const defaultMode: LoginMode = params.mode === 'phone' ? 'phone' : 'email';
  const { isAppleSignInAvailable, isConfigured, sendPhoneOtp, signInWithApple, signInWithEmail, signInWithGoogle, verifyPhoneOtp } =
    useAuth();

  const [mode, setMode] = useState<LoginMode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

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

  const handleSendOtp = async () => {
    setBusyAction('phone-send');
    setError(null);

    try {
      await sendPhoneOtp(phone);
      setOtpSent(true);
    } catch (authError) {
      captureError(authError);
    } finally {
      setBusyAction(null);
    }
  };

  const handleVerifyOtp = async () => {
    setBusyAction('phone-verify');
    setError(null);

    try {
      await verifyPhoneOtp({ phone, token });
    } catch (authError) {
      captureError(authError);
    } finally {
      setBusyAction(null);
    }
  };

  const handleSocial = async (provider: 'google' | 'apple') => {
    setBusyAction(provider);
    setError(null);

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
        <View style={styles.header}>
          <Button onPress={() => router.back()} size="sm" variant="ghost">
            Back
          </Button>
          <Text style={textStyles.screenTitle}>Log in</Text>
          <Text style={styles.copy}>Pick your preferred sign-in method and jump back into the studio.</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.modeRow}>
            <Tag label="Email" onPress={() => setMode('email')} variant={mode === 'email' ? 'selected' : 'default'} />
            <Tag label="Phone" onPress={() => setMode('phone')} variant={mode === 'phone' ? 'selected' : 'default'} />
          </View>

          {!isConfigured ? (
            <Text style={styles.notice}>Add valid Supabase keys in `.env` before testing sign in.</Text>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {mode === 'email' ? (
            <View style={styles.form}>
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
                placeholder="Enter your password"
                secureTextEntry
                value={password}
              />
              <Button disabled={!isConfigured} loading={busyAction === 'email'} onPress={() => void handleEmailLogin()}>
                Log in with email
              </Button>
            </View>
          ) : (
            <View style={styles.form}>
              <Input
                keyboardType="phone-pad"
                label="Phone number"
                onChangeText={setPhone}
                placeholder="+1 555 555 5555"
                value={phone}
              />
              {otpSent ? (
                <Input
                  keyboardType="number-pad"
                  label="SMS code"
                  onChangeText={setToken}
                  placeholder="123456"
                  value={token}
                />
              ) : null}
              <Button
                disabled={!isConfigured}
                loading={busyAction === 'phone-send'}
                onPress={() => void handleSendOtp()}
                variant={otpSent ? 'outline' : 'primary'}
              >
                {otpSent ? 'Send a new code' : 'Send SMS code'}
              </Button>
              {otpSent ? (
                <Button
                  disabled={!isConfigured}
                  loading={busyAction === 'phone-verify'}
                  onPress={() => void handleVerifyOtp()}
                  variant="secondary"
                >
                  Verify code
                </Button>
              ) : null}
            </View>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerCopy}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button disabled={!isConfigured} loading={busyAction === 'google'} onPress={() => void handleSocial('google')} variant="surface">
            Continue with Google
          </Button>
          {isAppleSignInAvailable ? (
            <Button disabled={!isConfigured} loading={busyAction === 'apple'} onPress={() => void handleSocial('apple')} variant="surface">
              Continue with Apple
            </Button>
          ) : null}
        </Card>

        <Text style={styles.footer}>
          Need an account? <Link href="/(auth)/signup" style={styles.link}>Create one</Link>
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
    gap: theme.spacing[3],
    padding: theme.spacing[3],
  },
  header: {
    gap: theme.spacing[1],
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  card: {
    gap: theme.spacing[2],
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  form: {
    gap: theme.spacing[2],
  },
  notice: {
    ...textStyles.caption,
  },
  error: {
    ...textStyles.caption,
    color: theme.colors.state.danger,
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  dividerLine: {
    backgroundColor: theme.colors.border.subtle,
    flex: 1,
    height: 1,
  },
  dividerCopy: {
    ...textStyles.caption,
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
