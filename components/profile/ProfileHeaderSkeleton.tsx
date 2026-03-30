import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui';
import { theme } from '@/lib/theme';

interface ProfileHeaderSkeletonProps {
  showActions?: boolean;
}

export function ProfileHeaderSkeleton({
  showActions = true,
}: ProfileHeaderSkeletonProps) {
  return (
    <View style={styles.wrap}>
      <Skeleton height={182} radius={0} />

      <View style={styles.profileBlock}>
        <Skeleton height={92} radius={46} style={styles.avatar} width={92} />

        <View style={styles.identityBlock}>
          <Skeleton height={28} width="64%" />
          <Skeleton height={12} width="32%" />
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="74%" />

          <View style={styles.socialRow}>
            <Skeleton height={34} radius={17} width={34} />
            <Skeleton height={34} radius={17} width={34} />
            <Skeleton height={34} radius={17} width={34} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Skeleton height={18} width="52%" />
            <Skeleton height={12} width="68%" />
          </View>
          <View style={styles.statItem}>
            <Skeleton height={18} width="52%" />
            <Skeleton height={12} width="68%" />
          </View>
          <View style={styles.statItem}>
            <Skeleton height={18} width="52%" />
            <Skeleton height={12} width="68%" />
          </View>
        </View>

        {showActions ? <Skeleton height={48} radius={theme.radius.pill} /> : null}
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
  socialRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
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
    gap: 6,
  },
});
