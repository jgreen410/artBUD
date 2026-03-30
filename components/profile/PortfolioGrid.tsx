import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { FeedPost } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';
import { formatCount } from '@/utils/formatters';

const DEFAULT_BLURHASH = '|rF?hV%2WCj[ayj[jt7j[ayj[ayj[ayj[ayj[ayfQfQfQfQfQfQ';
const GRID_GAP = 8;

interface PortfolioGridProps {
  posts: FeedPost[];
  onPostPress: (postId: string) => void;
}

export function PortfolioGrid({ posts, onPostPress }: PortfolioGridProps) {
  const { width } = useWindowDimensions();
  const tileSize = Math.floor((width - theme.spacing[2] * 2 - GRID_GAP * 2) / 3);

  if (posts.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={textStyles.sectionTitle}>Portfolio still warming up</Text>
        <Text style={styles.emptyCopy}>No published work has landed here yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {posts.map((post) => (
        <Pressable
          key={post.id}
          android_ripple={{ color: 'transparent' }}
          onPress={() => onPostPress(post.id)}
          style={({ pressed }) => [styles.tileWrap, pressed && styles.tilePressed]}
        >
          <View
            style={[
              styles.tileFrame,
              {
                width: tileSize,
                height: tileSize,
              },
            ]}
          >
            {post.preview_image_url ? (
              <Image
                cachePolicy="memory-disk"
                contentFit="cover"
                placeholder={{ blurhash: DEFAULT_BLURHASH }}
                source={post.preview_image_url}
                style={styles.tileImage}
                transition={150}
              />
            ) : (
              <View style={styles.tileFallback}>
                <Text style={styles.tileFallbackCopy}>Art</Text>
              </View>
            )}

            <View style={styles.metricsOverlay}>
              <View style={styles.metricPill}>
                <Feather color={theme.colors.text.inverse} name="heart" size={12} />
                <Text style={styles.metricCopy}>{formatCount(post.likes_count)}</Text>
              </View>
              <View style={styles.metricPill}>
                <Feather color={theme.colors.text.inverse} name="message-circle" size={12} />
                <Text style={styles.metricCopy}>{formatCount(post.comments_count)}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  tileWrap: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  tilePressed: {
    opacity: 0.92,
  },
  tileFrame: {
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  tileImage: {
    backgroundColor: theme.colors.background.elevated,
    height: '100%',
    width: '100%',
  },
  tileFallback: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.elevated,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  tileFallbackCopy: {
    ...textStyles.editorial,
    color: theme.colors.text.secondary,
  },
  metricsOverlay: {
    alignItems: 'center',
    backgroundColor: theme.colors.overlay.strong,
    bottom: 0,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 7,
    position: 'absolute',
    right: 0,
  },
  metricPill: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metricCopy: {
    ...textStyles.caption,
    color: theme.colors.text.inverse,
    fontSize: 12,
    lineHeight: 14,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: 8,
    padding: theme.spacing[3],
  },
  emptyCopy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
