import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { PortfolioGrid, ProfileHeader, ProfileHeaderSkeleton } from '@/components/profile';
import { Button, Card, Skeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useProfilePosts, useProfileStats } from '@/hooks/useProfile';
import { textStyles, theme } from '@/lib/theme';
import { formatWarmError } from '@/utils/errors';

export default function OwnProfileScreen() {
  const { profile: authProfile, signOut, user } = useAuth();
  const profileId = user?.id ?? authProfile?.id;

  const profileQuery = useProfile(profileId);
  const statsQuery = useProfileStats(profileId);
  const postsQuery = useProfilePosts(profileId);

  const profile = profileQuery.data ?? authProfile ?? null;
  const stats = statsQuery.data ?? { postsCount: 0, followersCount: 0, followingCount: 0 };
  const isLoading = profileQuery.isLoading && !profile;
  const hasError = profileQuery.isError || statsQuery.isError || postsQuery.isError;
  const errorMessage =
    formatWarmError(profileQuery.error, '') ||
    formatWarmError(statsQuery.error, '') ||
    formatWarmError(postsQuery.error, 'Your profile could not load just yet.');

  if (isLoading) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ProfileHeaderSkeleton />
          <View style={styles.sectionHeader}>
            <Skeleton height={22} width="28%" />
            <Skeleton height={14} width="58%" />
          </View>
          <View style={styles.portfolioLoadingGrid}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Skeleton
                key={`profile-post-loading-${index}`}
                height={118}
                style={styles.portfolioLoadingCell}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!profile || hasError) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <View style={styles.content}>
          <Card style={styles.card} variant="muted">
            <Text style={textStyles.sectionTitle}>Your profile needs another pass</Text>
            <Text style={styles.copy}>{errorMessage}</Text>
            <View style={styles.actionsRow}>
              <Button
                onPress={() => {
                  void profileQuery.refetch();
                  void statsQuery.refetch();
                  void postsQuery.refetch();
                }}
              >
                Try again
              </Button>
              <Button onPress={() => void signOut()} variant="surface">
                Sign out
              </Button>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              void profileQuery.refetch();
              void statsQuery.refetch();
              void postsQuery.refetch();
            }}
            progressBackgroundColor={theme.colors.background.surface}
            refreshing={profileQuery.isRefetching || statsQuery.isRefetching || postsQuery.isRefetching}
            tintColor={theme.colors.action.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          actionLabel="Sign out"
          actionVariant="outline"
          onActionPress={() => void signOut()}
          profile={profile}
          stats={stats}
        />

        <View style={styles.sectionHeader}>
          <Text style={textStyles.sectionTitle}>Portfolio</Text>
          <Text style={styles.caption}>Tap any piece to reopen it in full detail.</Text>
        </View>

        <PortfolioGrid
          onPostPress={(postId) => router.push(`/post/${postId}`)}
          posts={postsQuery.data ?? []}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background.base,
    flex: 1,
  },
  centeredState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[2],
  },
  statusCopy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  content: {
    gap: theme.spacing[2],
    padding: theme.spacing[2],
  },
  card: {
    gap: theme.spacing[1],
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  sectionHeader: {
    gap: 4,
  },
  portfolioLoadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  portfolioLoadingCell: {
    marginHorizontal: 6,
    marginVertical: 6,
    width: '30%',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  caption: {
    ...textStyles.caption,
    color: theme.colors.text.secondary,
  },
});
