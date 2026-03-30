import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Badge, Tag } from '@/components/ui';
import { FeedPost } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';
import { formatCount, formatRelativeDate } from '@/utils/formatters';

const DEFAULT_BLURHASH = '|rF?hV%2WCj[ayj[jt7j[ayj[ayj[ayj[ayj[ayfQfQfQfQfQfQ';

interface PostCardProps {
  post: FeedPost;
  onPress?: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const previewTags = [...post.medium_tags.slice(0, 2), ...post.subject_tags.slice(0, 2)].slice(0, 4);

  return (
    <Pressable android_ripple={{ color: 'transparent' }} onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        {post.preview_image_url ? (
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            placeholder={{ blurhash: DEFAULT_BLURHASH }}
            source={post.preview_image_url}
            style={[
              styles.image,
              {
                aspectRatio: post.image_aspect_ratio,
              },
            ]}
            transition={180}
          />
        ) : (
          <View
            style={[
              styles.imageFallback,
              {
                aspectRatio: post.image_aspect_ratio,
              },
            ]}
          >
            <Text style={styles.imageFallbackCopy}>Artwork preview</Text>
          </View>
        )}

        <View style={styles.overlay}>
          <Avatar name={post.author?.display_name ?? post.author?.username ?? 'Artist'} size={34} uri={post.author?.avatar_url} />
          <View style={styles.overlayCopy}>
            <Text numberOfLines={1} style={styles.overlayName}>
              {post.author?.display_name ?? 'Unknown artist'}
            </Text>
            <Text numberOfLines={1} style={styles.overlayMeta}>
              {post.community?.icon_emoji} {post.community?.name ?? 'Community'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={styles.title}>
            {post.title}
          </Text>
          {post.author?.is_professional ? <Badge label="Pro" variant="professional" /> : null}
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather color={theme.colors.action.secondary} name="heart" size={14} />
            <Text style={styles.metaCopy}>{formatCount(post.likes_count)}</Text>
          </View>
          <Text style={styles.metaCopy}>{formatRelativeDate(post.created_at)}</Text>
        </View>
        <View style={styles.tags}>
          {previewTags.map((tag) => (
            <Tag key={`${post.id}-${tag}`} label={tag} size="sm" variant="muted" />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  pressed: {
    opacity: 0.94,
  },
  imageWrap: {
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
  },
  imageFallback: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.elevated,
    justifyContent: 'center',
    width: '100%',
  },
  imageFallbackCopy: {
    ...textStyles.editorial,
    color: theme.colors.text.secondary,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: theme.colors.overlay.warm,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    left: 0,
    padding: 12,
    position: 'absolute',
    right: 0,
  },
  overlayCopy: {
    flex: 1,
    gap: 1,
  },
  overlayName: {
    color: theme.colors.text.inverse,
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: 14,
  },
  overlayMeta: {
    color: theme.colors.text.inverse,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: 12,
  },
  body: {
    gap: 10,
    padding: 12,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  title: {
    ...textStyles.sectionTitle,
    flex: 1,
    fontSize: 18,
    lineHeight: 22,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  metaCopy: {
    ...textStyles.caption,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
