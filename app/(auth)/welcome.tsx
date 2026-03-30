import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthVideoHero } from '@/components/auth';
import { AppleMark, EmailMark, GoogleMark, LogoMark, PhoneMark } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { authShowcaseItems } from '@/lib/authShowcase';
import { theme } from '@/lib/theme';

export default function WelcomeScreen() {
  const { isAppleSignInAvailable } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);

  const showComingSoon = (provider: 'google' | 'apple' | 'phone') => {
    const label =
      provider === 'google' ? 'Google' : provider === 'apple' ? 'Apple' : 'SMS code';
    Alert.alert('Coming Soon', `${label} sign in is coming soon.`);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" translucent />

      <AuthVideoHero onIndexChange={setActiveIndex} />

      <View style={StyleSheet.absoluteFillObject}>
        {/* Logo + wordmark centered over the video */}
        <View style={[styles.logoArea, { paddingTop: insets.top + 32 }]}>
          <LogoMark size={180} />
          <View style={styles.wordmark}>
            <Text style={styles.wordmarkScript}>Art</Text>
            <Text style={styles.wordmarkBold}>bud</Text>
          </View>
        </View>

        {/* Dark bottom panel */}
        <View style={[styles.panel, { paddingBottom: insets.bottom + 24 }]}>
          {/* Dot indicators */}
          <View style={styles.dotsRow}>
            {authShowcaseItems.map((item, index) => (
              <View
                key={item.id}
                style={[styles.dot, index === activeIndex && styles.dotActive]}
              />
            ))}
          </View>

          {/* Auth buttons */}
          <View style={styles.buttons}>
            <AuthPillButton
              icon={<EmailMark />}
              label="Continue with Email"
              onPress={() => router.push('/(auth)/login')}
            />
            <AuthPillButton
              icon={<PhoneMark />}
              label="Continue with Phone"
              onPress={() => showComingSoon('phone')}
            />
            <AuthPillButton
              icon={<GoogleMark />}
              label="Continue with Google"
              onPress={() => showComingSoon('google')}
            />
            {isAppleSignInAvailable ? (
              <AuthPillButton
                icon={<AppleMark />}
                label="Continue with Apple"
                onPress={() => showComingSoon('apple')}
              />
            ) : null}
          </View>

          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupLink}>
              New to Art Bud?{' '}
              <Text style={styles.signupLinkBold}>Create account</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function AuthPillButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pillButton, pressed && styles.pillButtonPressed]}
    >
      <View style={styles.pillIcon}>{icon}</View>
      <Text style={styles.pillLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#18120D',
    flex: 1,
  },
  logoArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    height: 180,
    width: 180,
  },
  panel: {
    backgroundColor: 'rgba(24, 18, 13, 0.88)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 14,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  dotsRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    backgroundColor: 'rgba(245, 237, 224, 0.3)',
    borderRadius: 999,
    height: 6,
    width: 6,
  },
  dotActive: {
    backgroundColor: theme.colors.action.primary,
    width: 18,
  },
  wordmark: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginTop: 8,
  },
  wordmarkScript: {
    color: '#F5EDE0',
    fontFamily: theme.typography.fontFamily.script,
    fontSize: 42,
    lineHeight: 44,
  },
  wordmarkBold: {
    color: '#F5EDE0',
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: 26,
    letterSpacing: 2,
    lineHeight: 44,
  },
  buttons: {
    gap: 10,
  },
  pillButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 237, 224, 0.12)',
    borderColor: 'rgba(245, 237, 224, 0.2)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pillButtonPressed: {
    opacity: 0.75,
  },
  pillIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
  },
  pillLabel: {
    color: '#F5EDE0',
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: 15,
  },
  signupLink: {
    color: 'rgba(245, 237, 224, 0.5)',
    fontSize: 13,
    textAlign: 'center',
  },
  signupLinkBold: {
    color: 'rgba(245, 237, 224, 0.85)',
    fontFamily: theme.typography.fontFamily.bodyMedium,
  },
});
