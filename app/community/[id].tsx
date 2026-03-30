import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { type ErrorBoundaryProps, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { MasonryGrid } from '@/components/feed';
import { Badge, Button, Card, Skeleton } from '@/components/ui';
import {
  useCommunity,
  useJoinedCommunities,
  useToggleCommunityMembership,
} from '@/hooks/useCommunities';
import { usePostCount, usePosts } from '@/hooks/usePosts';
import { textStyles, theme } from '@/lib/theme';
import { formatWarmError } from '@/utils/errors';
import { formatCount } from '@/utils/formatters';

const DEFAULT_BLURHASH = '|rF?hV%2WCj[ayj[jt7j[ayj[ayj[ayj[ayj[ayfQfQfQfQfQfQ';

function normalizeRouteParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  const errorMessage = formatWarmError(
    props.error,
    'The community screen hit a rendering problem. Retry the route once more.',
  );

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <View style={styles.centeredState}>
        <Card style={styles.feedbackCard} variant="muted">
          <Text style={textStyles.sectionTitle}>This community screen hit a snag</Text>
          <Text style={styles.copy}>{errorMessage}</Text>
          <View style={styles.feedbackActions}>
            <Button onPress={() => void props.retry()}>Retry</Button>
            <Button
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                  return;
                }

                router.replace('/(tabs)');
              }}
              variant="surface"
            >
              Back to app
            </Button>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

