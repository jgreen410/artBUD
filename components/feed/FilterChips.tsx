import { ScrollView, StyleSheet, View } from 'react-native';

import { Tag } from '@/components/ui';
import { Community } from '@/lib/types';

interface FilterChipsProps {
  communities: Community[];
  selectedCommunityId: string | null;
  onSelect: (communityId: string | null) => void;
  allLabel?: string;
}

export function FilterChips({
  communities,
  selectedCommunityId,
  onSelect,
  allLabel = 'All',
}: FilterChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        <Tag
          label={allLabel}
          onPress={() => onSelect(null)}
          variant={selectedCommunityId === null ? 'selected' : 'default'}
        />
        {communities.map((community) => (
          <Tag
            key={community.id}
            label={`${community.icon_emoji} ${community.name}`}
            onPress={() => onSelect(community.id)}
            variant={selectedCommunityId === community.id ? 'selected' : 'default'}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 24,
  },
});
