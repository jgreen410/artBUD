import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChips, MasonryGrid } from '@/components/feed';
import { LogoMark } from '@/components/icons';
import { Avatar, Badge, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useCommunities } from '@/hooks/useCommunities';
import { usePosts } from '@/hooks/usePosts';
import { textStyles, theme } from '@/lib/theme';
import { useFeedStore } from '@/stores/feedStore';
import { formatWarmError } from '@/utils/errors';

export default function HomeFeedScreen() {
  const { profile } = useAuth();
  const selectedCommunityId = useFeedStore((state) => state.selectedCommunityId);
  const setSelectedCommunityId = useFeedStore((state) => state.setSelectedCommunityId);
  const setHomeScrollOffset = useFeedStore((state) => state.setHomeScrollOffset);

  const communitiesQuery = useCommunities();
  const postsQuery = usePosts(selectedCommunityId);

  const posts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const selectedCommunity = communitiesQuery.data?.find((community) => community.id === selectedCommunityId) ?? null;
  const isRefreshing = postsQuery.isRefetching && !postsQuery.isFetchingNextPage;
  const hasBlockingError = postsQuery.isError || communitiesQuery.isError;
  const errorMessage =
    formatWarmError(postsQuery.error, '') ||
    formatWarmError(communitiesQuery.error, '') ||
    null;

  const header = (
    <View style={styles.headerWrap}>
      <View style={styles.headerTop}>
        <View style={styles.headerCopy}>
          <LogoMark size={40} />
          <Text style={textStyles.screenTitle}>Fresh From The Studio</Text>
          <Text style={styles.copy}>
            A Pinterest-style river of work across the launch communities, shaped for quick
            browsing and serendipitous discovery.
          </Text>
        </View>
        <Avatar name={profile?.display_name} size={52} uri={profile?.avatar_url ?? undefined} />
      </View>

      <View style={styles.summaryRow}>
        <Badge
          label={selectedCommunity ? `${selectedCommunity.icon_emoji} ${selectedCommunity.name}` : 'All Communities'}
          variant={selectedCommunity ? 'launched' : 'neutral'}
        />
        {profile?.is_professional ? <Badge label="Pro Artist" variant="professional" /> : null}
      </View>

      <FilterChips
        communities={communitiesQuery.data ?? []}
        onSelect={setSelectedCommunityId}
        selectedCommunityId={selectedCommunityId}
      />

      {hasBlockingError ? (
        <Card style={styles.errorCard} variant="muted">
          <Text style={textStyles.sectionTitle}>Feed connection needs attention</Text>
          <Text style={styles.copy}>
            {errorMessage ??
              'The feed could not settle just yet. Pull to refresh and try again.'}
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
            ? `No posts have landed in ${selectedCommunity.name} yet. Seed demo data or be the first to share work.`
            : 'No posts have landed yet. Seed demo data or be the first artist to share work.'
        }
        emptyTitle={selectedCommunity ? `${selectedCommunity.name} is still quiet` : 'The feed is warming up'}
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
          void communitiesQuery.refetch();
        }}
        onScroll={setHomeScrollOffset}
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
});