export default function CommunityDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const communityId = normalizeRouteParam(params.id);
  const insets = useSafeAreaInsets();

  const communityQuery = useCommunity(communityId);
  const joinedCommunitiesQuery = useJoinedCommunities();
  const membershipMutation = useToggleCommunityMembership();
  const postCountQuery = usePostCount(communityId);
  const postsQuery = usePosts(communityId ?? null);

  const community = communityQuery.data;
  const posts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const isRefreshing = postsQuery.isRefetching && !postsQuery.isFetchingNextPage;
  const joinedCommunityIds = (joinedCommunitiesQuery.data ?? []).map((item) => item.id);
  const isJoined = community ? joinedCommunityIds.includes(community.id) : false;
  const pendingCommunityId =
    membershipMutation.isPending && membershipMutation.variables
      ? membershipMutation.variables.communityId
      : null;
  const hasBlockingError =
    communityQuery.isError || postCountQuery.isError || postsQuery.isError || joinedCommunitiesQuery.isError;
  const errorMessage =
    formatWarmError(communityQuery.error, '') ||
    formatWarmError(postCountQuery.error, '') ||
    formatWarmError(postsQuery.error, '') ||
    formatWarmError(joinedCommunitiesQuery.error, 'This community could not load just yet.');

  const handleRefresh = () => {
    void communityQuery.refetch();
    void postCountQuery.refetch();
    void joinedCommunitiesQuery.refetch();
    void postsQuery.refetch();
  };

  if (!communityId) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <View style={styles.centeredState}>
          <Card style={styles.feedbackCard} variant="muted">
            <Text style={textStyles.sectionTitle}>This community link is incomplete</Text>
            <Text style={styles.copy}>A community id is required before the feed can load.</Text>
            <Button onPress={() => router.back()} variant="surface">
              Back
            </Button>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  if (communityQuery.isLoading && !community) {
    const loadingHeader = (
      <View style={styles.headerWrap}>
        <View style={styles.hero}>
          <Skeleton height={308} radius={theme.radius.lg} />
          <View style={[styles.heroTopRow, { top: insets.top + theme.spacing[1] }]}>
            <Skeleton height={40} radius={theme.radius.pill} width={84} />
            <View style={styles.heroMetricRow}>
              <Skeleton height={28} radius={theme.radius.pill} width={88} />
              <Skeleton height={28} radius={theme.radius.pill} width={72} />
            </View>
          </View>
        </View>

        <Card style={styles.feedbackCard} variant="muted">
          <Skeleton height={32} width="44%" />
          <Skeleton height={34} width="62%" />
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="78%" />
          <Skeleton height={44} radius={theme.radius.pill} width={164} />
        </Card>
      </View>
    );

    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <MasonryGrid
          data={[]}
          emptyCopy=""
          emptyTitle=""
          header={loadingHeader}
          isFetchingNextPage={false}
          isLoading
          isRefreshing={false}
          onEndReached={() => undefined}
          onPostPress={() => undefined}
          onRefresh={() => undefined}
        />
      </SafeAreaView>
    );
  }

  if (!community || hasBlockingError) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <View style={styles.centeredState}>
          <Card style={styles.feedbackCard} variant="muted">
            <Text style={textStyles.sectionTitle}>This community needs another pass</Text>
            <Text style={styles.copy}>{errorMessage}</Text>
            <View style={styles.feedbackActions}>
              <Button onPress={() => router.back()} variant="surface">
                Back
              </Button>
              <Button onPress={handleRefresh}>Try again</Button>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  const header = (
    <View style={styles.headerWrap}>
      <View style={styles.hero}>
        {community.cover_image_url ? (
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            placeholder={{ blurhash: DEFAULT_BLURHASH }}
            source={community.cover_image_url}
            style={styles.heroImage}
            transition={180}
          />
        ) : (
          <View style={styles.heroFallback} />
        )}
        <View style={styles.heroOverlay} />
        <View style={[styles.heroTopRow, { top: insets.top + theme.spacing[1] }]}>
          <Button
            iconLeft={<Feather color={theme.colors.text.primary} name="chevron-left" size={18} />}
            onPress={() => router.back()}
            size="sm"
            style={styles.backButton}
            variant="surface"
          >
            Back
          </Button>
          <View style={styles.heroMetricRow}>
            <Badge label={`${formatCount(community.member_count)} members`} variant="neutral" />
            <Badge
              label={`${formatCount(postCountQuery.data ?? posts.length)} posts`}
              variant="terracotta"
            />
          </View>
        </View>
        <View style={styles.heroContent}>
          <Text style={styles.emoji}>{community.icon_emoji}</Text>
          <Text style={styles.title}>{community.name}</Text>
          <Text style={styles.description}>{community.description}</Text>
          <View style={styles.heroActionRow}>
            <Button
              loading={pendingCommunityId === community.id}
              onPress={() =>
                void membershipMutation.mutateAsync({
                  communityId: community.id,
                  isJoined,
                })
              }
              style={styles.joinButton}
              variant={isJoined ? 'surface' : 'primary'}
            >
              {isJoined ? 'Joined' : 'Join Community'}
            </Button>
          </View>
        </View>
      </View>

      {membershipMutation.isError ? (
        <Card style={styles.feedbackCard} variant="muted">
          <Text style={textStyles.sectionTitle}>Membership update did not land</Text>
          <Text style={styles.copy}>
            {formatWarmError(
              membershipMutation.error,
              'Try the join action again after the connection settles.',
            )}
          </Text>
        </Card>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <MasonryGrid
        data={posts}
        emptyCopy={
          community.is_launched
            ? `No posts have landed in ${community.name} yet. Be the first to set the tone for this space.`
            : `${community.name} has not launched yet, so the feed is still waiting behind the curtain.`
        }
        emptyTitle={
          community.is_launched ? `${community.name} is still quiet` : `${community.name} is not live yet`
        }
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
        onRefresh={handleRefresh}
      />
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
  headerWrap: {
    gap: theme.spacing[2],
    paddingBottom: theme.spacing[1],
  },
  hero: {
    borderRadius: theme.radius.lg,
    height: 308,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  heroFallback: {
    backgroundColor: theme.colors.accent.clay,
    height: '100%',
    width: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(42, 31, 20, 0.34)',
  },
  heroContent: {
    bottom: theme.spacing[2],
    gap: 8,
    left: theme.spacing[2],
    position: 'absolute',
    right: theme.spacing[2],
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: theme.spacing[2],
    position: 'absolute',
    right: theme.spacing[2],
    zIndex: 5,
  },
  heroMetricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  backButton: {
    backgroundColor: 'rgba(245, 237, 224, 0.92)',
  },
  emoji: {
    color: theme.colors.text.inverse,
    fontSize: 32,
  },
  title: {
    color: theme.colors.text.inverse,
    fontFamily: theme.typography.fontFamily.display,
    fontSize: 32,
    lineHeight: 34,
  },
  description: {
    ...textStyles.body,
    color: theme.colors.text.inverse,
  },
  heroActionRow: {
    marginTop: 6,
  },
  joinButton: {
    minWidth: 160,
  },
  feedbackCard: {
    gap: theme.spacing[1],
  },
  feedbackActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
});
