import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { textStyles, theme } from '@/lib/theme';

export default function AuthCallbackScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.action.primary} size="small" />
      <Text style={textStyles.sectionTitle}>Finishing sign in</Text>
      <Text style={styles.copy}>Art Bud is completing the secure redirect.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.base,
    flex: 1,
    gap: theme.spacing[2],
    justifyContent: 'center',
    padding: theme.spacing[3],
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
