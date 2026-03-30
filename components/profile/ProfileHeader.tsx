import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar, Badge, Button } from '@/components/ui';
import { UserProfile } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';
import { formatCount } from '@/utils/formatters';

import { SocialLinks } from './SocialLinks';

interface ProfileStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

interface ProfileHeaderProps {
  profile: UserProfile;
  stats: ProfileStats;
  actionLabel?: string | null;
  onActionPress?: (() => void) | null;
  actionVariant?: 'primary' | 'surface' | 'outline';
  actionLoading?: boolean;
  secondaryActionLabel?: string | null;
  onSecondaryActionPress?: (() => void) | null;
}

export function ProfileHeader({
  profile,
  stats,
  actionLabel = null,
  onActionPress = null,
  actionVariant = 'primary',
  actionLoading = false,
  secondaryActionLabel = null,
  onSecondaryActionPress = null,
}: ProfileHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.coverWrap}>
        {profile.cover_image_url ? (
          <Image cachePolicy="memory-disk" contentFit="cover" source={profile.cover_image_url} style={styles.coverImage} transition={180} />
        ) : (
          <View style={styles.coverFallback} />
        )}
        <View style={styles.coverOverlay} />
      </View>

      <View style={styles.profileBlock}>
        <Avatar
          name={profile.display_name || profile.username}
          size={92}
          style={styles.avatar}
          uri={profile.avatar_url}
        />

        <View style={styles.identityBlock}>
          <View style={styles.nameRow}>
            <Text numberOfLines={2} style={styles.displayName}>
              {profile.display_name}
            </Text>
            {profile.is_professional ? <Badge label="Pro Artist" variant="professional" /> : null}
          </View>
          <Text style={styles.username}>@{profile.username}</Text>
          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
          <SocialLinks links={profile.social_links} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCount(stats.postsCount)}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCount(stats.followersCount)}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCount(stats.followingCount)}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {actionLabel || secondaryActionLabel ? (
          <View style={styles.actionsRow}>
            {actionLabel && onActionPress ? (
              <Button
                fullWidth
                loading={actionLoading}
                onPress={onActionPress}
                style={styles.primaryAction}
                variant={actionVariant}
              >
                {actionLabel}
              </Button>
            ) : null}
            {secondaryActionLabel && onSecondaryActionPress ? (
              <Button
                fullWidth
                onPress={onSecondaryActionPress}
                style={styles.secondaryAction}
                variant="outline"
              >
                {secondaryActionLabel}
              </Button>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  coverWrap: {
    height: 182,
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
    backgroundColor: 'rgba(42, 31, 20, 0.16)',
  },
  profileBlock: {
    gap: theme.spacing[2],
    paddingBottom: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    paddingTop: 0,
  },
  avatar: {
    marginTop: -42,
  },
  identityBlock: {
    gap: 8,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  displayName: {
    color: theme.colors.text.primary,
    flexShrink: 1,
    fontFamily: theme.typography.fontFamily.display,
    fontSize: 28,
    lineHeight: 30,
  },
  username: {
    ...textStyles.caption,
    color: theme.colors.text.tertiary,
  },
  bio: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  statsRow: {
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statValue: {
    ...textStyles.bodyBold,
  },
  statLabel: {
    ...textStyles.caption,
    color: theme.colors.text.secondary,
  },
  actionsRow: {
    gap: 10,
  },
  primaryAction: {
    alignSelf: 'stretch',
  },
  secondaryAction: {
    alignSelf: 'stretch',
  },
});
