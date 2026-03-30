import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommunityGrid } from '@/components/community';
import { Badge, Card, Input, Skeleton } from '@/components/ui';
import {
  useAllCommunities,
  useJoinedCommunities,
  useToggleCommunityMembership,
} from '@/hooks/useCommunities';
import { Community } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';
import { formatWarmError } from '@/utils/errors';

function matchesSearch(community: Community, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }

  const haystack = `${community.name} ${community.slug} ${community.description}`.toLowerCase();
  return haystack.includes(normalizedQuery);
}

export default function CommunitiesHubScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const allCommunitiesQuery = useAllCommunities();
  const joinedCommunitiesQuery = useJoinedCommunities();
  const membershipMutation = useToggleCommunityMembership();

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const communities = allCommunitiesQuery.data ?? [];
  const joinedCommunityIds = (joinedCommunitiesQuery.data ?? []).map((community) => community.id);

  const filteredLaunchedCommunities = useMemo(
    () =>
      communities.filter(
        (community) => community.is_launched && matchesSearch(community, normalizedQuery),
      ),
    [communities, normalizedQuery],
  );

  const filteredFutureCommunities = useMemo(
    () =>
      communities.filter(
        (community) => !community.is_launched && matchesSearch(community, normalizedQuery),
      ),
    [communities, normalizedQuery],
  );

  const hasBlockingError = allCommunitiesQuery.isError || joinedCommunitiesQuery.isError;
  const errorMessage =
    formatWarmError(allCommunitiesQuery.error, '') ||
    formatWarmError(joinedCommunitiesQuery.error, 'Communities could not load just yet.');

  const pendingCommunityId =
    membershipMutation.isPending && membershipMutation.variables
      ? membershipMutation.variables.communityId
      : null;

  const handleToggleMembership = async (community: Community, isJoined: boolean) => {
    try {
      await membershipMutation.mutateAsync({
        communityId: community.id,
        isJoined,
      });
    } catch {
      return;
    }
  };

  if (allCommunitiesQuery.isLoading && communities.length === 0) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Skeleton height={28} radius={theme.radius.pill} width="30%" />
            <Skeleton height={34} width="62%" />
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="82%" />
          </View>

          <View style={styles.summaryRow}>
            <Skeleton height={30} radius={theme.radius.pill} width="28%" />
            <Skeleton height={30} radius={theme.radius.pill} width="20%" />
            <Skeleton height={30} radius={theme.radius.pill} width="34%" />
          </View>

          <Skeleton height={56} width="100%" />

          <View style={styles.communitySkeletonGrid}>
            {[0, 1, 2, 3].map((index) => (
              <View key={`community-loading-${index}`} style={styles.communitySkeletonCell}>
                <View style={styles.communitySkeletonCard}>
                  <Skeleton height={152} radius={0} />
                  <View style={styles.communitySkeletonBody}>
                    <Skeleton height={18} width="72%" />
                    <Skeleton height={12} width="44%" />
                    <Skeleton height={40} radius={theme.radius.pill} width="54%" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              void allCommunitiesQuery.refetch();
              void joinedCommunitiesQuery.refetch();
            }}
            progressBackgroundColor={theme.colors.background.surface}
            refreshing={allCommunitiesQuery.isRefetching || joinedCommunitiesQuery.isRefetching}
            tintColor={theme.colors.action.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Badge label="Communities" variant="launched" />
          <Text style={textStyles.screenTitle}>Find Your Corner</Text>
          <Text style={styles.copy}>
            Browse the launch communities, join the ones that fit your practice, and preview the
            next wave of hubs that are still warming up.
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Badge
            label={`${joinedCommunityIds.length} Joined`}
            variant={joinedCommunityIds.length > 0 ? 'professional' : 'neutral'}
          />
          <Badge label={`${communities.filter((community) => community.is_launched).length} Live`} variant="launched" />
          <Badge label={`${communities.filter((community) => !community.is_launched).length} Coming Soon`} variant="comingSoon" />
        </View>

        <Input
          containerStyle={styles.searchInput}
          leftAdornment={<Feather color={theme.colors.text.tertiary} name="search" size={16} />}
          onChangeText={setSearchQuery}
          placeholder="Search painting, photography, digital art..."
          value={searchQuery}
        />

        {hasBlockingError ? (
          <Card style={styles.card} variant="muted">
            <Text style={textStyles.sectionTitle}>Community hub needs another pass</Text>
            <Text style={styles.copy}>{errorMessage}</Text>
          </Card>
        ) : null}

        {membershipMutation.isError ? (
          <Card style={styles.card} variant="muted">
            <Text style={textStyles.sectionTitle}>Membership change did not stick</Text>
            <Text style={styles.copy}>
              {formatWarmError(
                membershipMutation.error,
                'Try the join action again once the connection settles.',
              )}
            </Text>
          </Card>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={textStyles.sectionTitle}>Launch Communities</Text>
            <Text style={styles.caption}>
              {normalizedQuery
                ? `${filteredLaunchedCommunities.length} match${filteredLaunchedCommunities.length === 1 ? '' : 'es'}`
                : 'Open for joining now'}
            </Text>
          </View>

          {filteredLaunchedCommunities.length === 0 ? (
            <Card style={styles.card} variant="muted">
              <Text style={textStyles.sectionTitle}>No launch communities match that search</Text>
              <Text style={styles.copy}>
                Try a broader term like painting, digital, or photography.
              </Text>
            </Card>
          ) : (
            <CommunityGrid
              communities={filteredLaunchedCommunities}
              joinedCommunityIds={joinedCommunityIds}
              onOpenCommunity={(communityId) => router.push(`/community/${communityId}`)}
              onToggleMembership={handleToggleMembership}
              pendingCommunityId={pendingCommunityId}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={textStyles.sectionTitle}>Coming Soon</Text>
            <Text style={styles.caption}>Greyed out for now, but already mapped.</Text>
          </View>

          {filteredFutureCommunities.length === 0 ? (
            <Card style={styles.card} variant="muted">
              <Text style={textStyles.sectionTitle}>No future communities match that search</Text>
              <Text style={styles.copy}>
                Clear the search to browse the full upcoming slate.
              </Text>
            </Card>
          ) : (
            <CommunityGrid
              communities={filteredFutureCommunities}
              joinedCommunityIds={joinedCommunityIds}
              onOpenCommunity={() => undefined}
              onToggleMembership={() => undefined}
            />
          )}
        </View>
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
  header: {
    gap: theme.spacing[1],
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  searchInput: {
    marginTop: 2,
  },
  communitySkeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  communitySkeletonCell: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    width: '50%',
  },
  communitySkeletonCard: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  communitySkeletonBody: {
    gap: 10,
    padding: theme.spacing[2],
  },
  section: {
    gap: theme.spacing[2],
  },
  sectionHeader: {
    gap: 4,
  },
  card: {
    gap: theme.spacing[1],
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  caption: {
    ...textStyles.caption,
    color: theme.colors.text.secondary,
  },
});
