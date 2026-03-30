import { Image } from 'expo-image';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { theme } from '@/lib/theme';

export interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const fallbackPalette = [
  theme.colors.accent.sage,
  theme.colors.accent.dustyRose,
  theme.colors.action.primary,
  theme.colors.action.secondary,
] as const;

function getInitials(name?: string | null) {
  if (!name) {
    return 'A';
  }

  const pieces = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (pieces.length === 0) {
    return 'A';
  }

  return pieces.map((piece) => piece[0]?.toUpperCase() ?? '').join('');
}

function getFallbackColor(name?: string | null) {
  const value = [...(name ?? 'Art Bud')].reduce((total, character) => total + character.charCodeAt(0), 0);
  return fallbackPalette[value % fallbackPalette.length];
}

export function Avatar({ uri, name, size = 48, style }: AvatarProps) {
  const initials = getInitials(name);
  const backgroundColor = getFallbackColor(name);

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          accessibilityLabel={name ?? 'Avatar'}
          cachePolicy="memory-disk"
          contentFit="cover"
          source={uri}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          transition={150}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              {
                fontSize: Math.max(14, size * 0.34),
              },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderColor: theme.colors.background.surface,
    borderWidth: 2,
    overflow: 'hidden',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: theme.colors.text.inverse,
    fontFamily: theme.typography.fontFamily.bodyBold,
  },
});
