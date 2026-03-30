import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Badge, Tag } from '@/components/ui';
import { useLike } from '@/hooks/useLike';
import { FeedPost } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';
import { formatCount, formatRelativeDate } from '@/utils/formatters';
import { buildPostCardActionHandlers } from './postCardActions';

const DEFAULT_BLURHASH = '|rF?hV%2WCj[ayj[jt7j[ayj[ayj[ayj[ayj[ayfQfQfQfQfQfQ';

interface PostCardProps {
  post: FeedPost;
  onPress?: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const previewTags = [...post.medium_tags.slice(0, 2), ...post.subject_tags.slice(0, 2)].slice(0, 4);
  const like = useLike(post.id);
  const actionHandlers = buildPostCardActionHandlers({
    onOpenPost: onPress,
    onToggleLike: () => void like.toggleLike(),
  });

  return (
    <View style={styles.card}>
      <Pressable
        android_ripple={{ color: 'transparent' }}
        onPress={actionHandlers.onCardPress}
        style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}
        testID={`post-card-open-${post.id}`}
      >
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
          <Text style={styles.metaCopy}>{formatRelativeDate(post.created_at)}</Text>
          <View style={styles.tags}>
            {previewTags.map((tag) => (
              <Tag key={`${post.id}-${tag}`} label={tag} size="sm" variant="muted" />
            ))}
          </View>
        </View>
      </Pressable>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityLabel={like.isLiked ? 'Unlike post' : 'Like post'}
          android_ripple={{ color: 'transparent' }}
          disabled={like.isPending}
          onPress={actionHandlers.onLikePress}
          style={({ pressed }) => [
            styles.actionPill,
            like.isLiked ? styles.likePillActive : styles.likePill,
            pressed && styles.actionPressed,
          ]}
          testID={`post-card-like-${post.id}`}
        >
          {like.isPending ? (
            <ActivityIndicator
              color={like.isLiked ? theme.colors.text.inverse : theme.colors.action.secondary}
              size="small"
            />
          ) : (
            <Ionicons
              color={like.isLiked ? theme.colors.text.inverse : theme.colors.action.secondary}
              name={like.isLiked ? 'heart' : 'heart-outline'}
              size={16}
            />
          )}
          <Text style={[styles.actionCopy, like.isLiked && styles.actionCopyActive]}>
            {formatCount(post.likes_count)}
          </Text>
        </Pressable>

        <View style={styles.actionPill}>
          <Feather color={theme.colors.accent.sage} name="message-circle" size={15} />
          <Text style={styles.actionCopy}>{formatCount(post.comments_count)}</Text>
        </View>
      </View>
    </View>
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
  cardPressable: {
    flex: 1,
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
    paddingBottom: 10,
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
  metaCopy: {
    ...textStyles.caption,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionRow: {
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  actionPill: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  likePill: {
    backgroundColor: theme.colors.background.base,
  },
  likePillActive: {
    backgroundColor: theme.colors.action.secondary,
    borderColor: theme.colors.action.secondary,
  },
  actionPressed: {
    opacity: 0.9,
  },
  actionCopy: {
    ...textStyles.caption,
    color: theme.colors.text.primary,
  },
  actionCopyActive: {
    color: theme.colors.text.inverse,
  },
});
