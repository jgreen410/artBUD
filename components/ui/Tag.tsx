import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { textStyles, theme } from '@/lib/theme';

type TagVariant = 'default' | 'selected' | 'accent' | 'muted';
type TagSize = 'sm' | 'md';

export interface TagProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: TagVariant;
  size?: TagSize;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<TagSize, ViewStyle> = {
  sm: {
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  md: {
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
};

const variantStyles: Record<TagVariant, ViewStyle> = {
  default: {
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.subtle,
  },
  selected: {
    backgroundColor: theme.colors.action.primary,
    borderColor: theme.colors.action.primary,
  },
  accent: {
    backgroundColor: theme.colors.accent.sage,
    borderColor: theme.colors.accent.sage,
  },
  muted: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
  },
};

const textVariants: Record<TagVariant, TextStyle> = {
  default: {
    color: theme.colors.text.primary,
  },
  selected: {
    color: theme.colors.text.inverse,
  },
  accent: {
    color: theme.colors.text.inverse,
  },
  muted: {
    color: theme.colors.text.secondary,
  },
};

export function Tag({
  label,
  variant = 'default',
  size = 'md',
  style,
  labelStyle,
  leftIcon,
  rightIcon,
  disabled,
  onPress,
  ...pressableProps
}: TagProps) {
  const content = (
    <View style={styles.content}>
      {leftIcon ? <View>{leftIcon}</View> : null}
      <Text style={[textStyles.chip, textVariants[variant], labelStyle]}>{label}</Text>
      {rightIcon ? <View>{rightIcon}</View> : null}
    </View>
  );

  if (!onPress && !pressableProps.onLongPress) {
    return <View style={[styles.base, sizeStyles[size], variantStyles[variant], disabled && styles.disabled, style]}>{content}</View>;
  }

  return (
    <Pressable
      android_ripple={{ color: 'transparent' }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.55,
  },
});
