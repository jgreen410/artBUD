import { Feather } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { SocialLinks as SocialLinksShape } from '@/lib/types';
import { theme } from '@/lib/theme';

interface SocialLinksProps {
  links?: SocialLinksShape | null;
}

function normalizeUrl(url: string) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

const linkConfig = [
  { key: 'instagram', icon: 'instagram' },
  { key: 'website', icon: 'globe' },
  { key: 'tiktok', icon: 'music' },
  { key: 'twitter', icon: 'twitter' },
  { key: 'facebook', icon: 'facebook' },
] as const;

export function SocialLinks({ links }: SocialLinksProps) {
  const activeLinks = linkConfig.filter((item) => {
    const value = links?.[item.key];
    return typeof value === 'string' && value.trim().length > 0;
  });

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <View style={styles.row}>
      {activeLinks.map((item) => {
        const url = normalizeUrl(links?.[item.key] ?? '');

        return (
          <Pressable
            key={item.key}
            android_ripple={{ color: 'transparent' }}
            onPress={() => void Linking.openURL(url)}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            <Feather color={theme.colors.text.primary} name={item.icon} size={16} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.round,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  iconButtonPressed: {
    opacity: 0.9,
  },
});
