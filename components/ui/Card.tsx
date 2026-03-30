import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '@/lib/theme';

type CardVariant = 'default' | 'elevated' | 'muted' | 'accent';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  padding?: CardPadding;
}

const paddingStyles: Record<CardPadding, ViewStyle> = {
  none: {
    padding: 0,
  },
  sm: {
    padding: theme.spacing[1],
  },
  md: {
    padding: theme.spacing[2],
  },
  lg: {
    padding: theme.spacing[3],
  },
};

const variantStyles: Record<CardVariant, ViewStyle> = {
  default: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
  },
  elevated: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
  },
  muted: {
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.subtle,
  },
  accent: {
    backgroundColor: theme.colors.accent.clay,
    borderColor: theme.colors.border.strong,
  },
};

export function Card({
  children,
  style,
  variant = 'default',
  padding = 'md',
  disabled,
  onPress,
  ...pressableProps
}: CardProps) {
  const baseStyle = [styles.base, variantStyles[variant], paddingStyles[padding], disabled && styles.disabled, style];

  if (!onPress && !pressableProps.onLongPress) {
    return <View style={baseStyle}>{children}</View>;
  }

  return (
    <Pressable
      android_ripple={{ color: 'transparent' }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [baseStyle, pressed && !disabled && styles.pressed]}
      {...pressableProps}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    ...theme.shadow.card,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  disabled: {
    opacity: 0.7,
  },
});
