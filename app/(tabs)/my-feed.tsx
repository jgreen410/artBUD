import { router } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { FilterChips, MasonryGrid } from '@/components/feed';
import { Avatar, Badge, Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useJoinedCommunities } from '@/hooks/useCommunities';
import { usePostsForCommunities } from '@/hooks/usePosts';
import { textStyles, theme } from '@/lib/theme';
import { useFeedStore } from '@/stores/feedStore';
import { formatWarmError } from '@/utils/errors';

export default function JoinedCommunitiesFeedScreen() {
  const { profile } = useAuth();
  const selectedCommunityId = useFeedStore((state) => state.myFeedSelectedCommunityId);
  const setSelectedCommunityId = useFeedStore((state) => state.setMyFeedSelectedCommunityId);
  const setMyFeedScrollOffset = useFeedStore((state) => state.setMyFeedScrollOffset);

  const joinedCommunitiesQuery = useJoinedCommunities();
  const joinedCommunities = joinedCommunitiesQuery.data ?? [];
  const joinedCommunityIds = joinedCommunities.map((community) => community.id);
  const selectedCommunity =
    joinedCommunities.find((community) => community.id === selectedCommunityId) ?? null;
  const activeCommunityIds = selectedCommunityId ? [selectedCommunityId] : joinedCommunityIds;
  const postsQuery = usePostsForCommunities(activeCommunityIds);

  const posts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const isRefreshing = postsQuery.isRefetching && !postsQuery.isFetchingNextPage;
  const hasBlockingError = joinedCommunitiesQuery.isError || postsQuery.isError;
  const errorMessage =
    formatWarmError(joinedCommunitiesQuery.error, '') ||
    formatWarmError(postsQuery.error, '') ||
    null;

  useEffect(() => {
    if (selectedCommunityId && !joinedCommunityIds.includes(selectedCommunityId)) {
      setSelectedCommunityId(null);
    }
  }, [joinedCommunityIds, selectedCommunityId, setSelectedCommunityId]);

  if (!joinedCommunitiesQuery.isLoading && joinedCommunities.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyStateWrap}>
          <Card style={styles.emptyCard}>
            <Text style={textStyles.screenTitle}>Your Feed Starts With A Join</Text>
            <Text style={styles.copy}>
              This tab only shows posts from communities you have joined. Pick a few spaces first,
              then come back here for a more personal stream.
            </Text>
            <Button onPress={() => router.push('/(tabs)/communities')}>Browse Communities</Button>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  const header = (
    <View style={styles.headerWrap}>
      <View style={styles.headerTop}>
        <View style={styles.headerCopy}>
          <Text style={textStyles.meta}>My Feed</Text>
          <Text style={textStyles.screenTitle}>Inside Your Circles</Text>
          <Text style={styles.copy}>
            A tighter feed shaped only by the communities you&apos;ve chosen to join.
          </Text>
        </View>
        <Avatar name={profile?.display_name} size={52} uri={profile?.avatar_url ?? undefined} />
      </View>

      <View style={styles.summaryRow}>
        <Badge label={`${joinedCommunities.length} Joined`} variant="professional" />
        <Badge
          label={selectedCommunity ? `${selectedCommunity.icon_emoji} ${selectedCommunity.name}` : 'All Joined'}
          variant={selectedCommunity ? 'launched' : 'neutral'}
        />
      </View>

      <FilterChips
        allLabel="All Joined"
        communities={joinedCommunities}
        onSelect={setSelectedCommunityId}
        selectedCommunityId={selectedCommunityId}
      />

      {hasBlockingError ? (
        <Card style={styles.errorCard} variant="muted">
          <Text style={textStyles.sectionTitle}>Joined feed needs another pass</Text>
          <Text style={styles.copy}>
            {errorMessage ??
              'The joined communities feed could not load just yet. Refresh after the connection settles.'}
          </Text>
        </Card>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <MasonryGrid
        data={posts}
        emptyCopy={
          selectedCommunity
            ? `No posts have landed in ${selectedCommunity.name} yet. Keep this space joined and it will fill as artists share work.`
            : 'Your joined communities are quiet right now. Refresh or open a community and be the first to post.'
        }
        emptyTitle={selectedCommunity ? `${selectedCommunity.name} is quiet` : 'Your joined feed is quiet'}
        header={header}
        isFetchingNextPage={postsQuery.isFetchingNextPage}
        isLoading={postsQuery.isLoading}
        isRefreshing={isRefreshing}
        onEndReached={() => {
          if (postsQuery.hasNextPage && !postsQuery.isFetchingNextPage) {
            void postsQuery.fetchNextPage();
          }
        }}
        onPostPress={(post) => router.push(`/post/${post.id}`)}
        onRefresh={() => {
          void postsQuery.refetch();
          void joinedCommunitiesQuery.refetch();
        }}
        onScroll={setMyFeedScrollOffset}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background.base,
    flex: 1,
  },
  headerWrap: {
    gap: theme.spacing[2],
    paddingBottom: theme.spacing[2],
  },
  headerTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  errorCard: {
    gap: theme.spacing[1],
  },
  emptyStateWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing[3],
  },
  emptyCard: {
    gap: theme.spacing[2],
  },
});
