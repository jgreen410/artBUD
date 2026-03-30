import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { textStyles, theme } from '@/lib/theme';

interface AuthMethodButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  active?: boolean;
  loading?: boolean;
}

export function AuthMethodButton({
  icon,
  title,
  subtitle,
  onPress,
  active = false,
  loading = false,
}: AuthMethodButtonProps) {
  return (
    <Pressable
      android_ripple={{ color: 'transparent' }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        active && styles.buttonActive,
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
        {loading ? <ActivityIndicator color={theme.colors.action.primary} size="small" /> : icon}
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 74,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  buttonActive: {
    backgroundColor: '#EEE1D1',
    borderColor: theme.colors.action.primary,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.round,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  iconWrapActive: {
    borderColor: theme.colors.action.primary,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...textStyles.bodyBold,
    fontSize: 15,
    lineHeight: 18,
  },
  subtitle: {
    ...textStyles.caption,
    color: theme.colors.text.secondary,
    lineHeight: 17,
  },
});
