import { StyleSheet, Text, View } from 'react-native';

import { Button, Input } from '@/components/ui';
import { textStyles, theme } from '@/lib/theme';

interface CommentInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  bottomInset?: number;
}

export function CommentInput({
  value,
  onChangeText,
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
  bottomInset = 0,
}: CommentInputProps) {
  const trimmedValue = value.trim();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(bottomInset, theme.spacing[1]),
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={textStyles.meta}>Join The Conversation</Text>
        <Text style={styles.counter}>{value.length}/280</Text>
      </View>
      <Input
        inputStyle={styles.inputCopy}
        multiline
        onChangeText={onChangeText}
        placeholder="Share what you notice, what resonates, or what question this piece sparks."
        value={value}
        maxLength={280}
      />
      {errorMessage ? <Text style={styles.errorCopy}>{errorMessage}</Text> : null}
      <Button
        disabled={trimmedValue.length === 0}
        fullWidth
        loading={isSubmitting}
        onPress={onSubmit}
      >
        Post Comment
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.base,
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: 1,
    gap: 10,
    paddingHorizontal: theme.spacing[2],
    paddingTop: theme.spacing[2],
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  counter: {
    ...textStyles.caption,
    color: theme.colors.text.tertiary,
  },
  inputCopy: {
    minHeight: 74,
  },
  errorCopy: {
    ...textStyles.caption,
    color: theme.colors.state.danger,
  },
});
