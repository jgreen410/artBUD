import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card } from '@/components/ui';
import { Community } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';
import { formatCount } from '@/utils/formatters';

const DEFAULT_BLURHASH = '|rF?hV%2WCj[ayj[jt7j[ayj[ayj[ayj[ayj[ayfQfQfQfQfQfQ';

interface CommunityCardProps {
  community: Community;
  isJoined?: boolean;
  isComingSoon?: boolean;
  isMembershipPending?: boolean;
  onOpen?: (() => void) | null;
  onToggleMembership?: (() => void) | null;
}

export function CommunityCard({
  community,
  isJoined = false,
  isComingSoon = false,
  isMembershipPending = false,
  onOpen = null,
  onToggleMembership = null,
}: CommunityCardProps) {
  return (
    <Card
      padding="none"
      style={[styles.card, isComingSoon && styles.cardComingSoon]}
      variant={isComingSoon ? 'muted' : 'default'}
    >
      <Pressable
        android_ripple={{ color: 'transparent' }}
        disabled={isComingSoon || !onOpen}
        onPress={() => onOpen?.()}
        style={({ pressed }) => [styles.pressable, pressed && !isComingSoon && styles.pressed]}
      >
        <View style={styles.coverWrap}>
          {community.cover_image_url ? (
            <Image
              cachePolicy="memory-disk"
              contentFit="cover"
              placeholder={{ blurhash: DEFAULT_BLURHASH }}
              source={community.cover_image_url}
              style={styles.coverImage}
              transition={160}
            />
          ) : (
            <View style={styles.coverFallback} />
          )}
          <View style={[styles.coverOverlay, isComingSoon && styles.coverOverlayMuted]} />
          <View style={styles.coverTopRow}>
            <Badge
              label={isComingSoon ? 'Coming Soon' : `${formatCount(community.member_count)} members`}
              variant={isComingSoon ? 'comingSoon' : 'neutral'}
            />
            <View style={styles.emojiWrap}>
              <Text style={styles.emoji}>{community.icon_emoji}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleWrap}>
            <Text numberOfLines={2} style={styles.title}>
              {community.name}
            </Text>
            {!isComingSoon ? (
              <Feather color={theme.colors.text.tertiary} name="arrow-up-right" size={16} />
            ) : null}
          </View>
          <Text numberOfLines={3} style={styles.description}>
            {community.description}
          </Text>
        </View>
      </Pressable>

      <View style={styles.footer}>
        {isComingSoon ? (
          <Button disabled fullWidth variant="surface">
            Coming Soon
          </Button>
        ) : (
          <Button
            fullWidth
            loading={isMembershipPending}
            onPress={() => onToggleMembership?.()}
            variant={isJoined ? 'surface' : 'primary'}
          >
            {isJoined ? 'Joined' : 'Join'}
          </Button>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
  },
  cardComingSoon: {
    opacity: 0.85,
  },
  pressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.94,
  },
  coverWrap: {
    height: 148,
    position: 'relative',
  },
  coverImage: {
    height: '100%',
    width: '100%',
  },
  coverFallback: {
    backgroundColor: theme.colors.accent.clay,
    height: '100%',
    width: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(42, 31, 20, 0.2)',
  },
  coverOverlayMuted: {
    backgroundColor: 'rgba(42, 31, 20, 0.34)',
  },
  coverTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 10,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  emojiWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 237, 224, 0.9)',
    borderRadius: theme.radius.round,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  emoji: {
    fontSize: 18,
  },
  body: {
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  titleWrap: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  title: {
    color: theme.colors.text.primary,
    flex: 1,
    fontFamily: theme.typography.fontFamily.display,
    fontSize: 20,
    lineHeight: 22,
  },
  description: {
    ...textStyles.caption,
    color: theme.colors.text.secondary,
  },
  footer: {
    padding: 12,
    paddingTop: 14,
  },
});
