import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { theme } from '@/lib/theme';

type BadgeVariant = 'professional' | 'launched' | 'comingSoon' | 'neutral' | 'terracotta';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const variantStyles: Record<BadgeVariant, ViewStyle> = {
  professional: {
    backgroundColor: theme.colors.action.secondary,
    borderColor: theme.colors.action.secondary,
  },
  launched: {
    backgroundColor: theme.colors.accent.sage,
    borderColor: theme.colors.accent.sage,
  },
  comingSoon: {
    backgroundColor: theme.colors.state.muted,
    borderColor: theme.colors.state.muted,
  },
  neutral: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
  },
  terracotta: {
    backgroundColor: theme.colors.accent.dustyRose,
    borderColor: theme.colors.accent.dustyRose,
  },
};

const textVariantStyles: Record<BadgeVariant, TextStyle> = {
  professional: {
    color: theme.colors.text.inverse,
  },
  launched: {
    color: theme.colors.text.inverse,
  },
  comingSoon: {
    color: theme.colors.text.secondary,
  },
  neutral: {
    color: theme.colors.text.secondary,
  },
  terracotta: {
    color: theme.colors.text.inverse,
  },
};

export function Badge({ label, variant = 'neutral', style, labelStyle }: BadgeProps) {
  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      <Text style={[styles.label, textVariantStyles[variant], labelStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    minHeight: 24,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: theme.typography.size.meta,
    letterSpacing: theme.typography.letterSpacing.caps,
    lineHeight: theme.typography.lineHeight.meta,
    textTransform: 'uppercase',
  },
});
