import { Children } from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { textStyles, theme } from '@/lib/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'surface';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    minHeight: 40,
    paddingHorizontal: 16,
  },
  md: {
    minHeight: 48,
    paddingHorizontal: 20,
  },
  lg: {
    minHeight: 56,
    paddingHorizontal: 24,
  },
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: theme.colors.action.primary,
    borderColor: theme.colors.action.primary,
  },
  secondary: {
    backgroundColor: theme.colors.action.secondary,
    borderColor: theme.colors.action.secondary,
  },
  outline: {
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.strong,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  surface: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
  },
};

const pressedStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: theme.colors.action.primaryPressed,
    borderColor: theme.colors.action.primaryPressed,
  },
  secondary: {
    backgroundColor: theme.colors.action.secondaryPressed,
    borderColor: theme.colors.action.secondaryPressed,
  },
  outline: {
    backgroundColor: theme.colors.background.surface,
  },
  ghost: {
    backgroundColor: theme.colors.background.surface,
  },
  surface: {
    backgroundColor: theme.colors.background.elevated,
  },
};

const labelStyles: Record<ButtonVariant, TextStyle> = {
  primary: {
    color: theme.colors.text.inverse,
  },
  secondary: {
    color: theme.colors.text.inverse,
  },
  outline: {
    color: theme.colors.text.primary,
  },
  ghost: {
    color: theme.colors.text.primary,
  },
  surface: {
    color: theme.colors.text.primary,
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  style,
  labelStyle,
  iconLeft,
  iconRight,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const childArray = Children.toArray(children);
  const isTextChild = childArray.length > 0 && childArray.every((child) => typeof child === 'string' || typeof child === 'number');
  const textContent = isTextChild ? childArray.join('') : null;

  return (
    <Pressable
      accessibilityRole="button"
      android_ripple={{ color: 'transparent' }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && pressedStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={labelStyles[variant].color} size="small" />
        ) : (
          <>
            {iconLeft ? <View style={styles.icon}>{iconLeft}</View> : null}
            {isTextChild ? (
              <Text style={[textStyles.buttonLabel, labelStyles[variant], labelStyle]}>{textContent}</Text>
            ) : (
              children
            )}
            {iconRight ? <View style={styles.icon}>{iconRight}</View> : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.55,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
