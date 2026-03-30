import { StyleSheet, View } from 'react-native';

import { Community } from '@/lib/types';

import { CommunityCard } from './CommunityCard';

interface CommunityGridProps {
  communities: Community[];
  joinedCommunityIds: string[];
  pendingCommunityId?: string | null;
  onOpenCommunity: (communityId: string) => void;
  onToggleMembership: (community: Community, isJoined: boolean) => void;
}

export function CommunityGrid({
  communities,
  joinedCommunityIds,
  pendingCommunityId = null,
  onOpenCommunity,
  onToggleMembership,
}: CommunityGridProps) {
  return (
    <View style={styles.grid}>
      {communities.map((community) => {
        const isJoined = joinedCommunityIds.includes(community.id);
        const isComingSoon = !community.is_launched;

        return (
          <View key={community.id} style={styles.cell}>
            <CommunityCard
              community={community}
              isComingSoon={isComingSoon}
              isJoined={isJoined}
              isMembershipPending={pendingCommunityId === community.id}
              onOpen={isComingSoon ? null : () => onOpenCommunity(community.id)}
              onToggleMembership={
                isComingSoon ? null : () => onToggleMembership(community, isJoined)
              }
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cell: {
    minWidth: '47%',
    width: '47%',
  },
});
