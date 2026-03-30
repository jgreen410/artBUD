import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Community } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';

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
        <Pressable
          android_ripple={{ color: 'transparent' }}
          onPress={() => onSelect(null)}
          style={({ pressed }) => [
            styles.chip,
            selectedCommunityId === null ? styles.chipSelected : styles.chipDefault,
            pressed && styles.chipPressed,
          ]}
        >
          <Text
            style={[
              styles.chipLabel,
              selectedCommunityId === null ? styles.chipLabelSelected : styles.chipLabelDefault,
            ]}
          >
            {allLabel}
          </Text>
        </Pressable>
        {communities.map((community) => (
          <Pressable
            android_ripple={{ color: 'transparent' }}
            key={community.id}
            onPress={() => onSelect(community.id)}
            style={({ pressed }) => [
              styles.chip,
              selectedCommunityId === community.id ? styles.chipSelected : styles.chipDefault,
              pressed && styles.chipPressed,
            ]}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{community.icon_emoji}</Text>
            </View>
            <Text
              numberOfLines={1}
              style={[
                styles.chipLabel,
                selectedCommunityId === community.id ? styles.chipLabelSelected : styles.chipLabelDefault,
              ]}
            >
              {community.name}
            </Text>
          </Pressable>
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
  chip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipDefault: {
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.subtle,
  },
  chipSelected: {
    backgroundColor: theme.colors.action.primary,
    borderColor: theme.colors.action.primary,
  },
  chipPressed: {
    opacity: 0.9,
  },
  iconWrap: {
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  icon: {
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
  },
  chipLabel: {
    ...textStyles.bodyMedium,
    fontSize: 15,
    lineHeight: 18,
  },
  chipLabelDefault: {
    color: theme.colors.text.primary,
  },
  chipLabelSelected: {
    color: theme.colors.text.inverse,
  },
});
