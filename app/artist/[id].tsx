import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PortfolioGrid, ProfileHeader, ProfileHeaderSkeleton } from '@/components/profile';
import { Button, Card, Skeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useFollow } from '@/hooks/useFollow';
import { useProfile, useProfilePosts, useProfileStats } from '@/hooks/useProfile';
import { textStyles, theme } from '@/lib/theme';
import { formatWarmError } from '@/utils/errors';

export default function ArtistProfileScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const profileQuery = useProfile(params.id);
  const statsQuery = useProfileStats(params.id);
  const postsQuery = useProfilePosts(params.id);
  const follow = useFollow(params.id);

  const profile = profileQuery.data;
  const stats = statsQuery.data ?? { postsCount: 0, followersCount: 0, followingCount: 0 };
  const isOwnProfile = Boolean(user?.id && params.id && user.id === params.id);
  const isLoading = profileQuery.isLoading && !profile;
  const hasError = profileQuery.isError || statsQuery.isError || postsQuery.isError;
  const errorMessage =
    formatWarmError(profileQuery.error, '') ||
    formatWarmError(statsQuery.error, '') ||
    formatWarmError(postsQuery.error, 'This artist profile could not load just yet.');

  if (!params.id) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <View style={styles.centeredState}>
          <Card style={styles.card} variant="muted">
            <Text style={textStyles.sectionTitle}>This artist link is incomplete</Text>
            <Text style={styles.copy}>A profile id is required before the artist page can load.</Text>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ProfileHeaderSkeleton showActions={!isOwnProfile} />
          <View style={styles.sectionHeader}>
            <Skeleton height={22} width="28%" />
            <Skeleton height={14} width="58%" />
          </View>
          <View style={styles.portfolioLoadingGrid}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Skeleton
                key={`artist-post-loading-${index}`}
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
            <Text style={textStyles.sectionTitle}>This artist profile needs another pass</Text>
            <Text style={styles.copy}>{errorMessage}</Text>
            <View style={styles.actionsRow}>
              <Button onPress={() => router.back()} variant="surface">
                Back
              </Button>
              <Button
                onPress={() => {
                  void profileQuery.refetch();
                  void statsQuery.refetch();
                  void postsQuery.refetch();
                }}
              >
                Try again
              </Button>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <View
        style={[
          styles.backButtonWrap,
          {
            top: insets.top + theme.spacing[1],
          },
        ]}
      >
        <Button
          iconLeft={<Feather color={theme.colors.text.primary} name="chevron-left" size={18} />}
          onPress={() => router.back()}
          size="sm"
          style={styles.backButton}
          variant="surface"
        >
          Back
        </Button>
      </View>

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
          actionLabel={
            isOwnProfile ? null : follow.isFollowing ? 'Following' : follow.canFollow ? 'Follow' : null
          }
          actionLoading={follow.isPending}
          actionVariant={follow.isFollowing ? 'surface' : 'primary'}
          onActionPress={
            !isOwnProfile && follow.canFollow ? () => void follow.toggleFollow() : null
          }
          profile={profile}
          stats={stats}
        />

        <View style={styles.sectionHeader}>
          <Text style={textStyles.sectionTitle}>Portfolio</Text>
          <Text style={styles.caption}>Tap into any artwork to return to the full post view.</Text>
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
    paddingTop: theme.spacing[7],
  },
  card: {
    gap: theme.spacing[1],
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  backButtonWrap: {
    left: theme.spacing[2],
    position: 'absolute',
    zIndex: 5,
  },
  backButton: {
    backgroundColor: 'rgba(245, 237, 224, 0.92)',
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
