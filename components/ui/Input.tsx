import { forwardRef, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { textStyles, theme } from '@/lib/theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    hint,
    error,
    containerStyle,
    inputStyle,
    leftAdornment,
    rightAdornment,
    multiline,
    onFocus,
    onBlur,
    placeholderTextColor = theme.colors.text.tertiary,
    ...textInputProps
  },
  ref,
) {
  const [focused, setFocused] = useState(false);

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur: NonNullable<TextInputProps['onBlur']> = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          Boolean(error) && styles.fieldError,
          multiline && styles.multilineField,
        ]}
      >
        {leftAdornment ? <View style={styles.adornment}>{leftAdornment}</View> : null}
        <TextInput
          multiline={multiline}
          placeholderTextColor={placeholderTextColor}
          ref={ref}
          selectionColor={theme.colors.action.primary}
          style={[styles.input, multiline && styles.inputMultiline, inputStyle]}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...textInputProps}
        />
        {rightAdornment ? <View style={styles.adornment}>{rightAdornment}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    ...textStyles.bodyMedium,
    marginBottom: 8,
  },
  field: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  fieldFocused: {
    borderColor: theme.colors.action.primary,
    borderWidth: 1.5,
  },
  fieldError: {
    borderColor: theme.colors.state.danger,
  },
  multilineField: {
    alignItems: 'flex-start',
    minHeight: 128,
    paddingVertical: 14,
  },
  input: {
    ...textStyles.input,
    flex: 1,
    paddingVertical: 14,
  },
  inputMultiline: {
    minHeight: 96,
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  adornment: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  hint: {
    ...textStyles.caption,
    marginTop: 8,
  },
  error: {
    ...textStyles.caption,
    color: theme.colors.state.danger,
    marginTop: 8,
  },
});
