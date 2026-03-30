import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '@/lib/theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height, radius = theme.radius.md, style }: SkeletonProps) {
  return (
    <View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: radius,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
    borderWidth: 1,
  },
});
